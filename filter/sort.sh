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
cp -r src/abpvn_adguard_specific.txt src/abpvn_adguard_specific.tmp
cp -r src/abpvn_content_blocker_hot_fix.txt src/abpvn_content_blocker_hot_fix.tmp
# sort tmp to txt
sort -u -o src/abpvn_adult.txt src/abpvn_adult.tmp
sort -u -o src/abpvn_adult_elemhide.txt src/abpvn_adult_elemhide.tmp
sort -u -o src/abpvn_general.txt src/abpvn_general.tmp
sort -u -o src/abpvn_ad_domain.txt src/abpvn_ad_domain.tmp
sort -u -o src/abpvn_elemhide.txt src/abpvn_elemhide.tmp
sort -u -o src/abpvn_whitelist.txt src/abpvn_whitelist.tmp
sort -u -o src/abpvn_whitelist_elemhide.txt src/abpvn_whitelist_elemhide.tmp
sort -u -o src/abpvn_ublock_specific.txt src/abpvn_ublock_specific.tmp
sort -u -o src/abpvn_adguard_specific.txt src/abpvn_adguard_specific.tmp
sort -u -o src/abpvn_content_blocker_hot_fix.txt src/abpvn_content_blocker_hot_fix.tmp

# remove tmp file
rm -rf *.tmp src/*.tmp