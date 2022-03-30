def SMA(params, df):
    """ 단순이동평균 (Simple Moving Average)

    Args:
        params (list): [period1, period2,..., weight]
        df (dataframe): 주식 데이터 프레임

    Returns:
        dataframe: 열 추가된 주식 데이터 프레임
    """
    for i in range(len(params)-1):
        period=params[i]
        df[f'sma{period}']=df['current_price'].rolling(window=period).mean()
    return df

def EMA(df, period, column='current_price'):
    """ 지수이동평균 (Exponential Moving Average)

    Args:
        df (dataframe): 주식 데이터 프레임
        period (int): 기간
        column (string): 추가할 열의 이름

    Returns:
        dataframe: 열 추가된 주식 데이터 프레임
    """
    return df[column].ewm(span=period, adjust=False).mean()

 
def MACD(params, df):
    """ 이동평균 수렴/발산을 계산하는 함수(MACD)

    Args:
        params (list): [short_period, long_period, signal, weight]
        df (dataframe): 주식 데이터 프레임

    Returns:
        dataframe: 열 추가된 주식 데이터 프레임
    """
    short_period=params[0]
    long_period=params[1]
    signal=params[2]
    short_ema=EMA(df, short_period, column='current_price')  # 단기 지수 이평선 계산
    long_ema=EMA(df, long_period, column='current_price')    # 장기 지수 이평선 계산
    df[f'macd{short_period}_{long_period}']=short_ema-long_ema   # 이동평균 수렴/발산 계산
    df[f'signal{short_period}_{long_period}_{signal}']=EMA(df, signal, column=f'macd{short_period}_{long_period}') # 신호선 계산
    return df


def RSI(params, df):
    """ 상대적강도지수 (Relative Strength Index)

    Args:
        params (list): [period, index, weight]
        df (dataframe): 주식 데이터 프레임

    Returns:
        dataframe: 열 추가된 주식 데이터 프레임
    """
    period=params[0]
    delta=df['current_price'].diff(1)
    delta=delta.dropna()    # or delta[1:]

    up=delta.copy()
    down=delta.copy()
    up[up<0]=0
    down[down>0]=0
    df['up']=up
    df['down']=down

    avg_gain=df['up'].rolling(window=period).mean()
    avg_loss=abs(df['down'].rolling(window=period).mean())

    rs=avg_gain/avg_loss
    rsi=100.0-(100.0/(1.0+rs))
    df[f'rsi{period}']=rsi

    return df


def OBV(params, df):
    """ 거래량지표 (On-Balance Volumn)

    Args:
        params (list): [period, weight]
        df (dataframe): 주식 데이터 프레임

    Returns:
        dataframe: 열 추가된 주식 데이터 프레임
    """
    period=params[0]
    obv=[]
    obv.append(0)
    for i in range(1, len(df.current_price)):
        if df.current_price[i]>df.current_price[i-1]:
            obv.append(obv[-1]+df.volume[i])
        elif df.current_price[i]<df.current_price[i-1]:
            obv.append(obv[-1]-df.volume[i])
        else:
            obv.append(obv[-1])
    
    df[f'obv{period}']=obv
    df[f'obv_ema{period}']=df[f'obv{period}'].ewm(span=period).mean()  # 지수평균이동값
    return df


def MFI(params, df):
    """ 자금흐름지표 (Money Flow Index)

    Args:
        params (list): [period, index, weight]
        df (dataframe): 주식 데이터 프레임

    Returns:
        dataframe: 열 추가된 주식 데이터 프레임
    """
    typical_price=(df['current_price']+df['high_price']+df['low_price'])/3
    money_flow=typical_price*df['volume']
    positive_flow=[0]
    negative_flow=[0]
    for i in range(1, len(typical_price)):
        if typical_price[i]>typical_price[i-1]:
            positive_flow.append(money_flow[i-1])
            negative_flow.append(0)
        elif typical_price[i]<typical_price[i-1]:
            negative_flow.append(money_flow[i-1])
            positive_flow.append(0)
        else :
            positive_flow.append(0)
            negative_flow.append(0)
    
    period=params[0]
    positive_mf=[]
    negative_mf=[]

    for i in range(period-1):
        positive_mf.append(1)
        negative_mf.append(1)

    for i in range(period-1, len(positive_flow)):
        positive_mf.append(sum(positive_flow[i+1-period: i+1]))
    
    for i in range(period-1, len(negative_flow)):
        negative_mf.append(sum(negative_flow[i+1-period: i+1]))
    
    mfi=[]
    for i in range(len(positive_mf)):
        mfi.append(100*(1-negative_mf[i]/(negative_mf[i]+positive_mf[i])))
    df[f'mfi{period}']=mfi
    return df


