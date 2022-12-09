import re
from const import Const
class DomainList():
    @staticmethod
    def get_all_domain(text):
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
            if invalid_domain:
                continue
            domains.append(match[1])
        domain_set = set(domains)
        domains = list(domain_set)
        print("Found total {count} domain".format(count=len(domains)))
        return domains
