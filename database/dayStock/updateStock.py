# pip install openpyxl


import requests
import pandas as pd
import io

tdate=20220314
gen_req_url = 'http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd'
query_str_parms = {
    'mktId': 'ALL',
    'trdDd': str(tdate),
    'share': '1',
    'money': '1',
    'csvxls_isNo': 'false',
    'name': 'fileDown',
    'url': 'dbms/MDC/STAT/standard/MDCSTAT01501'
}
headers = {
    'Referer': 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'O2Mc1EmFLez8by7BX0EIh30Rkd32XD+7w/aGiWTvNHQ=' #generate.cmd에서 찾아서 입력하세요
}
r = requests.get(gen_req_url, query_str_parms, headers=headers)
gen_req_url = 'http://data.krx.co.kr/comm/fileDn/download_excel/download.cmd'
form_data = {
    'code': r.content
}
r = requests.post(gen_req_url, form_data, headers=headers)
# print(BytesIO(r.content))
bio = io.BytesIO(r.content) ## Some random BytesIO Object
df = pd.read_excel(bio)
# df2=pd.DataFrame(df)

# print(df2)
insert_str='insert into day_stock (`code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,`low_price`,`volume`,`trade_price`,`market_cap`,`stock_amount`,`date`) VALUES '

for idx, row in df.iterrows():
    # print(row['거래대금'])
    insert_str+='("'+row['종목코드']+'",'+str(int(row['종가']))+','+str(row['대비'])+','+str(row['등락률'])+','+str(int(row['시가']))+','+str(int(row['고가']))+','+str(int(row['저가']))+','+str(int(row['거래량']))+','+str(int(row['거래대금']))+','+str(int(row['시가총액']))+','+str(int(row['상장주식수']))+','+str(tdate)+'),\n'
    # break
insert_str=insert_str[0:-2]+';'
print(insert_str)

