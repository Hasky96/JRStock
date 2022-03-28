from __future__ import absolute_import, unicode_literals
import os
import pandas as pd
from datetime import datetime, timedelta
from django.db.models import Max

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'JRstock.settings')
# pip install -r requirements.txt
import django   
django.setup()

from stock.models import DayStock, FinancialInfo, BasicInfo

def get_day_stock(code_number, start_date, end_date):
    """ 주식 select 함수

    Args:
        code_number (String): DB에서 불러올 주식 코드 번호
        start_date (String): 시작 날짜
        end_date (String): 종료 날짜

    Returns:
        날짜별 주식 object가 남긴 리스트    [object1, object2, ...]
    """

    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date__gte=start_date).filter(date__lte=end_date)
    
    # financial_info = FinancialInfo.objects.get(pk=code_number)  # 재무제표
    day_stock_list = list(day_stock_list) 
    
    return day_stock_list

def get_current_stock_price(code_number=None):
    """ DB 기준 최신 주식 가격

    Args:
        없는 경우 모든 주식
        code_number (String) : 주식 종목 1개 코드 '005930'
    Returns:
        최신 주식별 가격 (Dict) {'005930': 71000, '005380': 205000, ...}
        주식 종목 1개 가격 (Integer) 71000
    """


    if (code_number!=None):     # 단일종목 가격
        day_stock_list = DayStock.objects.filter(code_number=code_number).order_by('-date')
        return day_stock_list[0].current_price

    # 모든 종목 가격
    # select * from day_stock where date=(select max(date) from day_stock); 
    current_date=DayStock.objects.aggregate(Max('date'))['date__max']   # DB에 저장된 마지막 날짜 {'date__max': '2022-03-21'}
    day_stock_list = DayStock.objects.filter(date=current_date)
    current_stock_price={}
    for row in list(day_stock_list):
        current_stock_price[row.code_number]=float(row.current_price)
    return current_stock_price


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
    if stock_amount * price * 1.00015 > account['balance']: 
        stock_amount -= 1
    buy_price =stock_amount * price * 1.00015 # 수수료포함가격
    if buy_price == 0: # 못사는경우
        print("구매가 불가합니다. 잔액부족")
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
    for code_num in account['stocks'].keys():
        cur_price = get_stock_price(code_num, date)
        current_asset += (int(cur_price) * int(account['stocks'][code_num]['amount']))
    
    earn_rate = (current_asset - account['start_price']) / account['start_price']
    earn_rate = round(earn_rate * 100, 3)
    name=get_stock_name_by_code(code)
    
    print(f'매수알림 : {date} {option}에 의해 {name}({code}) 주식 {price:,} 가격에 {stock_amount:,}주 매수 == 현재 자산 {current_asset} 총 수익률 {earn_rate}')
    return account

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
        print("판매가 불가능합니다. 보유한 주식수보다 작습니다.")
        return account
    stock_amount = int(account['stocks'][code]['amount']*percent/100)
    account['balance'] += int(price* stock_amount * 1.00015) #수수료포함 가격
    account['stocks'][code]['amount'] -= stock_amount
    if account['stocks'][code]['amount'] == 0:
        del account['stocks'][code]
        
    # 현재 자산 계산
    current_asset = int(account['balance'])
    for code_num in account['stocks'].keys():
        cur_price = get_stock_price(code_num, date)
        current_asset += (int(cur_price) * int(account['stocks'][code_num]['amount']))
    
    earn_rate = (current_asset - account['start_price']) / account['start_price']
    earn_rate = round(earn_rate * 100, 3)
    name=get_stock_name_by_code(code)
    print(f'매도알림 : {date} {option}에 의해 {name}({code}) 주식 {price:,} 가격에 {stock_amount:,}주 매도 == 현재 자산 {current_asset} 총 수익률 {earn_rate}')
    return account

def get_stock_data(code_number, date):
    """ 주식 종목 1개 정보 
    Args:
        code_number (String) : 주식 종목 1개 코드 '005930'
        date (String) : 날짜 '2022-03-22'
    Returns:
        주식 종목 (Object)
    """
    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date=date)
    
    return day_stock_list[0]
    

def get_stock_name_by_code(code_number):
    stock=BasicInfo.objects.get(pk=code_number)
    return stock.company_name

def get_stock_price(code_number, date):
    """ 주식 종목 1개 가격 
    Args:
        code_number (String) : 주식 종목 1개 코드 '005930'
        date (String) : 날짜 '2022-03-22'
    Returns:
        주식 종목 가격 (Integer)
    """
    day_stock_list = DayStock.objects.filter(code_number=code_number).filter(date=date)
    if day_stock_list.count() == 0:
        return None
    return day_stock_list[0].current_price
    

