
import news1
import pandas as pd
from konlpy.tag import Okt
import numpy as np
okt = Okt()

df = news1.crawler("005930",2)

n_ = []
for i in range(len(df)):
    n_.append(' '.join(okt.nouns(df.iloc[i]['기사제목'])))
df['nouns'] = n_
df = df[df['nouns']!='']
df['nouns'] = df['nouns'].str.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]","")
df['nouns'].replace('', np.nan, inplace=True)
df = df.dropna(how='any')
print(df)

vocab = {}
for i in df['nouns']:
    i = i.split(' ')
    for j in range(len(i)):
        if len(i[j])<=1:
            pass 
        elif i[j] in vocab:
            vocab[i[j]] += 1
        else:
            vocab[i[j]] = 1
            
print(sorted(vocab.items(), key=lambda item:item[1], reverse=True))
      