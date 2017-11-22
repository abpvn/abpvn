#!/bin/bash
sh build.sh
gitcomment="Update or Fix "$(cat src/abpvn_title.txt | grep -o '\s\[.*\]')
cd ..
git add .
git commit -m "$gitcomment"
git push
sh pull.sh