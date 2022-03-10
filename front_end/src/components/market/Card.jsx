export default function card({ info }) {
  return (
    <div className="border-2 rounded-xl m-5">
      <div className="flex w-full md:w-1/2 p-10 bg-gray-100 text-gray-600 items-center">
        <div className="w-full">
          <h3 className="text-lg font-semibold leading-tight text-gray-800">
            {info.stockFullName}
          </h3>
          <h6 className="text-sm leading-tight mb-2">
            <span>{info.stockShortName}</span>
            &nbsp;&nbsp;-&nbsp;&nbsp;Aug 2nd 4:10pm AEST
          </h6>
          <div className="flex w-full items-end mb-6">
            <span className="block leading-none text-3xl text-gray-800">
              {info.price.current}
            </span>
            <span className="block leading-5 text-sm ml-4 text-green-500">
              {`${info.price.high - info.price.low < 0 ? "▼" : "▲"} ${
                info.price.high - info.price.low
              } (${(info.price.high / info.price.low) * 100 - 100}%)`}
            </span>
          </div>
          <div className="flex w-full text-xs">
            <div className="flex w-5/12">
              <div className="flex-1 pr-3 text-left font-semibold">Open</div>
              <div className="flex-1 px-3 text-right">{info.price.open}</div>
            </div>
            <div className="flex w-7/12">
              <div className="flex-1 px-3 text-left font-semibold">
                Market Cap
              </div>
              <div className="flex-1 pl-3 text-right">{info.price.cap}</div>
            </div>
          </div>
          <div className="flex w-full text-xs">
            <div className="flex w-5/12">
              <div className="flex-1 pr-3 text-left font-semibold">High</div>
              <div className="px-3 text-right">{info.price.high}</div>
            </div>
            <div className="flex w-7/12">
              <div className="flex-1 px-3 text-left font-semibold">
                P/E ratio
              </div>
              <div className="pl-3 text-right">{info.price.ratio}</div>
            </div>
          </div>
          <div className="flex w-full text-xs">
            <div className="flex w-5/12">
              <div className="flex-1 pr-3 text-left font-semibold">Low</div>
              <div className="px-3 text-right">{info.price.low}</div>
            </div>
            <div className="flex w-7/12">
              <div className="flex-1 px-3 text-left font-semibold">
                Dividend yield
              </div>
              <div className="pl-3 text-right">{`${info.price.dividend}%`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
