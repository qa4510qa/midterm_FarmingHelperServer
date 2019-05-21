import sys
import numpy as np
import matplotlib.pyplot as plt
import math
import random
# from scipy.optimize import curve_fit
from statsmodels.distributions.empirical_distribution import ECDF

# def func(x, a,b):
#     # return a *np.exp(-b *x) +c
#     return 1-np.exp(-a*(x+b))




num_of_days=[30,31,30]
Climate_scenario=[[0.2,0.5,0.3],[0.3,0.5,0.2],[0.2,0.5,0.3]]
Climate_ratio=[]
date=[]
temperature=[]
precipitation=[]
sunshine=[]
wind=[]

IszeroRate=[[],[],[],[]]
Rainrate=[]
Windrate=[]
Sunshinerate=[]
# DataArray = [[],[],[],[],[]] 
DataArray_month = [[],[],[],[],[]] #T,P,S,W
DataExport = [[],[],[],[],[]]

data=open("/Users/yhhuang/Desktop/ClimateChange/forclimatechange/ClimateData/ClimateData_daily.csv","r")
output=open("/Users/yhhuang/Desktop/ClimateChange/forclimatechange/ClimateData/FutureClimateData_2.csv","w")

line=data.readline()
# print(len(line))
for i in range(10773):
    line=data.readline()
    date.append(line.split(',')[1])
    temperature.append(line.split(',')[2])
    precipitation.append(line.split(',')[3])
    sunshine.append(line.split(',')[4])
    wind.append(line.split(',')[5])

for i in range(12):
    DataArray_month[0].append(i+1)
    DataArray_month[1].append([])
    DataArray_month[2].append([])
    DataArray_month[3].append([])
    DataArray_month[4].append([])   

for i in range(10733):
    j=int(date[i][4:6])
    DataArray_month[1][j-1].append(temperature[i])
    DataArray_month[2][j-1].append(precipitation[i])
    DataArray_month[3][j-1].append(sunshine[i])
    DataArray_month[4][j-1].append(wind[i])


for i in range(12):
    IszeroRate[0].append(0)
    count=0
    for j in range(len(DataArray_month[2][i])):
        if(DataArray_month[2][i][j]=="0"):
            count+=1
    IszeroRate[1].append(round((float(count)/float(len(DataArray_month[2][i])))*1000)/1000)
    count=0
    for j in range(len(DataArray_month[3][i])):
        if(DataArray_month[3][i][j]=="0"):
            count+=1
    IszeroRate[2].append(round((float(count)/float(len(DataArray_month[3][i])))*1000)/1000)
    count=0
    for j in range(len(DataArray_month[4][i])):
        if(DataArray_month[4][i][j]=="0"):
            count+=1
    IszeroRate[3].append(round((float(count)/float(len(DataArray_month[4][i])))*1000)/1000)

for i in range(1,5,1):
    for j in range(12):
        while '-9999' in DataArray_month[i][j]:
            DataArray_month[i][j].remove('-9999')
        while '-9998' in DataArray_month[i][j]:
            DataArray_month[i][j].remove('-9998')
        while '-9997' in DataArray_month[i][j]:
            DataArray_month[i][j].remove('-9997')
        while '0' in DataArray_month[i][j]:
            DataArray_month[i][j].remove('0')
        for k in range(len(DataArray_month[i][j])):
            DataArray_month[i][j][k]=float(DataArray_month[i][j][k])

for i in range(3): #3 months(April~June)
    x=random.random()
    if x<=Climate_scenario[i][0]:
        Climate_ratio.append([0,Climate_scenario[i][0]])
    elif (x>Climate_scenario[i][0] and x<=Climate_scenario[i][1]):
        Climate_ratio.append([Climate_scenario[i][0],Climate_scenario[i][0]+Climate_scenario[i][1]])
    else :
        Climate_ratio.append([Climate_scenario[i][0]+Climate_scenario[i][1],1])

for i in range(1,5,1):
    for j in range(3):
        ecdf=ECDF(DataArray_month[i][j+3]) #(+3) -> April~June
        plt.figure()
        plt.plot(ecdf.x, ecdf.y, 'ko', label="Original Noised Data")
#        plt.plot(ecdf.x, func(ecdf.x, *popt), 'r-', label="Fitted Curve")
        plt.legend()
        plt.show()

        for k in range(num_of_days[j]):
            IsZero=random.random()
            if IsZero<=IszeroRate[i-1][j+3]: #(+3) -> April~June
                DataExport[i].append(0)
            else:
                y=random.random()*(Climate_ratio[j][1]-Climate_ratio[j][0])+Climate_ratio[j][0]
                p=0
                while ecdf.y[p]<y:
                    p+=1
                DataExport[i].append(round(ecdf.x[p]*1000)/1000)
