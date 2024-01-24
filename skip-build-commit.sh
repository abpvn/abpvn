#!/bin/sh
cd filter
bash sort.sh
cd ..
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