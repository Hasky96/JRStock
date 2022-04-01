import { useNavigate } from "react-router-dom";
import { API_MEDIA_URL } from "../../config";
import styles from "./list.module.css";
import ReactTooltip from "react-tooltip";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RankItem({ item }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/backtest/${item.id}`);
  };

  const applyTruncate = (content, title) => {
    return (
      <div>
        <div
          className="block truncate m-auto xl:w-32 w-16"
          data-tip
          data-for={`${item.id}-${title}`}
        >
          {content}
        </div>
        <ReactTooltip
          className="tooltipExtra"
          id={`${item.id}-${title}`}
          type="dark"
          effect="solid"
          backgroundColor="#E69A8DFF"
        >
          <span className="text-base">{content}</span>
        </ReactTooltip>
      </div>
    );
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
            className="rounded-full w-10 h-10"
            src={
              item.user.profile_img
                ? API_MEDIA_URL + `${item.user.profile_img}`
                : `${item.user.profile_img_url}`
            }
            alt="profile"
          />
        </div>
      </td>
      <td>{applyTruncate(item.user.name ? item.user.name : "-", "name")}</td>
      <td>{applyTruncate(item.title ? item.title : "-", "title")}</td>
      <td>
        {applyTruncate(
          item.final_rate ? item.final_rate.toFixed(1) : "-",
          "final_rate"
        )}
      </td>
      <td>
        {applyTruncate(item.asset ? item.asset.toLocaleString() : "-", "asset")}
      </td>
      <td>
        {applyTruncate(
          item.final_earn ? item.final_earn.toLocaleString() : "-",
          "final_earn"
        )}
      </td>
      <td>
        {applyTruncate(
          item.final_asset ? item.final_asset.toLocaleString() : "-",
          "final_asset"
        )}
      </td>
      <td>
        {applyTruncate(
          item.trading_days ? item.trading_days : "-",
          "trading_days"
        )}
      </td>
    </tr>
  );
}