def calculate_total_account(account, current_stock_price):
    """ 현재 자산 총합

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        current_stock_price (Dict) : 최신 주식별 가격 딕셔너리

    Returns:
        총액 (Integer)    4,103,320원
    """

    total_account=account['balance']
    for key in account['stocks'].keys():
        total_account+=int(current_stock_price)*account['stocks'][key]['amount']
    total_account=int(total_account)
    # result=f'{total_account:,}원'
    return total_account


def object_to_dataframe(stocks):
    """ 주식 oject 리스트를 dataframe으로 변환

    Args:
        stocks (List): 날짜별 주식 object가 남긴 리스트

    Returns:
        DataFrame : N rows * 12 columns
    """
    col_name = ['code_number','current_price','changes','chages_ratio','start_price','high_price', 'low_price', \
    'volume','trade_price','market_cap','stock_amount','date']
    stock_list=[]
    for stock in stocks:
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


def get_kospi_price_by_date(date):
    cnt = 0
    kospi_price = None
    while kospi_price == None:
        cnt += 1
        yesterday = datetime.strptime(date, '%Y-%m-%d') - timedelta(days=cnt)
        yesterday = yesterday.strftime('%Y-%m-%d')
        kospi_price = get_stock_price('kospi', yesterday)
    
    return kospi_price

def init_result_data(account):
    result_data = {
        'year' : account['start_date'][:4], # 연도 저장
        'year_start_price' : account['balance'], # 시작가격
        'year_earn_rate' : 0.0, # 연평균 수익률
        'year_cnt' : 0, # 총 연도 수
        'max_earn' : account['balance'], # 최고 수익
        'max_date' : None, # 최고 수익 날짜
        'min_earn' : account['balance'], # 최저 수익
        'min_earn_after_max' : 0, # 최고 수익 이후 최저 수익
        'start_kospi_price' : get_kospi_price_by_date(account['start_date']), # 시작날짜 코스피 가격
        'end_kospi_price' : get_kospi_price_by_date(account['end_date']), # 종료날자 코스피 가격
    }
    print(result_data)
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
        if result_data['max_date'] != None and result_data['max_date'] < min_date:
            result_data['min_earn_after_max'] = result_data['current_asset']
            
    result_data['min_earn'] = min(result_data['min_earn'], result_data['current_asset'])
    
    day_earn = (result_data['current_asset'] - account['pre_price'])
    day_earn_rate = day_earn / account['pre_price']
    day_earn_rate = round(day_earn_rate * 100, 3)
    account['pre_price'] = result_data['current_asset']
    
    # 연도가 바뀌었다면
    if result_data['year'] != stock['date'][:4]:
        result_data = year_calculate(account, result_data)
        result_data['year'] = stock['date'][:4] # 연도 변경
    
    # 이부분 DB에 넣어주기
    print('일수익률 : ' + str(day_earn_rate) + '|| 일손익 : ' + str(day_earn) + '|| 현재 자산 : ' + str(result_data['current_asset']) + '|| 날짜 : ' + str(stock['date']))
    return result_data

def year_calculate(account, result_data):
    print(result_data['year'] + '년 평균' + str((result_data['current_asset'] - result_data['year_start_price']) / result_data['year_start_price']))
    
    result_data['year_cnt'] += 1
    result_data['year_earn_rate'] = round((result_data['year_earn_rate'] + ((result_data['current_asset'] - result_data['year_start_price']) / result_data['year_start_price'])) / result_data['year_cnt'] * 100, 3)
    result_data['year_start_price'] = result_data['current_asset']
    print('연평균' + str(result_data['year_earn_rate']))
    
    return result_data

def end_calculate(account, result_data):
    # 마지막 날을 기준으로 마지막 연도 평균 계산
    result_data = year_calculate(account, result_data)
    
    result_data['my_profit_loss'] = int(account['pre_price']) - int(account['start_price'])
    result_data['my_final_rate'] = round(result_data['my_profit_loss'] / int(account['start_price']) * 100, 3)
    result_data['market_rate'] = round((float(result_data['end_kospi_price']) - float(result_data['start_kospi_price'])) / float(result_data['start_kospi_price']) * 100, 3)
    result_data['market_over_price'] = round(result_data['my_final_rate'] - result_data['market_rate'], 3)
    result_data['mdd'] = round((result_data['min_earn_after_max'] - result_data['max_earn']) / result_data['max_earn'] * 100, 3)
    
    print('내 손익 : ' + str(result_data['my_profit_loss']) + '|| 내 수익률 : ' + str(result_data['my_final_rate']) + '|| MDD : ' + str(result_data['mdd']))
    print('시장 수익률 : ' + str(result_data['market_rate']) + '|| 시장초과수익률 : ' + str(result_data['market_over_price']) + '|| 최고자산 : ' + str(result_data['max_earn']) + '|| 최저자산 : ' + str(result_data['min_earn']))
    return result_data


# front로부터 받는 전략
# window : 5일선, 20일선 등
# 공통 파라미터 : code_number, balance, start_date, end_date, 매수전략들, 매도전략들 - 개수 달라도 가능
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
