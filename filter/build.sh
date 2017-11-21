#!/bin/sh
# copy to tmp
cp -r src/abpvn_adult.txt src/abpvn_adult.tmp
cp -r src/abpvn_adult_elemhide.txt src/abpvn_adult_elemhide.tmp
cp -r src/abpvn_general.txt src/abpvn_general.tmp
cp -r src/abpvn_whitelist.txt src/abpvn_whitelist.tmp
cp -r src/abpvn_whitelist_elemhide.txt src/abpvn_whitelist_elemhide.tmp
# sort tmp to txt
sort -u -o src/abpvn_adult.txt src/abpvn_adult.tmp
sort -u -o src/abpvn_adult_elemhide.txt src/abpvn_adult_elemhide.tmp
sort -u -o src/abpvn_general.txt src/abpvn_general.tmp
sort -u -o src/abpvn_whitelist.txt src/abpvn_whitelist.tmp
sort -u -o src/abpvn_whitelist_elemhide.txt src/abpvn_whitelist_elemhide.tmp
# make time stamp update
TIME_STAMP=`date +'%d %B %Y %H:%M:%S'`
VERSION=`date +'%Y%m%d%H%M'`
sed -e "s/_time_stamp_/$TIME_STAMP/g" -e "s/_version_/$VERSION/g" src/abpvn_title.txt > src/abpvn_title.tmp
# add to 1 file
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt > abpvn.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_whitelist.txt src/abpvn_adult.txt > abpvn_noelemhide.txt
# remove tmp file
rm -rf src/*.tmp
