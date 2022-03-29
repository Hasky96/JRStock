import pandas as pd
from datetime import datetime, timedelta

import sys

from .models import BuySell, DayHistory, YearHistory
from .serializers import BuySellSerializer, ConditionInfoSerializer, DayHistorySerialilzer, ResultSerializer, YearHistorySerialilzer
from strategy import *

from stock.models import DayStock, FinancialInfo, BasicInfo

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

    # =====필요한 결과값들 init
    result_data = init_result_data(account, len(df))
    
    # 조건확인하여 필요한 Column 갱신
    buy_option = ""
    sell_option = ""
    for cond in buy_condition[0:-2]:  # 매수
        buy_option += strategy_name_dict[cond[0]] + " "
        df = add_indicator_by_code(cond[0], cond[1:], df)

    for cond in buy_condition[0:-2]:  # 매도
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
    return end_calculate(account, result_data)

def call_strategy_by_code(strategy_code, strategy_params, df, index):
    """ 코드로 전략 실행하는 함수 : 동적으로 함수 호출, 호출할 함수 이름과 일치해야함

    Args:
        strategy_code (int): 전략코드   101
        strategy (list): 전략 파라미터가 담긴 리스트   [101, 5, 5, 30]
        df (dataFrame): 주식 데이터프레임

    Returns:
        int: 매매조건이 맞으면 가중치만큼, 안맞으면 0
    """
    return getattr(sys.modules[__name__], strategy_name_dict[strategy_code])(strategy_params, df, index)

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

def get_day_stock(code_number, start_date, end_date):
    """ 주식 select 함수

    Args:
        code_number (String): DB에서 불러올 주식 코드 번호
        start_date (String): 시작 날짜
        end_date (String): 종료 날짜

    Returns:
        DataFrame : N rows * 12 columns
    """

    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date__gte=start_date).filter(date__lte=end_date)
    
    # financial_info = FinancialInfo.objects.get(pk=code_number)  # 재무제표
    day_stock_list = list(day_stock_list)
    
    col_name = ['code_number','current_price','changes','chages_ratio','start_price','high_price', 'low_price', \
    'volume','trade_price','market_cap','stock_amount','date']
    stock_list=[]
    for stock in day_stock_list:
        temp=[]
        temp.append(stock.code_number)
        temp.append(float(stock.current_price))
        temp.append(float(stock.changes))
        temp.append(float(stock.chages_ratio))
        temp.append(float(stock.start_price))
        temp.append(float(stock.high_price))
        temp.append(float(stock.low_price))
        temp.append(int(stock.volume))
        temp.append(int(stock.trade_price))
        temp.append(int(stock.market_cap))
        temp.append(int(stock.stock_amount))
        temp.append(stock.date)
        stock_list.append(temp)
    
    return pd.DataFrame(stock_list, columns=col_name) 

