import re
from const import Const


class FileList():
    @staticmethod
    def get_all_file(text):
        """
        Get file from text with regex
        """
        matches = re.findall(Const.FILE_REGEX, text)
        files = []
        for match in matches:
            files.append(match[0])
        file_set = set(files)
        files = list(file_set)
        files.sort()
        print("Found total {count} file".format(count=len(files)))
        return files
