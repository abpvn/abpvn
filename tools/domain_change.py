import requests
import re


class DomainChange():
    @staticmethod
    def check_domain_change(domains):
        """
        Check domain change and return pair of change domain
        """
        redirect_pairs = []
        for domain in domains:
            redirect_pair, is_error = DomainChange.__get_redirect_domain(
                domain)
            if is_error:
                print(
                    "-----------------Check domain {} got error-----------".format(domain))
            if redirect_pair is not False and len(redirect_pair) == 2:
                redirect_pairs.append(redirect_pair)
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
            }, allow_redirects=True)
            if domain in res.url:
                return (False, False)
            final_redirect_domain = res.url.replace('https://', '').replace(
                'http://', '').replace('/', '').replace('www.', '').replace('www1.', '')
            print("----------Domain {} redirected to {}----------".format(domain,
                  final_redirect_domain))
            return ([domain, final_redirect_domain], False)
        except Exception as ex:
            print("Got exception {}".format(ex))
            return (False, True)
