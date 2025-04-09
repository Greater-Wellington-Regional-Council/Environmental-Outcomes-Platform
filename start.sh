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

run-package "$@"