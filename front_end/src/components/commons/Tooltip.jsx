import React, { useState } from "react";
import { ReactComponent as TooltipIcon } from "../../assets/tooltipIcon.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Tooltip2({ title, contents, pos, right }) {
  const [tooltipStatus, setTooltipStatus] = useState(0);
  const paragraphList = (str) => {
    return str.split("/").map((content, idx) => {
      return (
        <p className=" text-xs leading-none text-gray-600 pt-2 pb-2" key={idx}>
          {content}
        </p>
      );
    });
  };

  const contentsList = () => {
    return contents.map(({ title, src, alt, content }, idx) => {
      return (
        <div key={idx} className="content-item">
          <p className="text-sm font-semibold leading-none text-gray-800">
            {title}
          </p>
          <div className="grid justify-center items-center gap-1">
            <img
              className="w-[200px] h-[200px] rounded-lg"
              src={src}
              alt={alt}
            />
            {paragraphList(content)}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className={classNames("absolute bottom-0", pos)}>
        {/*Code Block for white tooltip starts*/}
        <div
          className="relative mt-20 md:mt-0"
          onMouseEnter={() => setTooltipStatus(1)}
          onMouseLeave={() => setTooltipStatus(0)}
        >
          <div
            className={classNames("cursor-pointer", right ? "mr-2" : "ml-2")}
          >
            <TooltipIcon />
          </div>
          {tooltipStatus === 1 && (
            <div>
              <div
                role="tooltip"
                className={classNames(
                  "z-20 -mt-20 w-64 absolute transition duration-150 ease-in-out ml-8 shadow-lg bg-white p-4 rounded max-h-[250px] overflow-y-scroll border-2 border-primary",
                  right ? "left-0" : "right-8"
                )}
              >
                {contentsList()}
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
}
export default Tooltip2;
