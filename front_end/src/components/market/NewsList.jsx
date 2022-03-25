import { useNavigate } from "react-router-dom";

export default function NewsItem({ onChecked, checked, index, item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    window.open(`${item.link}`, "_blank");
  };
  return (
    <tr
      className="h-12 border-b hover:bg-indigo-50 hover:cursor-pointer xl:text-base text-sm"
      onClick={() => handleOnClick()}
    >
      <td className="font-bold">{item.title}</td>
      <td>{item.source}</td>
      <td className="xl:text-base text-xs">{item.date}</td>
    </tr>
  );
}
