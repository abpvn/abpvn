import threading
from datetime import datetime
from const import Const
from domain_list import DomainList
from pprint import pprint
import os
import dns.resolver
import dns.rdatatype


class NoIpCheck(threading.Thread):
    def set_data(self, domain, index, total_domain, no_ip_domains: list = [], error_domains: list = []):
        """
        Set process domain
        """
        self.__domain = domain
        self.__domain_index = index
        self.__total_domain = total_domain
        self.no_ip_domains = no_ip_domains
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

    def nslookup(self, domain):
        ip_address = []
        ips = dns.resolver.resolve(domain, raise_on_no_answer=False)
        for ip in ips:
            ip_address.append(str(ip))
        return ip_address

    def check_domain_ip(self):
        """
        Check domain ip. If no ip return exception
        """
        if self.__domain is None:
            return
        domain = self.__domain
        try:
            ip_arr = self.nslookup(domain)
            if len(ip_arr) == 0:
                self.lock.acquire()
                self.no_ip_domains.append(domain)
                self.lock.release()
                print("{}: Processed domain in index {}/{}".format(domain, self.__domain_index, self.__total_domain))
            else:
                print("{}: has valid IP address".format(domain))
        except Exception as ex:
            self.box_print("{}: Got exception {} when check".format(domain, ex))
            self.lock.acquire()
            self.error_domains.append(domain)
            self.lock.release()

    def run(self):
        self.lock = threading.Lock()
        self.check_domain_ip()

class NoIpDomain():
    def __init__(self, domains) -> None:
        self.domains = domains
        self.__threads = []
        self.no_ip_domains = []
        self.error_domains = []

    def process_domain(self, domain, index, total_domain):
        domain_check = NoIpCheck()
        domain_check.set_data(domain, index, total_domain, no_ip_domains=self.no_ip_domains, error_domains=self.error_domains)
        self.__threads.append(domain_check)
        domain_check.start()

    def check(self):
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
        return (self.no_ip_domains, self.error_domains)

def main():
    start_time = datetime.now()
    print("Script start at: {0}\n".format(start_time))
    f = open(os.path.dirname(os.path.abspath(__file__)) + "/../filter/abpvn_ublock.txt", "r", encoding="utf8")
    filter_text = f.read()
    f.close()
    domains = DomainList.get_all_domain(filter_text, True)
    no_ip_domain = NoIpDomain(domains)
    no_ip_domains, error_domains = no_ip_domain.check()
    print("----Found {} domain with no ip address----".format(len(no_ip_domains)))
    pprint(no_ip_domains)
    print("----Found {} error domain----".format(len(error_domains)))
    pprint(error_domains)
    end_time = datetime.now()
    print("Script finish at: {0}\n".format(end_time))
    running_time = end_time - start_time
    print("Running in {0} seconds".format(running_time.total_seconds()))

main()