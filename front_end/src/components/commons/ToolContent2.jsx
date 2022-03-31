import {
  srcDict,
  altDict,
  contentDict,
  linkDict,
} from "../BackTestCreate/tooltipData";
import { strategies, details, paramDict } from "../../config/backtestConfig";

export default function ToolContent2({ sId }) {
  const paragraphList = (str) => {
    return str.split("/n").map((content, idx) => {
      return (
        <p
          className=" text-base leading-normal text-gray-600 my-2 text-ellipsis overflow-hidden whitespace-pre-wrap"
          key={idx}
        >
          {content}
        </p>
      );
    });
  };

  const paramsList = (params) => {
    const list = [];
    for (const key in params) {
      if (key === "0") continue;
      list.push(
        <li key={key}>
          <span className="font-bold">{`${paramDict[key]} `}</span>
          <span>{`${params[key]}`}</span>
        </li>
      );
    }
    list.push(
      <li key={0}>
        <span className="font-bold">{"점수 "}</span>
        <span>{`${params[0]}`}</span>
      </li>
    );

    return list;
  };

  const contents = () => {
    return (
      <div className="content-item mb-5">
        <div className="flex justify-between mb-5 ">
          <div className="pr-1 flex flex-col flex-1 justify-center text-center">
            <div className="text-xl flex-1 font-semibold text-gray-800 whitespace-pre-wrap ">
              {`${strategies[sId.split("0")[0]]}`}
            </div>
            <div className="text-sm font-semibold flex-1 text-gray-500 ">{`${
              details[sId.split("0")[1]]
            }`}</div>
          </div>
        </div>
        <div className="grid justify-center items-center">
          <img
            className="max-w-[400px] max-h-[400px] rounded-lg"
            src={require(`../../assets/${srcDict[sId]}`)}
            alt={altDict[sId]}
          />
          {paragraphList(contentDict[sId].info)}
          {<ul>{paramsList(contentDict[sId].params)}</ul>}
        </div>
        <button
          className="float-right bg-primary text-white rounded-lg px-2 py-2 hover:bg-active duration-300"
          onClick={(e) => {
            e.preventDefault();
            // 위키로 이동
            window.open(linkDict[sId], "_blank");
          }}
        >
          자세히 보기
        </button>
      </div>
    );
  };

  return <div className="pb-6">{contents()}</div>;
}
