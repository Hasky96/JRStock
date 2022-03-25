# from common import *

# 단순 이동 평균 (Simple Moving Average)
def SMA(params, df):
    period=params[0]
    return df['current_price'].rolling(window=period).mean()

# 지수 이동 평균 (Exponential Moving Average)
def EMA(params, df):
    period=params[0]
    return df['current_price'].ewm(span=period, adjust=False).mean()


# 이동 평균 수렴/발산을 계산하는 함수(MACD)
def MACD(df, window1=12, window2=26, signal=9, column='current_price'):
    short_w=min(window1, window2)
    long_w=max(window1, window2)
    short_ema=EMA(df, short_w, column=column)  # 단기 지수 이평선 계산
    long_ema=EMA(df, long_w, column=column)    # 장기 지수 이평선 계산
    df[f'macd{short_w}_{long_w}']=short_ema-long_ema   # 이동평균 수렴/발산 계산
    df[f'single{short_w}_{long_w}_{signal}']=EMA(df, signal, column=f'macd{short_w}_{long_w}') # 신호선 계산

# 이동 평균 수렴/발산을 계산하는 함수(MACD)
def macd_gold_cross(window1, window2, signal, weight, df):
    short_w=min(window1, window2)
    long_w=max(window1, window2)
    # before_macd=macddf.iloc[0].loc[f'ema{short_w}']-df.iloc[0].loc[f'ema{long_w}']
    # after_macd=macddf.iloc[1].loc[f'ema{short_w}']-df.iloc[1].loc[f'ema{long_w}']

    df['MACD']=short_ema-long_ema   # 이동평균 수렴/발산 계산
    df['single_line']=EMA(df, period_signal, column='MACD') # 신호선 계산

    return df


# 상대적 강도 지수 (Relative Strength Index, 보통 14일)
def RSI(df, period=14, column='current_price'):
    delta=df[column].diff(1)
    delta=delta.dropna()    # or delta[1:]

    up=delta.copy()
    down=delta.copy()
    up[up<0]=0
    down[down>0]=0
    df['up']=up
    df['down']=down

    avg_gain=SMA(df, period, column='up')
    avg_loss=abs(SMA(df, period, column='down'))

    rs=avg_gain/avg_loss
    rsi=100.0-(100.0/(1.0+rs))
    df['RSI']=rsi

    return df

# OBV 지수
def OBV(df):
    obv=[]
    obv.append(0)
    for i in range(1, len(df.current_price)):
        if df.current_price[i]>df.current_price[i-1]:
            obv.append(obv[-1]+df.volume[i])
        elif df.current_price[i]<df.current_price[i-1]:
            obv.append(obv[-1]-df.volume[i])
        else:
            obv.append(obv[-1])
    
    df['OBV']=obv
    df['OBV_EMA']=df['OBV'].ewm(com=20).mean()  # 지수평균이동값
    return df


# RSI지수가 high_index 이상이면 매도, low_index 이하면 매수
def RSI_buy_sell(df, high_index=90, low_index=10, account={}, buy_percent=50, sell_percent=50):
    print(f'상대적 강도 지수(RSI) 전략: 하한선-{low_index} 상한선-{high_index}')
    for idx, row in df.iterrows():
        if row['RSI']>=high_index:
            account=sell(account, row['code_number'], row['current_price'], sell_percent, row['date'], "상대적강도지수(RSI)")
        elif row['RSI']<=low_index:
            account=buy(account, row['code_number'], row['current_price'], buy_percent, row['date'], "상대적강도지수(RSI)")


