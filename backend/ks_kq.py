# 코스피 지수 코스닥 지수

"""
코스피 지수

종가가 ma기준(err)보다 위에 있는지 

종가기준으로 사면 수익이 많이 안나.....

종가와 시가 중간 값으로 사고 슬리피지

종가> 구매가 >ma5 

시가 ? 그전날 종가 이익 손해

ks_straight(param, index; 현재행의 인덱스)
    params(list) : window, err, weight

"""
def ks_straight(params, df, index):
    """코스피 이평선보다 코스피지수 위에 있어야함

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
    col = f'ks_ma{window}'  # df 에서 가져올 col 이름 
    ks_ma = df.iloc[1][col] 
    ks_err = (1 + err/100) * ks_ma  # 오차범위 값 지정
    if (df.iloc[1]['ks_open'] < df.iloc[1]['ks_close']):  # 양봉이어야함
        if(ks_err < df.iloc[1]['ks_open']):
            return params[2]
    return 0

def ks_reverse(params, df, index):
    """코스피 이평선보다 코스피지수 아래에 있어야함

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
    col = f'ks_ma{window}'  # df 에서 가져올 col 이름 
    ks_ma = df.iloc[1][col] 
    ks_err = (1 + err/100) * ks_ma  # 오차범위 값 지정
    if (df.iloc[1]['ks_open'] > df.iloc[1]['ks_close']):  # 양봉이어야함
        if(ks_err > df.iloc[1]['ks_open']):
            return params[2]
    return 0

def kq_straight(params, df, index):
    """코스닥 이평선보다 코스닥지수 위에 있어야함

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
    col = f'kq_ma{window}'  # df 에서 가져올 col 이름 
    kq_ma = df.iloc[1][col] 
    kq_err = (1 + err/100) * kq_ma  # 오차범위 값 지정
    if (df.iloc[1]['kq_open'] < df.iloc[1]['kq_close']):  # 양봉이어야함
        if(kq_err < df.iloc[1]['kq_open']):
            return params[2]
    return 0

def kq_reverse(params, df, index):
    """코스닥 이평선보다 코스닥지수 아래에 있어야함

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
    col = f'kq_ma{window}'  # df 에서 가져올 col 이름 
    kq_ma = df.iloc[1][col] 
    kq_err = (1 + err/100) * kq_ma  # 오차범위 값 지정
    if (df.iloc[1]['kq_open'] > df.iloc[1]['kq_close']):  # 양봉이어야함
        if(kq_err > df.iloc[1]['kq_open']):
            return params[2]
    return 0