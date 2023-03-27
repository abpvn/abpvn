class Const():
    DOMAIN_REGEX = '([|\/=\.~]?)(([\w-]{3,255})(\.[a-z]{2,3})?(\.[a-z]{2,7}))([#\/|\n\^\$,])'
    TLD_DOMAIN_REGEX = '([\w-]+\.\w+)\/'
    REJECT_ENDINGS = [
        '.js', '.png', '.jpg', '.gif', '.aspx',
        '.widget', 'block.ad', '.mp4', '.mp3', '.m3u8',
        '.row', '.parse', '.round', 'abpvn.com',
        'abpvn.org', '.php', '.html', '.button', '.mrb10',
        '.modal', '.ico', '.error', '.write', '.webp', 'PanelScroller.Notices',
        'preload-b91.preload', 'firstmessfloadright.samItem', 'banner-top-box.click',
        'notMsg.Sticky', 'clear.hd', 'info.card', 'left.box', 'btn-sm.btn', 'right.box',
        'uts.jsr', 'blqPr.nwsItHm', 'text-center.adsense'
    ]
    SKIP_CHECK_REDIRECT = [
        'amazonaws.com', 'blogspot.com', 'blogtruyen.com', 'fptplay.net',
        'doubleclick.net', 'github.io', 'herokuapp.com', 'zing.vn', 'com.vn',
        'net.vn', 'edu.vn', 'googlesyndication.com', 'gov.vn', 'nct.vn', 'org.vn',
        'phukienthoitranggiare.com', 'cloudfront.net', 'admarketplace.net'
    ]
    REJECT_TARGET_DOMAIN = [
        'google.com', 'facebook.com', 'yahooinc.com'
    ]
    FILE_REGEX = r"\|\|([^*\n]+\.(js|png|webp|jpg|jpeg|mp4|gif))([\n\$])"
