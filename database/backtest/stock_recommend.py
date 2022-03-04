# 여러지표값들을 한번에 계산할수 있는 값 구한다.
# PER => 낮으면 저평가
# ROE => 높으면 좋다
# EPS => 클수록 좋다
# BPS => 높으면 좋다

# 위의 지표들의 순위를 매겨 전체 지표의 순위를 매김
# NaN이나 없는경우 꼴등으로 부여
# 상위 5개 나옴


import code
import sqlite3
import pandas as pd

def get_stocks_data():  # code : 종목코드 // return dataframe
    con = sqlite3.connect("stocks.db")
    cur = con.cursor()
    # cur.execute(f'select * from basic_info') #  테이블명이 숫자로 시작하면 대괄호로 감싸야함
    cur.execute(f'select * from cospi_basic_info') #  테이블명이 숫자로 시작하면 대괄호로 감싸야함
    rows = cur.fetchall()  # list
    con.close()
    data = pd.DataFrame(rows)
    data.columns = ['종목코드', '종목명', '액면가', '자본금', '상장주식', '신용비율', '연중최고', '연중최저', '시가총액', '외인소진률', '대용가', 'PER', 'EPS', 'ROE', 'PBR', 'EV', 'BPS', '매출액', '영업이익', '당기순이익', '최고250', '최저250', '시가', '고가', '저가', '상한가', '하한가', '기준가', '예상체결가', '예상체결수량', '최고가일250', '최고가대비율250', '최저가일250', '최저가대비율250', '현재가', '대비기호', '전일대비', '등락율', '거래량', '거래대비', '유통주식', '유통비율']
    data.set_index("종목코드", inplace=True)
    return data

def recommend_stocks(data):
    data['rank_by_ROE'] = data['ROE'].rank(method='dense', ascending=False, na_option='bottom').astype(int)
    data['rank_by_EPS'] = data['EPS'].rank(method='dense', ascending=False, na_option='bottom').astype(int)
    data['rank_by_BPS'] = data['BPS'].rank(method='dense', ascending=False, na_option='bottom').astype(int)
    data['rank_by_PER'] = data['PER'].rank(method='dense', na_option='bottom').astype(int)
    data['rv'] = (data['rank_by_ROE'] + data['rank_by_EPS'] + data['rank_by_BPS'] + data['rank_by_PER']).rank(method='dense').astype(int)
    return data.sort_values("rv", ascending=False).loc[:,['종목명','ROE','rank_by_ROE', 'EPS','rank_by_EPS', 'BPS','rank_by_BPS', 'PER','rank_by_PER', 'rv']].sort_values('rv')
 

code = 1
data = get_stocks_data()
print(data)
print(recommend_stocks(data).head())