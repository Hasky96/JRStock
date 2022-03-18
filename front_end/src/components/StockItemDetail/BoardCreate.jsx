import PageContainer from "../PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { createBoard } from "../../api/stock";

export default function BoardForm() {
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
      navigate(`/stock/${id}`)
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
            <div className="col-span-12 mt-5 text-3xl text-yellow-900">
              글쓰기
            </div>
            <div className="w-full col-start-4 col-end-10 mt-10">
              <label htmlFor="title" className="text-yellow-900 text-xl">
                제목
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="w-full rounded-lg mt-1 border-yellow-500 ring-yellow-500 focus:border-yellow-300 focus:ring-yellow-300"
                required
                onChange={getTitle}
              />
            </div>
            <div className="w-full col-start-4 col-end-10 mt-10">
              <label htmlFor="content" className="text-yellow-900 text-xl">
                내용
              </label>
              <textarea
                name="content"
                id="content"
                rows="10"
                className="w-full rounded-lg mt-1 border-yellow-500 ring-yellow-500 focus:border-yellow-300 focus:ring-yellow-300"
                required
                onChange={getContent}
              ></textarea>
            </div>
            <button className="mt-5 w-full border rounded-md bg-yellow-300 text-white hover:bg-yellow-500 py-2 col-start-5 col-span-1">
              작성
            </button>
            <div
              className="mt-5 w-full text-center border rounded-md bg-slate-300 text-white hover:bg-slate-400 py-2 col-start-8 col-span-1 cursor-pointer"
              onClick={function () {
                navigate(-1);
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
