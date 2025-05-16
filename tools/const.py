class Const():
    DEBUG = False
    FILTER_DOMAIN_REGEX = r'([|\/=\.~]?)(([\w-]{3,255})(\.[a-z]{2,3})?(\.[a-z]{2,7}))([#\/|\n\^\$,])'
    FILTER_SUB_DOMAIN_REGEX = r'([|\/=\.~]?)(([\w-]+\.){1,3}(([\w-]{3,255})(\.[a-z]{2,3})?(\.[a-z]{2,7})))([#\/|\n\^\$,])'
    RESPONSE_DOMAIN_REGEX = r'(([\w-]+\.){0,3}(([\w-]{3,255})(\.[a-z]{2,3})?(\.[a-z]{2,7})))'
    DOMAIN_REJECT_ENDINGS = [
        '.js', '.png', '.jpg', '.gif', '.aspx', '.jpeg',
        '.widget', 'block.ad', '.mp4', '.mp3', '.m3u8',
        '.row', '.parse', '.round', 'abpvn.com',
        'abpvn.org', '.html', '.button',
        '.modal', '.ico', '.write', '.webp', '.btn', '.show', 'parent.special', '.patch', 'li.special.parent',
        '2Flh3.googleusercontent.com', 'div.ad',
        '2Fp21-ad-sg.ibyteimg.com'
    ]
    SKIP_CHECK_REDIRECT = [
        'blogspot.com', 'fptplay.net', 'doubleclick.net', 'com.vn',
        'net.vn', 'edu.vn', 'googlesyndication.com', 'gov.vn', 'nct.vn', 'org.vn',
        'phukienthoitranggiare.com', 'cloudfront.net',
        'web1s.asia', 'vinaurl.net', 'i.postimg.cc', 'mannhan97.xyz', 'api.anime3s.com',
        'iili.io', 'cdn.jsdelivr.net'
    ]
    REDIRECT_REJECT_TARGET_DOMAIN = [
        'www.google.com', 'www.facebook.com', 'www.advertising.yahooinc.com', 'marketingplatform.google.com',
        'imgbb.com', 'blueseeddigital.com', 'www.criteo.com', 'github.com', 'speedcdnjs.com', 'www.cloudflare-terms-of-service-abuse.com'
    ]
    REDIRECT_SKIP_SUB_TO_DOMAIN = True
    FILE_REGEX = r"\|\|([^*\n]+\.(js|png|webp|jpg|jpeg|mp4|gif))([\n\$])"
    ELEMENT_HIDE_REGEX = r"(^|,){domain}([,.\w]+)?#(@)?#([\.\w\-\=\"\'\>\ \+\+\#\[\]\:]+)$"
    MAX_CHROME_THREAD = 50
    NETWORK_RULE_REGEX = {
        "TYPE1": r"(@@)?\|\|({domain}([\w\*\^\.\/\^\-\?\=]+))(.+)?$",
        "TYPE2": r"(@@)?\|\|([\.\-\w\^\*\/]+)([,$])?(.+)?domain=([.|\w]+)?{domain}(.+)?$"
    }
    NETWORK_RULE_SKIP = {
        "TYPE1": [
            "{domain}^",
            "domain=",
            ",third-party",
            "$third-party"
        ],
    }
    NETWORK_RULE_REPLACE = [
        ["^", ""],
        ["*", ".*"]
    ]
