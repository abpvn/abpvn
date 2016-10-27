@echo off;
rem Make time stamp update
powershell -Command "(Get-Content src\abpvn_title.txt).replace(\"_time_stamp_\",(Get-Date -format \"dd MMMM yyyy HH:mm:ss\")) | Set-Content abpvn_title_tmp.txt -Encoding UTF8"
rem Build file
copy /y /b abpvn_title_tmp.txt+src\abpvn_general.txt+src\abpvn_elemhide.txt+src\abpvn_whitelist.txt+src\abpvn_whitelist_elemhide.txt abpvn.txt
copy /y /b abpvn_title_tmp.txt+src\abpvn_general.txt+src\abpvn_whitelist.txt abpvn_noelemhide.txt
DEL abpvn_title_tmp.txt