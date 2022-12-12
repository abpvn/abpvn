from domain_list import DomainList
from domain_change import DomainChange
from pprint import pprint


def main():
    f = open("../filter/abpvn_ublock.txt", "r", encoding="utf8")
    filter_text = f.read()
    domains = DomainList.get_all_domain(filter_text)
    result = DomainChange.check_domain_change(domains)
    pprint(result)


main()
