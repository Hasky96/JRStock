# 전략 1
from asyncio.windows_events import NULL
import sqlite3
import pandas as pd

global my_stocks
global balance

# 종목코드=======================================
Naver = '035420'
Sk = '000660'
Samsung = '005930'
Kakao = '035720'
HD = '005380'
# ===============================================

def get_stock(code):  # code : 종목코드 // return dataframe
    con = sqlite3.connect("four_stocks.db")
    cur = con.cursor()
    cur.execute(f'select * from [{code}]') #  테이블명이 숫자로 시작하면 대괄호로 감싸야함
    rows = cur.fetchall()  # list
    con.close()
    data = pd.DataFrame(rows)
    data.columns = ['current_price', "volume", "trade_price", "date", "start_price", "high_price", "low_price"]
    data.set_index("date", inplace=True)
    return data


def find_ma(window, df):  # 이동평균선 구하는 함수
    return df['current_price'].rolling(window=window).mean().fillna(NULL)


def buy(percent, stocks, date, code):
    global balance
    global my_stocks
    price = stocks.loc[date, "current_price"]
    amount = (balance*percent/100) // price
    if amount > 0:
        print(f'{amount}주 구입함: {price*amount} ({date})')
        my_stocks[code] = amount
        balance -= price * amount
        balance -= price * amount * 0.0005  # 수수료
        return 1
    else:
        return 0
    
def sell(percent, stocks, date, code):
    global balance
    global my_stocks
    price = stocks.loc[date, "start_price"]
    # amount = divmod(my_stocks[code], percent / 100)[0]
    amount = divmod(my_stocks[code] * percent / 100, 1)[0]
    my_stocks[code] -= amount
    if my_stocks[code] == 0:
        del my_stocks[code]    
    balance += price * amount
    balance -= price * amount * 0.0005  # 수수료
    print(f'{amount}주 판매함: {price*amount} ({date})')
    
def ma_strategy(code):
    global my_stocks
    global balance
    global stock_code
    # 이동평균선을 이용한 주식거래 투자법
    stocks = get_stock(code)
    ma_5 =find_ma(5,get_stock(stock_code)) 
    ma_20 =find_ma(20,get_stock(stock_code)) 
    
    for i in range(len(stocks)):
        today = stocks.iloc[i]
        yesterday = stocks.iloc[i-1]
        # 양봉인지?
        positive = True if today.loc["start_price"] < today.loc["current_price"] else False 
        last_day = True if yesterday.loc["start_price"] < yesterday.loc["current_price"] else False
        #보유여부 확인
        if code in my_stocks.keys(): # 있다 => 판매전략
            if (last_day and not positive and yesterday.loc["high_price"] < today.loc["high_price"]) or today.loc["current_price"] < ma_5.iloc[i]:
                sell(100, stocks, today.name, code)
                print(f'자산 : {balance + (my_stocks[code] if code in my_stocks.keys() else 0) * today.loc["start_price"]:,.2f}  \n날짜 : {today.name}, 자금 : {balance}, 주식 : {my_stocks}',)
                print("===================================================================")
            
        else:  # 없다 => 구매전략
            if today.loc["start_price"] < ma_5.iloc[i] and today.loc["start_price"] < ma_20.iloc[i] and today.loc["current_price"] > ma_5.iloc[i] and today.loc["current_price"] > ma_20.iloc[i]:
                buy(90, stocks, today.name, code)
                print(f'자산 : {balance + (my_stocks[code] if code in my_stocks.keys() else 0) * today.loc["start_price"]:,.2f}  \n날짜 : {today.name}, 자금 : {balance}, 주식 : {my_stocks}',)
                print("===================================================================")
        
       
        # time.sleep(1/5)

    if code in my_stocks.keys():
        sell(100, stocks, stocks.iloc[-1].name, code)
        

#  벡테스팅 기본세팅
stock_code = Naver
my_stocks = {}
stocks = get_stock(stock_code)
init_balance =1000000
balance = init_balance  # 초기자금
print("===================================================================")
print("BackTest를 시작합니다.")
print(f'종목코드 : {stock_code}')
print(f'초기자금 : {balance}')
print("===================================================================")
ma_strategy(stock_code)
print(f'{stock_code} 에 {stocks.iloc[5].name} ~ {stocks.iloc[-1].name} 동안 투자한 결과\n자산 : {init_balance:,}원 => {balance:,.2f}원')

