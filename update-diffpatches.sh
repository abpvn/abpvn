#!/usr/bin/env bash
#
# This script assumes a linux environment
# ORIGINAL SOURCE FROM: https://github.com/uBlockOrigin/uAssets/blob/master/tools/update-diffpatches.sh

set -e

# To be executed at the root of CDN repo
#
# It's not being hosted at CDN because that
# repo is also used as a website


PATCHES_DIR=$1
if [[ -z $PATCHES_DIR ]]; then
    echo "Error: patches directory is not provided, aborting"
    exit 1
fi

FILTER_FILES=$2
if [[ -z $FILTER_FILES ]]; then
    echo "Error: filter lists are not provided, aborting"
    exit 1
fi
FILTER_FILES=( "$FILTER_FILES" )

PATCH_FILES=( $(ls -1v "$PATCHES_DIR"/*.patch | head -n -1) )

SKIP_PUSH_DEL_TAG=$3
DELETED_VERSIONS=''

# Keep only the most recent 30 patches
OBSOLETE_PATCHES=( $(ls -1v "$PATCHES_DIR"/*.patch | head -n -30) )
for FILE in "${OBSOLETE_PATCHES[@]}"; do
    echo "Removing obsolete patch $FILE"
    # Extract tag from patch file name
    [[ ${FILE} =~ ^$PATCHES_DIR/([0-9]{14})\.patch$ ]] && \
        DEL_VERSION=${BASH_REMATCH[1]}
    if [ "$DELETED_VERSION" == '' ]; then
        DELETED_VERSIONS=$DEL_VERSION
    else
        DELETED_VERSIONS="$DELETED_VERSIONS $DEL_VERSION"
    fi
    git rm "$FILE"
done

NEW_PATCH_FILE=$(mktemp)
DIFF_FILE=$(mktemp)

ALL_VERSION=$(git tag --list)

for PATCH_FILE in "${PATCH_FILES[@]}"; do

    # Extract tag from patch file name
    [[ ${PATCH_FILE} =~ ^$PATCHES_DIR/([0-9]{14})\.patch$ ]] && \
        PREVIOUS_VERSION=${BASH_REMATCH[1]}

    # Skip if version doesn't exist
    if [[ "$ALL_VERSION" != *"$PREVIOUS_VERSION"* ]]; then
        echo "Skip version $PREVIOUS_VERSION because does not exist"
        continue;
    fi

    # This will receive a clone of an old version of the current repo to another git work tree
    echo "Checkout repo at version $PREVIOUS_VERSION"
    OLD_REPO=$(mktemp -d)
    git worktree add -f "$OLD_REPO" "$PREVIOUS_VERSION"

    : > "$NEW_PATCH_FILE"

    for FILTER_LIST in ${FILTER_FILES[@]}; do

        if [ ! -f "$OLD_REPO/$FILTER_LIST" ]; then continue; fi

        # Patches are for filter lists supporting differential updates
        if ! (head "$OLD_REPO/$FILTER_LIST" | grep -q '^! Diff-Path: '); then
            continue
        fi

        # Reference:
        # https://github.com/ameshkov/diffupdates

        # Extract diff name from `! Diff-Path:` field
        DIFF_NAME=$(grep -m 1 -oP '^! Diff-Path: [^#]+#?\K.*' "$FILTER_LIST")
        # Fall back to `! Diff-Name:` field if no name found
        # Remove once `! Diff-Name:` is no longer needed after transition
        if [[ -z $DIFF_NAME ]]; then
            DIFF_NAME=$(grep -m 1 -oP '^! Diff-Name: \K.+' "$FILTER_LIST")
        fi

        # We need a patch name to generate a valid patch
        if [[ -z $DIFF_NAME ]]; then
            echo "Info: $FILTER_LIST is missing a patch name, skipping"
            continue
        fi

        # Compute the RCS diff between current version and new version
        diff -n "$OLD_REPO/$FILTER_LIST" "$FILTER_LIST" > "$DIFF_FILE" || true

        FILE_CHECKSUM=$(sha1sum "$FILTER_LIST")
        FILE_CHECKSUM=${FILE_CHECKSUM:0:10}

        DIFF_LINE_COUNT=$(wc -l < "$DIFF_FILE")

        # Patch header
        DIFF_HEAD="diff name:$DIFF_NAME lines:$DIFF_LINE_COUNT checksum:$FILE_CHECKSUM"
        printf "\tAdding diff: %s\n" "$DIFF_HEAD"
        echo "$DIFF_HEAD" >> "$NEW_PATCH_FILE"
        # Patch data
        cat "$DIFF_FILE" >> "$NEW_PATCH_FILE"

    done

    rm -rf "$OLD_REPO"

    # Stage changed patch file
    mv -f "$NEW_PATCH_FILE" "$PATCH_FILE"
    ls -l "$PATCH_FILE"
    echo "Info: Staging ${PATCH_FILE}"
    git add -u "$PATCH_FILE"

done

git worktree prune
rm -f "$DIFF_FILE"
rm -f "$NEW_PATCH_FILE"
if [ "$DELETED_VERSIONS" != '' ]; then
    if [ "$SKIP_PUSH_DEL_TAG" != 'true' ]; then
        git push -d origin $DELETED_VERSIONS
    else
        echo "These tag should be delete manualy: '$DELETED_VERSIONS'"
    fi
fi