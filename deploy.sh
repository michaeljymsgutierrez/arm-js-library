#!/bin/bash
# Usage: ./deploy.sh deployment-type:version-type
# deployment-type: stable | hotfix
# version-type: major | minor | patch
# ie: ./deploy.sh stable:minor

TERM=xterm-256color
DEPLOYMENT_TARGET="$1"
DEPLOYMENT_TYPE=$(echo "$DEPLOYMENT_TARGET" | cut -d ':' -f 1)
VERSION_TYPE=$(echo "$DEPLOYMENT_TARGET" | cut -d ':' -f 2)
CURRENT_VERSION="v"
LATEST_VERSION=""
COMMIT_MESSAGE=""
TARGET_BRANCH=""

prepare_release_version() {
  CURRENT_VERSION+=$(jq -r '.version' package.json)
  LATEST_VERSION=$(echo "npm version $1 --no-git-tag-version" | bash)
  COMMIT_MESSAGE="Updated release version from $CURRENT_VERSION to $LATEST_VERSION"

  git checkout -b "releases/$LATEST_VERSION" &&
  yarn install && git add . &&
  git commit -m "$COMMIT_MESSAGE" &&
  git push origin "releases/$LATEST_VERSION"
}

publish_release_version() {
  MERGE_COMMIT_MESSAGES=$(git log $TARGET_BRANCH..releases/$LATEST_VERSION \
    --format='- [%h][%an]: %s - %ad' \
    --date=format:'%Y-%m-%d %H:%M:%S' \
    --no-merges \
    | grep -v ": releases/v")
  MERGE_COMMIT_HEADER_AND_MESSAGES=$(echo -e "releases/$LATEST_VERSION\n${MERGE_COMMIT_MESSAGES}")

  git checkout release &&
  git pull origin release &&
  git merge --squash "releases/$LATEST_VERSION" &&
  git commit -m "$MERGE_COMMIT_HEADER_AND_MESSAGES" &&
  git push origin release &&
  git tag -a "$LATEST_VERSION" -m "$MERGE_COMMIT_HEADER_AND_MESSAGES" &&
  git push origin "$LATEST_VERSION" &&
  git checkout main &&
  git pull origin main &&
  git rebase release &&
  git push -f origin main
}

cleanup_release_version() {
  git checkout develop &&
  git rebase -Xours release &&
  git push -f origin develop &&
  git branch -D "releases/$LATEST_VERSION" &&
  git push origin --delete "releases/$LATEST_VERSION" &&
  git fetch origin --prune --verbose
  git checkout develop &&
  git pull origin develop &&
  git checkout release &&
  git pull origin release &&
  git checkout main &&
  git pull origin main
}

sync_repository() {
  git fetch origin --prune --verbose &&
  git checkout develop && git pull --rebase origin develop &&
  git checkout release && git pull --rebase origin release &&
  git checkout main && git pull --rebase origin main

  if [ "$DEPLOYMENT_TYPE" == "stable" ]; then
    TARGET_BRANCH="release"
    git checkout develop
  fi

  if [ "$DEPLOYMENT_TYPE" == "hotfix" ]; then
    TARGET_BRANCH="main"
    git checkout release
  fi
}

validate_input() {
  if ! [[ "$DEPLOYMENT_TYPE" =~ ^(stable|hotfix)$ ]]; then
    echo "Unknown deployment type for ${DEPLOYMENT_TYPE}" && exit 1
  fi

  if ! [[ "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo "Unknown version type for ${VERSION_TYPE}" && exit 1
  fi

  echo "DEPLOYMENT_TYPE: $DEPLOYMENT_TYPE"
  echo "VERSION_TYPE: $VERSION_TYPE"

  read -p "Are you sure? (y/n) " -n 1 -r
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo " Confirmed"
  else
    echo " Cancelled"
    exit 1
  fi
}

usage() {
  echo "# Usage: sh deploy.sh deployment-type:version-type"
  echo "# "
  echo "# deployment-type: stable | hotfix"
  echo "# version-type: major | minor | patch"
  echo "# "
  echo "# ie: sh deploy.sh stable:minor"
  exit 0
}

print_release_version() {
  echo -e "New \033[36m$DEPLOYMENT_TYPE\033[0m version \033[32m$LATEST_VERSION\033[0m has been released."
}

print_separator() {
  echo -e "\033[36m.........................................\033[0m"
}

print_process() {
  echo -e "\033[36mProcess: \033[32m$1\033[0m"
}

print_status_done() {
  echo -e "\033[36mStatus: \033[32mdone\033[0m"
}

print_status_failed() {
  echo -e "\033[36mStatus: \033[31mfailed\033[0m" && exit 1
}

clear

if [ "$1" == "-h" ]; then
  usage
fi

print_separator

print_process "validating:input"

validate_input && print_status_done || print_status_failed

print_separator

print_process "syncing:repository"

sync_repository && print_status_done || print_status_failed

print_separator

print_process "preparing:release-version"

prepare_release_version $VERSION_TYPE && print_status_done || print_status_failed

print_separator

print_process "publishing:release-version"

publish_release_version && print_status_done || print_status_failed

print_separator

print_process "cleaning:release-version"

cleanup_release_version && print_status_done || print_status_failed

print_separator

print_release_version

print_separator
