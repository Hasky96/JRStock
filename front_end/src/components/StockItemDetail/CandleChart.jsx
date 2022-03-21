import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import "./CandleChart.css";

export const CandleChart = ({ candleData, volumeData }) => {
  const chartContainerRef = useRef();
  const zeroFill = (s) => {
    return ("00" + s).slice(-2);
  };

  const stringToDate = (date) => {
    const [year, month, day] = date.split("-");
    return year + " - " + zeroFill(month) + " - " + zeroFill(day);
  };

  const initailDate =
    typeof candleData[candleData.length - 1].time === "string"
      ? stringToDate(candleData[candleData.length - 1].time)
      : candleData[candleData.length - 1].time.year +
        " - " +
        candleData[candleData.length - 1].time.month +
        " - " +
        candleData[candleData.length - 1].time.day;

  const initialLegend = {
    dateStr: initailDate,
    open: candleData[candleData.length - 1].open,
    high: candleData[candleData.length - 1].high,
    low: candleData[candleData.length - 1].low,
    close: candleData[candleData.length - 1].close,
    volume: volumeData[candleData.length - 1].value,
  };

  const [legends, setLegends] = useState(initialLegend);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const width = 900;
    const height = 380;

    var chart = (window.tvchart = createChart(chartContainerRef.current, {
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#d1d4dc",
      },
      rightPriceScale: {
        scaleMargins: {
          // top: 0.35,
          bottom: 0.4,
        },
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      grid: {
        horzLines: {
          color: "#eee",
          visible: false,
        },
        vertLines: {
          color: "#ffffff",
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          style: 0,
          width: 2,
          color: "rgba(32, 38, 46, 0.1)",
          labelVisible: true,
          labelBackgroundColor: "rgba(49, 46, 129, 0.1)",
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: "rgba(32, 38, 46, 0.1)",
          labelVisible: true,
          labelBackgroundColor: "rgba(49, 46, 129, 0.1)",
        },
      },
    }));

    var series = chart.addCandlestickSeries({
      upColor: "#2563eb",
      downColor: "#ef4444",
      // borderDownColor: "rgba(255, 144, 0, 1)",
      // borderUpColor: "rgba(255, 144, 0, 1)",
      wickDownColor: "#ef4444",
      wickUpColor: "#2563eb",
    });

    series.setData(candleData);

    var volumeSeries = chart.addHistogramSeries({
      color: "#000",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });

    volumeSeries.setData(volumeData);

    chart.subscribeCrosshairMove(function (param) {
      if (
        param === undefined ||
        param.time === undefined ||
        param.point.x < 0 ||
        param.point.x > width ||
        param.point.y < 0 ||
        param.point.y > height
      ) {
        setLegends(initialLegend);
      } else {
        const dateStr =
          param.time.year +
          " - " +
          zeroFill(param.time.month) +
          " - " +
          zeroFill(param.time.day);
        const open = param.seriesPrices.get(series).open;
        const high = param.seriesPrices.get(series).high;
        const low = param.seriesPrices.get(series).low;
        const close = param.seriesPrices.get(series).close;
        const volume = param.seriesPrices.get(volumeSeries);
        setLegends({ dateStr, open, high, low, close, volume });
      }
    });

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [candleData, volumeData]);

  return (
    <div
      id="chartContainer"
      className="w-full relative"
      ref={chartContainerRef}
    >
      <div className="three-line-legend bg-yellow-100 opacity-40">
        <div className="legend-title">종목명!</div>
        <div className="legend-content">
          {"시가" + legends.open}
          <br />
          {"고가" + legends.high}
          <br />
          {"저가" + legends.low}
          <br />
          {"종가" + legends.close}
          <br />
          {"거래량" + legends.volume}
        </div>
        <div>{legends.dateStr}</div>
      </div>
    </div>
  );
};
