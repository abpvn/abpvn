import requests
from const import Const
import re
import threading
from datetime import datetime
from domain_list import DomainList
from pprint import pprint
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

from util import box_print

class DomainChecker:
    def __init__(self, redirect_pairs, error_domains, lock):
        """
        Initialize domain checker with shared resources
        """
        self.redirect_pairs = redirect_pairs
        self.error_domains = error_domains
        self.lock = lock
    
    def is_redirect_sub_to_domain(self, domain: str, redirected_domain: str):
        """
        Check is redirect from sub domain to domain when REDIRECT_SKIP_SUB_TO_DOMAIN = True
        Example: Return True when redirected_domain=afamily.vn and domain=m.afamily.vn
        """
        if not Const.REDIRECT_SKIP_SUB_TO_DOMAIN:
            return False
        return "www." not in domain and redirected_domain in domain

    def check_domain_redirect(self, domain, index, total_domain):
        """
        Check domain redirect and return result
        """
        if domain is None:
            return None
            
        try:
            request_url = "http://" + domain
            res = requests.head(
                url=request_url, 
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
                }, 
                timeout=(10, 30),  # (connect_timeout, read_timeout) to prevent hanging
                allow_redirects=True
            )
            
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
                        with self.lock:
                            self.redirect_pairs.append([domain, final_redirect_domain])
                        print("{}: Processed domain in index {}/{}".format(domain, index, total_domain))
                        return True
                    elif self.is_redirect_sub_to_domain(domain, final_redirect_domain):
                        print("{}: Redirect but skipped because redirected from subdomain {} to domain {}".format(domain, domain, final_redirect_domain))
                        return False
                    else:
                        print("{}: Redirect but skipped because redirected to reject target domain".format(domain))
                        return False
            else:
                print("{}: is not redirect".format(domain))
                return False
                
        except Exception as ex:
            box_print("{}: Got exception {} when check".format(domain, ex))
            with self.lock:
                self.error_domains.append(domain)
            return False

class DomainChange:
    def __init__(self, domains):
        self.domains = domains
        self.redirect_pairs = []
        self.error_domains = []
        self.lock = threading.Lock()
        self.checker = DomainChecker(self.redirect_pairs, self.error_domains, self.lock)

    def check_domain_change(self):
        """
        Check domain change using ThreadPoolExecutor for better thread management
        """
        total_domain = len(self.domains)
        processed_count = 0
        
        # Filter out domains to skip
        domains_to_check = []
        for index, domain in enumerate(self.domains):
            if domain in Const.SKIP_CHECK_REDIRECT:
                print("{}: Skipped domain".format(domain))
                continue
            domains_to_check.append((domain, index, total_domain))
        
        print(f"Starting to check {len(domains_to_check)} domains with thread pool...")
        
        # Use ThreadPoolExecutor with a reasonable number of workers
        max_workers = min(Const.MAX_CHROME_THREAD, len(domains_to_check))
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_domain = {
                executor.submit(self.checker.check_domain_redirect, domain, index, total_domain): (domain, index)
                for domain, index, total_domain in domains_to_check
            }
            
            # Process completed tasks as they finish
            for future in as_completed(future_to_domain, timeout=300):  # 5 minute overall timeout
                domain, index = future_to_domain[future]
                try:
                    result = future.result()
                    processed_count += 1
                    if processed_count % 10 == 0:  # Progress update every 10 domains
                        print(f"Progress: {processed_count}/{len(domains_to_check)} domains processed")
                except Exception as exc:
                    print(f'Domain {domain} generated an exception: {exc}')
                    with self.lock:
                        self.error_domains.append(domain)
        
        return (self.redirect_pairs, self.error_domains)

def main():
    start_time = datetime.now()
    print("Script start at: {0}\n".format(start_time))
    
    try:
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
        
    except Exception as e:
        print(f"Script failed with error: {e}")
        end_time = datetime.now()
        running_time = end_time - start_time
        print("Script failed after {0} seconds".format(running_time.total_seconds()))

if __name__ == "__main__":
    main()
