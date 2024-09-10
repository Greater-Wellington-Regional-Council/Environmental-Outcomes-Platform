#!/usr/bin/env bash

# exit when any command fails
set -e

export CI=true

npm install
mkdir -p src/shared/lib
cp -R ../shared/lib/* src/shared/lib/
#npm run check
#npm run test
npm run build
