from common import *
from strategy import *
import sys

# front로부터 받는 전략
# 공통 파라미터 
# code_number, balance, start_date, end_date
# 개별 파라미터
# buy_condition(매수전략들, standard, percent), sell_condition(매도전략들, standard, percent) - 매수/매도 전략 개별로 추가
# ex) 매수/매도전략 : [101, 5, 5, 30]   : 전략번호, 파라미터들 쭉 (파라미터 개수 달라도 ㄱㅊ)
# ex) buy_condition : [ [101, 5, 5, 30], [307, 20, 30, 10, 40], 60, 100 ]

# 이동평균선(MA): 연속된 특정 기간동안 종가 평균, 이평선, ex) 5일선, 20일선, 60일선, 120일선, 240일선
# 지수이동평균선(EMA): 최근 주가 흐름에 더 많은 가중치를 둔 이동평균선
# 이동평균수렴/발산(MACD): 두 이평선간의 차이를 하나의 지표로 이용, 단기선-장기선, EMA 사용 ex) 단기:12일, 장기:26일, 신호선:9일
# 상대적강도지수(RSI): 주가의 과매수 또는 과매도 상태를 평가하기 위한 방법, 높으면 과매수 상태, 낮으면 과매도 상태, EMA 사용, ex) 14일, 20이하, 80이상
# 거래량균형(OBV): 주식 거래량 흐름 사용 ex) 20일

# 상향돌파(up_pass) : 종가가 period를 걸쳐 상향돌파하는 상황, 매수
# 하향돌파(up_pass) : 종가가 period를 걸쳐 하향돌파하는 상황, 매도
# 골든크로스(golden_cross) : 단기선<장기선 이다가 교차후 단기선>장기선, 매수
# 데드크로스(dead_cross) : 단기선>장기선 이다가 교차후 단기선<장기선, 매도
# 정배열(straight): 단기>장기, 매수
# 역배열(reverse): 단기<장기, 매도
# high, low는 단순 비교, 그때그때 다름, (아래 307, 308, 407, 408 주석 참고)

# 101 : ma_up_pass (period, err, weight)                        # 오차범위<종가
# 102 : ma_down_pass (period, err, weight)                      # 오차범위>종가
# 103 : ma_golden_cross (short_period, long_period, weight)
# 104 : ma_dead_cross (short_period, long_period, weight)
# 105 : ma_straight (short_period, long_period, weight)
# 106 : ma_reverse (short_period, long_period, weight)
# 203 : macd_golden_cross (short_period, long_period, signal, weight)
# 204 : macd_dead_cross (short_period, long_period, signal, weight)
# 205 : macd_straight (short_period, long_period, signal, weight)
# 206 : macd_reverse (short_period, long_period, signal, weight)
# 307 : rsi_high (short_period, long_period, index, weight)     # rsi>index, 과매수 됐다고 평가 -> 매도
# 308 : rsi_low  (short_period, long_period, index, weight)     # rsi<index, 과매도 됐다고 평가 -> 매수
# 407 : obv_high  (period, weight)                              # obv>ovb_ema, 매수
# 408 : obv_low  (period, weight)                               # obv<ovb_ema, 매도

# Initial Settings
account = {
    "balance":1000000,
    "stocks":{
    }
}

strategy_name_dict={
    101: 'ma_up_pass', 102: 'ma_down_pass', 103: 'ma_golden_cross', 104: 'ma_dead_cross', 105: 'ma_straight', 106: 'ma_reverse',
    203: 'macd_golden_cross', 204: 'macd_dead_cross', 205: 'macd_straight', 206: 'macd_reverse',
    307: 'rsi_high', 308: 'rsi_low',
    407: 'obv_high', 408: 'obv_low'
}

strategy_indicator_dict={
    101: 'SMA', 102: 'SMA', 103: 'SMA', 104: 'SMA', 105: 'SMA', 106: 'SMA',
    203: 'MACD', 204: 'MACD', 205: 'MACD', 206: 'MACD',
    307: 'RSI', 308: 'RSI',
    407: 'OBV', 408: 'OBV'
}

