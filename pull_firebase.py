#!/usr/bin/env python3

import time
# import firebase
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate('keys.json')
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://crypto-celebrities.firebaseio.com'
})

from firebase_admin import db

root = db.reference()

result = root.child('users/').get()

USERS = []

print ('name  |  cur price above avg  |  cur price')
for user, userValue in result.items():
  prices = []
  for timestamp, timeValue in userValue.items():
    for price, priceValue in timeValue.items():
      if price == 'price':
        prices.append(float(priceValue))
  if (len(set(prices)) <= 1) == False:
    print (len(set(prices)),',', user, ',', round(prices[len(prices) - 1] - sum(prices) / (len(prices)), 2), ',', prices[len(prices) - 1])