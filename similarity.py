import csv
import random
import pandas as pd
from fancyimpute import KNN
import numpy as np
from sklearn.metrics import accuracy_score
from io import StringIO



# from StringIO import StringIO



# read data into pandas using csv
df = pd.read_csv('./whiskey-missing.csv')
# X is the complete data matrix
# X_incomplete has the same values as X except a subset have been replace with NaN

# Use 3 nearest rows which have a feature to fill in each row's missing features
df_numeric = df.select_dtypes(include=[np.float])
# df_filled = pd.DataFrame(KNN(3).complete(df_numeric))
df_filled = pd.DataFrame(KNN(3).fit_transform(df_numeric))
df_filled.columns = df_numeric.columns
df_filled.index = df_numeric.index


# data.to_csv('./whiskey_knn.csv',index=False, header=True)


# df_filled.columns = df_numeric.columns


# X_filled_knn = KNN(k=3).complete(df)
# x_filled_knn.to_csv('./whiskey_knn.csv',index=False, header=True)

data = pd.read_csv('./whiskey-missing.csv')

data['Rating'] = df_filled['Rating']
data['Price'] = df_filled['Price']
data['ABV'] = df_filled['ABV']
data['Age'] = df_filled['Age']



data.to_csv('./whiskey_knn.csv',index=False, header=True)

# with open( './whiskey_global.csv', "wb") as csv_file:
#     writer = csv.writer(csv_file, delimiter=',')
#     for line in temp:
#         print('line',line)
#         writer.writerow(line)

#
# testing = data['Price']
# # print('testing',testing)
# predicted = df_filled
# print('predicted',predicted)


# KNN.score(testing, predicted)