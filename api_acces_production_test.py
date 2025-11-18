# -*- coding: utf-8 -*-
"""
Created on Mon Nov 10 16:28:23 2025

@author: Cameron
"""

# -*- coding: utf-8 -*-
"""
Created on Sun Nov  9 19:59:07 2025

@author: Cameron
"""

import requests
import bson



#headers = {'x-api-key' : api_key}

api_key = "KkneL2FAHNEZamp23J5H78CGyo7w3Qb8"
#api_key = "wrong"
headers = {"x-api-key" : api_key}

#%%
url = "http://localhost:3000/cats"

name = "name_1"
age = "1"
breed = "breed_1"
data = {"name" : name, "age" : age, "breed" : breed}

r = requests.post(url, data = data, headers = headers)
#%%
url = "http://localhost:3000/cats"

r = requests.get(url, headers = headers)
#%%
url = "http://localhost:3000/auth/all_keys"

r = requests.get(url, headers = headers)
#%%
#Merge Databases
url = "http://localhost:3000/migration/logs"

r = requests.post(url, headers = headers)
#%%
#Merge Databases
url = "http://localhost:3000/migration/keys"

r = requests.post(url, headers = headers)
#%%
import sqlite3

db_path= 'Desktop\\BusProject_API\\production_api\\database.db'
table_name = 'api_keys'

def get_column_types(db_path, table_name):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Use PRAGMA table_info to get column information
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    
    print(f"Column types for table '{table_name}':")
    for col in columns:
        col_id, name, data_type, not_null, default_value, pk = col
        print(f"  {name}: {data_type} (PK: {pk}, Not Null: {not_null})")
    
    conn.close()
    return columns

# Usage
get_column_types(db_path, table_name)

#%%
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
    
insert_sql = """
INSERT INTO api_keys (key, name, permissionLevel) 
VALUES ('KkneL2FAHNEZamp23J5H78CGyo7w3Qb8', 'Admin', 'ADMIN')
"""

cursor.execute(insert_sql)
conn.commit()
#%%

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute(f"SELECT * FROM api_keys")
rows = cursor.fetchall()

#%%
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("DELETE FROM api_keys WHERE id = 1")
conn.commit()