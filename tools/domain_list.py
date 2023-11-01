import re
from const import Const


class DomainList():
    @staticmethod
    def get_all_domain(text, include_sub_domain=False):
        """
        Get domain from text with regex
        """
        matches = re.findall(Const.DOMAIN_REGEX, text)
        domains = []
        for match in matches:
            invalid_domain = False
            for reject_ending in Const.REJECT_ENDINGS:
                if str(match[1]).endswith(reject_ending) or len(re.findall(r"\.\d+$", match[1])) > 0:
                    invalid_domain = True
            # Skip if subdomain when in process bellow
            if (include_sub_domain and match[0] == ".") or invalid_domain:
                continue
            domains.append(match[1])
        domain_set = set(domains)
        domains = list(domain_set)
        print("Found total {count} domain".format(count=len(domains)))
        if include_sub_domain:
            sub_matches = re.findall(Const.SUB_DOMAIN_REGEX, text)
            sub_domains = []
            for match in sub_matches:
                invalid_domain = False
                for reject_ending in Const.REJECT_ENDINGS:
                    if str(match[1]).endswith(reject_ending) or len(re.findall(r"\.\d+$", match[1])) > 0:
                        invalid_domain = True
                if invalid_domain:
                    continue
                sub_domains.append(match[1])
            print(f"Found total {len(sub_domains)} sub domain")
            sub_domains_set = set(sub_domains)
            sub_domains = list(sub_domains_set)
            sub_domains.sort()
            domains.extend(sub_domains)
        domains.sort()
        print(f"Found total domain and subdomain {len(domains)}")
        return domains
