## How to contributing ABPVN
1. Fork abpvn repository
2. Create your rule use your favorite Adblocker extention (ABP, Ublock Origin, AdGuard)
3. Filter your rule as type: network rule, element hiding rule, network white list rule, element hide white list rule and add it to correct file under `filter/src` folder. If you modify `filter/src/abpvn_ublock_specific.txt` please make sure added rule only work in uBlock Origin and is not supported by another Adblocker (ABP, AdGuard, etc)
4. Update `filter/src/abpvn_title.txt` file about your change `! Title: ABPVN List [(You change here)]`
5. Run `build-push.sh` with git-bash in Windows or terminal on Unix/Linux
6. Create pull request to **ABPVN** repository
7. Waiting for approve from **ABPVN** Author

Made with ♥ by hoangrio
