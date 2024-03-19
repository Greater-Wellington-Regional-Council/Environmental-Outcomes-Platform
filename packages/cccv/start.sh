#!/bin/bash

if [ -n "$1" ]; then
  echo "Checking if anything is running on port $1"
  lsof -i :$1
  if [ $? -eq 0 ]; then
    echo "Something is running on port $1. Kill it? (y/n)"
    read kill
    if [ "$kill"=="y" ]; then
      lsof -i :$1 | awk 'NR!=1 {print $2}' | xargs kill
    else
      echo "Ok, quitting.   Nothing done."
      exit 1
    fi
  fi
fi

npm run dev

