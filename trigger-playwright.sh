#!/bin/bash
set -e

BRANCH=$(git branch --show-current)

if [ -z "$BRANCH" ]; then
  echo "Error: Could not determine current branch"
  exit 1
fi

echo "Triggering Playwright workflow for branch: $BRANCH"
gh workflow run playwright.yml --ref "$BRANCH"
