from xml import dom
import requests
from const import Const
import re
import threading
from datetime import datetime
from domain_list import DomainList
from pprint import pprint
import os

from util import box_print, is_sub_domain

class DomainCheck(threading.Thread):
    def set_data(self, domain, index, total_domain,redirect_pairs: list, error_domains: list):
        """
        Set process domain
        """
        self.__domain = domain
        self.__domain_index = index
        self.__total_domain = total_domain
        self.redirect_pairs = redirect_pairs
        self.error_domains = error_domains
    
    def is_redirect_sub_to_domain(self, domain: str, redirected_domain: str):
        """
        Check is redirect from sub domain to domain when REDIRECT_SKIP_SUB_TO_DOMAIN = True
        Example: Return True when redirected_domain=afamily.vn and domain=m.afamily.vn
        """
        if not Const.REDIRECT_SKIP_SUB_TO_DOMAIN:
            return False
        return redirected_domain in domain

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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
            }, allow_redirects=True, timeout=5)
            if Const.DEBUG:
                print(f"[DEBUG]: Requested to domain {domain} with response url {res.url}")
            if domain not in res.url:
                domain_regex = Const.RESPONSE_DOMAIN_REGEX
                matches = re.search(domain_regex, res.url)
                if Const.DEBUG:
                    print(f"[DEBUG]: Find matches for domain:res url {domain}:{res.url} with regex {domain_regex}")
                    pprint(matches)
                if matches:
                    final_redirect_domain = matches.group()
                    message = "Domain {} redirected to {} ({})".format(domain,
                        final_redirect_domain, res.url)
                    box_print(message)
                    if final_redirect_domain not in Const.REDIRECT_REJECT_TARGET_DOMAIN and not self.is_redirect_sub_to_domain(domain, final_redirect_domain):
                        self.lock.acquire()
                        self.redirect_pairs.append([domain, final_redirect_domain])
                        self.lock.release()
                        print("{}: Processed domain in index {}/{}".format(domain, self.__domain_index, self.__total_domain))
                    else:
                        print("{}: Redirect but skiped because redirected to reject target domain".format(domain))
            else:
                print("{}: is not redirect".format(domain))
        except Exception as ex:
            box_print("{}: Got exception {} when check".format(domain, ex))
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

def main():
    start_time = datetime.now()
    print("Script start at: {0}\n".format(start_time))
    f = open(os.path.dirname(os.path.abspath(__file__)) + "/../filter/abpvn_ublock.txt", "r", encoding="utf8")
    filter_text = f.read()
    f.close()
    domains = DomainList.get_all_domain(filter_text, True)
    domain_change = DomainChange(domains)
    redirect_pairs, error_domains = domain_change.check_domain_change()
    print("----Found {} domain changed with redirect----".format(len(redirect_pairs)))
    pprint(redirect_pairs)
    print("----Found {} error domain----".format(len(error_domains)))
    pprint(error_domains)
    end_time = datetime.now()
    print("Script finish at: {0}\n".format(end_time))
    running_time = end_time - start_time
    print("Running in {0} seconds".format(running_time.total_seconds()))

main()