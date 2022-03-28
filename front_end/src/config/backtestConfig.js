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
  7: "high",
  8: "low",
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