def IKH(params, df): 
    # 일목균형표 (Ichimoku Kinkou Hyo)
    period9_max_price = df['high_price'].rolling(window=9).max()
    period9_min_price = df['low_price'].rolling(window=9).min()
    df['conversion_line'] = (period9_max_price + period9_min_price) /2   # 기준선 (conversion line)
    period26_max_price = df['high_price'].rolling(window=26).max()
    period26_min_price = df['low_price'].rolling(window=26).min()
    df['base_line'] = (period26_max_price + period26_min_price) / 2    # 기준선 (base line)
    df['leading_span1'] = ((df['conversion_line'] + df['base_line']) / 2).shift(26)    # 선행스팬1 (leading span 1)
    period52_max_price = df['high_price'].rolling(window=52).max()
    period52_min_price = df['low_price'].rolling(window=52).min()
    df['leading_span2'] = ((period52_max_price + period52_min_price) / 2).shift(26)    # 선행스팬1 (leading span 1)
    df['lagging_span'] = df['current_price'].shift(-26)     # 후행스팬 (lagging span)
    df['cloud']=df['leading_span1']-df['leading_span2']     # 구름층 
    
    return df
    # print('전환선: ',df['tenkan_sen'].iloc[-1])
    # print('기준선: ',df['kijun_sen'].iloc[-1])
    # print('후행스팬: ',df['chikou_span'].iloc[-27])
    # print('선행스팬1: ',df['senkou_span_a'].iloc[-1])
    # print('선행스팬2: ',df['senkou_span_b'].iloc[-1])
    # print('')


###########################################################################################

