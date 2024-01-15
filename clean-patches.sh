#!/bin/bash
PATCHES_DIR=$1
if [[ -z $PATCHES_DIR ]]; then
    echo "Error: patches directory is not provided, aborting"
    exit 1
fi
START_DEL=3
END_DEL=7
# Scan patches dir and delete outdate patch
for file in "$PATCHES_DIR"/*.patch; do
    for i in $(seq $START_DEL $END_DEL); do
        OUTDATE_PREFIX=`date -d "$i days ago" +'%Y%m%d'`
        if [[ "$file" == "$PATCHES_DIR/$OUTDATE_PREFIX"* ]]; then
            rm -rf $file
            git add $file
            printf '%s being deleted\n' "$file"
            break
        fi
    done
done