#!/bin/bash
git push --all
VERSION=$(cat version)
git tag $VERSION
git push origin $VERSION
CURRENT_DIR=$(pwd)

# Create tag for master branch
TEMP_DIR=$(mktemp -d)
git worktree add -f "$TEMP_DIR" master
cd "$TEMP_DIR"
TEMP_VERSION=$(cat version)
git tag $TEMP_VERSION
git push origin $TEMP_VERSION
cd "$CURRENT_DIR"
rm -rf $TEMP_DIR
git worktree prune

sleep 5
bash pull.sh