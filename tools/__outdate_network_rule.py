from datetime import datetime
import os
from pprint import pprint
import threading
from domain_list import DomainList
from seleniumwire import webdriver, request
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import re
from const import Const
from util import box_print

class OutdateNetworkRuleCheck(threading.Thread):
    def set_data(self, domain, network_rule: dict, domain_with_outdate_network_rule: dict, error_domains: list):
        """
        Set process domain
        """
        self.__network_rule = network_rule
        self.__domain = domain
        self.domain_with_outdate_network_rule = domain_with_outdate_network_rule
        self.error_domains = error_domains

    def is_outdate_nr(self, network_rule: str, nr_regex:str, requests: list[request.Request]):
        """
        Check network rule is outdate
        """
        for request in requests:
            matches = re.findall(nr_regex, request.url)
            if Const.DEBUG:
                print(f"Checking rule {network_rule} with regex {nr_regex} on {self.__domain} with request url {request.url} and matches: {matches}")
            if len(matches) > 0:
                print(f"Network rule {network_rule} is up to date because of match url {request.url} with regex {nr_regex} in {self.__domain}")
                return False
        return True

    def check_network(self):
        """
        Check network rule is request in website
        """
        if self.__network_rule is None:
            return
        current_outdate_nr = self.domain_with_outdate_network_rule.get(self.__domain)
        box_print(f"Start visit {self.__domain} with Chrome")
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        options.add_argument("–disable-gpu")
        options.add_argument("--headless")
        options.add_argument("--log-level=3")
        with webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options) as browser:
            try:
                browser.set_page_load_timeout(120)
                browser.implicitly_wait(10)
                browser.get(f"http://{self.__domain}")
                for network_rule in self.__network_rule.keys():
                    nr_regex = self.__network_rule[network_rule]
                    if self.is_outdate_nr(network_rule, nr_regex, browser.requests):
                        current_outdate_nr = current_outdate_nr if current_outdate_nr is not None else []
                        current_outdate_nr.append(network_rule)
            except Exception as ex:
                box_print("{}: Got exception {} when check".format(self.__domain, ex))
                self.lock.acquire()
                self.error_domains.append(self.__domain)
                self.lock.release()
            finally:
                box_print(f"Finish visit {self.__domain} with Chrome")
                if current_outdate_nr is not None:
                    pprint(current_outdate_nr)
            browser.quit()
        if current_outdate_nr is not None:
            self.domain_with_outdate_network_rule.__setitem__(self.__domain, current_outdate_nr)

    def run(self):
        self.lock = threading.Lock()
        self.check_network()

class OutdateNetWorkRule():
    def __init__(self, filter_text, domains) -> None:
        self.filter_text = filter_text
        self.domains = domains
        self.__threads = []
        self.domains_with_outdate_network_rule = {}
        self.error_domains = []

    def to_regex(self, network_rule_str: str):
        """
        Convert network rule to regex
        """
        for replace_rule in Const.NETWORK_RULE_REPLACE:
            network_rule_str = network_rule_str.replace(replace_rule[0], replace_rule[1])
        return fr"{network_rule_str}"
    
    def must_be_skip(self, match: re.Match[str], skip_rules: list[str]):
        """
        Check is network rule must be skip
        """
        for skip_rule in skip_rules:
            if skip_rule == match.group(2):
                return True
            if match.group(4) is not None and skip_rule in match.group(4):
                return True
        return False

    def parse_rule(self, domain: str, type: str, regex_str: str, domain_network_rule: dict):
        """
        Parse rule to regex
        """
        regex = regex_str.format(domain=domain)
        skip_rules = list(
            map(lambda x: x.format(domain=domain), Const.NETWORK_RULE_SKIP[type])
            if type in Const.NETWORK_RULE_SKIP.keys() else []
        )
        matches = re.finditer(regex, self.filter_text, re.MULTILINE)
        for match in matches:
            if self.must_be_skip(match, skip_rules):
                continue
            domain_network_rule.__setitem__(match.group(), self.to_regex(match.group(2)))

    def parse_filter(self):
        """
        Parse filter to network rule regex list
        """
        network_rule = {}
        for domain in self.domains:
            domain_network_rule = {}
            for type, regex_str in Const.NETWORK_RULE_REGEX.items():
                self.parse_rule(domain, type, regex_str, domain_network_rule)
            if len(domain_network_rule) > 0:
                network_rule.__setitem__(domain, domain_network_rule)
        return network_rule

    def process_domain(self, domain, network_rule):
        domain_check = OutdateNetworkRuleCheck()
        domain_check.set_data(
            domain,
            network_rule,
            domain_with_outdate_network_rule=self.domains_with_outdate_network_rule,
            error_domains=self.error_domains
        )
        self.__threads.append(domain_check)
        domain_check.start()

    def check(self):
        """
        Check element outdate in domain
        """
        domains_with_network_rule = self.parse_filter()
        if Const.DEBUG:
            box_print("List domain with network rule")
            pprint(domains_with_network_rule)
        for domain in domains_with_network_rule.keys():
            self.process_domain(domain, domains_with_network_rule[domain])
        for t in self.__threads:
            t.join()
        return (self.domains_with_outdate_network_rule, self.error_domains)

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def main():
    start_time = datetime.now()
    print("Script start at: {0}\n".format(start_time))
    f = open(os.path.dirname(os.path.abspath(__file__)) + "/../filter/abpvn_ublock.txt", "r", encoding="utf8")
    filter_text = f.read()
    f.close()
    all_domain_with_outdate_network_rules = {}
    all_error_domains = []
    domains_chunk = list(chunks(DomainList.get_all_domain(filter_text, True), Const.MAX_CHROME_THREAD))
    total_chunk = len(domains_chunk)
    for i, domains in enumerate(domains_chunk):
        box_print(f"Start process chunk {i+1}/{total_chunk} with {len(domains)} domain")
        outdate_network_rule = OutdateNetWorkRule(filter_text, domains)
        domains_with_outdate_network_rule, error_domains = outdate_network_rule.check()
        all_domain_with_outdate_network_rules = all_domain_with_outdate_network_rules | domains_with_outdate_network_rule
        all_error_domains.extend(error_domains)
        box_print(f"Finish process chunk {i+1}/{total_chunk}")
    print("----Found {} domain with outdate network rule----".format(len(all_domain_with_outdate_network_rules)))
    pprint(all_domain_with_outdate_network_rules)
    print("----Found {} error domain----".format(len(all_error_domains)))
    pprint(all_error_domains)
    end_time = datetime.now()
    print("Script finish at: {0}\n".format(end_time))
    running_time = end_time - start_time
    print("Running in {0} seconds".format(running_time.total_seconds()))
    exit()

main()