from bt_common import *
from bt_hs import *
# 101 : ma_uppass (window, err, weight)             # 종가가 window를 걸쳐 상향돌파, 일반적으로 매수
# 102 : ma_downpass (window, err, weight)           # 종가가 window를 걸쳐 하향돌파, 일반적으로 매도
# 103 : ma_gold_cross (window1, window2, weight)    # window 중 작은 값이 교차후 위로, 일반적으로 매수
# 104 : ma_dead_cross (window1, window2, weight)    # window 중 작은 값이 교차후 아래로, 일반적으로 매도
# 105 : ma_straight (window1, window2, weight)      # window 중 작은 값이 위에, 일반적으로 매수
# 106 : ma_reverse (window1, window2, weight)       # window 중 작은 값이 아래에, 일반적으로 매도
# 201 : macd_gold_cross (window1, window2, weight)  # window 중 작은 값이 교차후 위로, 일반적으로 매수
# 202 : macd_dead_cross (window1, window2, weight)  # window 중 작은 값이 교차후 아래로, 일반적으로 매도
# 203 : macd_straight (window1, window2, weight)    # window 중 작은 값이 위에, 일반적으로 매수
# 204 : macd_reverse (window1, window2, weight)     # window 중 작은 값이 아래에, 일반적으로 매도
# 301 : rsi_high (window1, window2, index, weight)  # rsi > index, 일반적으로 과매수 됐다고 평가 -> 매도
# 302 : rsi_low  (window1, window2, index, weight)  # rsi < index, 일반적으로 과매도 됐다고 평가 -> 매수
# 401 : obv_high  (window, weight)                  # obv > ovb_ema이면 일반적으로 매수
# 402 : obv_low  (window, weight)                   # obv < ovb_ema이면 일반적으로 매도

# Initial Settings
account = {
    "balance":1000000,
    "stocks":{
    }
}

# 백테스트
def backtest(account, buy_condition, sell_condition, code, start, end):
    """백테스트

    Args:
        account (dictionary): _description_
        buy_condition (List): _description_
        sell_condition (List): _description_
    """
    # 정해진 기간의 백테스트 자료 가져오기
    df = get_stock_data(code, start, end)
    # dataframe으로 전환
    df = object_to_dataframe(df)
    
    # 기준이 되는 점수 초기화
    buy_standard = buy_condition[-1]
    sell_standard = sell_condition[-1]
    
    # 조건확인하여 필요한 Column 갱신
    for cond in buy_condition[0:-1]:  # 매수
            pass
        
    for cond in buy_condition[0:-1]:  # 매도
            pass
    
    # 백테스트 시작
    for i in range(len(df)):
        # 매수, 매도
        total_weight = 0
        if(len(account["stocks"])==0):  # 매수
            for strategy in buy_condition[0:-1]:
                if "101" in strategy[0]:
                    total_weight += ma_up_pass(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "102" in strategy[0]:
                    total_weight += ma_down_pass(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "103" in strategy[0]:
                    total_weight += ma_gold_cross(strategy[1], strategy[2], strategy[3], df.iloc[i-1:i+1])
                elif "104" in strategy[0]:
                    total_weight += ma_dead_cross(strategy[1], strategy[2], strategy[3], df.iloc[i-1:i+1])
                elif "105" in strategy[0]:
                    total_weight += ma_straight(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "106" in strategy[0]:
                    total_weight += ma_reverse(strategy[1], strategy[2], strategy[3], df.iloc[i]) 
                elif "201" in strategy[0]:
                    total_weight += macd_gold_cross(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "202" in strategy[0]:
                    total_weight += macd_dead_cross(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "203" in strategy[0]:
                    total_weight += macd_straight(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "204" in strategy[0]:
                    total_weight += macd_reverse(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "301" in strategy[0]:
                    total_weight += rsi_high(strategy[1], strategy[2], strategy[3], strategy[4], df.iloc[i])
                elif "302" in strategy[0]:
                    total_weight += rsi_low(strategy[1], strategy[2], strategy[3], strategy[4], df.iloc[i])
                elif "401" in strategy[0]:
                    total_weight += obv_high(strategy[1], strategy[2], df.iloc[i-1:i+1])
                elif "402" in strategy[0]:
                    total_weight += obv_low(strategy[1], strategy[2], df.iloc[i-1:i+1])
                
            if total_weight> buy_standard:
               account = buy(account,code,df.iloc[i], 100, df.iloc[i]["date"], "이름")
            
        else:  # 매도
            for strategy in sell_condition[0:-1]:
                if "101" in strategy[0]:
                    total_weight += ma_up_pass(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "102" in strategy[0]:
                    total_weight += ma_down_pass(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "103" in strategy[0]:
                    total_weight += ma_gold_cross(strategy[1], strategy[2], strategy[3], df.iloc[i-1:i+1])
                elif "104" in strategy[0]:
                    total_weight += ma_dead_cross(strategy[1], strategy[2], strategy[3], df.iloc[i-1:i+1])
                elif "105" in strategy[0]:
                    total_weight += ma_straight(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "106" in strategy[0]:
                    total_weight += ma_reverse(strategy[1], strategy[2], strategy[3], df.iloc[i]) 
                elif "201" in strategy[0]:
                    total_weight += macd_gold_cross(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "202" in strategy[0]:
                    total_weight += macd_dead_cross(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "203" in strategy[0]:
                    total_weight += macd_straight(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "204" in strategy[0]:
                    total_weight += macd_reverse(strategy[1], strategy[2], strategy[3], df.iloc[i])
                elif "301" in strategy[0]:
                    total_weight += rsi_high(strategy[1], strategy[2], strategy[3], strategy[4], df.iloc[i])
                elif "302" in strategy[0]:
                    total_weight += rsi_low(strategy[1], strategy[2], strategy[3], strategy[4], df.iloc[i])
                elif "401" in strategy[0]:
                    total_weight += obv_high(strategy[1], strategy[2], df.iloc[i-1:i+1])
                elif "402" in strategy[0]:
                    total_weight += obv_low(strategy[1], strategy[2], df.iloc[i-1:i+1])   
            if total_weight> sell_standard:
                account = sell(account,code,df.iloc[i], 100, df.iloc[i]["date"], "이름")
    
    