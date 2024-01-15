#!/bin/bash
VERSION=`date +'%Y%m%d%H%M%S'`
cd filter
bash build.sh "$VERSION"
git add src
cd ..
PATCHES_DIR="filter/patches"
# Clean outdate patches
bash clean-patches.sh "$PATCHES_DIR"
# Create new patches
bash make-diffpatch.sh "$VERSION" "$PATCHES_DIR"
SKIP_COMMIT=$1
if [[ -z $SKIP_COMMIT ]]; then
    commit_type="A"
    read -p "Enter filter update type Add (A), Modified (M), Delete (D)? " update_type
    if [ $update_type == 'm' ] || [ $update_type == 'M' ]
    then
        commit_type="M"
    elif [ $update_type == 'd' ] || [ $update_type == 'D' ]
    then
        commit_type="D"
    fi
    read -p "Enter process domain? Ex: example.com " domain
    gitcomment="$commit_type: $domain"
    git add .
    git commit -m "$gitcomment"
fi