#!/bin/bash
set -euo pipefail

# Usage: ./deploy.sh [--dry-run|-d] deployment-type:version-type
# deployment-type: stable | hotfix
# version-type: major | minor | patch
# ie: ./deploy.sh stable:minor
# ie: ./deploy.sh --dry-run stable:minor

# Set the terminal type for colored output
TERM=xterm-256color

# Capture the absolute path of the project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Expected git username - only this user is authorized to run the deploy script
GIT_OWNER="michaeljymsgutierrez"

# Expected npm username - must match the logged-in npm user before publishing
NPM_OWNER="chaelgutierrez"

# Dry-run flag - when true, destructive commands are printed but not executed
DRY_RUN=false

# Deployment target extracted from arguments (e.g. stable:minor)
DEPLOYMENT_TARGET=""

# Parse all arguments - flags and positional
for arg in "$@"; do
  case $arg in
    -d|--dry-run) DRY_RUN=true ;;
    *) DEPLOYMENT_TARGET="$arg" ;;
  esac
done

# Extract the deployment type (stable or hotfix) using cut
DEPLOYMENT_TYPE=$(echo "$DEPLOYMENT_TARGET" | cut -d ':' -f 1)

# Extract the version type (major, minor, or patch) using cut
VERSION_TYPE=$(echo "$DEPLOYMENT_TARGET" | cut -d ':' -f 2)

# Initialize variables for current version, latest version, commit message, and target branch
CURRENT_VERSION="v"
LATEST_VERSION=""
COMMIT_MESSAGE=""
TARGET_BRANCH=""

# Helper: print and skip destructive commands when in dry-run mode
run_cmd() {
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

# Function to prepare the release version by updating package.json and related files
prepare_release_version() {
  # Get the current version from package.json using jq
  CURRENT_VERSION+=$(jq -r '.version' "$PROJECT_ROOT/packages/package.json")
  CURRENT_VERSION_NUMBER=${CURRENT_VERSION#v}

  # Increment the version using npm version and store the latest version
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] npm version $1 --no-git-tag-version (in $PROJECT_ROOT/packages)"
    LATEST_VERSION="v0.0.0-dry-run"
  else
    LATEST_VERSION=$(cd "$PROJECT_ROOT/packages" && npm version $1 --no-git-tag-version)
  fi
  LATEST_VERSION_NUMBER=${LATEST_VERSION#v}

  # Create the commit message
  COMMIT_MESSAGE="Updated release version from $CURRENT_VERSION to $LATEST_VERSION"

  # Update the version number in api-resource-manager.js and README.md
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] update version in api-resource-manager.js: $CURRENT_VERSION_NUMBER -> $LATEST_VERSION_NUMBER"
    echo "[dry-run] update version in README.md: $CURRENT_VERSION_NUMBER -> $LATEST_VERSION_NUMBER"
  else
    awk -v old="$CURRENT_VERSION_NUMBER" -v new="$LATEST_VERSION_NUMBER" '{gsub(old, new)} 1' \
      "$PROJECT_ROOT/packages/src/lib/api-resource-manager.js" \
      > "$PROJECT_ROOT/packages/src/lib/temp.txt" \
      && mv "$PROJECT_ROOT/packages/src/lib/temp.txt" "$PROJECT_ROOT/packages/src/lib/api-resource-manager.js"

    awk -v old="$CURRENT_VERSION_NUMBER" -v new="$LATEST_VERSION_NUMBER" '{gsub(old, new)} 1' \
      "$PROJECT_ROOT/README.md" \
      > "$PROJECT_ROOT/temp.txt" \
      && mv "$PROJECT_ROOT/temp.txt" "$PROJECT_ROOT/README.md"
  fi

  # Output the latest version
  echo "VERSION: $LATEST_VERSION"
}

# Function to prepare release files by copying README, building the package, generating docs and dts, running tests, and updating dependencies
prepare_release_files() {
  # Copy README.md to the packages directory
  print_process "copying:readme"
  run_cmd cp -v "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/packages/README.md" && print_status_done || print_status_failed
  print_separator

  # Build the package
  print_process "building:package"
  (cd "$PROJECT_ROOT/packages" && yarn build) && print_status_done || print_status_failed
  print_separator

  # Generate jsdocs
  print_process "generating:docs"
  (cd "$PROJECT_ROOT/packages" && yarn build:jsdocs) && print_status_done || print_status_failed
  print_separator

  # Generate dts files
  print_process "generating:dts"
  (cd "$PROJECT_ROOT/packages" && yarn build:dts) && print_status_done || print_status_failed
  print_separator

  # Run tests
  print_process "running:test"
  (cd "$PROJECT_ROOT/packages" && yarn test) && print_status_done || print_status_failed
  print_separator

  # Copy DOCS.md to the root directory
  print_process "copying:docs"
  run_cmd cp -v "$PROJECT_ROOT/packages/DOCS.md" "$PROJECT_ROOT/DOCS.md" && print_status_done || print_status_failed
  print_separator

  # Update dependencies in apps and packages
  print_process "updating:apps-and-packages-dependencies"
  (cd "$PROJECT_ROOT/apps/create-next-app" && yarn install) && print_status_done || print_status_failed
  (cd "$PROJECT_ROOT/packages" && yarn install) && print_status_done || print_status_failed
  print_separator
}

# Function to publish the release version branch by creating a release branch, committing changes, pushing, merging into release, tagging, and rebasing main
publish_release_version_branch() {
  # Create a release branch, add changes, commit, and push
  run_cmd git checkout -b "releases/$LATEST_VERSION" &&
  run_cmd git add . &&
  run_cmd git commit -m "$COMMIT_MESSAGE" &&
  run_cmd git push origin "releases/$LATEST_VERSION"

  # Generate merge commit messages
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] git log $TARGET_BRANCH..releases/$LATEST_VERSION (generate merge commit messages)"
    MERGE_COMMIT_MESSAGES="[dry-run]"
    MERGE_COMMIT_HEADER_AND_MESSAGES="[dry-run] releases/$LATEST_VERSION"
  else
    MERGE_COMMIT_MESSAGES=$(git log $TARGET_BRANCH..releases/$LATEST_VERSION \
      --format='- [%h][%an]: %s - %ad' \
      --date=format:'%Y-%m-%d %H:%M:%S' \
      --no-merges \
      | grep -v ": releases/v" || true)
    MERGE_COMMIT_HEADER_AND_MESSAGES=$(echo -e "releases/$LATEST_VERSION\n${MERGE_COMMIT_MESSAGES}")
  fi

  # Merge the release branch into release, tag, and push
  run_cmd git checkout release &&
  run_cmd git pull origin release &&
  run_cmd git merge --squash "releases/$LATEST_VERSION" &&
  run_cmd git commit -m "$MERGE_COMMIT_HEADER_AND_MESSAGES" &&
  run_cmd git push origin release &&
  run_cmd git tag -a "$LATEST_VERSION" -m "$MERGE_COMMIT_HEADER_AND_MESSAGES" &&
  run_cmd git push origin "$LATEST_VERSION" &&

  # Rebase main onto release and push
  run_cmd git checkout main &&
  run_cmd git pull origin main &&
  run_cmd git rebase release &&
  run_cmd git push -f origin main
}

