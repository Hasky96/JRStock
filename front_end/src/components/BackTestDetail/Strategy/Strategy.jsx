export default function Strategy() {
  const strategy = [
    {
      key: "시작일",
      value: "2012-01-01",
    },
    {
      key: "종료일",
      value: "2022-03-15",
    },
    {
      key: "투자 원금(만원)",
      value: "300",
    },
    {
      key: "수수료",
      value: "0.1%",
    },
    {
      key: "목표 수익률",
      value: "1,500 %",
    },
    {
      key: "종목 선정 방식",
      value: "나의 포트폴리오 / 추천 종목",
    },
    {
      key: "사용 전략",
      value: "볼린저 밴드",
    },
    {
      key: "리밸런싱",
      value: "연 단위",
    },
  ];

  const paintStrategy = strategy.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs text-gray-500">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3 gap-2">
        <div className="col-span-5 text-left text-lg">기본조건</div>
        {paintStrategy}
      </div>
      <div className="flex">
        <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3">
          매수 조건
        </div>
        <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3">
          매도 조건
        </div>
      </div>
    </div>
  );
}
