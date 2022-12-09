class Const():
    DOMAIN_REGEX = '([|\/=\.~]?)(([\w-]{3,255})(\.\w{2,6}))([#\/|\n\^\$,])'
    REJECT_ENDINGS = [
        '.js', '.png', '.jpg', '.gif', '.aspx', '.widget'
    ]