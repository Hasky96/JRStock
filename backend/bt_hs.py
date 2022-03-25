
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

