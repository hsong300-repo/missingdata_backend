import pandas as pd
import numpy as np
from fancyimpute import KNN

# read to csv for computation
df = pd.read_csv("./collected_data/stock_removed_final.csv")
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
   if np.isnan(df.at[i,'Beta']):
      temp_knn.at[i, 'Beta_impute'] = 1
   else:
      temp_knn.at[i, 'Beta_impute'] = 0

   if np.isnan(df.at[i,'Open']):
      temp_knn.at[i, 'Open_impute'] = 1
   else:
      temp_knn.at[i, 'Open_impute'] = 0

   if np.isnan(df.at[i,'52-Week Change']):
      temp_knn.at[i, '52-Week Change_impute'] = 1
   else:
      temp_knn.at[i, '52-Week Change_impute'] = 0

   if np.isnan(df.at[i,'Avg. Volume']):
      temp_knn.at[i, 'Avg. Volume_impute'] = 1
   else:
      temp_knn.at[i, 'Avg. Volume_impute'] = 0

   if np.isnan(df.at[i, 'PE Ratio']):
       temp_knn.at[i, 'PE Ratio_impute'] = 1
   else:
       temp_knn.at[i, 'PE Ratio_impute'] = 0

   if np.isnan(df.at[i, 'ROE']):
       temp_knn.at[i, 'ROE_impute'] = 1
   else:
       temp_knn.at[i, 'ROE_impute'] = 0

   if np.isnan(df.at[i, 'EPS']):
       temp_knn.at[i, 'EPS_impute'] = 1
   else:
       temp_knn.at[i, 'EPS_impute'] = 0

temp_knn['Beta'] = df_filled['Beta']
temp_knn['Open'] = df_filled['Open']
temp_knn['52-Week Change'] = df_filled['52-Week Change']
temp_knn['Avg. Volume'] = df_filled['Avg. Volume']
temp_knn['PE Ratio'] = df_filled['PE Ratio']
temp_knn['ROE'] = df_filled['ROE']
temp_knn['EPS'] = df_filled['EPS']


print("temp_mean after", temp_knn.describe())

temp_knn.to_csv('./collected_data/stock_removed_knn.csv', index=False, header=True)
