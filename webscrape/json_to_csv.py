import json
from pprint import pprint
import csv
import os

def get_list_of_json_files():

    list_of_files = os.listdir('./November_16th_2019')

    return list_of_files


def create_list_from_json(jsonfile):

    # append the items to the list in the same order

    with open(jsonfile) as f:
        data = json.load(f)

    # print('data',data['Previous Close'])

    data_list = [] # create an empty list

    data_list.append(data['Previous Close'])
    data_list.append(data["Open"])
    data_list.append(data["Bid"])
    data_list.append(data["Ask"])
    data_list.append(data["Day's Range"])
    data_list.append(data["52 Week Range"])
    data_list.append(data["Volume"])
    data_list.append(data["Avg. Volume"])
    data_list.append(data["Market Cap"])
    data_list.append(data["Beta (3Y Monthly)"])
    data_list.append(data["PE Ratio (TTM)"])
    data_list.append(data["EPS (TTM)"])
    data_list.append(data["Earnings Date"])
    data_list.append(data["Forward Dividend & Yield"])
    data_list.append(data["Ex-Dividend Date"])
    data_list.append(data["1y Target Est"])
    data_list.append(data["ticker"])
    data_list.append(data["url"])

    # In few json files, the race was not there so using KeyError exception to add '' at the place
    # try:
    #     data_list.append(data['meta']['unstructured']['race'])
    # except KeyError:
    #     data_list.append("")  # will add an empty string in case race is not there.
    # data_list.append(data['name'])

    # return data_list
    return data_list


def write_csv():
    list_of_files = get_list_of_json_files()
    for file in list_of_files:
        print('file name',file)
        row = create_list_from_json(
            f'November_16th_2019/{file}')  # create the row to be added to csv for each file (json-file)
        with open('2months.csv', 'a') as c:
            writer = csv.writer(c)
            print('row',row)
            writer.writerow(row)
        c.close()

if __name__== '__main__':
    write_csv()



