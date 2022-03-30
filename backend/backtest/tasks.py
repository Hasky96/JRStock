from __future__ import absolute_import, unicode_literals

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'JRstock.settings')

import django
django.setup()

from celery import shared_task
from .common import *

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

@shared_task
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
    try:
        df = get_day_stock(code_number, start_date, end_date)

        # =====필요한 결과값들 init
        result_data = init_result_data(account, len(df))
        
        # 조건확인하여 필요한 Column 갱신
        buy_option = ""
        sell_option = ""
        for cond in buy_condition[0:-2]:  # 매수
            buy_option += strategy_name_dict[cond[0]] + " "
            df = add_indicator_by_code(cond[0], cond[1:], df)

        for cond in sell_condition[0:-2]:  # 매도
            sell_option += strategy_name_dict[cond[0]] + " "
            df = add_indicator_by_code(cond[0], cond[1:], df)


        flag = True     # 매수 먼저
        # 백테스트 시작
        for i in range(0, len(df)):
            total_weight = 0
            if flag:  # 매수
                for cond in buy_condition[0:-2]:    # 마지막 파라미터 2개 제외, 전략들만
                    total_weight += call_strategy_by_code(cond[0], cond[1:], df.loc[i-1:i], i)
                    
                    # =============== 해당되는 전략들의 이름만 넣기
                    # =============== 이름을 한글화한 목록을 추가해서 그걸 넣기
                    
                if total_weight >= buy_condition[-2]:      # 기준선 이상이면 매수
                    account = buy(account, code_number, df.loc[i]['current_price'], buy_condition[-1], df.loc[i]["date"], buy_option)  
                    flag = False    # 매수, 매도 번갈아가며

            else:       # 매도
                for cond in sell_condition[0:-2]:
                    total_weight += call_strategy_by_code(cond[0], cond[1:], df.loc[i-1:i], i)
                if total_weight >= sell_condition[-2]:      # 기준선 이상이면 매도
                    account = sell(account, code_number, df.loc[i]['current_price'], sell_condition[-1], df.loc[i]["date"], sell_option)
                    result_data['win_lose_cnt'] += 1
                    flag = True

            # =====매일마다 계산
            result_data = day_calculate(account, result_data, df.loc[i])

        # 최종 계산
        create_database(account)
        end_calculate(account, result_data)
        account['user'].is_backtest = False
        account['user'].save()
    except Exception as e:
        account['result'].delete()
        account['user'].is_backtest = False
        account['user'].save()
        
        message = account['user'].name + '님이 요청한 백테스트 진행 중 에러 : ' + str(e)
        return message

    message = account['user'].name + '님이 요청한 백테스트 완료'
    return message