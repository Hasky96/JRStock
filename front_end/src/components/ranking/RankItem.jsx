import { useNavigate } from "react-router-dom";
import { API_MEDIA_URL } from "../../config";
import styles from "./list.module.css";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RankItem({ item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/backtest/${item.id}`);
  };

  const rankElement = (rank) => {
    if (rank > 3) return rank;

    return (
      <div className="xl:w-14 w-12 p-1 m-auto">
        <img src={require(`../../assets/rank${item.rank}.gif`)} alt="profile" />
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
      <td className="font-bold">{rankElement(item.rank)}</td>
      <td>
        <div className="xl:w-12 w-10 p-1 m-auto">
          <img
            className="rounded-full"
            src={
              item.user.profile_img
                ? API_MEDIA_URL + `${item.user.profile_img}`
                : `${item.user.profile_img_url}`
            }
            alt="profile"
          />
        </div>
      </td>
      <td>{item.user.name ? item.user.name : "-"}</td>
      <td>{item.final_rate ? item.final_rate : "-"}</td>
      <td>{item.asset ? item.asset : "-"}</td>
      <td>{item.final_earn ? item.final_earn : "-"}</td>
      <td>{item.final_asset ? item.final_asset : "-"}</td>
      <td>{item.trading_days ? item.trading_days : "-"}</td>
    </tr>
  );
}
