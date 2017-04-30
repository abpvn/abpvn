rem Update first
git pull
rem Run Build filter for EasyList
cd filter
call build.cmd
cd ..
powershell -Command "$git_comment=Select-String -Path filter\src\abpvn_title.txt -Pattern \"(\s\[.+?\])\" -AllMatches | %%{ $_.Matches } | %%{ $_.Value }; $git_comment=\"Update or Fix\"+$git_comment; git add .; git commit -m $git_comment; git push;";
sh pull.sh