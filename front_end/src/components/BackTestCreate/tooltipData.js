const srcDict = {
  101: "ma_upward.png",
  102: "ma_downward.png",
  103: "ma_golden_cross.png",
  104: "ma_dead_cross.png",
  105: "ma_regular_arrangement.png",
  106: "ma_inverse_arrangement.png",
  203: "macd_golden_cross.png",
  204: "macd_dead_cross.png",
  205: "macd_regular_arrangement.png",
  206: "macd_inverse_arrangement.png",
  307: "rsi_graph.png",
  308: "rsi_graph.png",
  407: "obv_regular_arrangement.png",
  408: "obv_regular_arrangement.png",
  507: "mfi_graph.png",
  508: "mfi_graph.png",
  605: "ichimoku_cloud.png",
  606: "ichimoku_cloud.png",
  707: "ma_upward.png",
  708: "ma_downward.png",
  807: "ma_upward.png",
  808: "ma_downward.png",
};

const altDict = {
  101: "ma_upward.png",
  102: "ma_downward.png",
  103: "ma_golden_cross.png",
  104: "ma_dead_cross.png",
  105: "ma_regular_arrangement.png",
  106: "ma_inverse_arrangement.png",
  203: "macd_golden_cross.png",
  204: "macd_dead_cross.png",
  205: "macd_regular_arrangement.png",
  206: "macd_inverse_arrangement.png",
  307: "rsi_graph.png",
  308: "rsi_graph.png",
  407: "obv_regular_arrangement.png",
  408: "obv_regular_arrangement.png",
  507: "mfi_graph.png",
  508: "mfi_graph.png",
  605: "ichimoku_cloud.png",
  606: "ichimoku_cloud.png",
  707: "ma_upward.png",
  708: "ma_downward.png",
  807: "ma_upward.png",
  808: "ma_downward.png",
};

const linkDict = {
  101: "https://terms.naver.com/entry.naver?docId=71180&cid=43667&categoryId=43667",
  102: "https://terms.naver.com/entry.naver?docId=71180&cid=43667&categoryId=43667",
  103: "https://terms.naver.com/entry.naver?docId=930600&cid=43667&categoryId=43667",
  104: "https://terms.naver.com/entry.naver?docId=67285&cid=43667&categoryId=43667",
  105: "https://terms.naver.com/entry.naver?docId=71181&cid=43667&categoryId=43667",
  106: "https://terms.naver.com/entry.naver?docId=71181&cid=43667&categoryId=43667",
  203: "https://terms.naver.com/entry.naver?docId=930600&cid=43667&categoryId=43667",
  204: "https://terms.naver.com/entry.naver?docId=67285&cid=43667&categoryId=43667",
  205: "https://terms.naver.com/entry.naver?docId=71181&cid=43667&categoryId=43667",
  206: "https://terms.naver.com/entry.naver?docId=71181&cid=43667&categoryId=43667",
  307: "https://terms.naver.com/entry.naver?docId=2080023&cid=42107&categoryId=42107",
  308: "https://terms.naver.com/entry.naver?docId=2080023&cid=42107&categoryId=42107",
  407: "https://terms.naver.com/entry.naver?docId=2075055&cid=42107&categoryId=42107",
  408: "https://terms.naver.com/entry.naver?docId=2075055&cid=42107&categoryId=42107",
  507: "https://www.investopedia.com/terms/m/mfi.asp",
  508: "https://www.investopedia.com/terms/m/mfi.asp",
  605: "https://www.investopedia.com/terms/i/ichimoku-cloud.asp",
  606: "https://www.investopedia.com/terms/i/ichimoku-cloud.asp",
  707: "https://www.investopedia.com/terms/k/kospi.asp",
  708: "https://www.investopedia.com/terms/k/kospi.asp",
  807: "https://www.investopedia.com/terms/k/koreastockexchange.asp",
  808: "https://www.investopedia.com/terms/k/koreastockexchange.asp",
};

