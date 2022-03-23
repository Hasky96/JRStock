import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import styles from "./CandleChart.module.css";

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

    const width = chartContainerRef.current.clientWidth;
    const height = chartContainerRef.current.clientWidth;

    var chart = (window.tvchart = createChart(chartContainerRef.current, {
      // width: width,
      // height: height,
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
          color: "rgba(49, 46, 129, 0.1)",
          labelVisible: true,
          labelBackgroundColor: "rgba(49, 46, 129, 0.1)",
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: "rgba(49, 46, 129, 0.1)",
          // labelVisible: false,
          labelVisible: true,
          labelBackgroundColor: "rgba(49, 46, 129, 0.1)",
        },
      },
    }));
    // rgba(255,0,0, 0.8)" },
    // { time: "2019-05-24", value: 8755506.0, color: "rgba(0,0,255, 0.8)
    var series = chart.addCandlestickSeries({
      upColor: "#ef4444",
      wickUpColor: "#ef4444",
      borderUpColor: "#ef4444",
      downColor: "#2563eb",
      wickDownColor: "#2563eb",
      borderDownColor: "#2563eb",
    });

    series.setData(candleData);

    var volumeSeries = chart.addHistogramSeries({
      // color: "#26a69a",
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
      className="w-full relative"
      ref={chartContainerRef}
    >
      <div className={styles["market-three-line-legend"]}>
        <div className={styles["legend-title"]}>{title}</div>
        <div className={styles["legend-content"]}>
          {"시가 " + legends.open}
          <br />
          {"  고가 " + legends.high}
          <br />
          {"  저가 " + legends.low}
          <br />
          {"  종가 " + legends.close}
          <br />
          {"  거래량 " + legends.volume}
        </div>
        <div>{legends.dateStr}</div>
      </div>
    </div>
  );
};
