import PageContainer from "../PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createBoard } from "../../api/stock";

export default function BoardCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const { id } = useParams();

  const getTitle = (e) => {
    setTitle(e.target.value);
  };

  const getContent = (e) => {
    setContent(e.target.value);
  };

  const create = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
    } else if (!content.trim()) {
      alert("내용을 입력해주세요.");
    } else {
      createBoard(title, content, id);
      navigate(`/stock/${id}/board`);
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
              create();
            }}
          >
            <div className="col-span-12 mt-5 text-3xl text-primary">글쓰기</div>
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
                onChange={getContent}
              ></textarea>
            </div>
            <button className="mt-5 w-full border rounded-md bg-indigo-500 text-white hover:bg-indigo-800 py-2 col-start-5 col-span-1">
              작성
            </button>
            <div
              className="mt-5 w-full text-center border rounded-md bg-slate-300 text-white hover:bg-slate-400 py-2 col-start-8 col-span-1 cursor-pointer"
              onClick={function () {
                navigate(`/stock/${id}/board`);
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