const contentDict = {
  101: {
    info: "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n시가가 이동평균선 밑이고, 종가가 이동평균선+오차 위이면 상향돌파로 판단한다.",
    params: {
      1: "이동평균선 기간",
      2: "이동평균선 허용 오차 범위",
      0: "가중치",
    },
  },
  102: {
    info: "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n시가가 이동평균선 위이고, 종가가 이동평균선-오차 아래이면 하향돌파로 판단한다.",
    params: {
      1: "이동평균선 기간",
      2: "이동평균선 허용 오차 범위",
      0: "가중치",
    },
  },
  103: {
    info: "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n단기 이동평균선이 장기 이동평균선을 상향돌파하면 골든크로스로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      0: "가중치",
    },
  },
  104: {
    info: "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n단기 이동평균선이 장기 이동평균선을 하향돌파하면 데드크로스로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      0: "가중치",
    },
  },
  105: {
    info: "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n단기 이동평균선이 장기 이동평균선보다 위에 있다면 정배열로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      0: "가중치",
    },
  },
  106: {
    info: "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n단기 이동평균선이 장기 이동평균선보다 아래에 있다면 역배열로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      0: "가중치",
    },
  },
  203: {
    info: "이동평균수렴확산지수(MACD)는 기간이 다른 이동평균선 사이의 관계에서 추세변화의 신호를 찾으려는 진동자 지표이다. Signal은 MACD의 지수 이동 평균이다./nMACD가 Signal을 상향돌파하면 골든크로스로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      5: "signal 기간",
      0: "가중치",
    },
  },
  204: {
    info: "이동평균수렴확산지수(MACD)는 기간이 다른 이동평균선 사이의 관계에서 추세변화의 신호를 찾으려는 진동자 지표이다. Signal은 MACD의 지수 이동 평균이다./nMACD가 Signal을 하향돌파하면 데드크로스로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      5: "signal 기간",
      0: "가중치",
    },
  },
  205: {
    info: "이동평균수렴확산지수(MACD)는 기간이 다른 이동평균선 사이의 관계에서 추세변화의 신호를 찾으려는 진동자 지표이다. Signal은 MACD의 지수 이동 평균이다./nMACD가 Signal보다 위에 있다면 정배열로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      5: "signal 기간",
      0: "가중치",
    },
  },
  206: {
    info: "이동평균수렴확산지수(MACD)는 기간이 다른 이동평균선 사이의 관계에서 추세변화의 신호를 찾으려는 진동자 지표이다. Signal은 MACD의 지수 이동 평균이다./nMACD가 Signal보다 아래에 있다면 역배열로 판단한다.",
    params: {
      3: "단기 이동평균선 기간",
      4: "장기 이동평균선 기간",
      5: "signal 기간",
      0: "가중치",
    },
  },
  307: {
    info: "상대적강도지수(RSI)는 미래 주가의 강세 및 약세를 전일 대비(혹은 전주비)의 주가 변화의 비율로 예측하려고 하는 지표이다. RSI는 과거 일정 기간의 가격 상승폭의 합계(분자)에 대한 같은 기간 내의 가격 상승폭과 가격 하락폭의 절대치 합계(분모)의 백분비로 구해진다. 경험적으로 80%이상은 천정으로 매도 영역, 25% 이하는 바닥권으로 매입 영역을 나타낸다./nRSI가 Index보다 위에 있다면 자산가지 고평가로 판단한다.",
    params: {
      1: "RSI 기간",
      6: "고평가 판단 기준",
      0: "가중치",
    },
  },
  308: {
    info: "상대적강도지수(RSI)는 미래 주가의 강세 및 약세를 전일 대비(혹은 전주비)의 주가 변화의 비율로 예측하려고 하는 지표이다. RSI는 과거 일정 기간의 가격 상승폭의 합계(분자)에 대한 같은 기간 내의 가격 상승폭과 가격 하락폭의 절대치 합계(분모)의 백분비로 구해진다. 경험적으로 80%이상은 천정으로 매도 영역, 25% 이하는 바닥권으로 매입 영역을 나타낸다./nRSI가 Index보다 아래에 있다면 자산가지 저평가로 판단한다.",
    params: {
      1: "RSI 기간",
      6: "저평가 판단 기준",
      0: "가중치",
    },
  },
  407: {
    info: "OBV는 상승한 날의 거래량과 하락한 날의 거래량을 누계적으로 집계, 도표화한 것이다. 거래량은 항상 주가에 선행한다는 것을 전제로 거래량 분석을 통해 주가를 분석하는 기법으로 조셉 그렌빌(Joseph Granville)이 개발한 기법이다. OBV_EMA 는 OBV의 이동평균 선이다./nOBV가 OBV_EMA위로 오는 경우 정배열로 판단한다.",
    params: {
      1: "OBV, OBV_EMA 기간",
      0: "가중치",
    },
  },
  408: {
    info: "OBV는 상승한 날의 거래량과 하락한 날의 거래량을 누계적으로 집계, 도표화한 것이다. 거래량은 항상 주가에 선행한다는 것을 전제로 거래량 분석을 통해 주가를 분석하는 기법으로 조셉 그렌빌(Joseph Granville)이 개발한 기법이다. OBV_EMA 는 OBV의 이동평균 선이다./nOBV가 OBV_EMA위로 오는 경우 역배열로 판단한다.",
    params: {
      1: "OBV, OBV_EMA 기간",
      0: "가중치",
    },
  },
  507: {
    info: "MFI는 거래량 가중 상대적 강도 지수라고도 하며, 자산 중에서 과매수 또는 과매도 신호를 식별하기 위해 가격 및 거래량 데이터를 이용해 계산한다. MFI 값이 80이상이면 과매수(매도 타이밍)로 간주되고, 20 미만이면 과매도(매수 타이밍)로 간주된다. 또한 MFI 값이 90 또는 10인 경우를 임계값 이라고 한다./nMFI가 Index보다 위에 있다면 과매수로 판단한다.",
    params: {
      1: "MFI 기간",
      6: "과매수 판단 기준",
      0: "가중치",
    },
  },
  508: {
    info: "MFI는 거래량 가중 상대적 강도 지수라고도 하며, 자산 중에서 과매수 또는 과매도 신호를 식별하기 위해 가격 및 거래량 데이터를 이용해 계산한다. MFI 값이 80이상이면 과매수(매도 타이밍)로 간주되고, 20 미만이면 과매도(매수 타이밍)로 간주된다. 또한 MFI 값이 90 또는 10인 경우를 임계값 이라고 한다./nMFI가 Index보다 아래에 있다면 과매도로 판단한다.",
    params: {
      1: "MFI 기간",
      6: "과매도 기준",
      0: "가중치",
    },
  },
  605: {
    info: "일목균형표란 일본에서 개발된 지표로 주가의 움직임을 5개의 의미 있는 선을 이용하여 주가를 예측하는 기법으로 시간 개념이 포함된 지표를 말한다./n전환선: 최근 9일간의 최고가와 최저가의 합을 2로 나눈 값을 연결한 선이다.\n기준선: 최근 26일간의 최저가와 최고가의 합을 2로 나눈 값을 연결하여 만든 선이다.\n선행스팬 제 1선: 전환선과 기준선의 평균값을 내어 26일 앞으로 보낸 것이다.\n선행스팬 제 2선: 52일간 최고가와 최저가를 더한 후 12로 나눈 평균값을 26일 앞으로 보낸 것이다.\n후행스팬: 현재 종목의 주가를 반대로 25일 전으로 보낸 것이다.\n구름대: 1선에서 2선을 뺀 값으로 양수면 양구름층, 음수면 음구름층 이다./ncount에 설정한 조건을 만족하면 정배열로 판단한다.",
    params: {
      7: "1: 양운, 2: 전환선>기준선, 3: 주가>전환선>기준선, 4: 후행스팬>주가>전환선>기준선, 5: 후행스팬>주가>전환선>기준선>구름대(양운)",
      0: "가중치",
    },
  },
  606: {
    info: "일목균형표란 일본에서 개발된 지표로 주가의 움직임을 5개의 의미 있는 선을 이용하여 주가를 예측하는 기법으로 시간 개념이 포함된 지표를 말한다./n전환선: 최근 9일간의 최고가와 최저가의 합을 2로 나눈 값을 연결한 선이다.\n기준선: 최근 26일간의 최저가와 최고가의 합을 2로 나눈 값을 연결하여 만든 선이다.\n선행스팬 제 1선: 전환선과 기준선의 평균값을 내어 26일 앞으로 보낸 것이다.\n선행스팬 제 2선: 52일간 최고가와 최저가를 더한 후 12로 나눈 평균값을 26일 앞으로 보낸 것이다.\n후행스팬: 현재 종목의 주가를 반대로 25일 전으로 보낸 것이다.\n구름대: 1선에서 2선을 뺀 값으로 양수면 양구름층, 음수면 음구름층 이다./ncount에 설정한 조건을 만족하면 역배열로 판단한다.",
    params: {
      7: "1: 음운, 2: 전환선<기준선, 3: 주가<전환선<기준선, 4: 후행스팬<주가<전환선<기준선, 5: 후행스팬<주가<전환선<기준선<구름대(음운)",
      0: "가중치",
    },
  },
  707: {
    info: "코스피지수는 증권거래소에 상장된 주식의 증권시장지표 중에서 주식의 전반적인 동향을 가장 잘 나타내는 대표적인 지수이다. 시장전체의 주가 움직임을 측정하는 지표로 이용되며, 투자성과 측정, 다른 금융상품과의 수익률 비교척도, 경제상황 예측지표로도 이용된다./n코스피지수 시가가 이동평균선 밑이고, 종가가 이동평균선+오차 위이면 상향돌파로 판단한다.",
    params: {
      1: "코스피지수 이동평균선 기간",
      2: "코스피지수 이동평균선 허용 오차 범위",
      0: "가중치",
    },
  },
  708: {
    info: "코스피지수는 증권거래소에 상장된 주식의 증권시장지표 중에서 주식의 전반적인 동향을 가장 잘 나타내는 대표적인 지수이다. 시장전체의 주가 움직임을 측정하는 지표로 이용되며, 투자성과 측정, 다른 금융상품과의 수익률 비교척도, 경제상황 예측지표로도 이용된다./n코스피지수 시가가 이동평균선 위이고, 종가가 이동평균선-오차 아래이면 하향돌파로 판단한다.",
    params: {
      1: "코스피지수 이동평균선 기간",
      2: "코스피지수 이동평균선 허용 오차 범위",
      0: "가중치",
    },
  },
  807: {
    info: "코스닥지수는 코스닥시장 전체의 주가동향을 파악할 수 있는 투자분석지표이다./n코스닥지수 시가가 이동평균선 밑이고, 종가가 이동평균선+오차 위이면 상향돌파로 판단한다.",
    params: {
      1: "코스닥지수 이동평균선 기간",
      2: "코스닥지수 이동평균선 허용 오차 범위",
      0: "가중치",
    },
  },
  808: {
    info: "코스닥지수는 코스닥시장 전체의 주가동향을 파악할 수 있는 투자분석지표이다./n코스닥지수 시가가 이동평균선 위이고, 종가가 이동평균선-오차 아래이면 하향돌파로 판단한다.",
    params: {
      1: "코스닥지수 이동평균선 기간",
      2: "코스닥지수 이동평균선 허용 오차 범위",
      0: "가중치",
    },
  },
};

export { srcDict, altDict, contentDict, linkDict };
