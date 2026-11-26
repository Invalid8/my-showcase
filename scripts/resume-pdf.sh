#!/bin/sh
set -e
url="${1:-http://localhost:3000/resume}"
chrome="${CHROME:-google-chrome}"
"$chrome" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$(dirname "$0")/../public/resume.pdf" "$url"
