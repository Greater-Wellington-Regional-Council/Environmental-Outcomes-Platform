#!/usr/bin/env bash

shopt -s nocasematch

if [ -z "$1" ]
  then
    echo
    echo "No argument supplied"
    echo "Usage: ./start.sh <package>"
    exit 1
fi

run-package () {
  cd "packages/$1" || exit 1
  ./start.sh $2 $3 $4 $5 $6 $7 $8 $9
}

if [ "$1" == "Manager" ]; then
  echo "Starting Manager..."
  run-package Manager "${@:2}" & # Run Manager in the background

  echo "Waiting for 60 seconds before starting DataTransformation..."
  sleep 60

  echo "Starting DataTransformation..."
  (cd packages/DataTransformation && ./batect run) # Output logs only to the console
  wait # Wait for all background processes to complete
else
  run-package "$@"
fi
