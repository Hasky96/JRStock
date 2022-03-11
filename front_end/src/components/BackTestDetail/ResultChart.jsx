import { createChart } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export const ResultChart = ({ marketData, testData }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
      layout: {
        fontFamily: "Comic Sans MS",
        backgroundColor: "rgba(255, 196, 42, 0.05)",
      },
      rightPriceScale: {
        borderColor: "rgba(197, 203, 206, 1)",
      },
      timeScale: {
        borderColor: "rgba(197, 203, 206, 1)",
      },
    });
    chart.timeScale().fitContent();

    const marketSeries = chart.addAreaSeries({
      topColor: "rgba(19, 68, 193, 0.4)",
      bottomColor: "rgba(0, 120, 255, 0.0)",
      lineColor: "rgba(19, 40, 153, 1.0)",
      lineWidth: 3,
    });
    const testSeries = chart.addAreaSeries({
      topColor: "rgba(252, 69, 136, 0.4)",
      bottomColor: "rgba(250, 174, 192, 0.0)",
      lineColor: "rgba(252, 69, 136, 1.0)",
      lineWidth: 3,
    });

    marketSeries.setData(marketData);
    testSeries.setData(testData);

    const minPriceLine = {
      price: 120,
      color: "#FFC42A",
      lineWidth: 1,
      axisLabelVisible: true,
      title: "원금",
    };
    const maxPriceLine = {
      price: 200,
      color: "#FFC42A",
      lineWidth: 1,
      axisLabelVisible: true,
      title: "목표치",
    };

    testSeries.createPriceLine(minPriceLine);
    testSeries.createPriceLine(maxPriceLine);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [marketData, testData]);

  return <div ref={chartContainerRef} />;
};
