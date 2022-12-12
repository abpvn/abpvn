class Const():
    DOMAIN_REGEX = '([|\/=\.~]?)(([\w-]{3,255})(\.\w{2,6}))([#\/|\n\^\$,])'
    REJECT_ENDINGS = [
        '.js', '.png', '.jpg', '.gif', '.aspx', '.widget', '.ad', '.mp4', '.mp3', '.m3u8', '.row', '.parse', '.round0', 'abpvn.com', 'abpvn.org', '.php', '.html', '.button'
    ]
    SKIP_CHECK_REDIRECT = [
        'amazonaws.com'
    ]
