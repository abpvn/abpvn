def box_print(message: str):
    """
    Print message in the box

    :param message: Message to print
    """
    line = "--------------------------------------------------------------------------------------------------------------"
    if len(message) > len(line):
        for _ in range(len(message) - len(line)):
            line = '-' + line
    print("|{}|".format(line))
    space_fill = (len(line) - len(message)) / 2
    for _ in range(int(space_fill)):
        message = " " + message + " "
    if (len(line) - len(message)) % 2 == 1:
        message = message + " "
    print("|{}|".format(message))
    print("|{}|".format(line))