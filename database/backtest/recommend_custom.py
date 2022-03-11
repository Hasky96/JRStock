import sqlite3
import pandas as pd

def get_stocks_data():  # code : 종목코드 // return dataframe
    con = sqlite3.connect("../db/stocks.db")
    cur = con.cursor()
    # cur.execute(f'select * from basic_info') #  테이블명이 숫자로 시작하면 대괄호로 감싸야함
    cur.execute(f'select * from kospi_financial_info') #  테이블명이 숫자로 시작하면 대괄호로 감싸야함
    rows = cur.fetchall()  # list
    con.close()
    data = pd.DataFrame(rows)
    data.columns = ['종목코드', '액면가', '자본금', '상장주식', '신용비율', '연중최고', '연중최저', '시가총액', '외인소진률', '대용가', 'PER', 'EPS', 'ROE', 'PBR', 'EV', 'BPS', '매출액', '영업이익', '당기순이익', '유통주식', '유통비율']
    data.set_index("종목코드", inplace=True)
    return data

def get_stocks_by_custom(**kwargs):
    """custom으로 종목찾기

    args: col_name = "비교 수치"ex) get_stocks_by_custom(상장주식="gte 10',당기순이익="eq 4", 신용비율 = "eq 1.19")
        이상 => gte
        이하 => lte
        초과 => gt
        미만 => lt
        같다 => eq
        원하는 조건들은 모두 기입
    
    Returns:
        _type_: filtered dataframe
    """
    data = get_stocks_data()
    for key, value in kwargs.items():
        print(key, value)
        value = value.split()
        if value[0] == "gte":
            data = data[(data[key] >= value[1])|(data[key] >= "+"+value[1])]
        elif value[0] == "lte":
            data = data[(data[key] <= value[1])|(data[key] <= "+"+value[1])]
        elif value[0] == "gt":
            data = data[(data[key] > value[1])|(data[key] > "+"+value[1])]
        elif value[0] == "lt":
            data = data[(data[key] < value[1])|(data[key] < "+"+value[1])]
        elif value[0] == "eq":
            data = data[(data[key] == value[1])|(data[key] == "+"+value[1])]
        
    return data


print(get_stocks_by_custom(당기순이익="eq 4", 신용비율 = "eq 1.19"))
