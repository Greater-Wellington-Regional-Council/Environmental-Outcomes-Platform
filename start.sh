#!/usr/bin/env bash

shopt -s nocasematch

if [ -z "$1" ]
  then
    echo
    echo "No argument supplied"
    echo "Usage: ./start.sh <package>"
    exit 1
fi

cd packages/Manager || exit 1

if [ "$1" == "Manager" ]
  then
    # Start manager in foreground
    ./start.sh "$2 $3 $4 $5 $6 $7 $8 $9"
    exit 0
fi

# We are in manager folder.  Start in background if moving on
# to start something else as well.
./start.sh "$2 $3 $4 $5 $6 $7 $8 $9" > app.log 2>&1 &

echo "Waiting for the front-end application to start..."
# Could probably choose a better way to do this, or a better string to check for.
tail -f app.log | tee /dev/tty | grep -q "Start Task refresh updateCouncilPlanRecBoundaries"

echo "Front-end application started. Starting the package..."
cd "../$1" || exit 1
./start.sh