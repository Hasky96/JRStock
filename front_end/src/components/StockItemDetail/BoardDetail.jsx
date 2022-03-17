import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardDetail } from "../../api/stock";
import PageContainer from "../PageContainer";

export default function BoardDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState();
  const [comment, setComment] = useState();
  const navigate = useNavigate();

  const init = async () => {
    const boardData = await getBoardDetail(boardId);
    setBoard(boardData);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <PageContainer>
      <div className="p-10">
        <h1 className="text-4xl my-10 font-bold">{board?.data?.title}</h1>
        <div className="border-b-2 pb-3 text-gray-400 text-lg flex justify-between">
          <p>작성자 : {board?.data?.user.name}</p>
          <p>
            {board?.data?.created_at.substring(0, 10)}{" "}
            {board?.data?.created_at.substring(11, 19)}
          </p>
        </div>
        <div className="text-xl p-10">{board?.data?.content}</div>
        <div className="text-2xl font-bold my-32">댓글</div>
        <button
          className="block m-auto rounded-xl border-2 w-32 h-12 bg-indigo-100 text-xl font-bold text-indigo-500 border-indigo-800 bottom-5"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/stock/${board.data.basic_info.code_number}`);
          }}
        >
          목록
        </button>
      </div>
    </PageContainer>
  );
}
