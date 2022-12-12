import requests
from const import Const
import re

class DomainChange():
    @staticmethod
    def pretty(d, indent=0):
        """
        Pretty print dict
        """
        for key, value in d.items():
            print('\t' * indent + str(key))
            if isinstance(value, dict):
                DomainChange.pretty(value, indent+1)
            else:
                print('\t' * (indent+1) + str(value))

    @staticmethod
    def check_domain_change(domains):
        """
        Check domain change and return pair of change domain
        """
        redirect_pairs = []
        total_domain = len(domains)
        for index, domain in enumerate(domains):
            if domain in Const.SKIP_CHECK_REDIRECT:
                # Skip if domain in SKIP_CHECK_REDIRECT list
                print("Skiped domain {}".format(domain))
                continue
            redirect_pair, is_error = DomainChange.__get_redirect_domain(
                domain)
            if is_error:
                print(
                    "-----------------Check domain {} got error-----------".format(domain))
            if redirect_pair is not False and len(redirect_pair) == 2:
                redirect_pairs.append(redirect_pair)
            print("Processed {}/{} domain".format(index + 1, total_domain))
        print("Found {} domain changed with redirect".format(len(redirect_pairs)))
        return redirect_pairs

    @staticmethod
    def __get_redirect_domain(domain):
        """
        Request and get final redirect url. If same as input return False else return pair [source, redirection]
        """
        print("Start check redirect of domain {}".format(domain))
        try:
            request_url = "http://" + domain
            res = requests.head(url=request_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0'
            }, allow_redirects=True, timeout=5)
            if domain not in res.url:
                matches = re.findall(Const.TLD_DOMAIN_REGEX, res.url)
                if matches is not None:
                    final_redirect_domain = matches[0]
                    print(
                        "|-----------------------------------------------------------------------------|")
                    print("|----------Domain {} redirected to {}---------|".format(domain,
                        final_redirect_domain))
                    print(
                        "|-----------------------------------------------------------------------------|")
                    return ([domain, final_redirect_domain], False)
            return (False, False)
        except Exception as ex:
            print("Got exception {}".format(ex))
            return (False, True)
