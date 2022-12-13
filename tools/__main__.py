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
    result = domain_change.check_domain_change()
    pprint(result)
    end_time = datetime.now()
    print("Script finish at: {0}\n".format(end_time))
    running_time = end_time - start_time
    print("Running in {0} seconds".format(running_time.total_seconds()))


main()
