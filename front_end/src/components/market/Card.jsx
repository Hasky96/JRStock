import costMap from "../../util/costMap";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function card({ info }) {
  return (
    <div className="border-2 rounded-xl m-2">
      <div>
        <div>
          <div
            className={classNames(
              "ml-5 mt-5 text-2xl",
              info.open > info.close ? "text-blue-600" : "text-red-500"
            )}
          >
            <span className="mr-3">{(+info.close.toFixed(2)).toLocaleString()}</span>
            <span>{`${info.close - info.open < 0 ? "▼" : "▲"} ${(
              info.close - info.open
            ).toFixed(3)} (${((info.close / info.open) * 100 - 100).toFixed(
              3
            )}%)`}</span>
          </div>
          <span className="ml-5 text-gray-400">{`${info.date} 기준`}</span>
        </div>
      </div>
      <div className="grid grid-rows-2 m-5 gap-8">
        <div className="grid grid-rows-1 grid-cols-2">
          <div className="grid grid-cols-1">
            <div className="font-bold">거래량</div>
            <div>{(+info.volume).toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-1">
            <div className="font-bold">거래 대금</div>
            <div>{`${costMap(info.tradePrice)}`}</div>
          </div>
        </div>
        <div className="grid grid-rows-1 grid-cols-2">
          <div className="grid grid-cols-1">
            <div className="font-bold">장중 최고</div>
            <div>{(+info.high.toFixed(2)).toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-1">
            <div className="font-bold">장중 최저</div>
            <div>{(+info.low.toFixed(2)).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
