from bt_common import *

current_stock_price=get_current_stock_price()   # {'005930': 71000}
day_stocks=get_day_stock('005380', '2010-05-02', '2021-12-31')
df_day_stocks=object_to_dataframe(day_stocks)
print(df_day_stocks)

account = {
    "balance":1000000,
    "start_price":1000000,
    "stocks":{
        # "005930":{
        #     "amount":100,
        #     "avg_price":70000
        #     },
        # "002356":{
        #     "amount":30,
        #     "avg_price":50000
        # },
    }
}