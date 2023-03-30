#!/usr/bin/env bash

# exit when any command fails
set -e

export CI=true

npm install
npm run check
npm run test
npm run build
