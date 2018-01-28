#!/usr/bin/env python3
"""This script grabs all emails from the websites in local urls.txt document"""

# import firebase
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate('keys.json')
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://crypto-celebrities-charts.firebaseio.com'
})

from firebase_admin import db

#import other libraries
import sys
import time
sys.path.insert(0, 'lib/')
from urllib.parse import urlparse
from urllib.request import urlopen
from bs4 import BeautifulSoup


HDR = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
    'Accept-Encoding': 'none',
    'Accept-Language': 'en-US,en;q=0.8',
    'Connection': 'keep-alive'}


def find_data(request):
    """find emails and links from the requests HTML content"""
    NAMES = []
    PRICES = []
    # content = urllib2.urlopen(url).read()
    # html = request.content.decode('utf-8', 'ignore')
    soup = BeautifulSoup(request, 'html.parser')
    for name in soup.find_all('h1', {"class": "name"}):
        for href in name.find('a'):
            NAMES.append(href)
    for price_list in soup.find_all('ul', {"class": "celeb-meta"}):
        for span in price_list.find('span'):
            if "Price" not in str(span):
                PRICES.append(span)
    i = 0
    root = db.reference()
    timestamp = str(time.time()).split('.')[0]
    print ('there are ', len(NAMES), 'names.')
    while i < len(NAMES):
        name = NAMES[i]
        name = name.replace(" ", "")
        name = name.replace('$', 'S')
        name = name.replace('.', '_')
        price = PRICES[i]

        # store into firebase
        root.child('users/' + name + '/' + timestamp).set({"timestamp": timestamp, "price": price, "name": NAMES[i]})
        i += 1

def request_url(url):
    request = urlopen(url).read()
    find_data(request)

while 1 == 1:   
    page = 0
    print (str(time.time()).split('.')[0])
    while page < 23:
        main_url = 'https://cryptocelebrities.co/marketplace/page/' + str(page)
        request_url(main_url)
        print ('finished page # ', page)
        page += 1
    time.sleep(100)
