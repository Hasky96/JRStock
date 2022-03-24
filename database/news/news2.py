from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
 
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)
 
def news_crawler(company_code):
    df_ret=pd.DataFrame(columns=['date', 'title', 'source', 'link'])

    url = 'https://finance.naver.com/sise/sise_index.naver?code=' + str(company_code)
    source_code = requests.get(url).text
    html = BeautifulSoup(source_code, "lxml")
    
    news_href = html.select('#contentarea_left > div:nth-child(4) > ul > li > span > a')
    news_info1 = html.select('#contentarea_left > div:nth-child(4) > ul > li > p > .paper')
    news_info2 = html.select('#contentarea_left > div:nth-child(4) > ul > li > p > .date')
    
    for i in range(len(news_href)):
        df_ret= pd.concat([df_ret,pd.DataFrame({'date':[news_info2[i].text], 'title':[news_href[i].text], 'source':[news_info1[i].text], 'link':[("finance.naver.com"+news_href[i]['href'])]})])
        df_ret = df_ret.reset_index(drop=True)
    return df_ret
    

def hot_stock():
    url = 'https://finance.naver.com/'
    source_code = requests.get(url).text
    html = BeautifulSoup(source_code, "lxml")
    
    table = html.select('#container > div.aside > div > div.aside_area.aside_popular > table > tbody')
    print(table)
    

#test
df= news_crawler("KOSPI")
print(df)
# df= news_crawler("KOSDAQ",1)
# print(df)
# print(hot_stock())