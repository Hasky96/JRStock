account = {
            "balance":1000000,
            "stocks":{
                "005930":{
                    "amount":100,
                    "avg_price":70000
                    },
                    "002356":{
                        "amount":30,
                        "avg_price":50000
                    },
        }
}

def buy(account, code, price, percent):
    """주식구매 함수

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        code (String): 매수하고자 하는 주식 코드
        price (Integer): 매수하는 가격
        percent (Integer): 현금자산의 몇 퍼센트의 비중으로 매수할지

    Returns:
        구매 완료시 수정된 현금 재산과 보유주식목록 딕셔너리 반환
        실패시 False 반환
    """
    stock_amount = int((account['balance'] * percent/100) // price)
    if stock_amount * price * 1.00015 > account['balance']: 
        stock_amount -= 1
    buy_price =stock_amount * price * 1.00015 # 수수료포함가격
    if buy_price == 0: # 못사는경우
        print("구매가 불가합니다. 잔액부족")
        return False
    account['balance'] -= buy_price # 구매후 가격 갱신
    if code in account['stocks'].keys():
        info = account['stocks'][code]
        account['stocks'][code]['avg_price'] = int((info['amount'] * info['avg_price'] + price*stock_amount) // (info['amount']+ stock_amount)) # 평단가 갱신 
        account['stocks'][code]['amount'] += stock_amount
    else:
        account['stocks'][code] = {"amount":stock_amount, "avg_price":price}
    print(f'매수알림 : {code} 주식 {price:,}가격에 {stock_amount:,}주 매수')
    return account

def sell(account, code, price, percent):
    """주식구매 함수

    Args:
        account (Dict): 현금 재산과 보유주식목록 딕셔너리
        code (String): 매도하고자 하는 주식 코드
        price (Integer): 매도하는 가격
        percent (Integer): 보유주식수의 몇 퍼센트의 비중으로 매도할지

    Returns:
        구매 완료시 수정된 현금 재산과 보유주식목록 딕셔너리 반환
        실패시 False 반환
    """
    if code not in account['stocks'].keys():
        print("판매가 불가능합니다. 보유한 주식수보다 작습니다.")
        return False
    stock_amount = int(account['stocks'][code]['amount']*percent/100)
    account['balance'] += int(price* stock_amount * 1.00015) #수수료포함 가격
    account['stocks'][code]['amount'] -= stock_amount
    if account['stocks'][code]['amount'] == 0:
        del account['stocks'][code]
    print(f'매도알림 : {code} 주식 {price:,}가격에 {stock_amount:,}주 매도')
    return account

# TEST
print(account)
account = buy(account, "005930", 71000, 50)
account = buy(account, "111111", 71000, 50)
print(account)
account = sell(account, "111111", 98000, 100)
account = sell(account, "005930", 80000, 50)
print(account)