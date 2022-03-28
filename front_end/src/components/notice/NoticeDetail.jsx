import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItem, deleteNotice } from "../../api/notice";
import { userDetail } from "../../api/user";
import PageContainer from "../PageContainer";
import { ReactComponent as NoticeDeleteIcon } from "../../assets/noticeDeleteIcon.svg";
import { ReactComponent as NoticeUpdateIcon } from "../../assets/noticeUpdateIcon.svg";

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const init = async () => {
    const data = await getItem(id);
    setNotice(data);

    const userData = await userDetail();
    setUser(userData);
  };

  useEffect(() => {
    init();
  }, []);

  const onClickUpdate = () => {
    navigate("update");
  };

  const onClickDelete = async () => {
    if (window.confirm("공지사항을 삭제하시겠습니까?")) {
      await deleteNotice(notice.id);
      navigate(`/notice`);
    }
  };

  const noticeInfo = () => {
    return (
      <div className="p-10">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-4xl font-bold">{notice?.title}</h1>
          {user && user?.id === notice?.user.id && (
            <div>
              <button
                className="mr-10 pl-2 pr-1 pt-1 pb-1.5 rounded-md bg-indigo-700 fill-white"
                onClick={onClickUpdate}
              >
                <NoticeUpdateIcon />
              </button>
              <button
                className="px-1.5 pt-1 pb-1.5 rounded-md bg-red-600 fill-white"
                onClick={onClickDelete}
              >
                <NoticeDeleteIcon />
              </button>
            </div>
          )}
        </div>
        <div className="border-b-2 pb-3 text-gray-400 text-lg">
          <span>{notice?.user?.name}</span>
          <span className="ml-14">
            {notice?.created_at?.substring(0, 10)}{" "}
            {notice?.created_at?.substring(11, 19)}
          </span>
        </div>
        <div className="my-5 text-xl">{notice?.content}</div>
        <button
          className="block m-auto rounded-xl border-2 w-32 h-12 bg-primary hover:bg-active text-xl font-bold text-white duration-300 bottom-5"
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
