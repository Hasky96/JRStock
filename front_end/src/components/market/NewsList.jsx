import { useNavigate } from "react-router-dom";

export default function NewsItem({ onChecked, checked, index, item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    window.open(`${item.url}`, "_blank");
  };
  return (
    <tr
      className="h-12 border-b hover:bg-yellow-50 hover:cursor-pointer"
      onClick={() => handleOnClick()}
    >
      <td>{index + 1}</td>
      <td className="font-bold">{item.title}</td>
      <td>{item.press}</td>
      <td>{item.created_at}</td>
    </tr>
  );
}
