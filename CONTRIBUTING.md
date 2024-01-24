## How to contributing ABPVN
1. Fork abpvn repository
2. Create your rule use your favorite Adblocker extention (ABP, Ublock Origin, AdGuard)
3. Filter your rule as type: network rule, element hiding rule, network white list rule, element hide white list rule and add it to correct file under `filter/src` folder. If you want to add rule only support by Ublock Origin please modify file `filter/src/abpvn_ublock_specific.txt`. Similar this `filter/src/abpvn_adguard_specific.txt` is for AdGuard.
4. Run `bash commit.sh` to build filter or `bash skip-build-commit.sh` to skip filter build then follow question for commit type and update domain.
5. Run `git push` with git-bash in Windows or terminal on Unix/Linux
6. Create pull request to **ABPVN** repository
7. Waiting for approve from **ABPVN** Author

Made with ♥ by hoangrio
