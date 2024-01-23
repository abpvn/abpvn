#!/bin/sh
bash sort.sh
# make time stamp update
TIME_STAMP=`date +'%d %b %Y %H:%M:%S'`
VERSION=$1
if [[ -z $VERSION ]]; then
    VERSION=`date +'%Y%m%d%H%M%S%3N'`
fi

sed -e "s/_time_stamp_/$TIME_STAMP/g" -e "s/_version_/$VERSION/g" src/abpvn_title.txt > src/abpvn_title.tmp
echo >> src/abpvn_title.tmp
# add to 1 file
# abpvn.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt > abpvn.tmp
sed -e '/^$/d' -e "s/.patch#/.patch#abpvn/" abpvn.tmp > abpvn.txt
# abpvn_ublock.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt src/abpvn_ublock_specific.txt > abpvn_ublock.tmp
get_replace_rule () {
    # $1 is input file
    local INPUT_FILE="src/$1.txt"
    local REMOVE_RULE_TMP_FILE="$1_removal.tmp"
    grep -E '^-(.*)$' $INPUT_FILE > $REMOVE_RULE_TMP_FILE
    local REPLACE_RULE=''
    for removeRule in $(cat $REMOVE_RULE_TMP_FILE | grep -v '\.$'); do
            printf -v removeRule "%q\n" $removeRule
            THIS_REPLACE_RULE="s|$(echo $removeRule | cut -c 1-${#removeRule})||g;s|$(echo $removeRule | cut -c 2-${#removeRule})||g"
            if [ "$REPLACE_RULE" == "" ]
            then
                REPLACE_RULE="$THIS_REPLACE_RULE"
            else
                REPLACE_RULE="$REPLACE_RULE;$THIS_REPLACE_RULE"
            fi
    done
    echo $REPLACE_RULE
}
# Search useless rule by ublock specific
UBLOCK_REPLACE_RULE=$(get_replace_rule abpvn_ublock_specific)
if [ "$UBLOCK_REPLACE_RULE" == "" ]
then
    sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_ublock/" abpvn_ublock.tmp > abpvn_ublock.txt
else
    sed $UBLOCK_REPLACE_RULE abpvn_ublock.tmp > abpvn_ublock1.tmp 
    sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_ublock/" abpvn_ublock1.tmp > abpvn_ublock.txt
fi
# abpvn_adguard.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt src/abpvn_adguard_specific.txt > abpvn_adguard.tmp
# Search useless rule by adguard specific
ADGUARD_REPLACE_RULE=$(get_replace_rule abpvn_adguard_specific)
if [ "$ADGUARD_REPLACE_RULE" == "" ]
then
    sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_adguard/" abpvn_adguard.tmp > abpvn_adguard.txt
else
    sed $ADGUARD_REPLACE_RULE abpvn_adguard.tmp > abpvn_adguard1.tmp 
    sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_adguard/" abpvn_adguard1.tmp > abpvn_adguard.txt
fi
# abpvn_noelemhide.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_whitelist.txt src/abpvn_adult.txt > abpvn_noelemhide.tmp
sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_noelemhide/" abpvn_noelemhide.tmp > abpvn_noelemhide.txt
# abpvn_content_blocker.txt
cat src/abpvn_title.tmp src/abpvn_general.txt src/abpvn_ad_domain.txt src/abpvn_elemhide.txt src/abpvn_whitelist.txt src/abpvn_whitelist_elemhide.txt src/abpvn_adult.txt src/abpvn_adult_elemhide.txt src/abpvn_content_blocker_hot_fix.txt > abpvn_content_blocker.tmp
# Search useless rule by content blocker
CONTENT_BLOCKER_REPLACE_RULE=$(get_replace_rule abpvn_content_blocker_hot_fix)
if [ "$CONTENT_BLOCKER_REPLACE_RULE" == "" ]
then
    sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_content_blocker/" abpvn_content_blocker.tmp > abpvn_content_blocker.txt
else
    sed $CONTENT_BLOCKER_REPLACE_RULE abpvn_content_blocker.tmp > abpvn_content_blocker1.tmp
    sed -e '/^$/d' -e "s/.patch#/.patch#abpvn_content_blocker/" abpvn_content_blocker1.tmp > abpvn_content_blocker.txt
fi

