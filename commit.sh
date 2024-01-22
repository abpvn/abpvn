#!/bin/bash
SKIP_COMMIT=$1
VERSION=$2
if [[ -z $VERSION ]]; then
    VERSION=`date +'%Y%m%d%H%M%S'`
fi
cd filter
bash build.sh "$VERSION"
git add src
cd ..
PATCHES_DIR="filter/patches"
# Create new patches
bash make-diffpatch.sh "$VERSION" "$PATCHES_DIR"
# Update exist patches
FILTER_FILES=$(git ls-files --exclude-standard -- filter/*.txt)
bash update-diffpatches.sh "$PATCHES_DIR" "$FILTER_FILES" "$SKIP_COMMIT"
if [ "$SKIP_COMMIT" != 'true' ]; then
    commit_type="A"
    read -p "Enter filter update type Add (A), Modified (M), Delete (D)? " update_type
    if [ "$update_type" == 'm' ] || [ "$update_type" == 'M' ]
    then
        commit_type="M"
    elif [ "$update_type" == 'd' ] || [ "$update_type" == 'D' ]
    then
        commit_type="D"
    fi
    read -p "Enter process domain? Ex: example.com " domain
    gitcomment="$commit_type: $domain"
    git add .
    git commit -m "$gitcomment"
fi