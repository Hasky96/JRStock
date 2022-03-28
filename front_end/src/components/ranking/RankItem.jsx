import { useNavigate } from "react-router-dom";
import styles from "./list.module.css";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RankItem({ onChecked, checked, index, item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    window.open(`${item.url}`, "_blank");
  };

  const rankElement = (rank) => {
    if (rank > 3) return rank;

    return (
      <div className="xl:w-14 w-12 p-1 m-auto">
        <img src={require(`../../assets/rank${index + 1}.gif`)} alt="profile" />
      </div>
    );
  };

  return (
    <tr
      className={classNames(
        "h-14 hover:bg-indigo-50 hover:cursor-pointer text-center text-primary border-b rounded-lg xl:text-base text-sm"
      )}
      onClick={() => handleOnClick()}
    >
      <td className="font-bold">{rankElement(index + 1)}</td>
      <td>
        <div className="xl:w-12 w-10 p-1 m-auto">
          <img
            className="rounded-full"
            src="https://source.unsplash.com/random/200x200"
            alt="profile"
          />
        </div>
      </td>
      <td>{item.name}</td>
      <td>{item["수익률"]}</td>
      <td>{item["투자원금"]}</td>
      <td>{item["총 손익"]}</td>
      <td>{item["최종 자산"]}</td>
      <td>{item["매매일수"]}</td>
    </tr>
  );
}