# Function to clean up the release version branch by rebasing develop and canary, deleting the release branch, and fetching updates
cleanup_release_version_branch() {
  # Rebase develop onto release and push
  run_cmd git checkout develop &&
  run_cmd git rebase -Xours release &&
  run_cmd git push -f origin develop &&

  # Rebase canary onto release and push
  run_cmd git checkout canary &&
  run_cmd git rebase -Xours release &&
  run_cmd git push -f origin canary &&

  # Delete the release branch both locally and remotely
  run_cmd git branch -D "releases/$LATEST_VERSION" &&
  run_cmd git push origin --delete "releases/$LATEST_VERSION" &&

  # Fetch and prune remote branches, and pull updates for develop, release, main, and canary
  git fetch origin --prune --verbose
  run_cmd git checkout develop && git pull origin develop
  run_cmd git checkout release && git pull origin release
  run_cmd git checkout main && git pull origin main
  run_cmd git checkout canary && git pull origin canary
}

# Function to publish the release version to npm
publish_release_version_npm() {
  cd "$PROJECT_ROOT/packages" && run_cmd npm publish && cd "$PROJECT_ROOT"
}

# Function to synchronize the repository by fetching updates and rebasing branches
sync_repository() {
  # Fetch updates and prune remote branches, then rebase develop, release, main, and canary
  git fetch origin --prune --verbose &&
  run_cmd git checkout develop && git pull --rebase origin develop &&
  run_cmd git checkout release && git pull --rebase origin release &&
  run_cmd git checkout main && git pull --rebase origin main &&
  run_cmd git checkout canary && git pull --rebase origin canary

  # Set the target branch based on the deployment type
  if [ "$DEPLOYMENT_TYPE" == "stable" ]; then
    TARGET_BRANCH="release"
    run_cmd git checkout develop
  fi

  if [ "$DEPLOYMENT_TYPE" == "hotfix" ]; then
    TARGET_BRANCH="main"
    run_cmd git checkout release
  fi
}

