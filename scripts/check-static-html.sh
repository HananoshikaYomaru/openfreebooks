#!/usr/bin/env bash
set -euo pipefail

matches="$(find themes/openfreebooks/static -type f -name '*.html' -print)"

if [[ -n "${matches}" ]]; then
  echo "Error: stale HTML files found under themes/openfreebooks/static:"
  echo "${matches}"
  echo "Remove them so Zola output stays source-of-truth in public/."
  exit 1
fi
