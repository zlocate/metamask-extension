#!/usr/bin/env bash

set -e
set -u
set -o pipefail

export PATH="$PATH:./node_modules/.bin"

shell-parallel -s 'npm run ganache:start' -x 'sleep 5 && superstatic test/e2e/beta/contract-test/ --port 8080 --host 127.0.0.1' -x 'sleep 5 && mocha test/e2e/metamask.spec.js --bail --recursive'
