import csv
import pandas as pd
import random

# random sample index
random_index = random.sample(range(1,281),28)
print('random_index',random_index)

# with open('./whiskye.csv') as csv_file:
#     csv_reader = csv.reader(csv_file, delimiter=',')
#     line_count = 0
#     for row in csv_reader:
#         if line_count == 0:
#             print('column names are',row)
#             line_count += 1
#         else:
#             line_count += 1
#     print('processed:',line_count)


with open('./whiskey.csv', mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        # print(f'\t{row["name"]} works in the {row["department"]} department, and was born in {row["birthday month"]}.')
        line_count += 1
    # print(f'Processed {line_count} lines.')


#  get the global mean
# read data into pandas using csv
df = pd.read_csv('./whiskey.csv')
temp = pd.read_csv('./whiskey.csv')

new_temp = temp.drop(temp.index[random_index])

print('temp')
print(new_temp.describe())

# mask = df.
print(df.describe())
mean = df['Price'].mean()
print('mean',mean)


for i in random_index:
    temp.at[i,'Rating'] = new_temp['Rating'].mean()
    temp.at[i,'Price'] = new_temp['Price'].mean()
    temp.at[i,'ABV'] = new_temp['ABV'].mean()
    temp.at[i,'Age'] = new_temp['Age'].mean()

print('random choice price',random.choice(temp['Rating']))

# write csv file
# temp.to_csv('./whiskey_global.csv',index=True, header=True)
temp.to_csv('./whiskey_global.csv',index=False, header=True)

# with open( './whiskey_global.csv', "wb") as csv_file:
#     writer = csv.writer(csv_file, delimiter=',')
#     for line in temp:
#         print('line',line)
#         writer.writerow(line)