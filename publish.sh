#! /bin/bash
# Script for auto copy and publish arm-js-library

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

print_process "copying"

cp -v README.md packages/README.md && print_status_done || print_status_failed

print_separator

cd packages &&

print_process "building"

npm run build && print_status_done || print_status_failed

print_separator

print_process "publishing"

npm publish && print_status_done || print_status_failed

print_separator

cd ..
