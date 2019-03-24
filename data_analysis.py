from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from werkzeug import secure_filename
import io
import csv
import random
import pandas as pd
# from StringIO import StringIO
from io import StringIO
import numpy as np
import csv
import random
from fancyimpute import KNN
from sklearn.metrics import accuracy_score
from io import StringIO
import os
import random



# csv_input = csv.reader(stream)
# read to csv for computation
df = pd.read_csv("./whiskey-missing.csv")
# print("pd_input",df.describe())
# to track original data
temp = df
temp_mean = df
temp_knn = df
temp_random = df
# ****transform, this is for the global mean part
rate_mean = df["Rating"].mean()
price_mean = df["Price"].mean()
abv_mean = df["ABV"].mean()
age_mean = df["Age"].mean()

print("temp_mean before", temp_mean.describe())
print("df before count",df.describe())



# part where the transform works
for i in range(len(df)):
   if np.isnan(df.at[i,'Rating']):
      temp_mean.at[i, 'Rating'] = rate_mean
      temp_mean.at[i, 'rate_impute'] = 1

   else:
      temp_mean.at[i, 'rate_impute'] = 0

   if np.isnan(df.at[i,'Price']):
      temp_mean.at[i, 'Price'] = price_mean
      temp_mean.at[i, 'price_impute'] = 1

   else:
      temp_mean.at[i, 'price_impute'] = 0

   if np.isnan(df.at[i,'ABV']):
      temp_mean.at[i, 'ABV'] = abv_mean
      temp_mean.at[i, 'abv_impute'] = 1
   else:
      temp_mean.at[i, 'abv_impute'] = 0

   if np.isnan(df.at[i,'Age']):
      temp_mean.at[i, 'Age'] = age_mean
      temp_mean.at[i, 'age_impute'] = 1

   else:
      temp_mean.at[i, 'age_impute'] = 0


print("temp_mean after", temp_mean.describe())
print("df after", df.describe())



temp_mean.to_csv('./new_data/whiskey_global.csv', index=False, header=True)

df = pd.read_csv("./whiskey-missing.csv")

print("df before count knn",df.describe())



# ***knn function
df_numeric = df.select_dtypes(include=[np.float])
# df_filled = pd.DataFrame(KNN(3).complete(df_numeric))
df_filled = pd.DataFrame(KNN(3).fit_transform(df_numeric))
df_filled.columns = df_numeric.columns
df_filled.index = df_numeric.index



temp_knn['Rating'] = df_filled['Rating']
temp_knn['Price'] = df_filled['Price']
temp_knn['ABV'] = df_filled['ABV']
temp_knn['Age'] = df_filled['Age']

# this is adding the imputation boolean label
# temp_knn['Rating_impute'] = temp['Rating_impute']
# temp_knn['Price_impute'] = temp['Price_impute']
# temp_knn['ABV_impute'] = temp['ABV_impute']
# temp_knn['Age_impute'] = temp['Age_impute']
temp_knn['rate_impute'] = temp_mean['rate_impute']
temp_knn['price_impute'] = temp_mean['price_impute']
temp_knn['abv_impute'] = temp_mean['abv_impute']
temp_knn['age_impute'] = temp_mean['age_impute']

print("temp_knn", temp_knn.describe())



temp_knn.to_csv('./new_data/whiskey_knn.csv', index=False, header=True)



df = pd.read_csv("./whiskey-missing.csv")

print("df before count knn",df.describe())




# this is for the random selction
for i in range(len(df)):
   if np.isnan(df.at[i,'Rating']):
        temp_random.at[i, 'Rating'] = random.choice(temp["Rating"])
   if np.isnan(df.at[i,'Price']):
        temp_random.at[i, 'Price'] = random.choice(temp["Price"])
   if np.isnan(df.at[i,'ABV']):
        temp_random.at[i, 'ABV'] = random.choice(temp["ABV"])
   if np.isnan(df.at[i,'Age']):
        temp_random.at[i, 'Age'] = random.choice(temp["Age"])

print("temp_knn", temp_random.describe())


temp_random['rate_impute'] = temp['rate_impute']
temp_random['price_impute'] = temp['price_impute']
temp_random['abv_impute'] = temp['abv_impute']
temp_random['age_impute'] = temp['age_impute']



temp_random.to_csv('./new_data/whiskey_random.csv', index=False, header=True)