def buy(account, code, price, percent, date, option):
    """주식구매 함수

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        code (String): 매수하고자 하는 주식 코드
        price (Integer): 매수하는 가격
        percent (Integer): 현금자산의 몇 퍼센트의 비중으로 매수할지
        date (String): 기준 날짜
        option (String): 사용한 방법

    Returns:
        구매 완료시 수정된 현금 재산과 보유주식목록 딕셔너리 반환
        실패시 False 반환 -> 현재 account 반환
    """
    stock_amount = int((account['balance'] * percent/100) // price)
    if stock_amount * price * account['commission'] > account['balance']: 
        stock_amount -= 1
    buy_price =stock_amount * price * account['commission'] # 수수료포함가격
    if buy_price == 0: # 못사는경우
        # print("구매가 불가합니다. 잔액부족")
        return account
    account['balance'] -= buy_price # 구매후 가격 갱신
    
    # 구매한 주식이 보유 목록에 있다면
    if code in account['stocks'].keys():
        info = account['stocks'][code]
        account['stocks'][code]['avg_price'] = int((info['amount'] * info['avg_price'] + price*stock_amount) // (info['amount']+ stock_amount)) # 평단가 갱신 
        account['stocks'][code]['amount'] += stock_amount
    # 없다면
    else:
        account['stocks'][code] = {"amount":stock_amount, "avg_price":price}
        
    # 현재 자산 계산
    current_asset = int(account['balance'])
    current_asset += (int(price) * int(account['stocks'][code]['amount']))
    
    earn_rate = (current_asset - account['start_price']) / account['start_price']
    earn_rate = round(earn_rate * 100, 3)
    name = account['company_name']
    
    account['buy_sell_list'].append(BuySell(result=account['result'], 
        date=date, isBuy=True, buy_sell_option=option, company_name=name, company_code=code, stock_amount=stock_amount,
        stock_price=price, current_rate=earn_rate, current_asset=current_asset))
    
    # print(f'매수알림 : {option}에 의해{name}({code}) 주식 {price} 가격에 {stock_amount:,}주 매수 == 현재 자산 {current_asset} 총 수익률 {earn_rate}')
    return account

# 이름도 같이 받아서 DB 접근 횟수 줄이기 가능할듯
def sell(account, code, price, percent, date, option):
    """주식구매 함수

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        code (String): 매도하고자 하는 주식 코드
        price (Integer): 매도하는 가격
        percent (Integer): 보유주식수의 몇 퍼센트의 비중으로 매도할지
        date (String): 기준 날짜
        option (String): 사용한 방법

    Returns:
        구매 완료시 수정된 현금 재산과 보유주식목록 딕셔너리 반환
        실패시 False 반환 -> 현재 account 반환
    """
    if code not in account['stocks'].keys():
        # print("판매가 불가능합니다. 보유한 주식수보다 작습니다.")
        return account
    stock_amount = int(account['stocks'][code]['amount'] * percent / 100)
    if stock_amount == 0:
        # print("현재 비율로는 판매가 불가능")
        return account
    
    account['balance'] += int(price * stock_amount * account['commission']) #수수료포함 가격
    account['stocks'][code]['amount'] -= stock_amount
    
    current_asset = int(account['balance'])
    if account['stocks'][code]['amount'] == 0:
        avg = account['stocks'][code]['avg_price']
        del account['stocks'][code]
    else: current_asset += (int(price) * int(account['stocks'][code]['amount']))
            
    earn_rate = (current_asset - account['start_price']) / account['start_price']
    earn_rate = round(earn_rate * 100, 3)
    name = account['company_name']
    
    # 승패여부
    if not code in account['stocks'].keys():
        if avg < price:
            win_or_lose = True
            account['win_cnt'] += 1
        else: win_or_lose = False
    else:
        if account['stocks'][code]['avg_price'] < price:
            win_or_lose = True
            account['win_cnt'] += 1
        else: win_or_lose = False
        
    account['buy_sell_list'].append(BuySell(result=account['result'], 
        date=date, isBuy=False, buy_sell_option=option, company_name=name, company_code=code, stock_amount=stock_amount,
        stock_price=price, current_rate=earn_rate, current_asset=current_asset, isWin=win_or_lose))
    
    # print(f'매도알림 : {option}에 의해{name}({code}) 주식 {price} 가격에 {stock_amount:,}주 매도 == 현재 자산 {current_asset} 총 수익률 {earn_rate} 승패여부{win_or_lose}')
    return account

def get_stock_data(code_number, date):
    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date=date)
    
    return day_stock_list[0]
    
def get_stock_name_by_code(code_number):
    stock=BasicInfo.objects.get(pk=code_number)
    return stock.company_name

def get_stock_price(code_number, date):
    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date=date)
    if day_stock_list.count() == 0:
        return None
    return day_stock_list[0].current_price

def get_kospi_price_by_date(date):
    cnt = 0
    kospi_price = None
    while kospi_price == None:
        cnt += 1
        yesterday = datetime.strptime(date, '%Y-%m-%d') - timedelta(days=cnt)
        yesterday = yesterday.strftime('%Y-%m-%d')
        kospi_price = get_stock_price('kospi', yesterday)
    
    return kospi_price

