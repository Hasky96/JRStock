import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItem } from "../api/notice";
import PageContainer from "../components/PageContainer";

export default function NoticeDetail() {
  const { id } = useParams();
  const [item, setItem] = useState();
  const navigate = useNavigate();
  const init = async () => {
    const data = await getItem(id);
    setItem(data);
  };

  useEffect(() => {
    init();
  }, []);

  const noticeInfo = () => {
    return (
      <div className="p-10">
        <h1 className="text-4xl my-10 font-bold">{item?.title}</h1>
        <div className="border-b-2 pb-3 text-gray-400 text-lg">
          <span>{item?.user?.name}</span>
          <span className="ml-14">
            {item?.created_at?.substring(0, 10)}{" "}
            {item?.created_at?.substring(11, 19)}
          </span>
        </div>
        <div className="my-5 text-xl">{item?.content}</div>
        <button
          className="block m-auto rounded-xl border-2 w-32 h-12 bg-yellow-100 text-xl font-bold text-orange-500 border-yellow-500 bottom-5"
          onClick={(e) => {
            e.preventDefault();
            navigate({ pathname: `/notice` });
          }}
        >
          목록
        </button>
      </div>
    );
  };

  return <PageContainer className="">{noticeInfo()}</PageContainer>;
}
