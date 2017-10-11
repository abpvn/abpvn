call build
powershell -Command "$git_comment=Select-String -Path src\abpvn_title.txt -Pattern \"(\s\[.+?\])\" -AllMatches | %%{ $_.Matches } | %%{ $_.Value }; $git_comment=\"Update or Fix\"+$git_comment; git add .; git commit -m $git_comment; git push;";
cd .. && pull.sh