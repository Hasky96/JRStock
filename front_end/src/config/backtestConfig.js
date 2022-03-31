export const strategies = {
  1: "이동평균선(MA)",
  2: "이동평균수렴확산지수(MACD)",
  3: "상대적강도지수(RSI)",
  4: "누적평균거래량(OBV)",
};

export const details = {
  1: "상향돌파",
  2: "하향돌파",
  3: "골든크로스(golden cross)",
  4: "데드크로스(dead cross)",
  5: "정배열",
  6: "역배열",
  7: "높음",
  8: "낮음",
};

export const options = [
  {
    1: 1,
    2: [1, 2, 3, 4, 5, 6],
  },
  {
    1: 2,
    2: [3, 4, 5, 6],
  },
  {
    1: 3,
    2: [7, 8],
  },
  {
    1: 4,
    2: [7, 8],
  },
];

export const paramDict = {
  1: "period",
  2: "err",
  3: "short_period",
  4: "long_period",
  5: "signal",
  6: "index",
};

export const configParam = {
  101: {
    1: 5,
    2: 5,
  },
  102: {
    1: 5,
    2: 5,
  },
  103: {
    3: 5,
    4: 20,
  },
  104: {
    3: 5,
    4: 20,
  },
  105: {
    3: 5,
    4: 20,
  },
  106: {
    3: 5,
    4: 20,
  },
  203: {
    3: 12,
    4: 26,
    5: 9,
  },
  204: {
    3: 12,
    4: 26,
    5: 9,
  },
  205: {
    3: 12,
    4: 26,
    5: 9,
  },
  206: {
    3: 12,
    4: 26,
    5: 9,
  },

  307: {
    1: 14,
    6: 80,
  },
  308: {
    1: 14,
    6: 20,
  },
  407: {
    1: 20,
  },
  408: {
    1: 20,
  },
};

export const configDefault = {
  weight: 50,
  standard: 50,
  percent: 100,
  params: configParam,
};

export const parameters = {
  101: [1, 2],
  102: [1, 2],
  103: [3, 4],
  104: [3, 4],
  105: [3, 4],
  106: [3, 4],
  203: [3, 4, 5],
  204: [3, 4, 5],
  205: [3, 4, 5],
  206: [3, 4, 5],
  307: [1, 6],
  308: [1, 6],
  407: [1],
  408: [1],
};

export const paramConstructor = {
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
};

export const getParamDefault = (s) => {
  return configParam[s];
};

export const assetKey = [
  "투자 원금(원)",
  "총 손익(원)",
  "최종 자산(원)",
  "시작일",
  "종료일",
  "총 기간(일)",
];
export const profitKey = [
  "누적 수익률",
  "시장초과 수익률",
  "승패율",
  "일평균 수익률",
  "연평균 수익률(CAGR)",
  "최대 손실폭(MDD)",
];

export const nameDict = {
  ma_up_pass: "이동평균선(MA) 상향돌파",
  ma_down_pass: "이동평균선(MA) 하향돌파",
  ma_golden_cross: "이동평균선(MA) 골든크로스",
  ma_dead_cross: "이동평균선(MA) 데드크로스",
  ma_straight: "이동평균선(MA) 정배열",
  ma_reverse: "이동평균선(MA) 역배열",
  macd_golden_cross: "이동평균수렴확산지수(MACD) 골든크로스",
  macd_dead_cross: "이동평균수렴확산지수(MACD) 데드크로스",
  macd_straight: "이동평균수렴확산지수(MACD) 정배열",
  macd_reverse: "이동평균수렴확산지수(MACD) 역배열",
  rsi_high: "상대적강도지수(RSI) 높음",
  rsi_low: "상대적강도지수(RSI) 낮음",
  obv_high: "누적평균거래량(OBV) 높음",
  obv_low: "누적평균거래량(OBV) 낮음",
};

export const nameToId = {
  ma_up_pass: 101,
  ma_down_pass: 102,
  ma_golden_cross: 103,
  ma_dead_cross: 104,
  ma_straight: 105,
  ma_reverse: 106,
  macd_golden_cross: 203,
  macd_dead_cross: 204,
  macd_straight: 205,
  macd_reverse: 206,
  rsi_high: 307,
  rsi_low: 308,
  obv_high: 407,
  obv_low: 408,
};
