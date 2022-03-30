import { useNavigate } from "react-router-dom";

export default function NoticeListItem({ element }) {
  const navigate = useNavigate();
  // 종목 클릭 시 해당 종목 디테일 페이지로
  const goDetailPage = (id) => {
    navigate(`${id}`);
  };

  return (
    <li className="grid grid-cols-12 h-12 hover:bg-indigo-50 hover:cursor-pointer border-b xl:text-base text-sm">
      <p
        className="col-span-6 my-auto"
        onClick={goDetailPage.bind(this, element.id)}
      >
        {element.title}
      </p>
      <p
        className="col-span-3 my-auto"
        onClick={goDetailPage.bind(this, element.id)}
      >
        {element.user.name}
      </p>
      <p
        className="col-span-3 my-auto"
        onClick={goDetailPage.bind(this, element.id)}
      >
        {element.created_at.substring(0, 10)}
      </p>
    </li>
  );
}
