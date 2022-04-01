export const strategies = {
  1: "이동평균선(MA)",
  2: "이동평균수렴확산지수(MACD)",
  3: "상대적강도지수(RSI)",
  4: "누적평균거래량(OBV)",
  5: "자금흐름지표(MFI)",
  6: "일목균형표",
  7: "코스피지수",
  8: "코스닥지수",
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
    2: [8, 7],
  },
  {
    1: 4,
    2: [7, 8],
  },
  {
    1: 5,
    2: [8, 7],
  },
  {
    1: 6,
    2: [5, 6],
  },
  {
    1: 7,
    2: [7, 8],
  },
  {
    1: 8,
    2: [7, 8],
  },
];

export const paramDict = {
  1: "기간",
  2: "허용 범위(%)",
  3: "단기선",
  4: "장기선",
  5: "신호선",
  6: "임계치",
  7: "번호",
};

export const configParam = {
  101: {
    1: 3,
    2: 0.5,
  },
  102: {
    1: 3,
    2: 0.5,
  },
  103: {
    3: 2,
    4: 3,
  },
  104: {
    3: 2,
    4: 3,
  },
  105: {
    3: 2,
    4: 3,
  },
  106: {
    3: 2,
    4: 3,
  },
  203: {
    3: 5,
    4: 10,
    5: 3,
  },
  204: {
    3: 5,
    4: 10,
    5: 3,
  },
  205: {
    3: 5,
    4: 8,
    5: 3,
  },
  206: {
    3: 5,
    4: 8,
    5: 3,
  },

  307: {
    1: 5,
    6: 90,
  },
  308: {
    1: 5,
    6: 10,
  },
  407: {
    1: 3,
  },
  408: {
    1: 3,
  },
  507: {
    1: 20,
    6: 90,
  },
  508: {
    1: 20,
    6: 10,
  },
  605: {
    7: 4,
  },
  606: {
    7: 4,
  },
  707: {
    1: 10,
    2: 1,
  },
  708: {
    1: 10,
    2: 1,
  },
  807: {
    1: 10,
    2: 1,
  },
  808: {
    1: 10,
    2: 1,
  },
};

export const configDefault = {
  weight: 10,
  standard: 10,
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
  507: [1, 6],
  508: [1, 6],
  605: [7],
  606: [7],
  707: [1, 2],
  708: [1, 2],
  807: [1, 2],
  808: [1, 2],
};

export const paramConstructor = {
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
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
  { title: "누적 수익률", isToolTip: false },
  {
    title: "시장초과 수익률",
    isToolTip: true,
    content: "내 수익률과 시장 수익률(KOSPI)의 차이",
  },
  {
    title: "승률",
    isToolTip: true,
    content: "매수 금액보다 비싸게 매도한 거래의 비율",
  },
  {
    title: "일평균 수익률",
    isToolTip: true,
    content: "일 수익률을 전체 거래일로 나눈 값",
  },
  {
    title: "연평균 수익률",
    isToolTip: true,
    content: "연 수익률을 전체 년도수로 나눈 값",
  },
  {
    title: "최대 손실폭",
    isToolTip: true,
    content: "Maximum DrawDown(MDD), 최고점 대비 낙폭의 크기",
  },
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
