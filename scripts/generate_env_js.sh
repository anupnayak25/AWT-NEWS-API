#!/usr/bin/env bash
# Generates assets/env.js from the NEWS_API_KEY environment variable.
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
OUT_FILE="$ROOT_DIR/assets/env.js"

: "${NEWS_API_KEY:?NEWS_API_KEY environment variable is not set}"

mkdir -p "$ROOT_DIR/assets"
cat > "$OUT_FILE" <<EOF
// generated from environment by scripts/generate_env_js.sh
window.NEWS_API_KEY = "${NEWS_API_KEY}";
EOF

echo "Wrote $OUT_FILE"
