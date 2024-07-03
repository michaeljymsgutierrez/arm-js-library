#! /bin/bash
# Script for auto copy and publish arm-js-library

echo "Copying README.md on packages/" &&

cp README.md packages/README.md &&

echo "Done..." &&

cd packages &&

echo "Started publishing" &&

npm publish &&

echo "Done..." &&

cd ..
