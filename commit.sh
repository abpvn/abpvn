#!/bin/bash
cd filter
sh build.sh
gitcomment="Update or Fix"$(cat src/abpvn_title.txt | grep -o '\s\[.*\]')
cd ..
git add .
git commit -m "$gitcomment"