def rsi_high(params, df, index):
    """ RSI > 상향선 ?

    Args:
        params (list): [period, index, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    period=params[0]
    if df.iloc[1][f'rsi{period}']>params[1]:
        return params[2]
    return 0

def rsi_low(params, df, index):
    """ RSI < 하한선 ?

    Args:
        params (list): [period, index, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    period=params[0]
    if df.iloc[1][f'rsi{period}']<params[1]:
        return params[2]
    return 0


def obv_high(params, df, index):
    """ OBV > OBV 지수이평선 ?

    Args:
        params (list): [period, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    period=params[0]
    if df.iloc[1][f'obv{period}']>df.iloc[1][f'obv_ema{period}']:
        return params[1]
    return 0

def obv_low(params, df, index):
    """ OBV < OBV 지수이평선 ?

    Args:
        params (list): [period, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    period=params[0]
    if df.iloc[1][f'obv{period}']<df.iloc[1][f'obv_ema{period}']:
        return params[1]
    return 0

def ma_up_pass(params, df, index):
    """ 가격이 단순이평선을 상향 돌파 하는 경우

    Args:
        params (list): [period, err, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """

    window=params[0]
    if index+1<window or index==len(df)-1:
        return 0
    err=params[1]
    col = f'sma{window}'  # df 에서 가져올 col 이름 
    sma = df.iloc[1][col] 
    sma_err = (1+err/100)* sma  # 오차범위 값 지정
    if (df.iloc[1]['start_price'] < df.iloc[1]['current_price']):  # 양봉이어야함
        if(sma > df.iloc[1]['start_price'] and sma_err < df.iloc[1]['current_price']):
            return params[2]
    return 0
    
def ma_down_pass(params, df, index):
    """ 가격이 단순이평선을 하향 돌파 하는 경우

    Args:
        params (list): [period, err, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    window=params[0]
    if index<window or index==len(df)-1:
        return 0
    err=params[1]
    col = f'sma{window}'  # df 에서 가져올 col 이름 
    sma = df.iloc[1][col]  
    sma_err = (1-err/100)* sma  # 오차범위 값 지정
    if (df.iloc[1]['start_price'] > df.iloc[1]['current_price']):  # 음봉이어야함
        if(sma < df.iloc[1]['start_price'] and sma_err > df.iloc[1]['current_price']):
            return params[2]
    return 0
    
def  ma_golden_cross(params, df, index):
    """ MA 골든크로스

    Args:
        params (list): [short_period, long_period, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    # 골드크로스 인지? ma 교차되고, 교차된후 윈도우 작은게 위에있는지
    #       20>= 5   =>   5>20
    window1=params[0]
    window2=params[1]
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    if index<window2 or index==len(df)-1:
        return 0
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    y_sma1 = df.iloc[0][col1]
    y_sma2 = df.iloc[0][col2]
    t_sma1 = df.iloc[1][col1]
    t_sma2 = df.iloc[1][col2]
    if(y_sma2 >= y_sma1 and t_sma1 > t_sma2):
        return params[2]
    return 0
    
def  ma_dead_cross(params, df, index):
    """ MA 데드크로스

    Args:
        params (list): [short_period, long_period, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    # 데드크로스인지 => ma 교차되고, 교차된후 윈도우 작은게 아래에있는지
    #      5>= 20   =>   20>5
    window1=params[0]
    window2=params[1]
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    if index<window2 or index==len(df)-1:
        return 0
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    y_sma1 = df.iloc[0][col1]
    y_sma2 = df.iloc[0][col2]
    t_sma1 = df.iloc[1][col1]
    t_sma2 = df.iloc[1][col2]
    if(y_sma1 >= y_sma2 and t_sma2 > t_sma1):
        return params[2]
    return 0

def  ma_straight(params, df, index):
    """ MA 정배율

    Args:
        params (list): [short_period, long_period, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    window1=params[0]
    window2=params[1]
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    if index<window2 or index==len(df)-1:
        return 0
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    sma1 = df.iloc[1][col1]
    sma2 = df.iloc[1][col2]
    if sma1>sma2:
        return params[2]
    return 0

def  ma_reverse(params, df, index):
    """ MA 역배율

    Args:
        params (list): [short_period, long_period, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    window1=params[0]
    window2=params[1]
    if window2 < window1: # window1이 작은값이 되도록
        window1, window2 = window2, window1
    if index<window2 or index==len(df)-1:
        return 0
    col1 = f'sma{window1}'
    col2 = f'sma{window2}'
    sma1 = df.iloc[1][col1]
    sma2 = df.iloc[1][col2]
    if sma2>sma1:
        return params[2]
    return 0


def macd_golden_cross(params, df, index):
    """ MACD 골든크로스

    Args:
        params (list): [short_period, long_period, signal, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    macd=f'macd{params[0]}_{params[1]}'
    signal=f'signal{params[0]}_{params[1]}_{params[2]}'
    if df.iloc[0][signal]<=df.iloc[0][signal] and df.iloc[1][macd]>df.iloc[1][signal]:
        return params[3]
    return 0


def macd_dead_cross(params, df, index):
    """ MACD 데드크로스

    Args:
        params (list): [short_period, long_period, signal, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    macd=f'macd{params[0]}_{params[1]}'
    signal=f'signal{params[0]}_{params[1]}_{params[2]}'
    if df.iloc[0][signal]>=df.iloc[0][signal] and df.iloc[1][macd]<df.iloc[1][signal]:
        return params[3]
    return 0

def macd_straight(params, df, index):
    """ MACD 정배율

    Args:
        params (list): [short_period, long_period, signal, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    macd=f'macd{params[0]}_{params[1]}'
    signal=f'signal{params[0]}_{params[1]}_{params[2]}'
    if df.iloc[1][macd]>df.iloc[1][signal]:
        return params[3]
    return 0


def macd_reverse(params, df, index):
    """ MACD 역배율

    Args:
        params (list): [short_period, long_period, signal, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    macd=f'macd{params[0]}_{params[1]}'
    signal=f'signal{params[0]}_{params[1]}_{params[2]}'
    if df.iloc[1][macd]<df.iloc[1][signal]:
        return params[3]
    return 0

def mfi_high(params, df, index):
    """ MFI > 상한선 ?

    Args:
        params (list): [period, index, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    if df.iloc[1][f'mfi{params[0]}']>params[1]:
        return params[2]
    return 0

def mfi_low(params, df, index):
    """ MFI < 하한선 ?

    Args:
        params (list): [period, index, weight]
        df (dataframe): 주식 데이터 프레임
        index (int): 몇번째 행인지

    Returns:
        int: 조건에 만족하면 가중치, 아니면 0
    """
    if index<params[1] or index==len(df)-1:
        return 0
    if df.iloc[1][f'mfi{params[0]}']<params[1]:
        return params[2]
    return 0


def ikh_straight(params, df, index):
    if index<26 or index==len(df)-1:
        return 0
    count=params[0]
    # flag=true
    if count>=3:
        if not(df.iloc[1]['current_price']<df.iloc[1]['conversion_line']<df.iloc[1]['base_line']):
            return 0
    if count>=4:
        if not(df.iloc[1]['lagging_span']<df.iloc[1]['current_price']):
            return 0
    if count>=5:
        if index<52 or not(df.iloc[1]['current_price']<df.iloc[1]['cloud']):
            return 0

    return params[1]


def ikh_reverse(params, df, index):
    if index<26 or index==len(df)-1:
        return 0
    count=params[0]
    # flag=true
    if count>=3:
        if not(df.iloc[1]['current_price']>df.iloc[1]['conversion_line']>df.iloc[1]['base_line']):
            return 0
    if count>=4:
        if not(df.iloc[1]['lagging_span']>df.iloc[1]['current_price']):
            return 0
    if count>=5:
        if index<52 or not(df.iloc[1]['current_price']>df.iloc[1]['cloud']):
            return 0

    return params[1]