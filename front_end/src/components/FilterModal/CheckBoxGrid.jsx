export default function CheckBoxGrid({
  indicators,
  onChecked,
  checkedIndicators,
  indicatorInfo,
}) {
  const checkBoxList = () => {
    return indicators.map((el) => {
      return (
        <div className="form-check" key={el}>
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm text-primary rotate-90 hover:rotate-0 checked:rotate-0 bg-white focus-within:ring-primary checked:bg-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value={el}
            id={el}
            onClick={(el) => {
              if (el.target.checked)
                onChecked((cur) => {
                  return new Map(cur).set(
                    el.target.value,
                    indicatorInfo.get(el.target.value)
                  );
                });
              else {
                onChecked((cur) => {
                  return new Map(
                    [...cur].filter(([k, v]) => k !== el.target.value)
                  );
                });
              }
            }}
            defaultChecked={
              Array.from(checkedIndicators.keys()).includes(el) ? true : false
            }
          />
          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor={el}
          >
            {el}
          </label>
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-3 grid-flow-row gap-4">{checkBoxList()}</div>
  );
}
