import pandas as pd
import numpy as np
from fancyimpute import KNN



# read to csv for computation
df = pd.read_csv("./data_removed.csv")
# to track original data
temp = df
temp_knn = df
# ****transform, this is for the global mean part


print("df before count knn",df.describe())
# ***knn function
df_numeric = df.select_dtypes(include=[np.float])
# df_filled = pd.DataFrame(KNN(3).complete(df_numeric))
df_filled = pd.DataFrame(KNN(3).fit_transform(df_numeric))
df_filled.columns = df_numeric.columns
df_filled.index = df_numeric.index





print("temp_knn", temp_knn.describe())

# part where the transform works
for i in range(len(df)):
   if np.isnan(df.at[i,'beta']):
      temp_knn.at[i, 'beta_impute'] = 1
   else:
      temp_knn.at[i, 'beta_impute'] = 0

   if np.isnan(df.at[i,'currprice']):
      temp_knn.at[i, 'currprice_impute'] = 1
   else:
      temp_knn.at[i, 'currprice_impute'] = 0

   if np.isnan(df.at[i,'pctchg52wks']):
      temp_knn.at[i, 'pctchg52wks_impute'] = 1
   else:
      temp_knn.at[i, 'pctchg52wks_impute'] = 0

   if np.isnan(df.at[i,'avgvol']):
      temp_knn.at[i, 'avgvol_impute'] = 1
   else:
      temp_knn.at[i, 'avgvol_impute'] = 0

   if np.isnan(df.at[i, 'peratio']):
       temp_knn.at[i, 'peratio_impute'] = 1
   else:
       temp_knn.at[i, 'peratio_impute'] = 0

   if np.isnan(df.at[i, 'roe']):
       temp_knn.at[i, 'roe_impute'] = 1
   else:
       temp_knn.at[i, 'roe_impute'] = 0

   if np.isnan(df.at[i, 'marketcap']):
       temp_knn.at[i, 'marketcap_impute'] = 1
   else:
       temp_knn.at[i, 'marketcap_impute'] = 0

   if np.isnan(df.at[i, 'eps']):
       temp_knn.at[i, 'eps_impute'] = 1
   else:
       temp_knn.at[i, 'eps_impute'] = 0

temp_knn['beta'] = df_filled['beta']
temp_knn['currprice'] = df_filled['currprice']
temp_knn['pctchg52wks'] = df_filled['pctchg52wks']
temp_knn['avgvol'] = df_filled['avgvol']
temp_knn['peratio'] = df_filled['peratio']
temp_knn['roe'] = df_filled['roe']
temp_knn['marketcap'] = df_filled['marketcap']*10000
temp_knn['eps'] = df_filled['eps']


print("temp_mean after", temp_knn.describe())

temp_knn.to_csv('./data_removed_knn.csv', index=False, header=True)
