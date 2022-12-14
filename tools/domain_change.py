import requests
from const import Const
import re
import threading


class DomainCheck(threading.Thread):
    def set_data(self, domain, index, total_domain,redirect_pairs: list = [], error_domains: list = []):
        """
        Set process domain
        """
        self.__domain = domain
        self.__domain_index = index
        self.__total_domain = total_domain
        self.redirect_pairs = redirect_pairs
        self.error_domains = error_domains

    def box_print(self, message: str):
        """
        Print message in the box

        :param message: Message to print
        """
        line = "--------------------------------------------------------------------------------------------------------------"
        if len(message) > len(line):
            for i in range(len(message) - len(line)):
                line = '-' + line
        print("|{}|".format(line))
        space_fill = (len(line) - len(message)) / 2
        for i in range(int(space_fill)):
            message = " " + message + " "
        if (len(line) - len(message)) % 2 == 1:
            message = message + " "
        print("|{}|".format(message))
        print("|{}|".format(line))

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
                if matches:
                    final_redirect_domain = matches[0]
                    message = "Domain {} redirected to {} ({})".format(domain,
                        final_redirect_domain, res.url)
                    self.box_print(message)
                    self.lock.acquire()
                    self.redirect_pairs.append([domain, final_redirect_domain])
                    self.lock.release()
                    print("{}: Processed domain in index {}/{}".format(domain, self.__domain_index, self.__total_domain))
            else:
                print("{}: is not redirect".format(domain))
        except Exception as ex:
            self.box_print("{}: Got exception {} when check".format(domain, ex))
            self.lock.acquire()
            self.error_domains.append(domain)
            self.lock.release()

    def run(self):
        self.lock = threading.Lock()
        self.get_redirect_domain()
class DomainChange():
    def __init__(self, domains) -> None:
        self.domains = domains
        self.__threads = []
        self.redirect_pairs = []
        self.error_domains = []

    def process_domain(self, domain, index, total_domain):
        domain_check = DomainCheck()
        domain_check.set_data(domain, index, total_domain, redirect_pairs=self.redirect_pairs, error_domains=self.error_domains)
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
        return (self.redirect_pairs, self.error_domains)
