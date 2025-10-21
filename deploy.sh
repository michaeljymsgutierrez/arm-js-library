#!/bin/bash
# Usage: ./deploy.sh deployment-type:version-type
# deployment-type: stable | hotfix
# version-type: major | minor | patch
# ie: ./deploy.sh stable:minor

# Set the terminal type for colored output
TERM=xterm-256color

# Store the deployment target (e.g., stable:minor) from the command-line argument
DEPLOYMENT_TARGET="$1"

# Extract the deployment type (stable or hotfix) using cut
DEPLOYMENT_TYPE=$(echo "$DEPLOYMENT_TARGET" | cut -d ':' -f 1)

# Extract the version type (major, minor, or patch) using cut
VERSION_TYPE=$(echo "$DEPLOYMENT_TARGET" | cut -d ':' -f 2)

# Initialize variables for current version, latest version, commit message, and target branch
CURRENT_VERSION="v"
LATEST_VERSION=""
COMMIT_MESSAGE=""
TARGET_BRANCH=""

# Function to prepare the release version by updating package.json and related files
prepare_release_version() {
  # Navigate to the 'packages' directory
  cd packages

  # Get the current version from package.json using jq
  CURRENT_VERSION+=$(jq -r '.version' package.json)
  CURRENT_VERSION_NUMBER=${CURRENT_VERSION#v}

  # Increment the version using npm version and store the latest version
  LATEST_VERSION=$(echo "npm version $1 --no-git-tag-version" | bash)
  LATEST_VERSION_NUMBER=${LATEST_VERSION#v}

  # Create the commit message
  COMMIT_MESSAGE="Updated release version from $CURRENT_VERSION to $LATEST_VERSION"

  # Navigate to the api-resource-manager.js file and update the version number
  cd src/lib &&
  awk -v old="$CURRENT_VERSION_NUMBER" -v new="$LATEST_VERSION_NUMBER" '{gsub(old, new)} 1' api-resource-manager.js > temp.txt && mv temp.txt api-resource-manager.js

  # Navigate back to the root directory and update the version number in README.md
  cd .. && cd .. && cd .. &&
  awk -v old="$CURRENT_VERSION_NUMBER" -v new="$LATEST_VERSION_NUMBER" '{gsub(old, new)} 1' README.md > temp.txt && mv temp.txt README.md

  # Output the latest version
  echo "VERSION: $LATEST_VERSION"
}

# Function to prepare release files by copying README, building the package, generating docs and dts, running tests, and updating dependencies
prepare_release_files() {
  # Copy README.md to the packages directory
  print_process "copying:readme"
  cp -v README.md packages/README.md && print_status_done || print_status_failed
  print_separator

  # Navigate to the packages directory and build the package
  cd packages &&
  print_process "building:package"
  yarn build && print_status_done || print_status_failed
  print_separator

  # Generate jsdocs
  print_process "generating:docs"
  yarn build:jsdocs && print_status_done || print_status_failed
  print_separator

  # Generate dts files
  print_process "generating:dts"
  yarn build:dts && print_status_done || print_status_failed
  print_separator

  # Run tests
  print_process "running:test"
  yarn test && print_status_done || print_status_failed
  print_separator

  # Copy DOCS.md to the root directory
  print_process "copying:docs"
  cp -v DOCS.md .. && print_status_done || print_status_failed
  print_separator

  # Update dependencies in apps and packages
  print_process "updating:apps-and-packages-dependencies"
  cd .. && cd apps/create-next-app && yarn install && print_status_done || print_status_failed
  cd .. && cd .. && cd packages && yarn install && cd .. && print_status_done || print_status_failed
  print_separator
}

# Function to publish the release version branch by creating a release branch, committing changes, pushing, merging into release, tagging, and rebasing main
publish_release_version_branch() {
  # Create a release branch, add changes, commit, and push
  git checkout -b "releases/$LATEST_VERSION" &&
  git add . &&
  git commit -m "$COMMIT_MESSAGE" &&
  git push origin "releases/$LATEST_VERSION"

  # Generate merge commit messages
  MERGE_COMMIT_MESSAGES=$(git log $TARGET_BRANCH..releases/$LATEST_VERSION \
    --format='- [%h][%an]: %s - %ad' \
    --date=format:'%Y-%m-%d %H:%M:%S' \
    --no-merges \
    | grep -v ": releases/v")
  MERGE_COMMIT_HEADER_AND_MESSAGES=$(echo -e "releases/$LATEST_VERSION\n${MERGE_COMMIT_MESSAGES}")

  # Merge the release branch into release, tag, and push
  git checkout release &&
  git pull origin release &&
  git merge --squash "releases/$LATEST_VERSION" &&
  git commit -m "$MERGE_COMMIT_HEADER_AND_MESSAGES" &&
  git push origin release &&
  git tag -a "$LATEST_VERSION" -m "$MERGE_COMMIT_HEADER_AND_MESSAGES" &&
  git push origin "$LATEST_VERSION" &&

  # Rebase main onto release and push
  git checkout main &&
  git pull origin main &&
  git rebase release &&
  git push -f origin main
}

# Function to clean up the release version branch by rebasing develop, deleting the release branch, and fetching updates
cleanup_release_version_branch() {
  # Rebase develop onto release and push
  git checkout develop &&
  git rebase -Xours release &&
  git push -f origin develop &&

  # Delete the release branch both locally and remotely
  git branch -D "releases/$LATEST_VERSION" &&
  git push origin --delete "releases/$LATEST_VERSION" &&

  # Fetch and prune remote branches, and pull updates for develop, release, and main
  git fetch origin --prune --verbose
  git checkout develop &&
  git pull origin develop &&
  git checkout release &&
  git pull origin release &&
  git checkout main &&
  git pull origin main
}

# Function to publish the release version to npm
publish_release_version_npm() {
  # Publish the package to npm
  cd packages && npm publish && cd ..
}

# Function to synchronize the repository by fetching updates and rebasing branches
sync_repository() {
  # Fetch updates and prune remote branches, then rebase develop, release, and main
  git fetch origin --prune --verbose &&
  git checkout develop && git pull --rebase origin develop &&
  git checkout release && git pull --rebase origin release &&
  git checkout main && git pull --rebase origin main

  # Set the target branch based on the deployment type
  if [ "$DEPLOYMENT_TYPE" == "stable" ]; then
    TARGET_BRANCH="release"
    git checkout develop
  fi

  if [ "$DEPLOYMENT_TYPE" == "hotfix" ]; then
    TARGET_BRANCH="main"
    git checkout release
  fi
}

# Function to validate the input arguments
validate_input() {
  # Validate the deployment type
  if ! [[ "$DEPLOYMENT_TYPE" =~ ^(stable|hotfix)$ ]]; then
    echo "Unknown deployment type for ${DEPLOYMENT_TYPE}" && exit 1
  fi

  # Validate the version type
  if ! [[ "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo "Unknown version type for ${VERSION_TYPE}" && exit 1
  fi

  # Output the deployment and version types
  echo "DEPLOYMENT_TYPE: $DEPLOYMENT_TYPE"
  echo "VERSION_TYPE: $VERSION_TYPE"

  # Confirm with the user before proceeding
  read -p "Are you sure? (y/n) " -n 1 -r
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo " Confirmed"
  else
    echo " Cancelled"
    exit 1
  fi
}

# Function to display usage instructions
usage() {
  echo "# Usage: sh deploy.sh deployment-type:version-type"
  echo "# "
  echo "# deployment-type: stable | hotfix"
  echo "# version-type: major | minor | patch"
  echo "# "
  echo "# ie: sh deploy.sh stable:minor"
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

# If the first argument is "-h", display usage instructions
if [ "$1" == "-h" ]; then
  usage
fi

# Validate the input arguments
print_separator
print_process "validating:input"
validate_input && print_status_done || print_status_failed
print_separator

# Synchronize the repository
print_process "syncing:repository"
sync_repository && print_status_done || print_status_failed
print_separator

# Prepare the release version
print_process "preparing:release-version"
prepare_release_version $VERSION_TYPE && print_status_done || print_status_failed
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

# Print the release version
print_process "publishing:release-version-npm"
publish_release_version_npm && print_status_done || print_status_failed
print_separator

# Print the release version
print_release_version
print_separator
