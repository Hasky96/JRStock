import { createChart } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export const ProfitChart = ({ marketData, testData }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      console.log("resize here: chartContainerRef.current.clientWidth");
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      width: 800,
      height: 400,
      layout: {
        fontFamily: "Comic Sans MS",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0)",
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
      },
    });
    chart.timeScale().fitContent();

    const marketSeries = chart.addAreaSeries({
      topColor: "rgba(255, 196, 42, 0.56)",
      bottomColor: "rgba(255, 196, 42, 0.04)",
      lineColor: "rgba(255, 196, 42, 1)",
      lineWidth: 2,
    });
    const testSeries = chart.addAreaSeries({
      topColor: "rgba(254, 138, 125, 0.56)",
      bottomColor: "rgba(254, 138, 125, 0.04)",
      lineColor: "rgba(254, 138, 125, 1)",
      lineWidth: 2,
    });

    marketSeries.setData(marketData);
    testSeries.setData(testData);

    var minimumPrice = marketData[0].value;
    var maximumPrice = minimumPrice;
    for (var i = 1; i < marketData.length; i++) {
      var price = marketData[i].value;
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

    testSeries.createPriceLine(minPriceLine);
    testSeries.createPriceLine(maxPriceLine);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [marketData, testData]);

  return <div id="chartContainer" className="w-full" ref={chartContainerRef} />;
};
