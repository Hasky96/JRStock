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
export default function Chart({ data }) {
  const chartContainerRef = useRef();

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
        topColor: "rgba(67, 56, 202, 0.56)",
        bottomColor: "rgba(67, 56, 202, 0.04)",
        lineColor: "rgba(67, 56, 202, 1)",
        lineWidth: 2,
      });
      areaSeries.setData(data);
    }

    syncToInterval(data);

    // 종료시 차트 제거
    return () => {
      chart.remove();
    };
  }, [data]);

  // 컴포넌트 반환
  return <div ref={chartContainerRef} />;
}
