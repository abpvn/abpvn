from datetime import datetime
import os
from pprint import pprint
from file_list import FileList
import requests
import threading

from tools.util import box_print


class FileCheck(threading.Thread):
    def set_data(self, file, not_found_pairs: list, error_files: list):
        """
        Set process file
        """
        self.__file = file
        self.not_found_pairs = not_found_pairs
        self.error_files = error_files

    def get_not_found_file(self):
        """
        Request and get final not_found url. If same as input return False else return pair [source, not_foundion]
        """
        if self.__file is None:
            return
        file = self.__file
        try:
            request_url = "http://" + file
            res = requests.head(url=request_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0'
            }, allow_redirects=True, timeout=5)
            if res.status_code != 200:
                print("{}: is deleted or moved".format(file))
                self.lock.acquire()
                self.not_found_pairs.append([file, res.status_code])
                self.lock.release()
            else:
                print("{}: is still exist".format(file))
        except Exception as ex:
            box_print("{}: Got exception {} when check".format(file, ex))
            self.lock.acquire()
            self.error_files.append(file)
            self.lock.release()

    def run(self):
        self.lock = threading.Lock()
        self.get_not_found_file()

class FileNotFound():
    def __init__(self, files) -> None:
        self.files = files
        self.__threads = []
        self.not_found_pairs = []
        self.error_files = []

    def process_file(self, file):
        file_check = FileCheck()
        file_check.set_data(file, not_found_pairs=self.not_found_pairs, error_files=self.error_files)
        self.__threads.append(file_check)
        file_check.start()

    def check_file_not_found(self):
        """
        Check file change and return pair of change file
        """
        for  file in self.files:
            self.process_file(file)
        for t in self.__threads:
            t.join()
        return (self.not_found_pairs, self.error_files)

def main():
    start_time = datetime.now()
    print("Script start at: {0}\n".format(start_time))
    f = open(os.path.dirname(os.path.abspath(__file__)) + "/../filter/abpvn_noelemhide.txt", "r", encoding="utf8")
    filter_text = f.read()
    f.close()
    domains = FileList.get_all_file(filter_text)
    domain_change = FileNotFound(domains)
    not_found_pairs, error_domains = domain_change.check_file_not_found()
    print("----Found {} file deleted or moved with file_not_found----".format(len(not_found_pairs)))
    pprint(not_found_pairs)
    print("----Found {} error file----".format(len(error_domains)))
    pprint(error_domains)
    end_time = datetime.now()
    print("Script finish at: {0}\n".format(end_time))
    running_time = end_time - start_time
    print("Running in {0} seconds".format(running_time.total_seconds()))

main()