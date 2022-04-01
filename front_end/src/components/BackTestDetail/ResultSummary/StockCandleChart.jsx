import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const dateObjToString = (date) => {
  return date.year + "-" + date.month + "-" + date.day;
};

export const StockCandleChart = ({
  candleData,
  volumeData,
  period,
  markers,
}) => {
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
    const width = chartContainerRef.current.clientWidth;
    const height = chartContainerRef.current.clientWidth;

    const chart = (window.tvchart = createChart(chartContainerRef.current, {
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
        barSpacing: period,
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

    function myVisibleTimeRangeChangeHandler(newVisibleTimeRange) {
      if (newVisibleTimeRange === null) {
        // handle null
      }

      if (
        new Date(dateObjToString(newVisibleTimeRange.to)) -
          new Date(dateObjToString(newVisibleTimeRange.from)) <
        19626400000
      ) {
        series.setMarkers(markers);
      } else {
        series.setMarkers([]);
      }
    }

    chart
      .timeScale()
      .subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [candleData, volumeData, period]);

  return (
    <div className="parent-container">
      <div className="child-container" ref={chartContainerRef} />
      <div className="absolute z-10 top-0 left-0">
        <div className="opacity-100 text-sm font-semibold text-gray-500">
          <div className="flex">
            <p className="mr-1 text-xs font-normal">시가:</p>
            <p className="mr-3 text-xs font-normal">
              {legends.open.toLocaleString()}
            </p>
          </div>
          <div className="flex">
            <p className="mr-1 text-xs font-normal">저가:</p>
            <p className="mr-3 text-xs font-normal">{legends.low}</p>
          </div>
          <div className="flex">
            <p className="mr-1 text-xs font-normal">고가:</p>
            <p className="mr-3 text-xs font-normal">{legends.high}</p>
          </div>
          <div className="flex">
            <p className="mr-1 text-xs font-normal">종가:</p>
            <p className="mr-3 text-xs font-normal">{legends.close}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
