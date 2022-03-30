from datetime import datetime
from pandas_datareader import data as pdr
import yfinance as yf
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout

from datetime import datetime, timedelta

import os


# 이건 없어도 되는내용입니다. 
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

   


def predict_close():
    df = pd.DataFrame([['Min',579.250000, 597.210022, 577.830017, 0.0, 596.710022, 571.766016]
                       ,['Max', 1.061320e+03, 1.062030e+03, 1.055640e+03, 1.522800e+06, 1.060000e+03, 1.056666e+03]
                       ],columns=['index' ,'Open', 'High', 'Low', 'Volume', 'Close', 'ma_5' ])
    df = df.set_index('index')
    
    model = tf.keras.models.load_model('kosdaq.h5')
    print(df.loc['Max'])
    print(df.loc['Min'])
    
    today = datetime.now()
    end = (today - timedelta(days=1)).date()
    start = (today- timedelta(days=30)).date()
    
    test_case = pdr.get_data_yahoo("^KQ11", start=start, end=end)
    test_case = test_case[['Open', "High", "Low",  "Volume", "Close"]]
    test_case['ma_5'] = test_case["Close"].rolling(window=5).mean()
    test_x = test_case[-10:]
    
    numerator = test_x - df.loc['Min']
    denominator = df.loc['Max'] - df.loc['Min']
    test_x = numerator / (denominator + 1e-7)   
    
    result = model.predict([test_x.values.tolist()])
    
    denominator = df.loc['Max']['ma_5'] - df.loc['Min']['ma_5']
    result_ma5 = result.mean() * (denominator + 1e-7) + df.loc['Min']['ma_5']

    result_close = result_ma5*5 - sum(test_case.iloc[-4:].Close)
    # print(f'{today.date()} predicted close : {result_close}')
    # print(test_case.iloc[-1].Close)
    return result_close


print(predict_close())