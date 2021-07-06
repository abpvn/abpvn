// ==UserScript==
// @name        ABPVN AdsBlock
// @namespace   ABPVN
// @author      ABPVN
// @copyright   ABPVN
// @homepage    https://abpvn.com
// @supportURL  https://github.com/abpvn/abpvn/issues
// @icon        https://abpvn.com/icon.png
// @description Script block ads, remove wating of ABPVN
// @description:vi Script chặn quảng cáo,loại bỏ chờ đợi của ABPVN
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donghoang.nguyen@gmail.com&item_name=ABPVN Donation
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @include     http://*
// @include     https://*
// @version     2.2.97
// @change-log  Addibongda2.com fake link removal
// @run-at      document-end
// ==/UserScript==
/* String Prototype */
String.prototype.startWith = function (str) {
    return typeof this.indexOf === 'function' && this.indexOf(str) === 0;
};
String.prototype.ismatch = function (regex) {
    return typeof this.match === 'function' && this.match(regex) !== null;
};
//Bypass Class
var byPass = {
    hideLinkUnlock: function () {
        var contentDiv = document.querySelectorAll('.onp-sl-content,.onp-locker-call,[data-locker-id]');
        if (contentDiv.length) {
            ABPVN.cTitle();
            //Add style tag to hide all .onp-sl and show all .onp-sl-content
            if (!document.getElementById('abpvn_style')) {
                var style = document.createElement('style');
                style.id = 'abpvn_style';
                style.innerHTML = '.onp-sl-content{display:block!important;}.onp-sl,.onp-sl-overlap-box{display:none!important;}.onp-sl-blur-area{filter: none!important;}';
                document.body.appendChild(style);
            } //ShowALl ContentDiv
            for (var i in contentDiv) {
                if (contentDiv[i].firstChild && contentDiv[i].firstChild.innerText != 'Unlocked by ABPVN.COM') {
                    var creditDiv = document.createElement('div');
                    creditDiv.innerHTML = '<a href="http://abpvn.com" target="_blank" style="color: #08BE54;font-weight: bold;">Unlocked by ABPVN.COM</a>';
                    creditDiv.style.textAlign = 'right';
                    contentDiv[i].insertBefore(creditDiv, contentDiv[i].firstChild);
                }
                if (contentDiv[i].style) {
                    contentDiv[i].style.display = 'block';
                }
            } //Hide All LockDiv
            var lockDiv = document.querySelectorAll('.onp-sl,div[id^="content-locker"]');
            for (var j in lockDiv) {
                if (lockDiv[j].style) {
                    lockDiv[j].style.display = 'none !important';
                    lockDiv[j].setAttribute('hidden', 'hidden');
                }
            }
        }
    },
    removeShortLink: function () {
        var allShortLink = document.querySelectorAll('a[href*="/full/?api="]');
        var count = 0;
        if (allShortLink.length) {
            ABPVN.cTitle();
            for (var i = 0; i < allShortLink.length; i++) {
                var processingLink = allShortLink[i];
                var href = processingLink.getAttribute('href');
                var tmp = href.match(/url=(.+?)&|$/);
                if (tmp[1]) {
                    processingLink.setAttribute('href', atob(tmp[1].replace(/=+$/, '')));
                    var oldTitle = processingLink.getAttribute('title');
                    processingLink.setAttribute('title', oldTitle ? (oldTitle + ' ') : '' + 'Short link by pass by ABPVN.COM');
                    count++;
                }
            }
            Logger.info("By pass " + count + " short link");
        }
    },
    quickByPassLink: function () {
        var regex = /123link\..*|phlame.pw|mshares\.co|mshare\.xyz|megaurl\.*|www.123l\.*|vinaurl\.*|share4you.pro|doxeaz10.site|derow.win|linkviet.net|ez4linkss.com|ckk.ai|link.codevn.net|linksht.com|beta.shortearn.eu/;
        var largeTimeoutHost = /share4you.pro|derow.win/;
        var autoCaptchaOnlyList = /megaurl\.*|vinaurl\.*|doxeaz10.site|linkviet.net|ez4linkss.com|ckk.ai|link.codevn.net|beta.shortearn.eu/;
        if (regex.test(location.hostname)) {
            try {
                var checkClick = function (mutation) {
                    if (mutation.attributeName === "disabled" && !mutation.target.disabled) {
                        return true;
                    }
                    if (mutation.attributeName === "class" && !mutation.target.classList.contains('disabled')) {
                        return true;
                    }
                    return false;
                }
                var link;
                // Set up a new observer
                var observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        // Check the modified attributeName is "disabled"
                        if (checkClick(mutation)) {
                            mutation.target.click();
                        }
                        if (mutation.attributeName === "href") {
                            link = mutation.target.getAttribute("href");
                            document.body.innerHTML = '<style>h1{color: #00dc58;}a{color: #015199}a h1{color: #015199;}</style><center><h1>ABPVN quick bypass đã hoạt động</h1><a href=\'https://abpvn.com/donate\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự chuyển trang? <a href=\'' + link + '\' title=\'Chuyển trang\'>Click vào đây</a></center>';
                            location.href = link;
                        }
                    });
                });
                // Configure to only listen to attribute changes
                var config = {
                    attributes: true
                };
                var button = document.getElementById('invisibleCaptchaShortlink') || document.querySelector('.download_1');
                if (button) {
                    observer.observe(button, config);
                } else if (document.querySelector('#originalLink')) {
                    link = document.querySelector('#originalLink').getAttribute("href");
                    document.body.innerHTML = '<style>h1{color: #00dc58;}a{color: #015199}a h1{color: #015199;}</style><center><h1>ABPVN quick bypass đã hoạt động</h1><a href=\'https://abpvn.com/donate\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự chuyển trang? <a href=\'' + link + '\' title=\'Chuyển trang\'>Click vào đây</a></center>';
                    location.href = link;
                } else {
                    var getLinkl = document.querySelector('.get-link');
                    var timeout = largeTimeoutHost.test(location.hostname) ? 6000 : 100;
                    if (getLinkl) {
                        observer.observe(getLinkl, config);
                        if (!autoCaptchaOnlyList.test(location.hostname)) {
                            setTimeout(function () {
                                $("#go-link").addClass("go-link").trigger("submit.adLinkFly.counterSubmit").one("submit.adLinkFly.counterSubmit", function (e) {
                                    e.preventDefault();
                                    if (!largeTimeoutHost.test(location.hostname)) {
                                        location.reload();
                                    }
                                });
                            }, timeout);
                        }
                    }
                }
                // mshares.co
                var downloadButton = document.querySelector('#download-file-button');
                if (downloadButton) {
                    $.ajax({
                        url: '/download/get-download-info',
                        type: 'POST',
                        data: {
                            id: downloadButton.getAttribute('data-id')
                        },
                        success: function (data) {
                            if (data.success && data.file_info && data.file_info.href) {
                                var link = data.file_info.href;
                                document.body.innerHTML = '<style>h1{color: #00dc58;}a{color: #015199}a h1{color: #015199;}</style><center><h1>ABPVN quick download đã hoạt động</h1><a href=\'https://abpvn.com/donate\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự tải xuống? <a href=\'' + link + '\' title=\'Tải xuống\'>Click vào đây</a></center>';
                                location.href = link;
                            } else {
                                location.reload();
                            }
                        },
                        error: function () {
                            location.reload();
                        }
                    });
                }
            } catch (e) {
                Logger.error(e);
            }
        }
    },
    wikiall_org: function () {
        if (location.hostname == 'wikiall.org' && document.querySelector('#timer')) {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // Check the modified childList of place
                    if (mutation.type == 'childList') {
                        var targetA = mutation.target.querySelector('a');
                        location.href = targetA.getAttribute('href');
                    }
                });
            });
            // Configure to only listen to attribute changes
            var place = document.querySelector('#place');
            observer.observe(place, {
                childList: true
            });
        }
    },
    init: function () {
        if (configure.getValue('unlock_content', true)) {
            window.addEventListener('DOMContentLoaded', this.hideLinkUnlock);
            window.addEventListener('load', this.hideLinkUnlock);
            this.hideLinkUnlock();
        }
        if (configure.getValue('remove_short_link', true)) {
            window.addEventListener('DOMContentLoaded', this.removeShortLink);
        }
        if (configure.getValue('quick_by_pass_link', true)) {
            this.quickByPassLink();
            this.wikiall_org();
        }
    }
};
//Logger Class
var Logger = {
    style: 'color: #00DC58',
    info: function (text) {
        console.info('%cABPVN.COM Info: ', this.style, text);
    },
    warn: function (text) {
        console.warn('%cABPVN Warn: ', this.style, text);
    },
    error: function (text) {
        console.error('%cABPVN Error: ', this.style, text);
    },
    log: function (text) {
        console.log('%cABPVN Log: ', this.style, text);
    },
};
//get Link class
var getLink = {
    vnz_leech_auto_fill: function () {
        if (this.url == 'https://www4.cbox.ws/box/?boxid=4240872&boxtag=soigia&sec=form' && this.url.indexOf('link=')) {
            var url = (window.location != window.parent.location) ?
                document.referrer :
                document.location.href;
            var match = url.match(/link=([\w\.\/\:]+)($|&|\?)/);
            if (match) {
                document.querySelector('input[name="pst"]').value = match[1];
            }
        }
    },
    mediafire_com: function () {
        if (this.url.startWith('http://www.mediafire.com/file/') || this.url.startWith('https://www.mediafire.com/file/')) {
            var a_tag = document.querySelector('.download_link a.input');
            var link = a_tag.getAttribute('href');
            if (link.startWith('http')) {
                document.body.innerHTML = '<style>h1{color: #00dc58;}a{color: #015199}a h1{color: #015199;}</style><center><h1>ABPVN MediaFire Download đã hoạt động</h1><a href=\'https://abpvn.com/donate\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự tải xuống? <a href=\'' + link + '\' title=\'Download\'>Click vào đây</a></center>';
                location.href = link;
            }
        }
    },
    usercloud_com: function () {
        if (this.url.startWith('https://userscloud.com/') && this.url.length > 24) {
            var form = document.querySelector('form[name="F1"]');
            if (form) {
                form.submit();
                document.body.innerHTML = '<style>h1{color: #00dc58;}a{color: #015199}a h1{color: #015199;}</style><center><h1>ABPVN UserCloud Download đã hoạt động</h1><a href=\'https://abpvn.com/donate\'><h1>Ủng hộ ABPVN</h1></center>';
            } else {
                var a_link = document.querySelector('h4 a.btn-success');
                if (a_link) {
                    var link = a_link.getAttribute('href');
                    if (link.startWith('https')) {
                        document.body.innerHTML = '<style>h1{color: #00dc58;}a{color: #015199}a h1{color: #015199;}</style><center><h1>ABPVN UserCloud Download đã hoạt động</h1><a href=\'https://abpvn.com/donate\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự tải xuống? <a href=\'' + link + '\' title=\'Download\'>Click vào đây</a></center>';

                    }
                }
            }
        }
    },
    init: function () {
        this.url = location.href;
        if (configure.getValue('quick_download', true)) {
            this.mediafire_com();
            this.usercloud_com();
            this.vnz_leech_auto_fill();
        }
    }
};
//Fix site class
var fixSite = {
    elementExist: function (selector) {
        var check = document.querySelector(selector);
        return check != null;
    },
    getAllText: function (selector) {
        var text = '';
        var nodeList = document.querySelectorAll(selector);
        if (nodeList) {
            for (var i in nodeList) {
                if (nodeList[i].innerText) text += nodeList[i].innerText;
            }
        }
        return text;
    },
    getScript: function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', function (data) {
            var blob = new Blob([xhr.responseText], {
                type: 'text/javascript'
            });
            var blobUrl = URL.createObjectURL(blob);
            var script = document.createElement('script');
            script.src = blobUrl;
            script.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(script);
        });
        xhr.send();
    },
    loadCss: function (url, id) {
        var css_tag = document.createElement('link');
        css_tag.rel = 'stylesheet';
        css_tag.id = id;
        css_tag.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(css_tag);
    },
    fakelinkRemover: function () {
        var regex = /ibongda|thevang.tv|banthang.live|tructiepbongda.vip|dabong.net|bongda365.tv|tructiepbongda.pro/
        if (regex.test(this.url)) {
            ABPVN.cTitle();
            var fakeLink = document.querySelectorAll('a[data-href][rel="nofollow"],a[data-url][rel="nofollow"],a[data-url].pop-open');
            var count = 0;
            for (var i = 0; i < fakeLink.length; i++) {
                if (fakeLink[i]) {
                    fakeLink[i].setAttribute('href', fakeLink[i].getAttribute('data-href') || fakeLink[i].getAttribute('data-url'));
                    count++;
                }
            }
            Logger.info("Removed " + count + " fake link in " + location.hostname);
        }
    },
    antiAdblockRemover: function () {
        var msg = 'By pass adBlock detect rồi nhé! Hahahahaha 😁😁😁';
        if (typeof adBlockDetected === 'function') {
            adBlockDetected = function () {
                Logger.info(msg);
            };
        }
        if (typeof showAdsBlock === 'function') {
            showAdsBlock = function () {
                Logger.info(msg);
            };
        }
        if (typeof nothingCanStopMeShowThisMessage === 'function') {
            nothingCanStopMeShowThisMessage = function () {
                Logger.info(msg);
            };
        }
    },
    kickass_cc: function () {
        if (this.url.startWith('https://kickass2.cc')) {
            var allFakeA = document.querySelectorAll('a[href^="https://mylink.cx/?url="]');
            var count = 0;
            for (var i = 0; i < allFakeA.length; i++) {
                var aTag = allFakeA[i];
                if (aTag) {
                    var realLink = aTag.getAttribute('href').replace(/https:\/\/mylink\.cx\/\?url=(.*)/, '$1');
                    aTag.setAttribute('href', decodeURIComponent(realLink));
                    count++;
                }
            }
            Logger.info("Removed " + count + " fake link in " + location.hostname);
        }
    },
    topphimhd_info: function () {
        if (this.url.startWith('http://lb.topphimhd.info')) {
            var adSourceEl = document.querySelector('[data-ads=""]');
            if (adSourceEl) {
                adSourceEl.remove();
                Logger.log("Removed ads source");
                ABPVN.cTitle();
            }
        }
    },
    removeRedir: function (config) {
        if (this.url.match(new RegExp(config.url, 'g')) || this.url.startWith(config.url)) {
            ABPVN.cTitle();
            var links = document.querySelectorAll(config.selector || 'a[href^="' + config.replace + '"]');
            Logger.info('Remove Redirect for ' + links.length + ' links');
            if (links.length) {
                links.forEach(function (item) {
                    var stockUrl = item.getAttribute('href').replace(config.replace, '');
                    var count = 0;
                    while (stockUrl.indexOf('%2') > -1 && count < 5) {
                        stockUrl = decodeURIComponent(stockUrl);
                        count++;
                    }
                    count = 0;
                    while (stockUrl.indexOf('aHR0c') === 0 && count < 5) {
                        stockUrl = atob(stockUrl);
                        count++;
                    }
                    item.setAttribute('href', stockUrl);
                    item.setAttribute('title', 'Link đã xóa chuyển hướng trung gian bởi abpvn.com');
                }.bind(this));
            }
        }
    },
    removeRedirect() {
        var configs = [
            {
                url: 'https://samsungvn.com',
                replace: 'https://samsungvn.com/xfa-interstitial/redirect?url=',
            },
            {
                url: 'https://forum.vietdesigner.net',
                replace: 'redirect/?url='
            },
            {
                url: 'http://phanmemaz.com/',
                replace: 'http://phanmemaz.com/wp-content/plugins/tm-wordpress-redirection/l.php?'
            },
            {
                url: 'forums.voz.vn/showthread.php',
                replace: '/redirect/index.php?link='
            },
            {
                url: 'www.webtretho.com/forum/',
                replace: /http(s?):\/\/webtretho\.com\/forum\/links\.php\?url=/,
                selector: 'a[href*="webtretho.com/forum/links.php?url="]'
            },
            {
                url: '/kat.vc|kickass.best/',
                replace: 'https://mylink.cx/?url='
            },
            {
                url: 'https://tuong.me/',
                replace: 'https://tuong.me/chuyen-huong/?url='
            },
            {
                url: 'https://yhocdata.com/',
                replace: 'https://yhocdata.com/redirect/?url='
            },
            {
                url: 'https://vn-z.vn/',
                replace: 'https://vn-z.vn/redirect?to='
            },
            {
                url: 'https://romgoc.net',
                replace: 'https://romgoc.net/redirect-to/?url='
            },
            {
                url: 'https://tophanmem.com',
                replace: 'https://tophanmem.com/redirect-to/?url='
            },
        ];
        configs.forEach(function (config) {
            this.removeRedir(config);
        }.bind(this));
    },
    init: function () {
        this.url = location.href;
        if (configure.getValue('remove_redirect', true)) {
            this.removeRedirect();
        }
        this.antiAdblockRemover();
        this.kickass_cc();
        this.fakelinkRemover();
        this.topphimhd_info();
    }
};
//Ad blocker script
var adBlocker = {
    blockPopUp: function () {
        var listSite = [
            'blogtruyen.vn',
            'www.khosachnoi.net',
            'hamtruyen.vn',
            'phim14.net',
            'phim7.com',
            'www.diendan.trentroiduoidat.com',
            'www.trentroiduoidat.com',
            'chophanthiet.us',
            'animetvn.com',
            'font.vn',
            'vidoza.net',
            'www.easysoft.xyz',
            'hdonline.vn',
            'www.phim.media',
            'phimnhanh.com',
            'www.vietsubhd.com',
            'www.phimmedia.tv',
            'tvhay.org',
            'bilutv.org',
            'fullcrackpc.com'
        ];
        for (var i = 0; i < listSite.length; i++) {
            if (location.hostname === listSite[i]) {
                ABPVN.cTitle();
                Logger.info('Đã chặn popup quảng cáo');
                document.body.onclick = null;
                document.onclick = null;
                document.ontouchstart = null;
                document.onmousedown = null;
                window.addEventListener('load', function () {
                    setTimeout(function () {
                        Logger.info('Đã chặn popup quảng cáo onload');
                        document.ontouchstart = null;
                        document.onclick = null;
                        document.body.onclick = null;
                        document.onmousedown = null;
                    }, 300);
                });
                window.addEventListener('DOMContentLoaded', function () {
                    setTimeout(function () {
                        Logger.info('Đã chặn popup quảng cáo dom load');
                        document.ontouchstart = null;
                        document.onclick = null;
                        document.body.onclick = null;
                        document.onmousedown = null;
                    }, 300);
                });
            }
        }
    },
    mgIdAdRemover: function () {
        var allMgIdEl = document.querySelectorAll('[id*="ScriptRoot"]');
        if (allMgIdEl && allMgIdEl.length) {
            ABPVN.cTitle();
            Logger.log('Removed mgIdAd placeholder');
            for (var i = 0; i < allMgIdEl.length; i++) {
                if (location.hostname !== 'megaup.net') {
                    allMgIdEl[i].id = 'ScriptRoot-removed-by-abpvn-' + Math.random();
                }
                allMgIdEl[i].innerHTML = '';
            }
        }
    },
    phimnhanh_com: function () {
        if (this.url.startWith('http://phimnhanh.com/xem-phim')) {
            Logger.warn('Đã chặn video preload');
            if (video !== undefined) {
                video.preroll = function (options) { };
            }
        }
    },
    vinaurl_net: function () {
        if (this.url.match(/vinaurl\.*/)) {
            document.querySelectorAll('div[id^="ads-"]').forEach(item => item.remove());
        }
    },
    phimnhe_net: function () {
        if (this.url.startWith('https://phimnhe.net') && createCookie !== undefined) {
            ABPVN.cTitle();
            createCookie('vwinpopuppc', 1, 72);
            createCookie('vwinpopupmb', 1, 72);
        }
    },
    aphimhot_com: function () {
        if (this.url.startWith('https://aphimhot.com')) {
            sessionStorage.setItem(key, 1);
            openTab = function (url) {
                Logger.log(`Chặn popup rồi nhé😁😁. Đang chuyển đến ${url}...`);
                location.href = url;
            }
        }
    },
    init: function () {
        this.url = location.href;
        this.mgIdAdRemover();
        this.blockPopUp();
        this.phimnhanh_com();
        this.vinaurl_net();
        this.phimnhe_net();
        this.aphimhot_com();
    },
};
var configure = {
    urls: {
        setting: 'https://abpvn.com/script-setting.html',
        issue: 'https://github.com/abpvn/abpvn/issues/new',
        fanpage: 'https://www.facebook.com/abpvn.org',
    },
    openUrl: function (url) {
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(url);
        }
    },
    getValue: function (key, defaultValue) {
        var value;
        if (typeof GM_getValue === 'function') {
            value = GM_getValue(key);
        }
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        return value;
    },
    setValue: function (key, value) {
        if (typeof GM_setValue === 'function') {
            return GM_setValue(key, value);
        }
    },
    setUpSetting: function () {
        if (this.url === this.urls.setting) {
            var settingContainer = document.querySelector('#setting-container');
            if (settingContainer) {
                settingContainer.classList.add('installed');
                var allSetting = settingContainer.querySelectorAll('input[type="checkbox"]');
                if (allSetting) {
                    allSetting.forEach(checkbox => {
                        checkbox.checked = this.getValue(checkbox.name, true);
                        checkbox.addEventListener('change', event => {
                            var target = event.target;
                            var key = target.name;
                            this.setValue(key, event.target.checked);
                        });
                    });
                }
            }
        }
    },
    init: function () {
        this.url = location.href;
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('ABPVN - Cài đặt', () => {
                this.openUrl(this.urls.setting);
            });
            GM_registerMenuCommand('ABPVN - Báo lỗi', () => {
                this.openUrl(this.urls.issue);
            });
            GM_registerMenuCommand('ABPVN - Fanpage', () => {
                this.openUrl(this.urls.fanpage);
            });
        }
        this.setUpSetting();
    }
};
//Main class
var ABPVN = {
    cTitle: function () {
        if (document.title.indexOf(' - Fixed by ABPVN.COM') === -1) {
            document.title = document.title + ' - Fixed by ABPVN.COM';
        }
    },
    init: function () {
        //Init class adBlocker
        adBlocker.init();
        //Init class getLink
        getLink.init();
        //Init class Fixsite
        fixSite.init();
        //Init bypass class
        byPass.init();
        if (window === window.parent) {
            //Init Congfiure
            configure.init();
        }
    }
};
//RUN INNIT
ABPVN.init();