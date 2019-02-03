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

PEOPLE_FOLDER = os.path.join('static', 'button_img')

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = PEOPLE_FOLDER


def transform(text_file_contents):
   return text_file_contents.replace("=", ",")

@app.route('/')
def index():
   full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'bar.png')
   scatter_name = os.path.join(app.config['UPLOAD_FOLDER'], 'scatter.png')

   return render_template('index.html',user_image = full_filename,scatter_image=scatter_name)

@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      f.save(secure_filename(f.filename))
      return 'file uploaded successfully'
      #  upto this point it is the original code
      # full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'bar.png')
      # scatter_name = os.path.join(app.config['UPLOAD_FOLDER'], 'scatter.png')
      #
      # return render_template('index.html',user_image = full_filename,scatter_image=scatter_name)


@app.route('/transform', methods=["POST"])
def transform_view():
    f = request.files['data_file']
    if not f:
        return "No file"

    stream = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
    csv_input = csv.reader(stream)
    # read to csv for computation
    df = pd.read_csv(stream)
    # print("pd_input",df.describe())
    # to track original data
    temp = df
    temp_knn = df
    # ****transform, this is for the global mean part
    rate_mean = df["Rating"].mean()
    price_mean = df["Price"].mean()
    abv_mean = df["ABV"].mean()
    age_mean = df["Age"].mean()

    # part where the transform works
    for i in range(len(temp)):
       if np.isnan(temp.at[i,'Rating']):
          temp.at[i, 'Rating'] = rate_mean
          temp.at[i, 'Rating_impute'] = 1
       else:
          temp.at[i, 'Rating_impute'] = 0
       if np.isnan(temp.at[i,'Price']):
          temp.at[i, 'Price'] = price_mean
          temp.at[i, 'Price_impute'] = 1
       else:
          temp.at[i, 'Price_impute'] = 0
       if np.isnan(temp.at[i,'ABV']):
          temp.at[i, 'ABV'] = abv_mean
          temp.at[i, 'ABV_impute'] = 1
       else:
          temp.at[i, 'ABV_impute'] = 0
       if np.isnan(temp.at[i,'Age']):
          temp.at[i, 'Age'] = age_mean
          temp.at[i, 'Age_impute'] = 1
       else:
          temp.at[i, 'Age_impute'] = 0

    temp.to_csv('./static/new_data/whiskey_global.csv', index=False, header=True)

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
    temp_knn['Rating_impute'] = temp['Rating_impute']
    temp_knn['Price_impute'] = temp['Price_impute']
    temp_knn['ABV_impute'] = temp['ABV_impute']
    temp_knn['Age_impute'] = temp['Age_impute']


    temp_knn.to_csv('./static/new_data/whiskey_knn.csv', index=False, header=True)


    # this is for retrieving the image
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'bar.png')
    scatter_name = os.path.join(app.config['UPLOAD_FOLDER'], 'scatter.png')

    return render_template('index.html', user_image=full_filename, scatter_image=scatter_name)

if __name__ == '__main__':
   app.run(debug = True)