# 단기이평선이 장기이평선을 상향돌파하면 매수, 하향돌파하면 매도
# 추가 : 팔 가격이 산 가격보다 높아야되고 살 가격이 판 가격보다 낮아야함
def SMA_buy_sell(df, short_period=20, long_period=120, account={}, buy_percent=50, sell_percent=50):
    print(f'단순이동평균선(SMA) 전략: 단기-{short_period}일 장기-{long_period}일')
    df_day_df['SMA_short']=SMA(df_day_df, short_period)
    df_day_df['SMA_long']=SMA(df_day_df, long_period)
    before_flag=0
    current_flag=0
    before_price=0
    current_price=0
    for idx, row in df.iterrows():
        current_price=row['current_price']
        if row['SMA_long']<row['SMA_short']:
            current_flag=1
        else:
            current_flag=2
        
        if before_flag==0:
            before_flag=current_flag
            before_price=current_price

        if before_flag<current_flag and before_price<current_price:
            account=sell(account, row['code_number'], row['current_price'], sell_percent, row['date'], "단순이동평균선(SMA)")
            before_price=max(before_price, current_price)
        elif before_flag>current_flag and before_price>current_price:
            account=buy(account, row['code_number'], row['current_price'], buy_percent, row['date'], "단순이동평균선(SMA)")
            before_price=min(before_price, current_price)
        
        before_flag=current_flag


# OBV < OBV_EMA 이면 팔고 반대면 산다
# 추가 : 팔 가격이 산 가격보다 높아야되고 살 가격이 판 가격보다 낮아야함
def OBV_buy_sell(df, account={}, buy_percent=50, sell_percent=50):
    df=OBV(df)
    flag=-1
    before_price=0
    current_price=0
    for idx, row in df.iterrows():   
        current_price=row['current_price']     

        if row['OBV']<row['OBV_EMA'] and flag!=0 and before_price<current_price:
            account=sell(account, row['code_number'], row['current_price'], sell_percent, row['date'], "거래량균형(OBV)")
            flag=0
            before_price=max(before_price, current_price)
        elif row['OBV']>row['OBV_EMA'] and flag!=1 and before_price>current_price:
            account=buy(account, row['code_number'], row['current_price'], buy_percent, row['date'], "거래량균형(OBV)")
            before_price=min(before_price, current_price)
            flag=1




# # MACD
# macd_period_long=120
# macd_period_short=20
# macd_period_signal=9
# rsi_period=14
# sma_period=120
# ema_period=20

# # RSI 


# # MA 
# sma_short_period=20
# sma_long_period=60

# df_day_df=MACD(df_day_df, macd_period_long, macd_period_short, macd_period_signal)
# df_day_df=RSI(df_day_df, rsi_period)

# df_day_df['SMA']=SMA(df_day_df, sma_period)
# df_day_df['EMA']=EMA(df_day_df, ema_period)

# # print(df_day_df.tail())

# rsi_high_index=90
# rsi_low_index=10
# buy_percent=50
# sell_percent=50

# # print(account)
# # RSI_buy_sell(df_day_df, rsi_high_index, rsi_low_index, account, buy_percent, sell_percent)
# # SMA_buy_sell(df_day_df, sma_short_period, sma_long_period, account, buy_percent, sell_percent)
# OBV_buy_sell(df_day_df, account, buy_percent, sell_percent)
# print(account)
# print(f'{calculate_total_account(account, current_stock_price):,}원')


# RSI지수가 high_index(과매수 지점) 이상이면 매도, low_index 이하면 매수
def RSI_buy_sell(df, rsi_period, high_index=70, low_index=30, account={}, buy_percent=50, sell_percent=50):
    print(f'상대적 강도 지수(RSI) 전략: 하한선-{low_index} 상한선-{high_index}')
    df = RSI(df, rsi_period)

    # =====필요한 결과값들 init
    result_data = init_result_data(account)

    for idx, row in df.iterrows():          
        if row['RSI']>=high_index:
            account=sell(account, row['code_number'], row['current_price'], sell_percent, row['date'], "상대적 강도 지수")
        elif row['RSI']<=low_index:
            account=buy(account, row['code_number'], row['current_price'], buy_percent, row['date'], "상대적 강도 지수")
        
        # =====매일마다 계산
        result_data = day_calculate(account, result_data, row)
        
    
    # 최종 계산
    result_data = end_calculate(account, result_data)


