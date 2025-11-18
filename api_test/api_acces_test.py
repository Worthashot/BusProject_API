# -*- coding: utf-8 -*-
"""
Created on Sun Nov  9 19:59:07 2025

@author: Cameron
"""

import requests
import bson


with open('C:\\Users\\Cameron\\Desktop\\BusProject_API\\api_test\\wimm-apis\\.resources\\wimm-db-dump\\api_keys.bson','rb') as f:
    data = bson.decode_all(f.read())
    
api_key = data[0]['key']
name = "Mr Test2"
email = "test2@test.com"
password = "abcdefg"
# %%

#Create an account
url = "http://localhost:3000/auth/signup/basic"
headers = {'x-api-key' : api_key}
data = {"email" : email, "password" : password, "name" : name}

r = requests.post(url, headers = headers, data = data)
data = r.json()

accesstoken = data["data"]["tokens"]["accessToken"]
refreshtoken = data["data"]["tokens"]["refreshToken"]
# %%
#loggin to an account

url = "http://localhost:3000/auth/login/basic"
headers = {'x-api-key' : api_key}
data = {"email" : email, "password" : password}
r = requests.post(url, headers = headers, data = data)

data = r.json()

accesstoken = data["data"]["tokens"]["accessToken"]
refreshtoken = data["data"]["tokens"]["refreshToken"]
# %%

#logout of an account
url = "http://localhost:3000/auth/logout"
headers = {'x-api-key' : api_key, "Authorization" : "Bearer " + accesstoken}
r = requests.delete(url, headers = headers, data = data)
