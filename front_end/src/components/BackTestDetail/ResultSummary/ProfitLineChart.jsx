import { createChart } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { nameDict } from "../../../config/backtestConfig";

export const ProfitLineChart = ({
  priceData,
  dayEarnData,
  period,
  records,
  markers,
}) => {
  const zeroFill = (s) => {
    return ("00" + s).slice(-2);
  };

  const stringToDate = (date) => {
    const [year, month, day] = date.split("-");
    return year + "-" + zeroFill(month) + "-" + zeroFill(day);
  };

  const dateObjToString = (date) => {
    return date.year + "-" + date.month + "-" + date.day;
  };

  const initailDate =
    typeof priceData[priceData.length - 1].time === "string"
      ? stringToDate(priceData[priceData.length - 1].time)
      : priceData[priceData.length - 1].time.year +
        "-" +
        priceData[priceData.length - 1].time.month +
        "-" +
        priceData[priceData.length - 1].time.day;

  const initialLegend = {
    dateStr: stringToDate(initailDate),
    price: priceData[priceData.length - 1].value,
    earn: dayEarnData[priceData.length - 1].value,
  };

  const [legends, setLegends] = useState(initialLegend);
  const chartContainerRef = useRef();

  const barSpacingPerPeriod = new Map([
    ["1D", 32],
    ["1W", 8],
    ["1M", 2],
    ["1Y", 0.5],
  ]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        fontFamily: "Comic Sans MS",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.1)",
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        barSpacing: barSpacingPerPeriod.get(period),
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
      },
    });

    const priceSeries = chart.addAreaSeries({
      // rgba(24, 33, 109, 1)
      topColor: "rgba(255, 130, 92, 0.8)",
      bottomColor: "rgba(255, 130, 92, 0)",
      lineColor: "rgba(255, 130, 92, 1)",
      lineWidth: 1,
    });

    const dayEarnSeries = chart.addHistogramSeries({
      // color: "#26a69a",
      lineWidth: 2,
      color: "rgba(24, 33, 109, 0.8)",
      priceFormat: {
        type: "value",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });

    priceSeries.setData(priceData);
    priceSeries.applyOptions({
      priceFormat: {
        type: "price",
        precision: 0,
        minMove: 10,
      },
    });
    dayEarnSeries.setData(dayEarnData);
    dayEarnSeries.applyOptions({
      priceFormat: {
        type: "price",
        precision: 0,
        minMove: 10,
      },
    });

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
          "-" +
          zeroFill(param.time.month) +
          "-" +
          zeroFill(param.time.day);

        const price = param.seriesPrices.get(priceSeries);
        const earn = param.seriesPrices.get(dayEarnSeries);

        if (typeof records[dateStr] === "object") {
          const { buy_sell_option, isBuy, isWin, stock_amount, stock_price } =
            records[dateStr];

          setLegends({
            dateStr,
            price,
            earn,
            buy_sell_option,
            isBuy,
            isWin,
            stock_amount,
            stock_price,
          });
        } else {
          setLegends({
            dateStr,
            price,
            earn,
          });
        }
      }
    });

    let minimumPrice = priceData[0].value;
    let maximumPrice = minimumPrice;
    for (let i = 1; i < priceData.length; i++) {
      let price = priceData[i].value;
      if (price > maximumPrice) {
        maximumPrice = price;
      }
      if (price < minimumPrice) {
        minimumPrice = price;
      }
    }

    const minPriceLine = {
      price: minimumPrice,
      color: "#FAEBE5",
      lineWidth: 1,
      axisLabelVisible: true,
      title: "최저",
    };
    const maxPriceLine = {
      price: maximumPrice,
      color: "#FAEBE5",
      lineWidth: 1,
      axisLabelVisible: true,
      title: "최고",
    };

    priceSeries.createPriceLine(minPriceLine);
    priceSeries.createPriceLine(maxPriceLine);

    function myVisibleTimeRangeChangeHandler(newVisibleTimeRange) {
      if (newVisibleTimeRange === null) {
        // handle null
      }

      if (
        new Date(dateObjToString(newVisibleTimeRange.to)) -
          new Date(dateObjToString(newVisibleTimeRange.from)) <
        18067600000
      ) {
        priceSeries.setMarkers(markers);
      } else {
        priceSeries.setMarkers([]);
      }
    }

    chart
      .timeScale()
      .subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const width = chartContainerRef.current.clientWidth;
    const height = chartContainerRef.current.clientWidth;

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [priceData, dayEarnData, period, records]);

  return (
    <div className="parent-container">
      <div className="child-container" ref={chartContainerRef} />
      <div className="absolute z-10 top-0 left-0">
        <div className="opacity-100 text-sm font-semibold text-gray-500">
          <div className="flex my-1">
            <p className="mr-3">현재 자산</p>
            <p className="mr-3">{legends.price.toLocaleString()}원</p>
          </div>
          <div className="flex my-1">
            <p className="mr-3 my-0">수익</p>
            <p>{legends.earn.toLocaleString()}원</p>
          </div>
          <div>
            <p className="mr-3 text-xs font-normal">{legends.dateStr}</p>
          </div>

          {legends.buy_sell_option && (
            <div className="flex">
              <p className="mr-1 text-xs font-normal">매수 전략:</p>
              <p className="mr-3 text-xs font-normal">
                {legends.buy_sell_option}
              </p>
            </div>
          )}

          <div className="flex">
            <p className="mr-3 mt-0 text-xs font-normal">
              {typeof legends.isBuy === "boolean" &&
                (legends.isBuy ? "매수:" : "매도:") +
                  " " +
                  legends.stock_amount +
                  "주"}{" "}
            </p>
          </div>
          {legends.stock_price && (
            <div className="flex">
              <p className="mr-1 text-xs font-normal">매매가:</p>
              <p className="mr-3 text-xs font-normal">
                {legends.stock_price.toLocaleString()}
              </p>
            </div>
          )}

          <p className="mr-3 text-xs font-normal">
            {typeof legends.isWin === "boolean" &&
              (legends.isWin ? "@승" : "@패")}
          </p>
        </div>
      </div>
    </div>
  );
};

// const dayEarnSeries = chart.addLineSeries({
//   color: "rgba(24, 33, 109, 0.8)",
//   lineWidth: 1,
// });

{
  /* {legends.stock_amount && (
            <>
              <span className="mr-1 text-xs font-normal">매매 수량</span>
              <span className="mr-3 text-xs font-normal"></span>
            </>
          )} */
}
