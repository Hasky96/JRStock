import os
from unittest import result
import pandas as pd
from datetime import datetime, timedelta
from django.db.models import Max

from stock.models import DayStock, FinancialInfo, BasicInfo

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
    
    # 한종목만 하면 이부분 변경해야함 =====
    for code_num in account['stocks'].keys():
        cur_price = get_stock_price(code_num, date)
        current_asset += (int(cur_price) * int(account['stocks'][code_num]['amount']))
    
    earn_rate = (current_asset - account['start_price']) / account['start_price']
    earn_rate = round(earn_rate * 100, 3)
    name=get_stock_name_by_code(code)
    
    print(f'매수알림 : {option}에 의해{name}({code}) 주식 {price:,} 가격에 {stock_amount:,}주 매수 == 현재 자산 {current_asset} 총 수익률 {earn_rate}')
    return account

# 이름도 같이 받아서 DB 접근 횟수 줄이기 가능할듯
def sell(account, code, price, percent, date, option, result_data):
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
        avg = account['stocks'][code]['avg_price']
        del account['stocks'][code]
        
    if stock_amount == 0:
        print("현재 비율로는 판매가 불가능")
        return account
        
    # 현재 자산 계산
    current_asset = int(account['balance'])
    for code_num in account['stocks'].keys():
        cur_price = get_stock_price(code_num, date)
        current_asset += (int(cur_price) * int(account['stocks'][code_num]['amount']))
    
    earn_rate = (current_asset - account['start_price']) / account['start_price']
    earn_rate = round(earn_rate * 100, 3)
    name=get_stock_name_by_code(code)
    
    # 승패여부
    if not code in account['stocks'].keys():
        if avg < price:
            win_or_lose = '승'
            result_data['win_cnt'] += 1
        else: win_or_lose = '패'
    else:
        if account['stocks'][code]['avg_price'] < price:
            win_or_lose = '승'
            result_data['win_cnt'] += 1
        else: win_or_lose = '패'
    
    result_data['win_lose_cnt'] += 1
    
    print(f'매도알림 : {option}에 의해{name}({code}) 주식 {price:,} 가격에 {stock_amount:,}주 매도 == 현재 자산 {current_asset} 총 수익률 {earn_rate} 승패여부{win_or_lose}')
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

def init_result_data(account, trading_days):
    result_data = {
        'trading_days': trading_days, # 총 거래일수
        'year' : account['start_date'][:4], # 연도 저장
        'year_start_price' : account['balance'], # 시작가격
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
        'win_cnt' : 0, # 승리 횟수
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
        if result_data['max_date'] < min_date:
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
    
    result_data['avg_day_earn_rate'] += day_earn_rate # 일평균 누적
    # 이부분 DB에 넣어주기
    print('일수익률 : ' + str(day_earn_rate) + '|| 일손익 : ' + str(day_earn) + '|| 현재 자산 : ' + str(result_data['current_asset']) + '|| 날짜 : ' + str(stock['date']))
    return result_data

def year_calculate(account, result_data):
    year_earn_rate = round((result_data['current_asset'] - result_data['year_start_price']) / result_data['year_start_price'] * 100, 3)
    print(result_data['year'] + '년 평균' + str(year_earn_rate))
    
    result_data['year_cnt'] += 1
    result_data['avg_year_earn_rate'] = round((result_data['avg_year_earn_rate'] + year_earn_rate) / result_data['year_cnt'], 3)
    result_data['year_start_price'] = result_data['current_asset']
    
    return result_data

def end_calculate(account, result_data):
    # 마지막 날을 기준으로 마지막 연도 평균 계산
    result_data = year_calculate(account, result_data)
    
    result_data['my_profit_loss'] = int(account['pre_price']) - int(account['start_price'])
    result_data['my_final_rate'] = round(result_data['my_profit_loss'] / int(account['start_price']) * 100, 3)
    result_data['market_rate'] = round((float(result_data['end_kospi_price']) - float(result_data['start_kospi_price'])) / float(result_data['start_kospi_price']) * 100, 3)
    result_data['market_over_price'] = round(result_data['my_final_rate'] - result_data['market_rate'], 3)
    result_data['mdd'] = round((result_data['min_earn_after_max'] - result_data['max_earn']) / result_data['max_earn'] * 100, 3)
    result_data['avg_day_earn_rate'] = round(result_data['avg_day_earn_rate'] / result_data['trading_days'], 3)
    win_lose_rate = round(result_data['win_cnt'] / result_data['win_lose_cnt'] * 100, 3)
    print('최종자산 : ' + str(result_data['current_asset']) + '|| 일평균' + str(result_data['avg_day_earn_rate']) +'|| 연평균' + str(result_data['avg_year_earn_rate']) + ' || 승률' + str(win_lose_rate))
    print('총 거래일수 :' + str(result_data['trading_days']) + '||내 손익 : ' + str(result_data['my_profit_loss']) + '|| 내 수익률 : ' + str(result_data['my_final_rate']) + '|| MDD : ' + str(result_data['mdd']))
    print('시장 수익률 : ' + str(result_data['market_rate']) + '|| 시장초과수익률 : ' + str(result_data['market_over_price']) + '|| 최고자산 : ' + str(result_data['max_earn']) + '|| 최저자산 : ' + str(result_data['min_earn']))
    return result_data
