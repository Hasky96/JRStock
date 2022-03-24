import { useEffect, useState } from "react";
import NewsTitle from "./NewsTitle";
import NewsList from "./NewsList";
import { getNews } from "../../api/stock";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewsTable({ kind }) {
  const [newsData, setNewsData] = useState([]);

  const init = async () => {
    const res = await getNews(kind.toUpperCase());
    setNewsData(res.data);
  };

  useEffect(() => {
    // newsData 초기화
    init();
  }, []);

  const newsList = () => {
    const list = [];
    newsData.forEach((el, idx) => {
      list.push(<NewsList item={el} index={idx} key={idx} />);
    });
    return list;
  };

  return (
    <div className="h-full mx-5 my-2">
      <table className="table-auto w-full">
        <colgroup>
          <col span="1" style={{ width: 70 + "%" }} />
          <col span="1" style={{ width: 15 + "%" }} />
          <col span="1" style={{ width: 15 + "%" }} />
        </colgroup>
        <NewsTitle titles={["제목", "정보제공", "작성일"]} />
        <tbody className="text-center">
          {newsData.length === 0 ? (
            <tr>
              <td>
                <div className="pt-6 text-gray-500">
                  관련 뉴스를 찾지 못헀습니다..
                </div>
              </td>
            </tr>
          ) : (
            newsList()
          )}
        </tbody>
      </table>
    </div>
  );
}
