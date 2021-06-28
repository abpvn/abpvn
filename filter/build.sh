#!/bin/sh
export LC_ALL=C
# copy to tmp
cp -r src/abpvn_adult.txt src/abpvn_adult.tmp
cp -r src/abpvn_adult_elemhide.txt src/abpvn_adult_elemhide.tmp
cp -r src/abpvn_general.txt src/abpvn_general.tmp
cp -r src/abpvn_ad_domain.txt src/abpvn_ad_domain.tmp
cp -r src/abpvn_elemhide.txt src/abpvn_elemhide.tmp
cp -r src/abpvn_whitelist.txt src/abpvn_whitelist.tmp
cp -r src/abpvn_whitelist_elemhide.txt src/abpvn_whitelist_elemhide.tmp
cp -r src/abpvn_ublock_specific.txt src/abpvn_ublock_specific.tmp
# sort tmp to txt
sort -u -o src/abpvn_adult.txt src/abpvn_adult.tmp
sort -u -o src/abpvn_adult_elemhide.txt src/abpvn_adult_elemhide.tmp
sort -u -o src/abpvn_general.txt src/abpvn_general.tmp
sort -u -o src/abpvn_ad_domain.txt src/abpvn_ad_domain.tmp
sort -u -o src/abpvn_elemhide.txt src/abpvn_elemhide.tmp
sort -u -o src/abpvn_whitelist.txt src/abpvn_whitelist.tmp
sort -u -o src/abpvn_whitelist_elemhide.txt src/abpvn_whitelist_elemhide.tmp
sort -u -o src/abpvn_ublock_specific.txt src/abpvn_ublock_specific.tmp
# make time stamp update
TIME_STAMP=`date +'%d %b %Y %H:%M'`
VERSION=`date +'%Y%m%d%H%M'`
sed -e "s/_time_stamp_/$TIME_STAMP/g" -e "s/_version_/$VERSION/g" src/abpvn_title.txt > src/abpvn_title.tmp
#if [ "$(uname)" != "Darwin" ]; then
echo >> src/abpvn_title.tmp
#fi
# add to 1 file
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt > abpvn.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt src/abpvn_ublock_specific.txt > abpvn_ublock.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_whitelist.txt src/abpvn_adult.txt > abpvn_noelemhide.txt
# remove tmp file
rm -rf src/*.tmp
