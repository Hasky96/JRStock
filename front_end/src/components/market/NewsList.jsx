import { useNavigate } from "react-router-dom";

export default function NewsItem({ onChecked, checked, index, item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    window.open(`${item.url}`, "_blank");
  };
  return (
    <tr
      className="h-12 border-b hover:bg-indigo-50 hover:cursor-pointer"
      onClick={() => handleOnClick()}
    >
      <td className="font-bold">{item.title}</td>
      <td>{item.press}</td>
      <td>{item.created_at}</td>
    </tr>
  );
}
