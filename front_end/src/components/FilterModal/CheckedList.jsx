import { useState } from "react";
import RangeItem from "./RangeItem";

export default function CheckedList({
  checkedIndicators,
  indicatorInfo,
  onChange,
}) {
  const [max, setMax] = useState(10000);
  const [min, setMin] = useState(0);
  const [leftVal, setLeftVal] = useState(0);
  const [rightVal, setRightVal] = useState(10000);

  const checkedList = () => {
    return Array.from(checkedIndicators.keys()).map((el) => {
      return (
        <RangeItem
          name={"T" + el.replace(" ", "")} // name- 숫자로 시작, 띄어쓰기가 있는 경우 오류를 피하기위해 이름 변경
          name2={el} // name2 - 본래 이름
          key={el}
          min={indicatorInfo.get(el)[0]}
          max={indicatorInfo.get(el)[1]}
          left={checkedIndicators.get(el)[0]}
          right={checkedIndicators.get(el)[1]}
          onChange={onChange}
        />
      );
    });
  };
  return <div>{checkedList()}</div>;
}
