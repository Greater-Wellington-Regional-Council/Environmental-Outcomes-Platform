#!/bin/zsh

show_usage () {
  echo "Start supporting services and the Manager application."
  echo ""
  echo "Usage: $0 [-i] [-x] [-r]"
  echo "(No options): just start up where we left off last time"
  echo "-x: stop and delete everything, but don't restart"
  echo "-r: stop and delete everything and restart"
  echo "-i: check container health"
  echo "-p: prepare to deploy"
}

container_health () {
  for id in $(docker container ls -a | grep "$1" | awk '{print $1}'); do docker container inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{end}}' $id; done
}

stop_containers () {
  echo "Stopping containers..."

  delete_after_stop=$1
  echo "delete_after_stop: $delete_after_stop"

  echo "All containers:"

  allContainers=$(docker ps -a --format "{{.Names}} {{.Status}}")
  if [ -z "$allContainers" ]; then
      echo "None found"
  else
      echo "$allContainers"
  fi

  declare -a grep_strings=('manager-' 'manager-database' 'confluentinc' 'provectuslabs' 'pramsey' 'temurin' 'kafka')
  containers=$(docker ps -a $(printf -- '--filter name=%s ' "${grep_strings[@]}") --format "{{.Names}}")
  echo "Containers to be stopped for patterns: ${containers:-None}"

  if [ -n "$containers" ]; then
    echo "Stopping containers..."
    echo "$containers" | xargs -r docker stop
    if [ "$delete_after_stop" = true ]; then
      echo "Deleting stopped containers matching: $grep_strings"
      echo "$containers" | xargs -r docker rm -v
    fi
  fi

  # Prune all stopped containers, dangling images, and unused volumes
  echo "Pruning stopped containers, dangling images, and unused volumes..."
  docker system prune -af --volumes

  images=$(docker images $(printf -- '--filter=reference="*%s*" ' "${grep_strings[@]}") --format "{{.Repository}}:{{.Tag}}")
  echo "Images to be forcefully removed: ${images:-None}"

  if [ -n "$images" ]; then
    echo "Images being removed..."
    echo "$images" | xargs -r docker rmi --force
  fi
}

delete_database () {
  echo "Deleting database volume"
}

reset_all () {
  stop_containers true
  delete_database
}

inspect_all () {
  docker ps -a --filter "name=manager-" --format '{{.Names}} {{.Image}} {{.Status}}' | sort
}

start_all () {
  ./batect --output=all run
}

prepare_to_deploy () {
  reset_all
  if [ $? -ne 0 ]; then
    echo "Failed to reset all"
    exit 1
  fi
  if [ -d "./.gradle" ]; then
    rm -rf ./.gradle
  fi
  ./gradlew spotlessApply
  if [ $? -ne 0 ]; then
    echo "Failed to apply spotless formatting"
    exit 1
  fi
  ./batect check
}

# Do the stuff
main () {
  if [ "$#" -eq 0 ]; then
    start_all
    exit 0
  fi

  while getopts ":xirhp" opt; do
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
      p)
        prepare_to_deploy
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