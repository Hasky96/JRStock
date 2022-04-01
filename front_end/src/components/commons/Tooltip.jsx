import React, { useState } from "react";
import { ReactComponent as TooltipIcon } from "../../assets/tooltipIcon.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * iPos: tooltip 아이콘 absolute 위치
 * cPos: tooltip 내용 absolute 위치
 */
function Tooltip({ children, iPos, cPos }) {
  const [tooltipStatus, setTooltipStatus] = useState(0);

  return (
    <>
      <div className={classNames("absolute", iPos)}>
        {/*Code Block for white tooltip starts*/}
        <div
          className="relative"
          onMouseEnter={() => setTooltipStatus(1)}
          onMouseLeave={() => setTooltipStatus(0)}
        >
          <div className="absolute z-[80]">
            <TooltipIcon />
          </div>
          {tooltipStatus === 1 && (
            <div>
              <div
                role="tooltip"
                className={classNames(
                  "z-[140] absolute transition duration-150 ease-in-out shadow-lg bg-white p-4 rounded max-h-[400px] min-w-[300px] overflow-y-scroll border-2 border-primary",
                  cPos
                )}
              >
                {children}
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
}
export default Tooltip;
