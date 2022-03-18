from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
 
 
def crawler(company_code, maxpage):
    page = 0
    df_ret=pd.DataFrame()
    while page <= int(maxpage): 
    
        url = 'https://finance.naver.com/item/news_news.nhn?code=' + str(company_code) + '&page=' + str(page) 
        source_code = requests.get(url).text
        html = BeautifulSoup(source_code, "lxml")
     
 
        
        # 뉴스 제목 
        titles = html.select('.title')
        title_result=[]
        for title in titles: 
            title = title.get_text() 
            title = re.sub('\n','',title)
            title_result.append(title)
 
 
        # 뉴스 링크
        links = html.select('.title') 
 
        link_result =[]
        for link in links: 
            add = 'https://finance.naver.com' + link.find('a')['href']
            link_result.append(add)
 
 
        # 뉴스 날짜 
        dates = html.select('.date') 
        date_result = [date.get_text() for date in dates] 
 
 
        # 뉴스 매체     
        sources = html.select('.info')
        source_result = [source.get_text() for source in sources] 


        result= {"날짜" : date_result, "언론사" : source_result, "기사제목" : title_result, "링크" : link_result} 
        df_result = pd.DataFrame(result)
        if df_ret.empty:
            df_ret=df_result.copy()
        else:
            df_ret = pd.merge(df_ret, df_result)
        page += 1 
    return df_result
 
 
 
# print(crawler("035720",1))