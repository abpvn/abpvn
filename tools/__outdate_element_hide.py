from datetime import datetime
import os
from pprint import pprint
import threading
from domain_list import DomainList
from selenium import webdriver 
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import re
from const import Const
from util import box_print

class OutdateElementHideCheck(threading.Thread):
    def set_data(self, domain, element_hide, domain_with_outdate_element_hide: dict, error_domains: list):
        """
        Set process domain
        """
        self.__element_hide = element_hide
        self.__domain = domain
        self.domain_with_outdate_element_hide = domain_with_outdate_element_hide
        self.error_domains = error_domains

    def check_element(self):
        """
        Check element present of website
        """
        if self.__element_hide is None:
            return
        current_out_date_el = self.domain_with_outdate_element_hide.get(self.__domain)
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
                for el_hide in self.__element_hide:
                    try:
                        el = browser.find_element(By.CSS_SELECTOR, el_hide)
                        if el is None:
                            current_out_date_el = current_out_date_el if current_out_date_el is not None else []
                            current_out_date_el.append(el_hide)
                    except Exception:
                        current_out_date_el = current_out_date_el if current_out_date_el is not None else []
                        current_out_date_el.append(el_hide)
            except Exception as ex:
                box_print("{}: Got exception {} when check".format(self.__domain, ex))
                self.lock.acquire()
                self.error_domains.append(self.__domain)
                self.lock.release()
            finally:
                box_print(f"Finish visit {self.__domain} with Chrome")
                if current_out_date_el is not None:
                    pprint(current_out_date_el)
            browser.quit()
        if current_out_date_el is not None:
            self.domain_with_outdate_element_hide.__setitem__(self.__domain, current_out_date_el)

    def run(self):
        self.lock = threading.Lock()
        self.check_element()

class OutdateElementHide():
    def __init__(self, filter_text, domains) -> None:
        self.filter_text = filter_text
        self.domains = domains
        self.__threads = []
        self.domains_with_outdate_element_hide = {}
        self.error_domains = []

    def parse_filter(self):
        domains_with_element_hide = {}
        for domain in self.domains:
            regex = Const.ELEMENT_HIDE_REGEX.format(domain=domain)
            matches = re.findall(regex, self.filter_text, re.MULTILINE)
            element_hides = []
            for match in matches:
                element_hides.append(match[3])
            if len(element_hides) > 0:
                domains_with_element_hide.__setitem__(domain, element_hides)
        return domains_with_element_hide

    def process_domain(self, domain, element_hide):
        domain_check = OutdateElementHideCheck()
        domain_check.set_data(
            domain,
            element_hide,
            domain_with_outdate_element_hide=self.domains_with_outdate_element_hide,
            error_domains=self.error_domains
        )
        self.__threads.append(domain_check)
        domain_check.start()

    def check(self):
        """
        Check element outdate in domain
        """
        domains_with_element_hide = self.parse_filter()
        for domain in domains_with_element_hide.keys():
            self.process_domain(domain, domains_with_element_hide[domain])
        for t in self.__threads:
            t.join()
        return (self.domains_with_outdate_element_hide, self.error_domains)

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
    all_domain_with_outdate_element_hides = {}
    all_error_domains = []
    domains_chunk = list(chunks(DomainList.get_all_domain(filter_text, True), Const.MAX_CHROME_THREAD))
    total_chunk = len(domains_chunk)
    for i, domains in enumerate(domains_chunk):
        box_print(f"Start process chunk {i+1}/{total_chunk} with {len(domains)} domain")
        outdate_elment_hide = OutdateElementHide(filter_text, domains)
        domains_with_outdate_element_hide, error_domains = outdate_elment_hide.check()
        all_domain_with_outdate_element_hides = all_domain_with_outdate_element_hides | domains_with_outdate_element_hide
        all_error_domains.extend(error_domains)
        box_print(f"Finish process chunk {i+1}/{total_chunk}")
    print("----Found {} domain with outdate element hide----".format(len(all_domain_with_outdate_element_hides)))
    pprint(all_domain_with_outdate_element_hides)
    print("----Found {} error domain----".format(len(all_error_domains)))
    pprint(all_error_domains)
    end_time = datetime.now()
    print("Script finish at: {0}\n".format(end_time))
    running_time = end_time - start_time
    print("Running in {0} seconds".format(running_time.total_seconds()))
    exit()

main()