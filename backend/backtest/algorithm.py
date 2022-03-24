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
def RSI_buy_sell(stocks, rsi_period, high_index=70, low_index=30, account={}, buy_percent=50, sell_percent=50, start_date=''):
    print(f'상대적 강도 지수(RSI) 전략: 하한선-{low_index} 상한선-{high_index}')
    stocks = RSI(stocks, rsi_period)
    year = '0' # 연도 저장
    year_start_price = 0 # 시작가격
    year_earn_rate = 0.0 # 연평균 수익률
    year_cnt = 0 # 총 연도 수
    max_earn = account['balance']; # 최고 수익
    max_date = None # 최고 수익 날짜
    min_earn = account['balance']; # 최저 수익
    min_earn_after_max = 0
    
    start_kospi_price = common.get_kospi_price_by_date(start_date) # 시작 코스피 가격
    
    for idx, row in stocks.iterrows():
        # 시작날 연도랑 시작가격 받아오기
        if idx == 0:
            year = row['date'][:4]
            year_start_price = account['balance']
            
        # 마지막날 코스피 가격 받아오기
        if idx == len(stocks) - 1:
            end_kospi_price = common.get_kospi_price_by_date(row['date'])
        
        if row['RSI']>=high_index:
            account=common.sell(account, row['code_number'], row['current_price'], sell_percent, row['date'], "상대적 강도 지수")
        elif row['RSI']<=low_index:
            account=common.buy(account, row['code_number'], row['current_price'], buy_percent, row['date'], "상대적 강도 지수")
        
        # 팔거나 구매 이후에 일수익률 계산    
        current_asset = int(account['balance'])
        for code_num in account['stocks'].keys():
            cur_price = common.get_stock_price(code_num, row['date'])
            current_asset += (int(cur_price) * int(account['stocks'][code_num]['amount']))
        
        if max_earn < current_asset:
            max_earn = current_asset
            max_date = datetime.strptime(row['date'], '%Y-%m-%d')
            
        if min_earn > current_asset:
            min_earn = current_asset
            min_date = datetime.strptime(row['date'], '%Y-%m-%d')
            if max_date != None and max_date < min_date:
                min_earn_after_max = current_asset
                
        min_earn = min(min_earn, current_asset)
        day_earn = (current_asset - account['pre_price'])
        day_earn_rate = day_earn / account['pre_price']
        day_earn_rate = round(day_earn_rate * 100, 3)
        
        # print('일수익률' + str(day_earn_rate) + '|| 일손익' + str(day_earn) + '|| 현재 자산' + str(current_asset))
        
        # 연도가 끝나는 날과 종료시에 연평균 계산
        account['pre_price'] = current_asset
        if year != row['date'][:4] or idx == len(stocks) - 1:
            year_cnt += 1
            print(year + '년 평균' + str((current_asset - year_start_price) / year_start_price))
            year = row['date'][:4]
            year_earn_rate = (year_earn_rate + ((current_asset - year_start_price) / year_start_price)) / year_cnt
            year_start_price = current_asset
            print('연평균' + str(round(year_earn_rate * 100, 3)))
    
    my_profit_loss = int(account['pre_price']) - int(account['start_price'])
    my_final_rate = round(my_profit_loss / int(account['start_price']) * 100, 3)
    market_rate = round((float(end_kospi_price) - float(start_kospi_price)) / float(start_kospi_price) * 100, 3)
    alpha = round(my_final_rate - market_rate, 3)
    mdd = round((min_earn_after_max - max_earn) / max_earn * 100, 3)
    print('내 손익' + str(my_profit_loss) + '내 수익률' + str(my_final_rate) + '  MDD' + str(mdd))
    print('시장 수익률' + str(market_rate) + '시장초과수익률' + str(alpha) + '최고자산' + str(max_earn) + '최저자산' + str(min_earn))






