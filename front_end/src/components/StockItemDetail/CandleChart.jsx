import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import "./CandleChart.css";

export const CandleChart = ({ title, candleData, volumeData, period }) => {
  const chartContainerRef = useRef();
  const zeroFill = (s) => {
    return ("00" + s).slice(-2);
  };

  var barSpacingPerPeriod = new Map([
    ["일봉", 6],
    ["주봉", 12],
    ["월봉", 18],
  ]);

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
        barSpacing: barSpacingPerPeriod.get(period),
      },
      grid: {
        horzLines: {
          color: "#eee",
          visible: true,
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
          color: "rgba(24, 33, 109, 0.1)",
          labelVisible: true,
          labelBackgroundColor: "rgba(24, 33, 109, 0.1)",
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: "rgba(24, 33, 109, 0.1)",
          labelVisible: true,
          labelBackgroundColor: "rgba(24, 33, 109, 0.1)",
        },
      },
    }));

    var series = chart.addCandlestickSeries({
      upColor: "#ef4444",
      downColor: "#2563eb",
      borderDownColor: "#2563eb",
      borderUpColor: "#ef4444",
      wickDownColor: "#2563eb",
      wickUpColor: "#ef4444",
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
  }, [candleData, volumeData, period]);

  return (
    <div
      id="chartContainer"
      className="absolute w-full top-0 left-0 h-full"
      ref={chartContainerRef}
    >
      <div className="three-line-legend bg-indigo-100">
        <div className="legend-title">{title}</div>
        <div className="legend-content">
          {"시가 " + legends.open}
          <br />
          {"고가 " + legends.high}
          <br />
          {"저가 " + legends.low}
          <br />
          {"종가 " + legends.close}
          <br />
          {"거래량 " + legends.volume}
        </div>
        <div>{legends.dateStr}</div>
      </div>
    </div>
  );
};
