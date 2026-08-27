#!/usr/bin/env bash
# Append analytics + conversion scripts to SPA index.html if missing.
set -euo pipefail
INDEX="${1:?index.html path required}"

append_before_body() {
  local snippet="$1"
  if grep -qF "$snippet" "$INDEX"; then
    return 0
  fi
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "s|</body>|  ${snippet}\n</body>|" "$INDEX"
  else
    sed -i "s|</body>|  ${snippet}\n</body>|" "$INDEX"
  fi
}

append_before_body '<script src="/js/compliance.js?v=11"></script>'
append_before_body '<script src="/js/conversion.js?v=1"></script>'
