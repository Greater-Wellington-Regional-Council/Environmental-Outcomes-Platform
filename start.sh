#!/usr/bin/env bash

shopt -s nocasematch

if [ -z "$1" ]
  then
    echo
    echo "No argument supplied"
    echo "Usage: ./start.sh <package>"
    exit 1
fi

module_to_run=$1
# Shift args along by 1
Shift 1

cd packages/Manager || exit 1

if [ "$module_to_run" == "Manager" ]
  then
    #  Manager in foreground
    ./start.sh "$@"
    exit 0
fi

# Start Manager in background remembering process id
./start.sh "$@" &

echo "Front-end application started. Starting the package..."
cd "../$module_to_run" || exit 1
./start.sh