import React, { useState } from "react";

function Tooltip({ title, contents }) {
  const [isShow, setShow] = useState(false);
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
        <div key={idx}>
          <p className="text-sm font-semibold leading-none text-gray-800">
            {title}
          </p>
          <div className="mt-2">
            <img className="w-[400px] h-[400px]" src={src} alt={alt} />
            {paragraphList(content)}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="mx-auto container max-w-[450px]   px-4 py-4 bg-gray-200 rounded relative">
        <div className="max-h-[500px] overflow-y-scroll">
          {isShow && contentsList()}
          <svg
            className="absolute z-10  bottom-[-10px] "
            width={16}
            height={10}
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10L0 0L16 1.41326e-06L8 10Z"
              fill="rgb(229, 231, 235)"
            />
          </svg>
        </div>
        <button
          onFocus={() => {
            setShow(true);
          }}
          onBlur={() => {
            setShow(false);
          }}
          onClick={() => {
            setShow((cur) => !cur);
          }}
        >
          <svg
            className="absolute   bottom-[-30px]  z-10 cursor-pointer"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.75 2C4.57469 2 2 4.57469 2 7.75C2 10.9253 4.57469 13.5 7.75 13.5C10.9253 13.5 13.5 10.9253 13.5 7.75C13.5 4.57469 10.9253 2 7.75 2Z"
              stroke="#1F2937"
              strokeMiterlimit={10}
            />
            <path
              d="M6.875 6.875H7.875V10.5"
              stroke="#1F2937"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 10.625H9.25"
              stroke="#1F2937"
              strokeMiterlimit={10}
              strokeLinecap="round"
            />
            <path
              d="M7.75 4.0625C7.5893 4.0625 7.43222 4.11015 7.2986 4.19943C7.16499 4.28871 7.06084 4.41561 6.99935 4.56407C6.93785 4.71254 6.92176 4.8759 6.95311 5.03351C6.98446 5.19112 7.06185 5.3359 7.17548 5.44953C7.28911 5.56316 7.43388 5.64054 7.59149 5.67189C7.7491 5.70324 7.91247 5.68715 8.06093 5.62566C8.2094 5.56416 8.3363 5.46002 8.42557 5.3264C8.51485 5.19279 8.5625 5.0357 8.5625 4.875C8.5625 4.65951 8.4769 4.45285 8.32453 4.30048C8.17215 4.1481 7.96549 4.0625 7.75 4.0625Z"
              fill="#1F2937"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

export default Tooltip;
