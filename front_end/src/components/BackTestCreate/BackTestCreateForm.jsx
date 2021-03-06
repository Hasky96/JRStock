import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BasicCondition from "./BasicCondition";
import TradeCondition from "./TradeCondition";
import { paramConstructor, getParamDefault } from "../../config/backtestConfig";
import "./BackTestCreateForm.css";
import { toast } from "react-toastify";
import { startBacktest } from "../../api/backtest";
import Swal from "sweetalert2";

export default function BackTestCreateForm() {
  let location = useLocation();
  const navigate = useNavigate();
  const valueDefault = {
    commission: 0.15,
    buy_standard: 10,
    buy_ratio: 100,
    sell_standard: 10,
    sell_ratio: 100,
  };

  const [isStockSelected, setIsStockSelected] = useState(false);
  const [values, setValues] = useState({
    ...valueDefault,
    title: "",
    asset: "",
    start_date: "",
    end_date: "",
    company_name: location.state?.company_name
      ? location.state.company_name
      : "",
    company_code: location.state?.company_code
      ? location.state.company_code
      : "",
    buy_strategy: [
      {
        id: 0,
        strategy: "101",
        weight: 10,
        params: { ...paramConstructor, ...getParamDefault("101") },
      },
    ],
    sell_strategy: [
      {
        id: 0,
        strategy: "102",
        weight: 10,
        params: { ...paramConstructor, ...getParamDefault("102") },
      },
    ],
  });

  const handleInputChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    handleStateChange(name, value);
  };

  const handleStateChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "w-32 bg-primary text-white px-3 py-2 m-2 hover:bg-active rounded-md duration-300",
        cancelButton:
          "w-32 bg-glass_primary text-white px-3 py-2 m-2 hover:bg-active rounded-md duration-300",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "????????????",
        text: "??????????????? ?????????????????????????",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "??????",
        cancelButtonText: "??????",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          if (!isStockSelected) {
            swalWithBootstrapButtons.fire(
              "??????",
              "????????? ??????????????????!",
              "warning"
            );
            return;
          }
          const data = { ...values, asset: values.asset.replace(/,/gi, "") };
          const res = await startBacktest(data).catch((err) => {
            if (err.response) {
              return err.response;
            }
          });

          if (res.status === 201) {
            swalWithBootstrapButtons.fire(
              "??????",
              "??????????????? ??????????????? ?????????????????????.<br />?????? ????????? ?????? ?????? 30??? ?????? ???????????????.",
              "success"
            );
            navigate(`/backtest/`);
          } else if (res.statue === 403) {
            swalWithBootstrapButtons.fire(
              "??????",
              "?????? ???????????? ?????? ???????????? ??????????????? ???????????????.<br />???????????? ?????? ??? ?????? ??????????????????.",
              "warning"
            );
          } else {
            swalWithBootstrapButtons.fire(
              "??????",
              "???????????? ????????? ?????????????????????.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "?????????",
            "???????????? ????????? ?????????????????????.",
            "error"
          );
        }
      });
  };

  const types = {
    buy: "??????",
    sell: "??????",
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="bactestcreateform-container mx-auto flex flex-col justify-center items-center"
    >
      {/* setIsStockSelected, handleStateChange ??? StockSelectModal ?????? ?????? */}
      <BasicCondition
        values={values}
        setIsStockSelected={setIsStockSelected}
        handleInputChange={handleInputChange}
        handleStateChange={handleStateChange}
      />
      <div className="w-full flex flex-col justify-center mt-3 gap-2">
        <TradeCondition
          type="buy"
          name="??????"
          color="red"
          values={values}
          setValues={setValues}
          handleInputChange={handleInputChange}
        />
        <TradeCondition
          type="sell"
          name="??????"
          color="blue"
          values={values}
          setValues={setValues}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className="w-full flex justify-center mt-3">
        <button className="w-32 mt-1 py-2 px-4 border border-transparent bg-primary text-white shadow-sm text-sm font-medium rounded-md hover:bg-active duration-300">
          ???????????? ??????
        </button>
      </div>
    </form>
  );
}