def ma_up_pass(window, err, weight, df):
    """ma선을 상향 돌파 하는경우

    Args:
        window (int): ma의 기준날짜
        err (int): 오차
        weight (int): 반환될 점수
        df (dataframe): (df.iloc[index]) 하루치 row
    """
    col = f'sma{window}'  # df 에서 가져올 col 이름 
    sma = df[col] 
    sma_err = (1-err/100)* sma  # 오차범위 값 지정
    if (df.loc['start_price'] < df.loc['current_price']):  # 양봉이어야함
        if(sma > df.loc['start_price'] and sma_err < df.loc['current_price']):
            return weight
    else:
        return 0
    
def ma_down_pass(window, err, weight, df):
    """ma 하향돌파

    Args:
        window (int): ma의 기준날짜
        err (int): 오차
        weight (int): 반환될 점수
        df (dataframe): (df.iloc[index]) 하루치 row
    """
    col = f'sma{window}'  # df 에서 가져올 col 이름 
    sma = df[col]  
    sma_err = (1-err/100)* sma  # 오차범위 값 지정
    if (df.loc['start_price'] > df.loc['current_price']):  # 음봉이어야함
        if(sma < df.loc['start_price'] and sma_err > df.loc['current_price']):
            return weight
    else:
        return 0
    
def  ma_gold_cross(window1, window2, weight, df):
    """골드크로스 형성

    Args:
        window1 (int): ma의 기준날짜 1
        window2 (int): ma의 기준날짜 2
        weight (int): 반환될 점수
        df (_type_): df.iloc[index-1:index+1] 어제 오늘의 df row
    """
    # 골드크로스 인지? ma 교차되고, 교차된후 윈도우 작은게 위에있는지
    #       20>= 5   =>   5>20
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    y_sma1 = df.iloc[0][col1]
    y_sma2 = df.iloc[0][col2]
    t_sma1 = df.iloc[1][col1]
    t_sma2 = df.iloc[1][col2]
    if(y_sma2 >= y_sma1 and t_sma1 > t_sma2):
        return weight
    return 0
    
def  ma_dead_cross(window1, window2, weight, df):
    """데드크로스 형성

    Args:
       window1 (int): ma의 기준날짜 1
        window2 (int): ma의 기준날짜 2
        weight (int): 반환될 점수
        df (_type_): df.iloc[index-1:index+1] 어제 오늘의 df row
    """
    # 데드크로스인지 => ma 교차되고, 교차된후 윈도우 작은게 아래에있는지
    #      5>= 20   =>   20>5
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    y_sma1 = df.iloc[0][col1]
    y_sma2 = df.iloc[0][col2]
    t_sma1 = df.iloc[1][col1]
    t_sma2 = df.iloc[1][col2]
    if(y_sma1 >= y_sma2 and t_sma2 > t_sma1):
        return weight
    return 0

def  ma_straight(window1, window2, weight, df):
    """정배율인지

    Args:
        window1 (int): ma의 기준날짜 1
        window2 (int): ma의 기준날짜 2
        weight (_type_): 반환될 점수
        df (_type_): (df.iloc[index]) 하루치 row
    """
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    sma1 = df.loc[col1]
    sma2 = df.loc[col2]
    if(sma1>sma2):
        return weight
    return 0

def  ma_reverse(window1, window2, weight, df):
    """역배율인지

    Args:
        window1 (int): ma의 기준날짜 1
        window2 (int): ma의 기준날짜 2
        weight (_type_): 반환될 점수
        df (_type_): (df.iloc[index]) 하루치 row
    """
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    sma1 = df.loc[col1]
    sma2 = df.loc[col2]
    if(sma2>sma1):
        return weight
    return 0
