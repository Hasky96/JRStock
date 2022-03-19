import { useState } from "react";
import BasicCondition from "./BasicCondition";
import "./BackTestCreateForm.css";

export default function BackTestCreateForm() {
  const [values, setValues] = useState({
    title: "",
    start_at: "",
    end_at: "",
    company_name: "",
    commission: "",
    stock: "",
    goal: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };
  const handleChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="BacktestCreatFormContainer mx-auto flex flex-col justify-center items-center">
      <BasicCondition
        handleInputChange={handleInputChange}
        setValues={setValues}
      />
      <div className="w-full flex justify-center mt-3 gap-2">
        <div className="w-1/2 grid grid-cols-2 border-0 border-b-1 border-gray-200 shadow-lg rounded text-center p-3 gap-2">
          <div className="col-span-2 text-left text-lg">매수 조건</div>
        </div>
        <div className="w-1/2 grid grid-cols-2 border-0 border-b-1 border-gray-200 shadow-lg rounded text-center p-3 gap-2">
          <div className="col-span-2 text-left text-lg">매도 조건</div>
        </div>
      </div>
    </div>
  );
}