def make_condition(result, isBuy, strategies, standard, ratio):
    db_input = []   # DB에 저장하기 위한 리스트
    condition = []  # 리턴하기 위한 리스트
    for conditions in strategies:
        option = []
        buy_sell_option = strategy_name_dict[int(conditions.get('strategy'))]
        params = ""
        option.append(int(conditions.get('strategy')))
        for param in conditions.get('params').values():
            if param:
                params += param + " "
                option.append(int(param))
        weight = conditions.get('weight')
        option.append(int(conditions.get('weight')))
        condition.append(option)
        
        condition_info = {
            'result' : result.id,
            'isBuy' : isBuy,
            'buy_sell_option' : buy_sell_option,
            'params' : params,
            'weight' : weight,
        }
        db_input.append(condition_info)
    
    # DB 접근은 한 번만해서 정보 넣기
    serializer = ConditionInfoSerializer(data=db_input, many=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        
    condition.append(int(standard))
    condition.append(int(ratio))
    
    return condition

def init_result_data(account, trading_days):
    result_data = {
        'trading_days': trading_days, # 총 거래일수
        'year' : account['start_date'][:4], # 연도 저장
        'year_start_price' : account['balance'], # 시작가격
        'market_year_start_price' : float(get_kospi_price_by_date(account['start_date'])),
        'avg_day_earn_rate' : 0.0, # 일평균 수익률
        'avg_year_earn_rate' : 0.0, # 연평균 수익률
        'year_cnt' : 0, # 총 연도 수
        'max_earn' : account['balance'], # 최고 수익
        'max_date' : datetime.strptime(account['start_date'], '%Y-%m-%d'), # 최고 수익 날짜
        'min_earn' : account['balance'], # 최저 수익
        'min_earn_after_max' : account['balance'], # 최고 수익 이후 최저 수익
        'start_kospi_price' : get_kospi_price_by_date(account['start_date']), # 시작날짜 코스피 가격
        'end_kospi_price' : get_kospi_price_by_date(account['end_date']), # 종료날자 코스피 가격
        'win_lose_cnt' : 0, # 판매 횟수
    }
    return result_data

# 하루마다 계산할 것
def day_calculate(account, result_data, stock):
    result_data['current_asset'] = int(account['balance'])
    for code_num in account['stocks'].keys():
        cur_price = get_stock_price(code_num, stock['date'])
        result_data['current_asset'] += (int(cur_price) * int(account['stocks'][code_num]['amount']))
    
    if result_data['max_earn'] < result_data['current_asset']:
        result_data['max_earn'] = result_data['current_asset']
        result_data['max_date'] = datetime.strptime(stock['date'], '%Y-%m-%d')
        
    if result_data['min_earn'] > result_data['current_asset']:
        result_data['min_earn'] = result_data['current_asset']
        min_date = datetime.strptime(stock['date'], '%Y-%m-%d')
        if result_data['max_date'] < min_date:
            result_data['min_earn_after_max'] = result_data['current_asset']
            
    result_data['min_earn'] = min(result_data['min_earn'], result_data['current_asset'])
    
    day_earn = (result_data['current_asset'] - account['pre_price'])
    day_earn_rate = day_earn / account['pre_price']
    day_earn_rate = round(day_earn_rate * 100, 3)
    account['pre_price'] = result_data['current_asset']
    
    # 연도가 바뀌었다면
    if result_data['year'] != stock['date'][:4]:
        result_data = year_calculate(account, result_data, stock['date'])
        result_data['year'] = stock['date'][:4] # 연도 변경
    
    result_data['avg_day_earn_rate'] += day_earn_rate # 일평균 누적
    account['day_history_list'].append(DayHistory(result=account['result'], date=stock['date'], day_earn_rate=day_earn_rate, day_earn=day_earn, current_asset=result_data['current_asset']))
    # print('일수익률 : ' + str(day_earn_rate) + '|| 일손익 : ' + str(day_earn) + '|| 현재 자산 : ' + str(result_data['current_asset']) + '|| 날짜 : ' + str(stock['date']))
    return result_data

def year_calculate(account, result_data, date):
    year_earn_rate = round((result_data['current_asset'] - result_data['year_start_price']) / result_data['year_start_price'] * 100, 3)
    market_current_price = float(get_kospi_price_by_date(date))
    market_year_rate = round((market_current_price - result_data['market_year_start_price']) / result_data['market_year_start_price'] * 100, 3)
    
    account['year_history_list'].append(YearHistory(result=account['result'], 
        year=result_data['year'], year_rate=year_earn_rate, market_rate=market_year_rate))
    # print(result_data['year'] + '년 평균' + str(year_earn_rate) + '|| 시장연평균 :' + str(market_year_rate))
    
    result_data['year_cnt'] += 1
    result_data['avg_year_earn_rate'] = round((result_data['avg_year_earn_rate'] + year_earn_rate) / result_data['year_cnt'], 3)
    result_data['year_start_price'] = result_data['current_asset']
    result_data['market_year_start_price'] = market_current_price
    
    return result_data

def create_database(account):
    # 매수매도내역 DB에 저장
    BuySell.objects.bulk_create(account['buy_sell_list'])
        
    # 일일데이터 저장
    DayHistory.objects.bulk_create(account['day_history_list'])
        
    # 연데이터 저장
    YearHistory.objects.bulk_create(account['year_history_list'])

def end_calculate(account, result_data): 
    # 마지막 날을 기준으로 마지막 연도 평균 계산
    result_data = year_calculate(account, result_data, account['end_date'])
    
    result_data['my_profit_loss'] = int(account['pre_price']) - int(account['start_price'])
    result_data['my_final_rate'] = round(result_data['my_profit_loss'] / int(account['start_price']) * 100, 3)
    result_data['market_rate'] = round((float(result_data['end_kospi_price']) - float(result_data['start_kospi_price'])) / float(result_data['start_kospi_price']) * 100, 3)
    result_data['market_over_price'] = round(result_data['my_final_rate'] - result_data['market_rate'], 3)
    result_data['mdd'] = round((result_data['min_earn_after_max'] - result_data['max_earn']) / result_data['max_earn'] * 100, 3)
    result_data['avg_day_earn_rate'] = round(result_data['avg_day_earn_rate'] / result_data['trading_days'], 3)
    max_earn_rate = round((result_data['max_earn'] - account['start_price']) / account['start_price'] * 100, 3)
    min_earn_rate = round((result_data['min_earn'] - account['start_price']) / account['start_price'] * 100, 3)
    
    if account['win_cnt'] == 0 or result_data['win_lose_cnt'] == 0:
        win_lose_rate = 0
    else: win_lose_rate = round(account['win_cnt'] / result_data['win_lose_cnt'] * 100, 3)
    
    input_data = {
        'title' : account['result'].title,
        'asset' : account['result'].asset,
        'test_start_date' : account['result'].test_start_date,
        'test_end_date' : account['result'].test_end_date,
        'commission' : account['result'].commission,
        'buy_standard' : account['result'].buy_standard,
        'buy_ratio' : account['result'].buy_ratio,
        'sell_standard' : account['result'].sell_standard,
        'sell_ratio' : account['result'].sell_ratio,
        'avg_day_earn_rate' : result_data['avg_day_earn_rate'],
        'avg_year_earn_rate' : result_data['avg_year_earn_rate'],
        'market_rate' : result_data['market_rate'],
        'market_over_rate' : result_data['market_over_price'],
        'max_earn' : result_data['max_earn'],
        'min_earn' : result_data['min_earn'],
        'max_earn_rate' : max_earn_rate,
        'min_earn_rate' : min_earn_rate,
        'trading_days' : result_data['trading_days'],
        'mdd' : result_data['mdd'],
        'win_lose_rate' : win_lose_rate,
        'final_asset' : result_data['current_asset'],
        'final_earn' : result_data['my_profit_loss'],
        'final_rate' : result_data['my_final_rate']
    }
    
    serializer = ResultSerializer(instance=account['result'], data=input_data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
    
    # print('최종자산 : ' + str(result_data['current_asset']) + '|| 일평균' + str(result_data['avg_day_earn_rate']) +'|| 연평균' + str(result_data['avg_year_earn_rate']) + ' || 승률' + str(win_lose_rate))
    # print('총 거래일수 :' + str(result_data['trading_days']) + '||내 손익 : ' + str(result_data['my_profit_loss']) + '|| 내 수익률 : ' + str(result_data['my_final_rate']) + '|| MDD : ' + str(result_data['mdd']))
    # print('시장 수익률 : ' + str(result_data['market_rate']) + '|| 시장초과수익률 : ' + str(result_data['market_over_price']) + '|| 최고자산 : ' + str(result_data['max_earn']) + '|| 최저자산 : ' + str(result_data['min_earn']))
    # print('최고수익률 : ' + str(max_earn_rate) + '|| 최저수익률 : ' + str(min_earn_rate))
    return serializer
