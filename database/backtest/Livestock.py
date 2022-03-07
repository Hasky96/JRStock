# 실시간 데이터 받아오기

# import
from pandas_datareader import data  # pip install pandas_datareader
from datetime import datetime  
import pandas as pd  # pip install pandas

# 데이터 받아오기

# 데이터 수집기간
start_date = datetime(2010,1,1)
end_date = datetime(2020,1,1)
print(start_date)

# Kospi, Kosdaq
def get_kospi_chart(start_date=None, end_date=None):
    """get Kospi data from web

    Args:
        start_date (_type_, optional): start date. Defaults to None.
        end_date (_type_, optional): end date. Defaults to None.

    Returns:
        _type_: dataframe for Kospi chart
    """
    if start_date is None or end_date is None:
        return data.get_data_yahoo("^KS11")
    else:
        return data.get_data_yahoo("^KS11", start_date, end_date)


def get_kosdaq_chart(start_date=None, end_date=None):
    """get Kosdaq data from web

    Args:
        start_date (_type_, optional): start date. Defaults to None.
        end_date (_type_, optional): end date. Defaults to None.

    Returns:
        _type_: dataframe for Kosdaq chart
    """
    if start_date is None or end_date is None:
        return data.get_data_yahoo("^KQ11")
    else:
        return data.get_data_yahoo("^KQ11", start_date, end_date)


def get_live_stock(code, index, start_date, end_date):
    """get stock data of stock by code from web
    
    Args:
        code (String): Stock code
        index (String): index for the stock => ks(Kospi), kq(kosdaq)
        start_date (String): starting date for searching => "2020-01-03"
        end_date (String): ending date for searching => "2020-02-03"

    Returns:
        DataFrame : Pandas DF (stock data)
    """
    stock = data.get_data_yahoo(f"{code}.{index}", start_date, end_date)
    return stock

'''
    examples
'''
# print(get_live_stock("005930","ks","2021-03-01","2021-04-01"))
# print(get_kosdaq_chart("2020-01-01", "2021-01-01"))
# print(get_kospi_chart())

