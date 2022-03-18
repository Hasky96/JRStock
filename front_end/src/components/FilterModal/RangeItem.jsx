import { useEffect, useState } from "react";
import "./range.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RangeItem({
  name,
  name2,
  min,
  max,
  left,
  right,
  onChange,
}) {
  const [leftVal, setLeftVal] = useState(left);
  const [rightVal, setRightVal] = useState(right);

  useEffect(() => {
    const range = document.querySelector(`.${name} .slider .progress`);
    range.style.left = ((leftVal - min) / (max - min)) * 100 + "%";
    range.style.right = ((max - rightVal) / (max - min)) * 100 + "%";
  }, []);

  return (
    <div className={classNames("wrapper", name)}>
      <header>
        <h2>{name2}</h2>
      </header>
      <div className="price-input">
        <div className="field">
          <span>Min</span>
          {/* 왼쪽값 입력 */}
          <input
            type="number"
            className="input-min"
            value={leftVal}
            onInput={(e) => {
              // -값 입력을 저장하기위에 초기에 값 설정

              const range = document.querySelector(
                  `.${name} .slider .progress`
                ),
                rangeInput = document.querySelectorAll(
                  `.${name} .range-input input`
                ),
                priceInput = document.querySelectorAll(
                  `.${name} .price-input input`
                );

              setLeftVal(e.target.value);
              let minPrice = parseInt(priceInput[0].value);
              let maxPrice = parseInt(priceInput[1].value);
              // 입력된 왼쪽값이 min, max 범위를 넘어설 경우
              if (minPrice > max) {
                minPrice = max;
                setLeftVal(minPrice);
              } else if (minPrice < min) {
                minPrice = min;
                setLeftVal(minPrice);
              }
              // 입력된 왼쪽값이 오른쪽 값보다 클 경우 서로 교환
              if (maxPrice < minPrice) {
                let tmp = maxPrice;
                maxPrice = minPrice;
                minPrice = tmp;
                setLeftVal(minPrice);
                setRightVal(maxPrice);
                range.style.right =
                  ((max - maxPrice) / (max - min)) * 100 + "%";
              }

              rangeInput[0].value = minPrice;
              range.style.left = ((minPrice - min) / (max - min)) * 100 + "%";

              onChange((cur) => {
                return new Map(cur.set(name2, [minPrice, maxPrice]));
              });
            }}
          />
        </div>
        <div className="separator">-</div>
        <div className="field">
          <span>Max</span>
          {/* 오른쪽값 입력 */}
          <input
            type="number"
            className="input-max"
            value={rightVal}
            onInput={(e) => {
              setRightVal(e.target.value);

              const range = document.querySelector(
                  `.${name} .slider .progress`
                ),
                rangeInput = document.querySelectorAll(
                  `.${name} .range-input input`
                ),
                priceInput = document.querySelectorAll(
                  `.${name} .price-input input`
                );

              let minPrice = parseInt(priceInput[0].value);
              let maxPrice = parseInt(priceInput[1].value);
              // 입력된 오른쪽값이 min, max 범위를 넘어설 경우
              if (maxPrice > max) {
                maxPrice = max;
                setRightVal(maxPrice);
              } else if (maxPrice < min) {
                maxPrice = min;
                setRightVal(maxPrice);
              }
              // 입력된 오른값이 왼쪽 값보다 작을 경우 서로 교환
              if (maxPrice < minPrice) {
                let tmp = maxPrice;
                maxPrice = minPrice;
                minPrice = tmp;
                setLeftVal(minPrice);
                setRightVal(maxPrice);
                range.style.left = ((minPrice - min) / (max - min)) * 100 + "%";
              }

              rangeInput[1].value = maxPrice;
              range.style.right = ((max - maxPrice) / (max - min)) * 100 + "%";

              onChange((cur) => {
                return new Map(cur.set(name2, [minPrice, maxPrice]));
              });
            }}
          />
        </div>
      </div>
      <div className="slider">
        <div className="progress"></div>
      </div>
      <div className="range-input">
        {/* 왼쪽 range 입력 */}
        <input
          type="range"
          className="range-min"
          min={min}
          max={max}
          value={leftVal}
          onInput={(e) => {
            setLeftVal(e.target.value);

            const range = document.querySelector(`.${name} .slider .progress`),
              rangeInput = document.querySelectorAll(
                `.${name} .range-input input`
              );

            let minVal = parseInt(rangeInput[0].value),
              maxVal = parseInt(rangeInput[1].value);

            // 입력된 range 왼쪽값이 range 오른쪽값을 넘으려는 경우
            if (minVal > maxVal) {
              let tmp = maxVal;
              maxVal = minVal;
              minVal = tmp;
              setLeftVal(minVal);
              setRightVal(maxVal);
            }
            range.style.left = ((minVal - min) / (max - min)) * 100 + "%";
            range.style.right = ((max - maxVal) / (max - min)) * 100 + "%";

            onChange((cur) => {
              return new Map(cur.set(name2, [minVal, maxVal]));
            });
          }}
        />
        {/* 오른쪽 range 입력 */}
        <input
          type="range"
          className="range-max"
          min={min}
          max={max}
          value={rightVal}
          onInput={(e) => {
            setRightVal(e.target.value);

            const range = document.querySelector(`.${name} .slider .progress`),
              rangeInput = document.querySelectorAll(
                `.${name} .range-input input`
              );

            let minVal = parseInt(rangeInput[0].value),
              maxVal = parseInt(rangeInput[1].value);

            // 입력된 range 오른쪽값이 range 왼쪽값을 넘으려는 경우
            if (minVal > maxVal) {
              let tmp = maxVal;
              maxVal = minVal;
              minVal = tmp;
              setLeftVal(minVal);
              setRightVal(maxVal);
            }

            range.style.left = ((minVal - min) / (max - min)) * 100 + "%";
            range.style.right = ((max - maxVal) / (max - min)) * 100 + "%";

            onChange((cur) => {
              return new Map(cur.set(name2, [minVal, maxVal]));
            });
          }}
        />
      </div>
    </div>
  );
}
