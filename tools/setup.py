from setuptools import setup

setup(
    name='abpvn_tools',
    version='0.0.1',
    install_requires=[
        'requests',
        'dnspython',
        'selenium',
        'webdriver_manager',
        'selenium-wire',
        'importlib-metadata; python_version == "3.8"',
    ],
)