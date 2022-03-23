import { useEffect, useState } from "react";
import NewsTitle from "./NewsTitle";
import NewsList from "./NewsList";

const kospiNewsData = [
  {
    title: "코스피 뉴스1",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
  {
    title: "코스피 뉴스2",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
  {
    title: "코스피 뉴스3",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
];

const kosdaqNewsData = [
  {
    title: "코스닥 뉴스1",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
  {
    title: "코스닥 뉴스2",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
  {
    title: "코스닥 뉴스3",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewsTable({ kind }) {
  const [newsData, setNewsData] = useState({});
  useEffect(() => {
    // newsData 초기화
    setNewsData(kind === "kospi" ? kospiNewsData : kosdaqNewsData);
  }, []);

  const newsList = () => {
    const list = [];
    newsData.forEach((el, idx) => {
      list.push(<NewsList item={el} index={idx} key={idx} />);
    });
    return list;
  };

  return (
    <div className="h-96 mx-5 my-2">
      <table className="table-auto w-full">
        <colgroup>
          <col span="1" style={{ width: 70 + "%" }} />
          <col span="1" style={{ width: 15 + "%" }} />
          <col span="1" style={{ width: 15 + "%" }} />
        </colgroup>
        <NewsTitle titles={["제목", "정보제공", "작성일"]} />
        <tbody className="text-center">{newsData.length && newsList()}</tbody>
      </table>
    </div>
  );
}
