#!/bin/bash

# Please run this script from the root of the project
#
# errcheck: https://github.com/kisielk/errcheck
# gosec: https://github.com/securego/gosec
# revive: https://github.com/mgechev/revive
# staticcheck: https://staticcheck.dev/

arg_type="${1}"

if [ -z "$arg_type" ]; then
  echo "Usage: $0 <option> [value]"
  echo "Options:"
  echo "  --err-check                   run errcheck"
  echo "  --go-sec                      run gosec"
  echo "  --revive <config_file_path>   run revive with a specific config file (e.g., .revive.toml)"
  echo "  --static-check                run staticcheck"
  exit 1
fi

run_errcheck() {
  echo "running errcheck.."
  if ! errcheck ./...; then
    echo "errcheck failed"
    exit 1
  fi
}

run_gosec() {
  echo "running gosec.."
  if ! gosec -exclude-dir=node_modules ./...; then
    echo "gosec failed"
    exit 1
  fi
}

run_revive() {
  local config_file_path="$1"
  echo "running revive with config $config_file_path.."
  if ! revive -config "$config_file_path" ./...; then
    echo "revive failed"
    exit 1
  fi
}

run_staticcheck() {
  echo "running staticcheck.."
  if ! staticcheck ./...; then
    echo "staticcheck failed"
    exit 1
  fi
}

case $arg_type in
"--err-check")
  run_errcheck
  ;;
"--go-sec")
  run_gosec
  ;;
"--revive")
  config_file_arg="${2}"

  if [ -z "$config_file_arg" ]; then
    echo "error: missing config file path for --revive."
    echo "usage: $0 --revive <path_to_config_file>"
    echo "example: $0 --revive .revive.toml"
    exit 1
  fi

  run_revive "$config_file_arg"
  ;;
"--static-check")
  run_staticcheck
  ;;
*)
  echo "invalid argument"
  exit 1
  ;;
esac
