echo off;
copy /y /b src\abpvn_title.txt+src\abpvn_general.txt+src\abpvn_elemhide.txt+src\abpvn_whitelist.txt+src\abpvn_whitelist_elemhide.txt abpvn.txt
copy /y /b src\abpvn_title.txt+src\abpvn_general.txt+src\abpvn_whitelist.txt abpvn_noelemhide.txt