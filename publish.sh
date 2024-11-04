#! /bin/bash
# Script for auto copy and publish arm-js-library
# Available flags: release:latest, release:beta

function print_separator {
  echo -e "\033[36m.........................................\033[0m"
}

function print_process {
  echo -e "\033[36mProcess: \033[32m$1\033[0m"
}

function print_status_done {
  echo -e "\033[36mStatus: \033[32mdone\033[0m"
}

function print_status_failed {
  echo -e "\033[36mStatus: \033[31mfailed\033[0m"
}

print_separator

print_process "prepairing"

print_separator

print_process "copying:readme"

cp -v README.md packages/README.md && print_status_done || print_status_failed

print_separator

cd packages &&

print_process "building:package"

npm run build && print_status_done || print_status_failed

print_separator

print_process "generating:docs"

npm run build:jsdocs && print_status_done || print_status_failed

print_separator

print_process "generating:dts"

npm run build:dts && print_status_done || print_status_failed

print_separator

print_process "running:test"

npm run test && print_status_done || print_status_failed

print_separator

print_process "copying:docs"

cp -v DOCS.md .. && print_status_done || print_status_failed

print_separator

print_process "updating:apps-and-packages-dependencies"

cd .. && cd apps/create-next-app && npm install && print_status_done || print_status_failed
cd .. && cd .. && cd packages && npm install && print_status_done || print_status_failed

print_separator

if [ "$1" == "release:latest" ]; then
  print_process "publishing:latest"
  npm publish && print_status_done || print_status_failed
  print_separator
fi

if [ "$1" == "release:beta" ]; then
  print_process "publishing:beta"
  npm publish --tag beta && print_status_done || print_status_failed
  print_separator
fi

cd ..
