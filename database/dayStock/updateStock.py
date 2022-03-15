# 실시간 데이터 받아오기

# import
import requests
import pandas as pd
from io import BytesIO
path = 'C:/ssafy/project2/data/day_stock'

def krx_basic(tdate):
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
    df = pd.read_excel(BytesIO(r.content))
    df['일자'] = tdate
    file_name = 'basic_'+ str(tdate) + '.xlsx'
    df.to_excel(path+file_name, index=False, index_label=None)
    print('KRX crawling completed :', tdate)
    return


krx_basic(20220314)

# for year in range(2020, 2021):
#     for month in range(1, 13):
#         for day in range(1, 32):
#             tdate = year * 10000 + month * 100 + day * 1
#             if tdate <= 20211231:
#                 krx_basic(tdate)
