function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function card({ info }) {
  return (
    <div className="border-2 rounded-xl m-2">
      <div
        className={classNames(
          "m-5 text-2xl mb-10",
          info.open > info.close ? "text-red-900" : "text-green-900"
        )}
      >
        <span className="mr-3">{info.close.toFixed(2)}</span>
        <span>{`${info.close - info.open < 0 ? "▼" : "▲"} ${(
          info.close - info.open
        ).toFixed(3)} (${((info.close / info.open) * 100 - 100).toFixed(
          3
        )}%)`}</span>
      </div>
      <div className="grid grid-rows-2 m-5 gap-8">
        <div className="grid grid-rows-1 grid-cols-2">
          <div className="grid grid-cols-1">
            <div className="font-bold">거래량</div>
            <div>{info.volume}</div>
          </div>
          <div className="grid grid-cols-1">
            <div className="font-bold">거래 대금</div>
            <div>{`${parseInt(
              info.volume * info.open
            ).toLocaleString()} 원`}</div>
          </div>
        </div>
        <div className="grid grid-rows-1 grid-cols-2">
          <div className="grid grid-cols-1">
            <div className="font-bold">장중 최고</div>
            <div>{info.high.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-1">
            <div className="font-bold">장중 최저</div>
            <div>{info.low.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
