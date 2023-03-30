#!/usr/bin/env bash
export CI=true

npm install
npm run check
npm run test
npm run build
