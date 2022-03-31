import { getNews } from "../../api/stock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as Spinner } from "../../assets/spinner.svg";

export default function News() {
  const [news, setNews] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const init = async () => {
    const res = await getNews(id);
    setNews(res.data);
    if (!res.data.length) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  // 뉴스 페이지로 이동
  const goNews = (link) => {
    window.open(`${link}`);
  };

  // 뉴스 데이터로 li태그 만들기
  const newsList = () => {
    const result = [];
    for (let i = 0; i < news.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"news" + i}
          className="grid grid-cols-8 h-12 hover:bg-indigo-50 hover:cursor-pointer"
          onClick={goNews.bind(this, news[i].link)}
        >
          <p className="col-span-6 my-auto text-left pl-5 font-bold">
            {news[i].title}
          </p>
          <p className="col-span-1 my-auto">{news[i].source}</p>
          <p className="col-span-1 my-auto">{news[i].date}</p>
        </li>
      );
    }
    return result;
  };
  return (
    <div>
      <div className="border-collapse w-full text-center my-8">
        <ul className="xl:text-base lg:text-sm text-xs">
          <li className="grid grid-cols-8 h-12 bg-slate-100">
            <p className="col-span-6 my-auto">제목</p>
            <p className="col-span-1 my-auto">정보제공</p>
            <p className="col-span-1 my-auto">날짜</p>
          </li>
          {isLoading && (
            <div className="flex justify-center items-center my-10">
              <Spinner />
            </div>
          )}
          {!isError ? (
            newsList()
          ) : (
            <div className="mt-6 text-gray-500">
              관련 뉴스를 찾지 못헀습니다..
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
