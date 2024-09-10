#!/usr/bin/env bash

# exit when any command fails
set -e

export CI=true

npm install
rsync -av ../shared/lib/ ./src/shared/lib/
#npm run check
#npm run test
npm run build
