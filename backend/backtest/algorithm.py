from . import common
from datetime import datetime, timedelta

# 단순 이동 평균 (Simple Moving Average)
# 30일선 이동평균선
def SMA(stocks, period, column='current_price'):
    return stocks[column].rolling(window=period).mean()

# 상대적 강도 지수 (Relative Strength Index, 보통 14일)
# RSI 지수 
def RSI(stocks, period, column='current_price'):
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
        
# RSI지수가 high_index(과매수 지점) 이상이면 매도, low_index 이하면 매수
def RSI_buy_sell(stocks, rsi_period, high_index=70, low_index=30, account={}, buy_percent=50, sell_percent=50):
    print(f'상대적 강도 지수(RSI) 전략: 하한선-{low_index} 상한선-{high_index}')
    stocks = RSI(stocks, rsi_period)

    # =====필요한 결과값들 init
    result_data = common.init_result_data(account)

    for idx, row in stocks.iterrows():          
        if row['RSI']>=high_index:
            account=common.sell(account, row['code_number'], row['current_price'], sell_percent, row['date'], "상대적 강도 지수")
        elif row['RSI']<=low_index:
            account=common.buy(account, row['code_number'], row['current_price'], buy_percent, row['date'], "상대적 강도 지수")
        
        # =====매일마다 계산
        result_data = common.day_calculate(account, result_data, row)
        
    
    # 최종 계산
    result_data = common.end_calculate(account, result_data)
    