def call_strategy_by_code(strategy_code, strategy_params, df):
    """ 코드로 전략 실행하는 함수 : 동적으로 함수 호출, 호출할 함수 이름과 일치해야함

    Args:
        strategy_code (int): 전략코드   101
        strategy (list): 전략 파라미터가 담긴 리스트   [101, 5, 5, 30]
        df (dataFrame): 주식 데이터프레임

    Returns:
        int: 매매조건이 맞으면 가중치만큼, 안맞으면 0
    """
    return getattr(sys.modules[__name__], strategy_name_dict[strategy_code])(strategy_params, df)

def add_indicator_by_code(strategy_code, strategy_params, df):
    """ 코드로 지표 추가하는 함수 : 동적으로 함수 호출

    Args:
        strategy_code (int): 전략코드   101
        strategy (list): 전략 파라미터가 담긴 리스트   [101, 5, 5, 30]
        df (dataFrame): 주식 데이터프레임

    Returns:
        dataFrame: 컬럼 추가된 주식 데이터프레임
    """
    return getattr(sys.modules[__name__], strategy_indicator_dict[strategy_code])(strategy_params, df)


def backtest(account, code_number, start_date, end_date, buy_condition, sell_condition):
    """백테스트

    Args:
        account (dict)): 잔액, 보유 주식    {"balance":1000000, "stocks":{}}
        code_number (string): 주식 종목 코드    '005930'
        start_date (string): 시작 날짜  '1995-05-02'
        end_date (string): 종료 날짜    '2022-03-24' 
        buy_condition (list): 매수 조건 (매수 전략들, 기준점수, 매매비율)   [ [101, 5, 5, 30], [307, 20, 30, 10, 40], 60, 100 ]
        sell_condition (list): 매도 조건 (매도 전략들, 기준점수, 매매비율)   [ [102, 5, 4, 20], 20, 90 ]
    """
    # 정해진 기간의 백테스트 자료 가져오기
    df = get_day_stock(code_number, start_date, end_date)
    # dataframe으로 전환
    df = object_to_dataframe(df)
    
    # 기준이 되는 점수 초기화
    buy_standard = buy_condition[-1]
    sell_standard = sell_condition[-1]

    # =====필요한 결과값들 init
    # result_data = init_result_data(account)
    
    # 조건확인하여 필요한 Column 갱신
    buy_option=""
    sell_option=""
    for cond in buy_condition[0:-2]:  # 매수
        buy_option+=strategy_name_dict[cond[0]]+" "
        df=add_indicator_by_code(cond[0], cond[1:], df)

    for cond in buy_condition[0:-2]:  # 매도
        sell_option+=strategy_name_dict[cond[0]]+" "
        df=add_indicator_by_code(cond[0], cond[1:], df)
    
   

    # 백테스트 시작
    for i in range(len(df)):
        
        # 매수, 매도
        total_weight=0
        flag=True     # 매수 먼저
        if flag:  # 매수
            for cond in buy_condition[0:-2]:    # 마지막 파라미터 2개 제외, 전략들만
                total_weight+=call_strategy_by_name(cond[0], cond[1:], df[i-1:i+1])
            if total_weight>=buy_condition[-2]:      # 기준선 이상이면 매수
               account = buy(account, code_number, df[i]['current_price'], buy_condition[-1], df[i]["date"], buy_option)  

        else:       # 매도
            for cond in sell_condition[0:-2]:
                total_weight+=call_strategy_by_name(cond[0], cond[1:], df[i-1:i+1])
            if total_weight>=sell_condition[-2]:      # 기준선 이상이면 매도
               account = buy(account, code_number, df[i]['current_price'], sell_condition[-1], df[i]["date"], sell_option)  
        flag=not flag   # 매수, 매도 번갈아가며
        
        # =====매일마다 계산
        # result_data = day_calculate(account, result_data, df[i])

    # 최종 계산
    # result_data = end_calculate(account, result_data)
    print("===================================================")
    # print(result_data)


code_number='005930'
start_date='1995-05-02'
end_date='2022-03-23' 
buy_condition=[ [101, 5, 5, 30], [307, 20, 30, 10, 40], 60, 100 ]
sell_condition=[ [102, 5, 5, 30], [308, 20, 30, 10, 40], 60, 100 ]
backtest(account, code_number, start_date, end_date, buy_condition, sell_condition)

