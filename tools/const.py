class Const():
    DOMAIN_REGEX = '([|\/=\.~]?)(([\w-]{3,255})(\.\w{2,6}))([#\/|\n\^\$,])'
    TLD_DOMAIN_REGEX = '([\w-]+\.\w+)\/'
    REJECT_ENDINGS = [
        '.js', '.png', '.jpg', '.gif', '.aspx',
        '.widget', '.ad', '.mp4', '.mp3', '.m3u8',
        '.row', '.parse', '.round0', 'abpvn.com',
        'abpvn.org', '.php', '.html', '.button', '.mrb10',
        '.modal', '.ico', '.error'
    ]
    SKIP_CHECK_REDIRECT = [
        'amazonaws.com', 'blogspot.com', 'blogtruyen.com', 'fptplay.net',
        'doubleclick.net', 'github.io', 'herokuapp.com', 'zing.vn', 'com.vn',
        'net.vn', 'edu.vn', 'googlesyndication.com', 'gov.vn', 'nct.vn', 'org.vn'
    ]
