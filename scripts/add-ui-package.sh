#!/bin/zsh
SCRIPT_PATH="$(dirname $(realpath $0))/add-ui-package/add-ui-package.mjs"


if [ $# -lt 1 ]; then
  echo "Usage: $0 <AppName> [TemplateSubfolder]"
  exit 1
fi

cd "$(dirname $0)/../packages"
pwd

$SCRIPT_PATH "$@"
