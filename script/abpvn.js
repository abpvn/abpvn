// ==UserScript==
// @name        ABPVN AdsBlock
// @namespace   ABPVN
// @author      ABPVN
// @copyright   ABPVN
// @homepage    http://abpvn.com
// @supportURL  https://github.com/abpvn/abpvn/issues
// @icon        http://abpvn.com/icon.png
// @description Script chặn quảng cáo,loại bỏ chờ đợi của ABPVN
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donghoang.nguyen@gmail.com&item_name=ABPVN Donation
// @run-at      document-end
// @include     http://*
// @include     https://*
// @version     2.2.11
// @change-log  Use higher z-index for fshare config button
// @grant       none
// ==/UserScript==
/* String Prototype */
String.prototype.startWith = function strxStart(str) {
  return this.indexOf(str) === 0;
};
String.prototype.ismatch = function (regex) {
  return this.match(regex) !== null;
};
var getAllText = function (selector) {
  var text = '';
  var list = document.querySelectorAll(selector);
  if (list)
  for (var i = 0; i < list.length; i++) {
    text += list[i].innerText;
  }
  return text;
};
var removeDuplicates = function (arr) {
  var tmp = [
  ];
  for (var i = 0; i < arr.length; i++) {
    if (tmp.indexOf(arr[i]) == - 1) {
      tmp.push(arr[i]);
    }
  }
  return tmp;
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
        style.innerHTML = '.onp-sl-content{display:block!important;}.onp-sl,.onp-sl-overlap-box{display:none!important;}';
        document.body.appendChild(style);
      }      //ShowALl ContentDiv

      for (var i in contentDiv) {
        if (contentDiv[i].firstChild && contentDiv[i].firstChild.innerText != 'Unlocked by ABPVN.COM') {
          var creditDiv = document.createElement('div');
          creditDiv.innerHTML = '<a href="http://abpvn.com" target="_blank" style="color: #08BE54;font-weight: bold;">Unlocked by ABPVN.COM</a>';
          creditDiv.style.textAlign = 'right';
          contentDiv[i].insertBefore(creditDiv, contentDiv[i].firstChild);
        }
        if(contentDiv[i].style){
          contentDiv[i].style.display = 'block';
        }
      } //Hide All LockDiv

      var lockDiv = document.querySelectorAll('.onp-sl,div[id^="content-locker"]');
      for (var j in lockDiv) {
        if(lockDiv[j].style){
          lockDiv[j].style.display = 'none !important';
          lockDiv[j].setAttribute('hidden','hidden');
        }
      }
    }
  },
  anti123link: function(){
    var allShortLink = document.querySelectorAll('a[href^="http://123link"]');
    var count = 0;
    if(allShortLink.length){
      ABPVN.cTitle();
      for(var i=0;i<allShortLink.length;i++){
        var processingLink = allShortLink[i];        
        var href = processingLink.getAttribute('href');
        var tmp = href.match(/url=(.+?)&|$/);        ;
        if(tmp[1]){
          processingLink.setAttribute('href', atob(tmp[1]));
          var oldTitle = processingLink.getAttribute('title');
          processingLink.setAttribute('title',oldTitle?(oldTitle+' '):''+'123link by pass by ABPVN');
          count++;
        }
      }
      Logger.info("By pass "+count+" 123link short");
    }
  },
  init: function () {
    window.addEventListener('DOMContentLoaded', this.hideLinkUnlock);
    window.addEventListener('load', this.hideLinkUnlock);
    this.hideLinkUnlock();
    window.addEventListener('DOMContentLoaded',  this.anti123link);
    
  }
};
//Logger Class
var Logger = {
  info: function (text) {
    console.info('ABPVN Info: ', text);
  },
  warn: function (text) {
    console.warn('ABPVN Warn: ', text);
  },
  error: function (text) {
    console.error('ABPVN Error: ', text);
  },
  log: function (text) {
    console.log('ABPVN Log: ', text);
  },
};
//get Link class
var getLink = {
  FShareConfig: function () {
    if (this.url.startWith('https://www.fshare.vn')) {
      var background_image = localStorage.off == 'true' ? 'url("http://i.imgur.com/kJnOMOB.png")' : 'url("http://i.imgur.com/2b7fN6a.png")';
      var title = localStorage.off == 'true' ? 'Bật get link fshare' : 'Tắt get link fshare';
      var html = '<div id=\'fs_click\' title=\'' + title + '\' style=\'position: fixed; right: 0; bottom: 0; width: 30px; height: 30px; border-radius: 50%; background-image: ' + background_image + '; background-size: cover; cursor: pointer; z-index: 99999;\'></div>';
      $(document).ready(function () {
        $(document.body).append(html);
        $(document).on('click', '#fs_click', function FS_on_off() {
          if (localStorage.off != 'true') {
            localStorage.off = true;
            this.style.backgroundImage = 'url("http://i.imgur.com/kJnOMOB.png")';
            this.setAttribute('title', 'Bật get link fshare');
            alert('Đã tắt get link fshare');
          }
          else {
            localStorage.off = false;
            this.setAttribute('title', 'Tắt get link fshare');
            this.style.backgroundImage = 'url("http://i.imgur.com/2b7fN6a.png")';
            alert('Đã bật get link fshare');
          }
        });
      });
    }
  },
  FShareGetLink: function () {
    if (this.url.startWith('https://www.fshare.vn/file/') && !this.url.startWith('https://www.fshare.vn/file/manager')) {
      if (localStorage.off != 'true') {
        console.info('Start get link Fshare.vn');
        $(document).ready(function () {
          var checkpassword = document.querySelector('.password-form');
          var linkcode = $('#linkcode').val();
          if (checkpassword === null) {
            var code = $('#form-download input[name="_csrf-app"]').val();           
            var data = {
              '_csrf-app': code,
              'fcode5': '',
              'linkcode': linkcode,
              'withFcode5': 0,
            };
            $.post('/download/get', data).done(function (data, statusText, xhr) {
              if (data.url === undefined) location.reload();
               else {
                if (typeof location != 'undefined') {
                  console.log('ABPVN: ' + location.href + ' -> ' + data.url);
                  location.href = data.url;
                } 
                else {
                  $('.download').prepend('<a title="Tải trực tiếp" style="padding: 5px 0;box-sizing: content-box;" class="download-btn mdc-button mdc-button--raised mdc-ripple-upgraded full-width mdc-button-primary fcode5" href="' + data.url + '">Tải trực tiếp<span>Hỗ trợ bởi abpvn.com</span></a>'
                  );
                }
              }
            }).fail(function (xhr, statusText, error) {
              alert('ABPVN: Đã có lỗi fshare hoặc file có password');
            });
          } 
          else {
            alert('ABPVN: Hãy nhập mật khẩu cho file trước');           
          }
        });
      }
      else {
        $('.download').prepend('<a title="Download nhanh qua linksvip.net" style="padding: 5px 0;box-sizing: content-box;" class="download-btn mdc-button mdc-button--raised mdc-ripple-upgraded full-width mdc-button-primary fcode5" href="http://linksvip.net?link=' + location.href + '">Tải nhanh<span>Qua dịch vụ linksvip.net</span></a>'
        );
      }
    }
  },
  mediafire_com: function () {
    if (this.url.startWith('http://www.mediafire.com/file/')) {
      var a_tag = document.querySelector('.download_link a');
      var link = a_tag.getAttribute('href');
      if (link.startWith('http')) {
        document.body.innerHTML = '<center><h1>ABPVN MediaFire Download đã hoạt động</h1><a href=\'http://abpvn.com/napthe\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự tải xuống? <a href=\'' + link + '\' title=\'Download\'>Click vào đây</a></center>';
        location.href = link;
      }
    }
  },
  usercloud_com: function () {
    if (this.url.startWith('https://userscloud.com/') && this.url.length > 24) {
      var form = document.querySelector('form[name="F1"]');
      if (form) {
        form.submit();
        document.body.innerHTML = '<center><h1>ABPVN UserCloud Download đã hoạt động</h1><a href=\'http://abpvn.com/napthe\'><h1>Ủng hộ ABPVN</h1></center>';
      } else {
        var a_link = document.querySelector('h4 a.btn-success');
        if (a_link) {
          var link = a_link.getAttribute('href');
          if (link.startWith('https')) {
            location.href = link;
            document.body.innerHTML = '<center><h1>ABPVN UserCloud Download đã hoạt động</h1><a href=\'http://abpvn.com/napthe\'><h1>Ủng hộ ABPVN</h1></a><br/>Không tự tải xuống? <a href=\'' + link + '\' title=\'Download\'>Click vào đây</a></center>';
          }
        }
      }
    }
  },
  init: function () {
    this.url = location.href;
    this.FShareConfig();
    this.FShareGetLink();
    this.mediafire_com();
    this.usercloud_com();
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
      var url = URL.createObjectURL(blob);
      var script = document.createElement('script');
      script.src = url;
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
  phim_media: function () {
    if (this.url.startWith('https://www.phim.media/')||this.url.startWith('http://www.phim.media/')) {
      var links = document.querySelectorAll('#btn-film-watch,.poster > a');
      if(links){
        for(var i=0;i<links.length;i++){          
          var href = links[i].getAttribute('href');
          href = href.match('utm_id=.*') [0].replace('utm_id=', '');
          if (href) {
            links[i].setAttribute('href', atob(href));
          } 
        }       
        ABPVN.cTitle();
      }
    }
  },
  linkneverdie_com: function () {
    if(this.url.startWith('https://linkneverdie.com/')){
      ABPVN.cTitle();
      var el=document.getElementById('wrapper');
      if(el){
        el.id="wrapper-fix-by-abpvn";
      }
    }    
  },
  hdonline_vn: function(){    
    if (this.url.startWith('http://hdonline.vn')) {         
      var links = document.querySelectorAll('a[href^="http://hub.blueserving.com/"]');
      for (var i in links) {
        var link = links[i];
        var href = link.getAttribute('href');
        href = href.match('url=.*') [0].replace('url=', '');
        if (href) {
          link.setAttribute('href', href);
        }
      }
      ABPVN.cTitle();
    }
  },
  maclife_vn: function(){
    if(this.url.startWith('https://maclife.vn/')){
      var allShortUrl=document.querySelectorAll('a[rel]');
      var count=0;
      for(var i=0;i<allShortUrl.length;i++){
        if(allShortUrl[i].innerText.indexOf('http')===0){
          allShortUrl[i].setAttribute('href',allShortUrl[i].innerText);
          count++;
        }
      }
      Logger.info("Đã xóa "+count+" link rút gọn!");
    }
  },
  aphim_co: function(){
      if (this.url.startWith('https://aphim.co/xem-phim/')) {
          ABPVN.cTitle();
          var aTagAds = document.querySelector('#video > a');
          aTagAds.setAttribute('href','#abpvn');
          aTagAds.removeAttribute('target');
          Logger.info('Đã xóa link quảng cáo!');
      }
  },
  openload: function(){
    if(this.url.match(/^(https?:)?\/\/openload\.co\/*.*/) || this.url.match(/^(https?:)?\/\/oload\.\/*.*/)){
     //Base on https://greasyfork.org/vi/scripts/17665-openload
     //
     // @run-at document-start
     //
     window.adblock=false;
     window.adblock2=false;
     window.turnoff=true;
     window.open=function(){};
     //
     // @run-at document-end
     //
     function onready(fn){if(document.readyState!='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}

     onready(function(){
      if( document.location.href.match(/\/embed\//) || $('#realdl>a') )
      {
       var streamurl = '#streamurl, #streamuri, #streamurj';
       $('#btnView').hide();
       $('#btnDl').hide();
       $('.dlButtonContainer').show();
       $('h3.dlfile.h-method').hide();
       $('.col-md-4.col-centered-sm *').remove();
       $('#mgiframe,#main>div[id*="Composite"]').remove();
       $('#downloadTimer').hide();
       $('#mediaspace_wrapper').prepend( $('<div/>').attr('id', 'realdl')
                                        .attr('style', 'position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #00DC58; padding: .5em 0;')
                                        .on('mouseenter', function(){ $(this).fadeTo(500, 1); }).on('mouseleave', function(){ $(this).fadeTo(500, 0); })
                                        .append( $('<a/>').attr('href', '').attr('style', 'color: #fff; text-decoration: none;').html('FREE DOWNLOAD<sub>Power by abpvn.com</sub>') ) );
        if(document.location.href.match(/\/embed\//)){
         setTimeout(function(){
          $('#realdl').fadeTo(500,0);
         },1500); 
        }        
       $('#realdl').show();
       var tmrstreamurl = setInterval(function(){
        if( $(streamurl).text() != 'HERE IS THE LINK' )
        {
         $('#realdl a').attr('href', '/stream/' + $(streamurl).text());
         $('#videooverlay').click();
         clearInterval(tmrstreamurl);
        }
       },100);
      }
      window.onclick=function(){};
      document.onclick=function(){};
      document.body.onclick=function(){};
     });
    }    
  },
  fontdep_com: function(){
    if(this.url.startWith('http://www.fontdep.com/')&&document.cookie.indexOf('virallock_myid')==-1){
      document.cookie='virallock_myid=0001';
      location.reload();
    }
  },
  removeRedir(config) {
    if (this.url.match(new RegExp(config.url,'g')) || this.url.startWith(config.url)) {
      ABPVN.cTitle();
      var links = document.querySelectorAll('a[href^="' + config.replace + '"]');
      Logger.info('Remove Redirect for ' + links.length + ' links');
      if (links.length) {
        links.forEach(function (item) {
          var stockUrl = item.getAttribute('href').replace(config.replace, '');
          var count = 0;
          while (stockUrl.indexOf('%2') > - 1 && count < 5) {
            stockUrl = decodeURIComponent(stockUrl);
            count++;
          }
          item.setAttribute('href', stockUrl);
          item.setAttribute('title','Link đã xóa chuyển hướng trung gian bởi abpvn.com');
        }.bind(this));
      }
    }
  },
  xem7_com: function(){
    if(this.url.startWith('http://xem7.com')){
      //Remove all .ad_location by css
      if(!document.getElementById('#ABPVN_style')){
        var styleTag = document.createElement('style');
        styleTag.id = 'ABPVN_style';
        styleTag.innerHTML = '.ad_location{display: none !important;}';
        document.head.appendChild(styleTag);
      }
      ABPVN.cTitle();
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
        url: 'http://sinhvienit.net',
        replace: 'http://sinhvienit.net/goto/?'
      },
      {
        url: 'http://phanmemaz.com/',
        replace: 'http://phanmemaz.com/wp-content/plugins/tm-wordpress-redirection/l.php?'
      },
      {
         url: 'vozforums\.(com|net)',
         replace: '/redirect/index.php?link='
      }
    ];
    configs.forEach(function (config) {
      this.removeRedir(config);
    }.bind(this));
  },
  init: function () {
    this.url = location.href;
    this.removeRedirect();
    this.phim_media();
    this.linkneverdie_com();
    this.hdonline_vn();
    this.maclife_vn();
    this.aphim_co();
    this.fontdep_com();
    this.openload();
    this.xem7_com();
  }
};
//Main class
var ABPVN = {
  getCookie: function (cookie_name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + cookiename + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  },
  cTitle: function () {
    if (document.title.indexOf(' - Fixed by ABPVN.COM') == - 1) {
      document.title = document.title + ' - Fixed by ABPVN.COM';
    }
  },
  blockPopUp: function () {
    var listSite = [
      'http://blogtruyen.com',
      'http://www.khosachnoi.net',
      'http://hamtruyen.vn/',
      'http://phim14.net/',
      'http://phim7.com/',
      'http://www.diendan.trentroiduoidat.com/',
      'http://www.trentroiduoidat.com/',
      'http://chophanthiet.us',
      'http://anime47.com/',
      'http://animetvn.com',
      'http://font.vn',
      'https://vidoza.net/',
      'http://www.easysoft.xyz',
      'http://hdonline.vn',
      'http://anime47.com',
      'https://www.phim.media',
      'http://phimnhanh.com',
      'http://www.vietsubhd.com'
    ];
    for (var i = 0; i < listSite.length; i++) {
      if (this.url.startWith(listSite[i])) {
        this.cTitle();
        Logger.info('Đã chặn popup quảng cáo');
        document.body.onclick = null;
        document.onclick = null;
        document.ontouchstart=null;
        document.onmousedown=null;
        window.addEventListener('load', function () {
          setTimeout(function () {
            Logger.info('Đã chặn popup quảng cáo onload');
            document.ontouchstart=null;
            document.onclick = null;
            document.body.onclick = null;
            document.onmousedown=null;
          }, 300);
        });
        window.addEventListener('DOMContentLoaded', function () {
          setTimeout(function () {
            Logger.info('Đã chặn popup quảng cáo dom load');
            document.ontouchstart=null;
            document.onclick = null;
            document.body.onclick = null;
            document.onmousedown=null;
          }, 300);
        });
      }
    }
  },
  init: function () {
    this.url = location.href;
    this.blockPopUp();
    //Init class getLink
    getLink.init();
    //Init class Fixsite
    fixSite.init();
    //console.info('ABVPN init finish for: '+this.url);
    byPass.init();
  }
};
//RUN INNIT
ABPVN.init();
