from domain_list import DomainList
from domain_change import DomainChange
from pprint import pprint
from datetime import datetime


def main():
    start_time = datetime.now()
    print("Script start at: {0}\n".format(start_time))
    f = open("../filter/abpvn_ublock.txt", "r", encoding="utf8")
    filter_text = f.read()
    domains = DomainList.get_all_domain(filter_text)
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

if __name__ == '__main__':
    main()
