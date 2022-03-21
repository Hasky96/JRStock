import { useNavigate } from "react-router-dom";

export default function RankItem({ onChecked, checked, index, item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    window.open(`${item.url}`, "_blank");
  };

  const rankElement = (rank) => {
    if (rank > 3) return rank;

    return (
      <div className="w-14 p-1 m-auto">
        <img
          // className="rounded-full"
          src={require(`../../assets/rank${index + 1}.png`)}
          alt="profile"
        />
      </div>
    );
  };

  return (
    <tr
      className="h-14 hover:bg-indigo-700 hover:cursor-pointer text-center text-white"
      onClick={() => handleOnClick()}
    >
      <td className="font-bold">{rankElement(index + 1)}</td>
      <td>
        <div className="w-12 p-1 m-auto">
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
