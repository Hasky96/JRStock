import { useNavigate } from "react-router-dom";

export default function ListItem({ onChecked, checked, index, item }) {
  const navigate = useNavigate();

  const paintElement = () => {
    const elementArray = [];

    for (let key in item) {
      if (key === "id") continue;
      elementArray.push(
        <td key={key} className="mx-3">
          {item[key]}
        </td>
      );
    }

    return elementArray;
  };
  const handleOnClick = () => {
    navigate(`${item.id}`);
  };
  return (
    <tr
      className="h-12 border-b hover:bg-indigo-50 hover:cursor-pointer duration-200"
      onClick={() => handleOnClick()}
    >
      <td className="px-3">
        <input
          id="checkbox"
          name="checkbox"
          type="checkbox"
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded duration-300"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChecked(e, item.id)}
          checked={checked}
        />
      </td>

      <td>{index + 1}</td>
      {paintElement()}
    </tr>
  );
}
