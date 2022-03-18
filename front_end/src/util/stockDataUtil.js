function transCandleData(data) {
  return data.map((e) => {
    return {
      time: e.date,
      open: e.start_price,
      close: e.current_price,
      low: e.low_price,
      high: e.high_price,
    };
  });
}

function transVolumeData(data) {
  return data.map((e) => {
    return {
      time: e.date,
      value: e.volume,
      color: parseFloat(e.changes) < 0 ? "#ef4444" : "#2563eb",
    };
  });
}

function transLineData(data) {
  return data.map((e) => {
    return {
      time: e.date,
      value: e.current_price,
    };
  });
}

export { transCandleData, transVolumeData, transLineData };
