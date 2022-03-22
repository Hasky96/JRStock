import { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { CandleChart } from "./CandleChart";
import "../PageContainer.css";
import { getDayStock, getWeekStock, getMonthStock } from "../../api/stock";
import { useParams } from "react-router-dom";
import {
  transLineData,
  transCandleData,
  transVolumeData,
} from "../../util/stockDataUtil";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Chart({ title }) {
  const [data, setData] = useState();
  const [dayData, setDayData] = useState();
  const [weekData, setWeekData] = useState();
  const [monthData, setMonthData] = useState();
  const [period, setPeriod] = useState("1D");
  const { id } = useParams();

  const init = async () => {
    let candleData;
    let volumeData;
    const resDay = await getDayStock(id);
    const lineData = transLineData(resDay.data);
    candleData = transCandleData(resDay.data);
    volumeData = transVolumeData(resDay.data);
    setData(lineData);
    setDayData({ candleData, volumeData });

    const resWeek = await getWeekStock(id);
    candleData = transCandleData(resWeek.data);
    volumeData = transVolumeData(resWeek.data);
    setWeekData({ candleData, volumeData });

    const resMonth = await getMonthStock(id);
    candleData = transCandleData(resMonth.data);
    volumeData = transVolumeData(resMonth.data);
    setMonthData({ candleData, volumeData });
  };

  useEffect(() => {
    init();
  }, [id]);

  let seriesesData = new Map([
    ["1D", data],
    ["1W", data],
    ["1M", data],
    ["1Y", data],
    ["일봉", dayData],
    ["주봉", weekData],
    ["월봉", monthData],
  ]);

  const btnList = () => {
    const list = [];
    const intervals = ["1D", "1W", "1M", "1Y", "일봉", "주봉", "월봉"];
    intervals.forEach((el, idx) => {
      list.push(
        <button
          key={idx}
          onClick={(e) => {
            e.preventDefault();
            setPeriod(e.target.innerText);
          }}
          className={classNames(
            "switcher-item",
            period === el ? "switcher-active-item" : ""
          )}
        >
          {el}
        </button>
      );
    });
    return list;
  };

  return (
    <div className="pt-1 grid grid-cols-1">
      <div className="grid border-2 my-h-50 grid-rows-6 rounded-xl m-2 p-3">
        {"1D1W1M1Y".includes(period) && (
          <div className="grid row-span-5">
            {data && <LineChart data={data} period={period} />}
          </div>
        )}
        {"일봉주봉월봉".includes(period) && (
          <div className="grid row-span-5">
            {seriesesData.get(period) && (
              <CandleChart
                title={title}
                candleData={seriesesData.get(period).candleData}
                volumeData={seriesesData.get(period).volumeData}
                period={period}
              />
            )}
          </div>
        )}
        <div className="switcher row-span-1 pt-8">{btnList()}</div>
      </div>
    </div>
  );
}
