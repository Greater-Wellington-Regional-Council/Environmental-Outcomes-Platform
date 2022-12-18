#!/usr/bin/env bash
export CI=true

npm install
npm run test
npm run build
