import { useNavigate } from "react-router-dom";
import { ReactComponent as Spinner } from "../../assets/spinner_small.svg";
import { ReactComponent as Delete } from "../../assets/trashcan.svg";

export default function ListItem({ index, item, handleDeleteButton }) {
  const navigate = useNavigate();

  const paintElement = () => {
    const elementArray = [];

    for (let key in item) {
      if (key === "id") continue;
      elementArray.push(
        <td key={key} className="mx-3">
          {item[key] === "테스트 중" ? <Spinner /> : item[key]}
        </td>
      );
    }

    elementArray.push(
      <td key={item.id} className="mx-3">
        <button type="button" onClick={(e) => handleDeleteButton(e, item.id)}>
          <Delete fill="#ff825c" />
        </button>
      </td>
    );

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
      <td>{index + 1}</td>
      {paintElement()}
    </tr>
  );
}
