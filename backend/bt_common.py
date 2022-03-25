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
    """ 최신 주식 가격

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
    
    print(f'매수알림 : {option}에 의해{name}({code}) 주식 {price:,} 가격에 {stock_amount:,}주 매수 == 현재 자산 {current_asset} 총 수익률 {earn_rate}')
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
    print(f'매도알림 : {option}에 의해{name}({code}) 주식 {price:,} 가격에 {stock_amount:,}주 매도 == 현재 자산 {current_asset} 총 수익률 {earn_rate}')
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
