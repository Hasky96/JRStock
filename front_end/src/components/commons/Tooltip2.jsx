import React, { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tooltip2({ title, children, cPos }) {
  const [tooltipStatus, setTooltipStatus] = useState(0);

  return (
    <>
      <span
        onMouseEnter={() => setTooltipStatus(1)}
        onMouseLeave={() => setTooltipStatus(0)}
      >
        {title}
      </span>
      {/*Code Block for white tooltip starts*/}
      <div
        className="relative"
        onMouseEnter={() => setTooltipStatus(1)}
        onMouseLeave={() => setTooltipStatus(0)}
      >
        {tooltipStatus === 1 && (
          <div>
            <div
              role="tooltip"
              className={classNames(
                "z-[60] absolute transition duration-150 ease-in-out shadow-lg bg-white p-4 rounded max-h-[250px] min-w-[300px] overflow-y-scroll border-2 border-primary",
                cPos
              )}
            >
              {children}
            </div>
          </div>
        )}{" "}
      </div>
    </>
  );
}
