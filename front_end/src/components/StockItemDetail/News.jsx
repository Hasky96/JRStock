export default function News() {
  const news = [
    {
      title: "카카오, 일본 찍고 글로벌 공략체제로...김범수 직접 나선다",
      inform: "머니투데이",
      date: "2022.03.14 12:17",
    },
    {
      title: "김범수 카카오 이사회 의장직 사임…글로벌 사업 확장에 전념",
      inform: "헤럴드경제",
      date: "2022.03.14 12:09",
    },
    {
      title: "[속보] 카카오 창업자 김범수, 이사회 의장직 사임",
      inform: "한국경제",
      date: "2022.03.14 11:55",
    },
  ];

  // 뉴스 데이터로 li태그 만들기
  const newsList = () => {
    const result = [];
    for (let i = 0; i < news.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"news" + i}
          className="grid grid-cols-8 h-12 hover:bg-yellow-50 hover:cursor-pointer"
        >
          <p className="col-span-6 my-auto text-left pl-5 font-bold">
            {news[i].title}
          </p>
          <p className="col-span-1 my-auto">{news[i].inform}</p>
          <p className="col-span-1 my-auto">{news[i].date}</p>
        </li>
      );
    }
    return result;
  };
  return (
    <div>
      <div className="border-collapse w-full text-center my-8">
        <ul>
          <li className="grid grid-cols-8 h-12 bg-slate-100">
            <p className="col-span-6 my-auto">제목</p>
            <p className="col-span-1 my-auto">정보제공</p>
            <p className="col-span-1 my-auto">날짜</p>
          </li>
          {newsList()}
        </ul>
      </div>
    </div>
  );
}
