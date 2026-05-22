#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  if [[ -n "${JS_PID:-}" ]] && kill -0 "${JS_PID}" 2>/dev/null; then
    kill "${JS_PID}"
  fi
}

trap cleanup EXIT INT TERM

if [[ "${1:-}" == "--full" ]]; then
  bun run sync:chapters -- --full
else
  bun run sync:chapters
fi

bun run dev:js &
JS_PID=$!

zola serve
