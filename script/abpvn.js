// ==UserScript==
// @name        ABPVN AdsBlock
// @namespace   ABPVN
// @author      Hoàng Rio
// @copyright   ABPVN
// @homepage    http://abpvn.com
// @icon        http://abpvn.com/icon.png
// @description Script chặn quảng cáo,loại bỏ chờ đợi của ABPVN
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donghoang.nguyen@gmail.com&item_name=ABPVN Donation
// @run-at      document-end
// @include     http://*
// @include     https://*
// @version     2.1.3.2
// @grant       none
// ==/UserScript==
/* String Prototype */
var url=location.href;
String.prototype.startWith = function strxStart(str){
    return this.indexOf(str)===0;
};
String.prototype.ismatch = function (regex){
    return this.match(regex)!==null;
};
//Bypass Class
var byPass={

};
//get Link class
var getLink= {
    FShareConfig: function (){
        if(this.url.startWith('https://www.fshare.vn')){
            var background_image=localStorage.off=='true'?'url("http://i.imgur.com/kJnOMOB.png")':'url("http://i.imgur.com/2b7fN6a.png")';
            var title=localStorage.off=='true'?'Bật get link fshare':'Tắt get link fshare';
            var html="<div id='fs_click' title='"+title+"' style='position: fixed; right: 0; bottom: 0; width: 30px; height: 30px; border-radius: 50%; background-image: "+background_image+"; background-size: cover; cursor: pointer; z-index: 9999;'></div>";
            $(document).ready(function(){
                $(document.body).append(html);
                $(document).on('click','#fs_click',function FS_on_off(){
                    if(localStorage.off!='true'){
                        localStorage.off=true;
                        this.style.backgroundImage='url("http://i.imgur.com/kJnOMOB.png")';
                        this.setAttribute('title','Bật get link fshare');
                        alert('Đã tắt get link fshare');
                    }
                    else {
                        localStorage.off=false;
                        this.setAttribute('title','Tắt get link fshare');
                        this.style.backgroundImage='url("http://i.imgur.com/2b7fN6a.png")';
                        alert('Đã bật get link fshare');
                    }
                });
            });
        }
    },
    FShareGetLink: function(){
        if(this.url.startWith('https://www.fshare.vn/file/')&&localStorage.off!='true'){
            console.info('Start get link Fshare.vn');
            $(document).ready(function(){
                var checkpassword=document.querySelector('.fa-lock');
                var linkcode=$('[data-linkcode]').attr('data-linkcode');
                if(checkpassword===null){
                    var code=$('input[name=fs_csrf]').val();
                    var speed = $(this).data('speed');
                    var data ={
                        'fs_csrf':code,
                        'DownloadForm[pwd]':'',
                        'DownloadForm[linkcode]':linkcode,
                        'ajax': 'download-form',
                        'undefined':'undefined'
                    };
                    $.post('/download/get', data).done(function (data, statusText, xhr) {
                        if(data.url===undefined) location.reload();
                        else {
                            window.location = data.url;
                            console.log("ABPVN: "+location.href+" -> "+data.url);
                        }
                    }).fail(function(xhr, statusText, error){
                        $.alert({success: false, message: "ABPVN: Đã có lỗi fshare hoặc file có password"});
                    });
                }
                else{
                    $.alert({success: false, message: "ABPVN: Hãy nhập mật khẩu cho file trước"});
                    $('#download-form').unbind('submit');
                    $('#download-form').submit(function(event){
                        var pwd=$('#DownloadForm_pwd').val();
                        var code=$('input[name=fs_csrf]').val();
                        var speed = $(this).data('speed');
                        var data ={
                            'fs_csrf':code,
                            'DownloadForm[pwd]':pwd,
                            'DownloadForm[linkcode]':linkcode,
                            'ajax': 'download-form',
                            'undefined':'undefined'
                        };
                        $.post('/download/get', data).done(function (data, statusText, xhr) {
                            if(data.url===undefined) location.reload();
                            else {
                                window.location = data.url;
                                console.log("ABPVN: "+location.href+" -> "+data.url);
                            }
                        }).fail(function(xhr, statusText, error){
                            $.alert({success: false, message: "ABPVN: Đã có lỗi fshare hoặc file có password"});
                        });
                        event.preventDefault();
                    });
                }
            });
        }
    },
    init: function(){
        this.url=location.href;
        this.FShareConfig();
        this.FShareGetLink();
    }
};
//Fix site class
var fixSite={
    getScript: function(url){
        var xhr=new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.addEventListener("load", function(data){
            var blob=new Blob([xhr.responseText],{type: "text/javascript"});
            var url=URL.createObjectURL(blob);
            var script=document.createElement('script');
            script.src=url;
            script.type="text/javascript";
            document.getElementsByTagName('head')[0].appendChild(script);
        });
        xhr.send();
    },
    talktv_vn: function() {
        if(this.url.startWith('http://talktv.vn/')){
            //disabled jwplayer
            jwplayer={};
            //Ininit Libs Tag
            var css_tag=document.createElement('link');
            css_tag.rel="stylesheet";
            //this.getScript("//vjs.zencdn.net/5.10/video.js");
            css_tag.href="//vjs.zencdn.net/5.10/video-js.css";
            var script_vjs_tag=document.createElement('script');
            script_vjs_tag.src="//vjs.zencdn.net/5.10/video.js";
            var script_js_hls=document.createElement('script');
            script_js_hls.src="https://npmcdn.com/videojs-contrib-hls@%5E3.0.0/dist/videojs-contrib-hls.js";
            var head=document.getElementsByTagName('head')[0];
            head.appendChild(css_tag);
            head.appendChild(script_vjs_tag);
            head.appendChild(script_js_hls);
            //Innit video Tag to play
            document.querySelector('.channel-play').innerHTML='<video controls id="abpvn_talktv_vjs" style="width: 100%; height: 100%" class="video-js vjs-default-skin" poster="'+loadPlayer.backgroundImage+'"><source src="https://crossorigin.me/'+loadPlayer.manifestUrl+'" type="application/x-mpegURL"></video>';
            window.addEventListener('load',function(){
                var timer;
                timer=setInterval(function(){
                    if(typeof videojs!='undefined'){
                        var tmp_video=videojs("abpvn_talktv_vjs");
                        tmp_video.play();
                        clearInterval(timer);
                    }

                },300);
            });


        }
    },
  	usercloud_com: function(){
      if(this.url.startWith('https://userscloud.com/')){
        var form=document.querySelector('form[name="F1"]');
        if(form){
          form.submit();
          var div = document.createElement('div');
          div.style="position: fixed; width: 100%; height: 100%; background: rgba(0,0,0,0.80); z-index: 999999999; text-align: center; color: white; top: 0; left: 0;";
          div.innerHTML="<h1>ABPVN Auto download is worked..</h1>";
          document.body.insertBefore(div,document.body.firstChild);
        }
      }
    },
    init: function(){
        this.url=location.href;
        //this.talktv_vn();
       	this.usercloud_com();
    }
};
//Main class
var ABPVN={
    getCookie: function(cookie_name){
        var value = "; " + document.cookie;
        var parts = value.split("; " + cookiename + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    cTitle: function(){
        document.title =document.title+" - ABPVN.COM";
    },
    blockPopUp: function(){
        var listSite=[
            'http://blogtruyen.com',
            'http://www.khosachnoi.net',
            'http://hamtruyen.vn/',
            'http://phim14.net/',
            'http://phim7.com/'
        ];
        for (var i = 0; i < listSite.length; i++) {
            if (this.url.startWith(listSite[i])) {
                this.cTitle();
                console.info("ABPVN: Đã chặn popup quảng cáo");
                document.body.onclick = null;
                window.addEventListener('load',function(){
                    document.body.onclick = null;
                });
            }
        }
    },
    init: function(){
        this.url=location.href;
        this.blockPopUp();
        //Init class getLink
        getLink.init();
        fixSite.init();
        //console.info('ABVPN init finish for: '+this.url);
    }
};
//RUN INNIT
ABPVN.init();