# print(DataExport[4])
for i in range(len(DataExport[1])):
    if int(date[i+90][6:8])<10:
        DataExport[0].append('2019/'+date[i+90][5:6]+"/"+date[i+90][7:8])
    else:
        DataExport[0].append('2019/'+date[i+90][5:6]+"/"+date[i+90][6:8])

# print(DataExport[0])
output.write("Date,Temperature,Precipitation,Sunshine,Wind\n")
for i in range(len(DataExport[0])):
  output.write("{},{},{},{},{}\n".format(DataExport[0][i],DataExport[1][i],DataExport[2][i],DataExport[3][i],DataExport[4][i]))




        

# ------------------------------------------------------
# for i in range(366):
#     DataArray[0].append(date[730+i][4:8])
#     DataArray[1].append([])
#     DataArray[2].append([])
#     DataArray[3].append([])
#     DataArray[4].append([])
#     Fitting[0].append([])
#     Fitting[1].append([])
#     Fitting[2].append([])
#     Fitting[3].append([])
    

# for i in range(10733):
#     DataArray[1][DataArray[0].index(date[i][4:8])].append(temperature[i])
#     DataArray[2][DataArray[0].index(date[i][4:8])].append(precipitation[i])
#     DataArray[3][DataArray[0].index(date[i][4:8])].append(sunshine[i])
#     DataArray[4][DataArray[0].index(date[i][4:8])].append(wind[i])

# for i in range(366):
#     count=0
#     for j in range(len(DataArray[2][i])):
#         if(DataArray[2][i][j]=="0"):
#             count+=1
#     Rainrate.append(round((1-float(count)/float(len(DataArray[2][i])))*1000)/1000)
#     count=0
#     for j in range(len(DataArray[3][i])):
#         if(DataArray[3][i][j]=="0"):
#             count+=1
#     Sunshinerate.append(round((1-float(count)/float(len(DataArray[3][i])))*1000)/1000)
#     count=0
#     for j in range(len(DataArray[4][i])):
#         if(DataArray[4][i][j]=="0"):
#             count+=1
#     Windrate.append(round((1-float(count)/float(len(DataArray[4][i])))*1000)/1000)

# for i in range(1,5,1):
#     for j in range(366):
#         while '-9999' in DataArray[i][j]:
#             DataArray[i][j].remove('-9999')
#         while '-9998' in DataArray[i][j]:
#             DataArray[i][j].remove('-9998')
#         while '-9997' in DataArray[i][j]:
#             DataArray[i][j].remove('-9997')
#         while '0' in DataArray[i][j]:
#             DataArray[i][j].remove('0')

#           #from small to large

# for i in range(1,5,1):
#     for j in range(366):
#         for k in range(len(DataArray[i][j])):
#             DataArray[i][j][k]=float(DataArray[i][j][k])
#         DataArray[i][j].sort()



        # l=len(DataArray[i+1][j])
        # print(i+1,j)
        # print(DataArray[i+1][j][0:int(math.floor(l/3))])
        # if(l<=1):
        #     Fitting[i][j].append("No_answer")
        # else:
        #     ydata=np.linspace(0,1,l)
        #     xdata=np.asarray(DataArray[i+1][j])
            # y2=np.linspace(0,1,int(math.floor(2*l/3)-math.floor(l/3)))
            # x2=np.asarray(DataArray[i+1][j][int(math.floor(l/3)):int(math.floor(2*l/3))])
            # y3=np.linspace(0,1,l-int(math.floor(2*l/3)))
            # x3=np.asarray(DataArray[i+1][j][int(math.floor(2*l/3)):l])
            # try:
            #     popt, pcov1 = curve_fit(func, xdata, ydata)
            #     Fitting[i][j].append([xdata,popt])
                # popt2, pcov2 = curve_fit(func, x2, y2)
                # Fitting[i][j].append([x2,popt2,"middle"])
                # popt3, pcov3 = curve_fit(func, x3, y3)
                # Fitting[i][j].append([x3,popt3,"high"])
            # except:
            #     Fitting[i][j].append("No_answer")
            #     error.append(j)

 
# # func(x, *poptn) is the function after fitting

# for i in range(366):
#     print(Fitting[0][i])



# y1=np.linspace(0,1,9)
# x1=np.asarray(DataArray[1][0][0:9])
# plt.plot(x1, y1, 'b-', label='data')
# popt, pcov = curve_fit(func, x1, y1)
# print(popt)
# plt.figure()
# plt.plot(x1, y1, 'ko', label="Original Noised Data")
# plt.plot(x1, func(x1, *popt), 'r-', label="Fitted Curve")
# plt.legend()
# plt.show()




# for i in range(60,151):
    # DataExport[0].append([])
    # DataExport[1].append([])
    # DataExport[2].append([])
    # DataExport[3].append([])

# print(Rainrate)






# DataArray[1][1].sort()
# print(DataArray[1][1])
# output.write("Date,wind\n")
# for i in range(len(wind)):
#   output.write("{},{}\n".format(date[i],wind[i]))