# Function to verify the current git user is authorized to run the deploy script
check_git_auth() {
  local current_user
  current_user=$(git config user.name 2>/dev/null) || {
    echo "Git user not configured. Run: git config user.name" && return 1
  }
  if [ "$current_user" != "$GIT_OWNER" ]; then
    echo "Git user '$current_user' is not authorized to deploy (expected: $GIT_OWNER)" && return 1
  fi
}

# Function to verify the logged-in npm user matches the expected package owner
check_npm_auth() {
  local current_user
  current_user=$(npm whoami 2>/dev/null) || {
    echo "Not logged in to npm. Run: npm login" && return 1
  }
  if [ "$current_user" != "$NPM_OWNER" ]; then
    echo "npm user '$current_user' is not authorized to publish this package (expected: $NPM_OWNER)" && return 1
  fi
}

# Function to check that all required tools are installed before running
check_dependencies() {
  local missing=0
  for tool in jq npm yarn git awk; do
    if ! command -v "$tool" &>/dev/null; then
      echo "Missing required tool: $tool"
      missing=1
    fi
  done
  if [ "$missing" -eq 1 ]; then
    echo "Install missing tools before running deploy.sh" && return 1
  fi
}

# Function to validate the input arguments
validate_input() {
  # Validate the deployment type
  if ! [[ "$DEPLOYMENT_TYPE" =~ ^(stable|hotfix)$ ]]; then
    echo "Unknown deployment type for ${DEPLOYMENT_TYPE}" && return 1
  fi

  # Validate the version type
  if ! [[ "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo "Unknown version type for ${VERSION_TYPE}" && return 1
  fi

  # Output the deployment and version types
  echo "DEPLOYMENT_TYPE: $DEPLOYMENT_TYPE"
  echo "VERSION_TYPE: $VERSION_TYPE"

  # Confirm with the user before proceeding
  read -p "Are you sure? (y/n) " -n 1 -r || true
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo " Confirmed"
  else
    echo " Cancelled"
    exit 1
  fi
}

# Function to display usage instructions
usage() {
  echo "# Usage: sh deploy.sh [--dry-run|-d] deployment-type:version-type"
  echo "# "
  echo "# deployment-type: stable | hotfix"
  echo "# version-type: major | minor | patch"
  echo "# "
  echo "# ie: sh deploy.sh stable:minor"
  echo "# ie: sh deploy.sh --dry-run stable:minor"
  exit 0
}

# Function to print the release version
print_release_version() {
  echo -e "New \033[36m$DEPLOYMENT_TYPE\033[0m version \033[32m$LATEST_VERSION\033[0m has been released."
}

# Function to print a separator line
print_separator() {
  echo -e "\033[36m.........................................\033[0m"
}

# Function to print the process being executed
print_process() {
  echo -e "\033[36mProcess: \033[32m$1\033[0m"
}

# Function to print a "done" status
print_status_done() {
  echo -e "\033[36mStatus: \033[32mdone\033[0m"
}

# Function to print a "failed" status and exit
print_status_failed() {
  echo -e "\033[36mStatus: \033[31mfailed\033[0m" && exit 1
}

# Clear the terminal
clear

# If the argument is "-h", display usage instructions
if [ "$DEPLOYMENT_TARGET" == "-h" ]; then
  usage
fi

# Show dry-run banner if active
if [ "$DRY_RUN" = true ]; then
  echo -e "\033[33m[DRY RUN] No changes will be made.\033[0m"
  print_separator
fi

# Validate the input arguments
print_separator
print_process "validating:input"
validate_input && print_status_done || print_status_failed
print_separator

# Check that all required tools are installed
print_process "checking:dependencies"
check_dependencies && print_status_done || print_status_failed
print_separator

# Verify the current git user is authorized to deploy
print_process "checking:git-auth"
check_git_auth && print_status_done || print_status_failed
print_separator

# Verify the logged-in npm user is authorized to publish
print_process "checking:npm-auth"
check_npm_auth && print_status_done || print_status_failed
print_separator

# Synchronize the repository
print_process "syncing:repository"
sync_repository && print_status_done || print_status_failed
print_separator

# Prepare the release version
print_process "preparing:release-version"
prepare_release_version "$VERSION_TYPE" && print_status_done || print_status_failed
print_separator

# Prepare release files
prepare_release_files

# Publish the release version branch
print_process "publishing:release-version-branch"
publish_release_version_branch && print_status_done || print_status_failed
print_separator

# Clean up the release version branch
print_process "cleaning:release-version-branch"
cleanup_release_version_branch && print_status_done || print_status_failed
print_separator

# Publish the release version to npm
print_process "publishing:release-version-npm"
publish_release_version_npm && print_status_done || print_status_failed
print_separator

# Print the release version
print_release_version
print_separator
