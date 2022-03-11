import { Link } from "react-router-dom";

export default function TabItem({ link, text, handleOnClick }) {
  return (
    <Link
      to={link}
      onClick={(e) => handleOnClick(e, text)}
      className="tab-item"
    >
      {text}
    </Link>
  );
}
