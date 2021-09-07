#!/bin/bash
cd filter
sh build.sh
commit_type="A"
read -p "Is this commit to update exist site? (Y/N) " is_update
if [ $is_update == 'y' ] || [ $is_update == 'Y' ]
then
    commit_type="M"
fi
read -p "Enter process domain? Ex: example.com " domain
gitcomment="$commit_type: $domain"
cd ..
git add .
git commit -m "$gitcomment"