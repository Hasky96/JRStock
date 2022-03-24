import { createChart } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

/**
 * prop.data 로
 *
 * [{ time: "2006-01-02", value: 24.89 }
 * , { time: "2006-01-02", value: 24.89 }]
 *
 * 위 형식의 데이터를 받는다.
 *
 *  */
export default function Chart({ data, period }) {
  const chartContainerRef = useRef();

  var barSpacingPerPeriod = new Map([
    ["1D", 32],
    ["1W", 8],
    ["1M", 2],
    ["1Y", 0.5],
  ]);

  // 데이터가 변경될 때 그래프를 그린다.
  useEffect(() => {
    var chart = createChart(chartContainerRef.current, {
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {},
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

    var areaSeries = null;

    // 데이터 셋팅 함수
    function syncToInterval(data) {
      if (areaSeries) {
        chart.removeSeries(areaSeries);
        areaSeries = null;
      }
      areaSeries = chart.addAreaSeries({
        topColor: "rgba(24, 33, 109, 0.56)",
        bottomColor: "rgba(24, 33, 109, 0.04)",
        lineColor: "rgba(24, 33, 109, 1)",
        lineWidth: 2,
      });
      areaSeries.setData(data);
    }

    syncToInterval(data);

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    // 종료시 차트 제거
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, period]);

  // 컴포넌트 반환
  return (
    <div
      className="absolute w-full top-0 left-0 h-full"
      ref={chartContainerRef}
    />
  );
}
