from __future__ import absolute_import, unicode_literals
import os
import pandas as pd
from datetime import datetime, timedelta
from django.db.models import Max

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'JRstock.settings')
# pip install -r requirements.txt
import django   
django.setup()

from stock.models import DayStock, FinancialInfo

def get_day_stock(code_number, start_date, end_date):
    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date__gte=start_date).filter(date__lte=end_date)
    
    financial_info = FinancialInfo.objects.get(pk=code_number)
    day_stock_list = list(day_stock_list) 
    
    # print(financial_info.face_value)
    # print(day_stock_list[0].current_price)
    # print(day_stock_list[0].changes)
    # print(day_stock_list[0].chages_ratio)
    # print(day_stock_list[0].date)
    
    return day_stock_list

def get_current_stock_price():
    # select * from day_stock where date=(select max(date) from day_stock); 
    current_date=DayStock.objects.aggregate(Max('date'))['date__max']   # DB에 저장된 마지막 날짜 {'date__max': '2022-03-21'}
    day_stock_list = DayStock.objects.filter(date=current_date)
    current_stock_price={}
    for row in list(day_stock_list):
        current_stock_price[row.code_number]=float(row.current_price)
    return current_stock_price

current_stock_price=get_current_stock_price()
day_stocks=get_day_stock('005380', '1995-05-02', '2022-03-01')
# day_stocks=get_day_stock('005930', '2022-01-02', '2022-03-01')


