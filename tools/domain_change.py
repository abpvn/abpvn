import requests
from const import Const
import re
import threading


class DomainCheck(threading.Thread):
    def set_data(self, domain, redirect_pairs, index, total_domain):
        """
        Set process domain
        """
        self.__domain = domain
        self.redirect_pairs = redirect_pairs
        self.__domain_index = index
        self.__total_domain = total_domain

    def get_redirect_domain(self):
        """
        Request and get final redirect url. If same as input return False else return pair [source, redirection]
        """
        if self.__domain is None:
            return
        domain = self.__domain
        try:
            request_url = "http://" + domain
            res = requests.head(url=request_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0'
            }, allow_redirects=True, timeout=5)
            if domain not in res.url:
                matches = re.findall(Const.TLD_DOMAIN_REGEX, res.url)
                if matches is not None:
                    final_redirect_domain = matches[0]
                    line = "|------------------------------------------------------------------------------|"
                    print(line)
                    message = "Domain {} redirected to {}".format(domain,
                        final_redirect_domain)
                    space_fill = (len(line) - 2 - len(message)) / 2
                    for i in range(int(space_fill)):
                        message = " " + message + " "
                    print("|{}|".format(message))
                    print(line)
                    self.lock.acquire()
                    self.redirect_pairs.append([domain, final_redirect_domain])
                    self.lock.release()
                    print("{}: Processed domain in index {}/{}".format(domain, self.__domain_index, self.__total_domain))
            else:
                print("{}: is not redirect".format(domain))
        except Exception as ex:
            print("{}: Got exception {} when check".format(domain, ex))

    def run(self):
        self.lock = threading.Lock()
        self.get_redirect_domain()
class DomainChange():
    def __init__(self, domains) -> None:
        self.domains = domains
        self.__threads = []
        self.redirect_pairs = []

    def process_domain(self, domain, index, total_domain):
        domain_check = DomainCheck()
        domain_check.set_data(domain, self.redirect_pairs, index, total_domain)
        self.__threads.append(domain_check)
        domain_check.start()

    def check_domain_change(self):
        """
        Check domain change and return pair of change domain
        """
        total_domain = len(self.domains)
        for index, domain in enumerate(self.domains):
            if domain in Const.SKIP_CHECK_REDIRECT:
                # Skip if domain in SKIP_CHECK_REDIRECT list
                print("{}: Skiped domain".format(domain))
                continue
            self.process_domain(domain, index, total_domain)
        for t in self.__threads:
            t.join()
        print("----Found {} domain changed with redirect----".format(len(self.redirect_pairs)))
        return self.redirect_pairs
