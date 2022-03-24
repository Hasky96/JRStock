from bt_common import *

# 5일선과 20일선 이평선을 이용한 매매 법

# Initial Settings
account = {
    "balance":1000000,
    "stocks":{
    }
}

def ma5_20_strategy(account, code, start, end):
    start_balance = account['balance']
    day_stocks=get_day_stock(code, start, end)
    df_day_stocks=object_to_dataframe(day_stocks)   # dataframe으로 변환
    # ma5, ma20 추가    
    df_day_stocks['ma_5'] = df_day_stocks["current_price"].rolling(window=5).mean()
    df_day_stocks['ma_20'] = df_day_stocks["current_price"].rolling(window=20).mean()
    df_day_stocks['candle'] = df_day_stocks["current_price"] > df_day_stocks["start_price"]
    # 로직
    print(df_day_stocks)
    for i in range(19,len(df_day_stocks)):
        mdd_max = 0
        mdd_min = 987654321
        # if(mdd_max)
        yesterday = df_day_stocks.iloc[i-1]
        today = df_day_stocks.iloc[i]
        yesterday_candle = yesterday['candle']
        if code in account['stocks'].keys(): # 주식 보유하고 있을 경우 판매전략만 고려한다.
            #판매전략
            if(today['current_price'] < today['ma_5']):
                account = sell(account,code, today['current_price'], 100)  # 5일선 접촉 모두판매
            if(not today['candle'] and yesterday_candle and today['start_price'] > yesterday['current_price']):  # 하락할 추세 있음 50 % 매도
                account = sell(account,code, today['current_price'], 50)
            if(today['ma_5'] > today['ma_20'] and yesterday['ma_20'] > yesterday['ma_5']):
                account = sell(account,code, today['current_price'], 50)
        else:
            #구매전략
            if(today['candle'] and today['start_price'] < today['ma_5'] and today['start_price'] < today['ma_20'] and today['current_price'] > today['ma_5'] and today['current_price'] > today['ma_20']):  # 이평선 두개 돌파시
                if(today['ma_5'] > today['ma_20'] and yesterday['ma_20'] > yesterday['ma_5']):  # 정배율이면 100 프로
                    account = buy(account,code, today['ma_5']+(today['current_price']- today['ma_5'])//4,100)
                else:  # 아니면 50
                    account = buy(account,code, today['ma_5'],50)
                
    current_stock_price=get_current_stock_price()   # {'005930': 71000}
    result = calculate_total_account(account, current_stock_price)
    p1 = int(df_day_stocks.iloc[-1]['current_price'] )
    p2 = int(df_day_stocks.iloc[0]['current_price'] )
    print(f'기간 : {start} ~ {end}')
    print(f'결과 : {start_balance:,}원 => {result}')
    print(f'가격변동 : {p2:,}원 => {p1:,}원 ')
    
#실행
# code = "005380"
code = "005930"
# code = "035420"
# code = "035720"

# ma5_20_strategy(account, code, '1995-05-02', '2022-03-24')
ma5_20_strategy(account, code, '2015-03-02', '2022-03-23')