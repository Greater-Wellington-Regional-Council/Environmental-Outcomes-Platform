#!/bin/bash

show_usage () {
  echo "Start supporting services and the Manager application."
  echo ""
  echo "Usage: $0 [-i] [-x] [-r]"
  echo "(No options): just start up where we left off last time"
  echo "-x: stop and delete everything, but don't restart"
  echo "-r: stop and delete everything and restart"
  echo "-i: check container health"
}

container-health () {
  for id in $(docker container ls -a | grep "$1" | awk '{print $1}'); do docker container inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{end}}' $id; done
}

stop_containers () {
  echo Stopping containers..
  docker ps --filter "status=running" --format "{{.Names}}" | grep 'manager-' | xargs -r docker stop
  docker ps --filter "status=running" --format "{{.Names}}" | grep 'manager-database' | xargs -r docker stop
  docker ps --filter "status=running" --format "{{.Names}}" | grep 'confluentinc' | xargs -r docker stop
  docker ps --filter "status=running" --format "{{.Names}}" | grep 'provectuslabs' | xargs -r docker stop
  docker ps --filter "status=running" --format "{{.Names}}" | grep 'pramsey' | xargs -r docker stop
}

stop_and_delete_containers () {
  echo Stopping and deleting containers..
  docker ps -a --filter "name=manager-" --format '{{.ID}} {{.Image}}' | \
  awk '{print $1}' | xargs -r -I {} docker rm -f {} && \
  docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' | grep 'manager-' | awk '{print $2}' | xargs -r -I {} docker rmi {}
}

delete_database () {
  echo Deleting database..
  rm -rf ../LocalInfrastructure/.volumes
}

reset_all () {
  stop_and_delete_containers
  delete_database
}

inspect_all () {
  docker ps -a --filter "name=manager-" --format '{{.Names}} {{.Image}} {{.Status}}' | sort
}

start_all () {
  ./batect --output=all run
}

# Do the stuff
main () {
  while getopts ":xirh" opt; do
    case $opt in
      h)
        show_usage
        exit 0
        ;;
      x|r)
        reset_all
        if [[ "$opt" == "r" ]]; then
          start_all
        fi
        exit 0
        ;;
      i)
        inspect_all
        exit 0
        ;;
      \?)
        echo "Invalid option: -$OPTARG" >&2
        exit 1
        ;;
    esac
  done

  shift $((OPTIND -1))
}

main "$@"