account = {
    "balance":1000000,
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

today_stock_price={}

def buy(account, code, price, percent):
    """주식구매 함수

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        code (String): 매수하고자 하는 주식 코드
        price (Integer): 매수하는 가격
        percent (Integer): 현금자산의 몇 퍼센트의 비중으로 매수할지

    Returns:
        구매 완료시 수정된 현금 재산과 보유주식목록 딕셔너리 반환
        실패시 False 반환 -> account 반환
    """
    stock_amount = int((account['balance'] * percent/100) // price)
    if stock_amount * price * 1.00015 > account['balance']: 
        stock_amount -= 1
    buy_price =stock_amount * price * 1.00015 # 수수료포함가격
    if buy_price == 0: # 못사는경우
        print("구매가 불가합니다. 잔액부족")
        return account
    account['balance'] -= buy_price # 구매후 가격 갱신
    if code in account['stocks'].keys():
        info = account['stocks'][code]
        account['stocks'][code]['avg_price'] = int((info['amount'] * info['avg_price'] + price*stock_amount) // (info['amount']+ stock_amount)) # 평단가 갱신 
        account['stocks'][code]['amount'] += stock_amount
    else:
        account['stocks'][code] = {"amount":stock_amount, "avg_price":price}
    print(f'매수알림 : {code} 주식 {price:,}가격에 {stock_amount:,}주 매수')
    return account

def sell(account, code, price, percent):
    """주식구매 함수

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        code (String): 매도하고자 하는 주식 코드
        price (Integer): 매도하는 가격
        percent (Integer): 보유주식수의 몇 퍼센트의 비중으로 매도할지

    Returns:
        구매 완료시 수정된 현금 재산과 보유주식목록 딕셔너리 반환
        실패시 False 반환 -> account 반환
    """
    if code not in account['stocks'].keys():
        print("판매가 불가능합니다. 보유한 주식수보다 작습니다.")
        return account
    stock_amount = int(account['stocks'][code]['amount']*percent/100)
    account['balance'] += int(price* stock_amount * 1.00015) #수수료포함 가격
    account['stocks'][code]['amount'] -= stock_amount
    if account['stocks'][code]['amount'] == 0:
        del account['stocks'][code]
    print(f'매도알림 : {code} 주식 {price:,} 가격에 {stock_amount:,}주 매도')
    return account


def calculate_total_account(account, current_stock_price):
    total_amount=account['balance']
    for key in account['stocks'].keys():
        # current_price=current_stock_price[key]
        total_amount+=current_stock_price[key]*account['stocks'][key]['amount']
    
    return total_amount

# TEST
# key='005930'
# print(current_stock_price[key])
# print(account)
# account = buy(account, "005930", 71000, 50)
# account = buy(account, "111111", 71000, 50)
# print(calculate_total_account(account, current_stock_price))
# account = sell(account, "111111", 98000, 100)
# account = sell(account, "005930", 80000, 50)
# print(account)





def object_to_dataframe(stocks):
    col_name = ['code_number','current_price','changes','chages_ratio','start_price','high_price', 'low_price', \
    'volume','trade_price','market_cap','stock_amount','date']
    stock_list=[]
    for stock in stocks:
        temp=[]
        temp.append(stock.code_number)
        temp.append(float(stock.current_price))
        temp.append(float(stock.changes))
        temp.append(float(stock.chages_ratio))
        temp.append(float(stock.start_price))
        temp.append(float(stock.high_price))
        temp.append(float(stock.low_price))
        temp.append(int(stock.volume))
        temp.append(int(stock.trade_price))
        temp.append(int(stock.market_cap))
        temp.append(int(stock.stock_amount))
        temp.append(stock.date)
        stock_list.append(temp)
    
    return pd.DataFrame(stock_list, columns=col_name)



df_day_stocks=object_to_dataframe(day_stocks)   # dataframe으로 변환
# print(df_day_stocks)

# 단순 이동 평균 (Simple Moving Average, 보통 30일 평균 값)
def SMA(stocks, period=30, column='current_price'):
    return stocks[column].rolling(window=period).mean()

# 지수 이동 평균 (Exponential Moving Average, 보통 20일 평균 값)
def EMA(stocks, period=20, column='current_price'):
    return stocks[column].ewm(span=period, adjust=False).mean()

# 이동 평균 수렴/발산을 계산하는 함수(MACD)
def MACD(stocks, period_long=26, period_short=12, period_signal=9, column='current_price'):
    # 단기 지수 이평선 계산
    short_ema=EMA(stocks, period_short, column=column)
    
    # 장기 지수 이평선 계산
    long_ema=EMA(stocks, period_long, column=column)

    # 이동평균 수렴/발산 계산
    stocks['MACD']=short_ema-long_ema

    # 신호선 계산
    stocks['single_line']=EMA(stocks, period_signal, column='MACD')

    return stocks


# 상대적 강도 지수 (Relative Strength Index, 보통 14일)
def RSI(stocks, period=14, column='current_price'):
    delta=stocks[column].diff(1)
    delta=delta.dropna()    # or delta[1:]

    up=delta.copy()
    down=delta.copy()
    up[up<0]=0
    down[down>0]=0
    stocks['up']=up
    stocks['down']=down

    avg_gain=SMA(stocks, period, column='up')
    avg_loss=abs(SMA(stocks, period, column='down'))

    rs=avg_gain/avg_loss
    rsi=100.0-(100.0/(1.0+rs))
    stocks['RSI']=rsi

    return stocks

# RSI지수가 high_index 이상이면 매도, low_index 이하면 매수
def RSI_buy_sell(stocks, high_index=70, low_index=30, account={}, buy_percent=50, sell_percent=50):
    for idx, row in stocks.iterrows():
        if row['RSI']>=high_index:
            print(row['date'], end=' ')
            account=sell(account, row['code_number'], row['current_price'], sell_percent)
        elif row['RSI']<=low_index:
            print(row['date'], end=' ')
            account=buy(account, row['code_number'], row['current_price'], buy_percent)



macd_period_long=26
macd_period_short=12
macd_period_signal=9
rsi_period=14
sma_period=30
ema_period=20

df_day_stocks=MACD(df_day_stocks, macd_period_long, macd_period_short, macd_period_signal)
df_day_stocks=RSI(df_day_stocks, rsi_period)

df_day_stocks['SMA']=SMA(df_day_stocks, sma_period)
df_day_stocks['EMA']=EMA(df_day_stocks, ema_period)

# print(df_day_stocks.tail())

rsi_high_index=90
rsi_low_index=10
buy_percent=50
sell_percent=50

# print(account)
RSI_buy_sell(df_day_stocks, rsi_high_index, rsi_low_index, account, buy_percent, sell_percent)
print(account)
print(calculate_total_account(account, current_stock_price))