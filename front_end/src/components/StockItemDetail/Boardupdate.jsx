import PageContainer from "../PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardDetail, updateBoard } from "../../api/stock";

export default function BoardUpdate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const { id, boardId } = useParams();

  const init = async () => {
    const data = await getBoardDetail(boardId);
    setTitle(data.data.title);
    setContent(data.data.content);
  };

  useEffect(() => {
    init();
    if (!sessionStorage.getItem("access_token")) {
      navigate("/login", {
        state: { from: { pathname: `/stock/${id}/board/${boardId}/update` } },
        replace: true,
      });
    }
  }, []);

  const getTitle = (e) => {
    setTitle(e.target.value);
  };

  const getContent = (e) => {
    setContent(e.target.value);
  };

  const update = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
    } else if (!content.trim()) {
      alert("내용을 입력해주세요.");
    } else {
      updateBoard(title, content, boardId);
      navigate(`/stock/${id}/board/${boardId}`);
    }
  };

  return (
    <div>
      <PageContainer>
        <div className="w-full">
          <div className="mt-5 ml-5 text-3xl font-extrabold">종목 토론방</div>
          <form
            className="grid grid-cols-12 place-items-center"
            onSubmit={function (e) {
              e.preventDefault();
              update();
            }}
          >
            <div className="col-span-12 mt-5 text-3xl text-primary">
              글 수정
            </div>
            <div className="w-full col-start-4 col-end-10 mt-10">
              <label htmlFor="title" className="text-primary text-xl">
                제목
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="w-full rounded-lg mt-1 border-indigo-800 ring-indigo-800 focus:border-indigo-300 focus:ring-indigo-300"
                required
                value={title || ""}
                onChange={getTitle}
              />
            </div>
            <div className="w-full col-start-4 col-end-10 mt-10">
              <label htmlFor="content" className="text-primary text-xl">
                내용
              </label>
              <textarea
                name="content"
                id="content"
                rows="10"
                className="w-full rounded-lg mt-1 border-indigo-800 ring-indigo-800 focus:border-indigo-300 focus:ring-indigo-300"
                required
                value={content}
                onChange={getContent}
              ></textarea>
            </div>
            <button className="mt-5 w-full border rounded-md bg-indigo-500 text-white hover:bg-indigo-800 py-2 col-start-5 col-span-1">
              수정
            </button>
            <div
              className="mt-5 w-full text-center border rounded-md bg-slate-300 text-white hover:bg-slate-400 py-2 col-start-8 col-span-1 cursor-pointer"
              onClick={function () {
                navigate(`/stock/${id}/board/${boardId}`);
              }}
            >
              돌아가기
            </div>
          </form>
        </div>
      </PageContainer>
    </div>
  );
}
