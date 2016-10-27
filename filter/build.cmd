@echo off;
rem Soft filter rule and get Unique
powershell -Command "copy src\abpvn_general.txt src\abpvn_general.tmp;copy src\abpvn_elemhide.txt src\abpvn_elemhide.tmp;copy src\abpvn_whitelist.txt src\abpvn_whitelist.tmp;copy src\abpvn_whitelist_elemhide.txt src\abpvn_whitelist_elemhide.tmp;"
powershell -Command "Get-Content src\abpvn_general.tmp | Sort-Object | Get-Unique | Set-Content src\abpvn_general.txt;Get-Content src\abpvn_elemhide.tmp | Sort-Object | Get-Unique | Set-Content src\abpvn_elemhide.txt;Get-Content src\abpvn_whitelist.tmp | Sort-Object | Get-Unique | Set-Content src\abpvn_whitelist.txt; Get-Content src\abpvn_whitelist_elemhide.tmp | Sort-Object | Get-Unique | Set-Content src\abpvn_whitelist_elemhide.txt;"
rem Make time stamp update
powershell -Command "(Get-Content src\abpvn_title.txt).replace(\"_time_stamp_\",(Get-Date -format \"dd MMMM yyyy HH:mm:ss\")) | Set-Content src\abpvn_title.tmp -Encoding UTF8"
rem Build file
copy /y /b src\abpvn_title.tmp+src\abpvn_general.txt+src\abpvn_elemhide.txt+src\abpvn_whitelist.txt+src\abpvn_whitelist_elemhide.txt abpvn.txt
copy /y /b src\abpvn_title.tmp+src\abpvn_general.txt+src\abpvn_whitelist.txt abpvn_noelemhide.txt
DEL src\*.tmp
powershell -Command "$git_comment=Select-String -Path src\abpvn_title.txt -Pattern \"(\s\[.+?\])\" -AllMatches | \%{ $_.Matches } | \%{ $_.Value }; $git_comment=\"Update or Fix\"+$git_comment; git add .;git commit -m $git_comment;";