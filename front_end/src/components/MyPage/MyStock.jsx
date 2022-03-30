import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInterest, addInterest, deleteInterest } from "../../api/stock";
import Pagenation from "../Pagenation";
import CheckBoxGrid from "../FilterModal/CheckBoxGrid";
import CheckedList from "../FilterModal/CheckedList";
import costMap from "../../util/costMap";

import { ReactComponent as ModalCancle } from "../../assets/modalCancle.svg";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import OnOffToggle from "../OnOffToggle";
import { toast } from "react-toastify";

export default function StockItemList() {
  const navigate = useNavigate();
  const [checkedList, setcheckedList] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [stocks, setStocks] = useState([]);
  const [sortBy, setSortBy] = useState("-market_cap");
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState(null);
  const [filterData, setFilterData] = useState({});
  const pageSize = 10;

  // 선택된 필터 지표
  const [checkedIndicators, setCheckedIndicators] = useState(new Map());

  // filter on/off
  const [filterToggle, setFilterToggle] = useState(false);

  const clickFilterToggle = (toggle) => {
    setFilterToggle(toggle);
    setPageNo(1);
  };

  // 주식 종목 초기화
  const init = async () => {
    let res;
    if (filterToggle) {
      res = await getInterest({
        page: pageNo,
        size: pageSize,
        sort: sortBy,
        company_name: search,
        filterData,
      });
    } else {
      res = await getInterest({
        page: pageNo,
        size: pageSize,
        sort: sortBy,
        company_name: search,
      });
    }
    setStocks(res.data.results);
    setTotalCount(res.data.count);
    setCurrentList([]);
    let temp = [];
    let isChecked = true;
    for (let i = 0; i < res.data.results.length; i++) {
      temp.push(res.data.results[i].financial_info.basic_info.code_number);
      if (
        !checkedList.includes(
          res.data.results[i].financial_info.basic_info.code_number
        )
      ) {
        isChecked = false;
      }
    }
    setIsAllChecked(isChecked);
    setCurrentList(temp);
  };

  useEffect(() => {
    init();
  }, [sortBy, search, filterData, filterToggle, pageNo]);

  // 페이지네이션 동작
  const onClickFirst = async () => {
    setPageNo(1);
  };

  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
  };

  // 주식 데이터로 html 리스트를 만듬
  const stockList = () => {
    const result = [];
    for (let i = 0; i < stocks.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"stock" + i}
          className="grid grid-cols-12 h-12 hover:bg-indigo-50 hover:cursor-pointer"
        >
          <div className="col-span-1 my-auto grid grid-cols-2">
            <p className="col-span-1">
              <input
                id="total-stock"
                name="total-stock"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded duration-300"
                onChange={onChecked.bind(
                  this,
                  stocks[i].financial_info.basic_info.code_number
                )}
                checked={
                  checkedList.includes(
                    stocks[i].financial_info.basic_info.code_number
                  )
                    ? true
                    : false
                }
              />
            </p>
            <p
              className="col-span-1"
              onClick={goDetailPage.bind(
                this,
                stocks[i].financial_info.basic_info.code_number
              )}
            >
              {(pageNo - 1) * pageSize + i + 1}
            </p>
          </div>
          <p
            className="col-span-2 my-auto text-left ml-10"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {stocks[i].financial_info.basic_info.company_name}
          </p>
          <p
            className="col-span-1 my-auto text-right mr-5"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {(+stocks[i].current_price).toLocaleString()}
          </p>
          <p
            className={
              stocks[i].changes > 0
                ? "col-span-2 my-auto text-red-500"
                : stocks[i].changes < 0
                ? "col-span-2 my-auto text-blue-600"
                : "col-span-2 my-auto text-gray-600"
            }
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {stocks[i].changes > 0
              ? "▲ " + (+stocks[i].changes).toLocaleString()
              : stocks[i].changes < 0
              ? "▼ " + (-stocks[i].changes).toLocaleString()
              : "- " + (+stocks[i].changes).toLocaleString()}{" "}
            ({stocks[i].chages_ratio + "%"})
          </p>
          <p
            className="col-span-1 my-auto text-right mr-5"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {(+stocks[i].volume).toLocaleString()}
          </p>
          <p
            className="col-span-1 my-auto text-right mr-5"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {(+stocks[i].start_price).toLocaleString()}
          </p>
          <p
            className="col-span-1 my-auto text-right mr-5"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {(+stocks[i].high_price).toLocaleString()}
          </p>
          <p
            className="col-span-1 my-auto text-right mr-5"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {(+stocks[i].low_price).toLocaleString()}
          </p>
          <p
            className="col-span-2 my-auto"
            onClick={goDetailPage.bind(
              this,
              stocks[i].financial_info.basic_info.code_number
            )}
          >
            {costMap(stocks[i].market_cap)}
          </p>
        </li>
      );
    }
    return result;
  };

  // 전체 체크 클릭 시
  const onCheckedAll = (e) => {
    if (e.target.checked) {
      const temp = [];

      stocks.forEach((stock) => {
        if (
          !checkedList.includes(stock.financial_info.basic_info.code_number)
        ) {
          temp.push(stock.financial_info.basic_info.code_number);
        }
      });
      setcheckedList([...checkedList, ...temp]);
      setIsAllChecked(true);
    } else {
      const temp = checkedList.filter(
        (stockId) => !currentList.includes(stockId)
      );
      setcheckedList(temp);
      setIsAllChecked(false);
    }
  };

  // 개별 체크 클릭 시
  const onChecked = (id, e) => {
    if (e.target.checked) {
      setcheckedList([...checkedList, id]);
      let isChecked = true;
      currentList.forEach((stockId) => {
        if (!checkedList.includes(stockId) && id !== stockId) {
          isChecked = false;
        }
      });
      setIsAllChecked(isChecked);
    } else {
      setcheckedList(checkedList.filter((el) => el !== id));
      setIsAllChecked(false);
    }
  };

  // 종목 클릭 시 해당 종목 디테일 페이지로
  const goDetailPage = (id) => {
    navigate({ pathname: `/stock/${id}/detail` });
  };

  // 검색
  const onSearch = (word) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setPageNo(1);
      setSearch(word);
    }, 500);
    setTimer(newTimer);
  };

  // 관심 종목 추가
  const addBookMark = async () => {
    if (checkedList.length) {
      const res = await addInterest(checkedList);
      if (res.data.duplicate) {
        alert(
          `이미 추가된 ${res.data.duplicate}개를 제외한 ${
            checkedList.length - res.data.duplicate
          }개의 항목이 관심종목에 추가되었습니다.`
        );
      } else {
        alert(
          `선택하신 ${checkedList.length}개의 항목이 관심종목에 추가되었습니다.`
        );
      }
      setcheckedList([]);
      setIsAllChecked(false);
    } else {
      alert("하나 이상의 종목을 선택해주세요.");
    }
  };

  const deleteBookMark = async () => {
    if (checkedList.length) {
      const res = await deleteInterest(checkedList);
      return res.status === 200 ? true : false;
    } else {
      toast.warning("선택된 종목이 없습니다.");
    }
  };

  // 관심 종목 삭제
  const handleDeleteButton = () => {
    const status = deleteBookMark();
    if (status) {
      init();
      toast.success("관심종목 삭제에 성공하였습니다.");
    } else {
      toast.error("관심종목 삭제에 실패하였습니다.");
    }
  };

  // 정렬 변경
  const changeSort = (text) => {
    if (sortBy === text) {
      setSortBy("-" + text);
    } else {
      setSortBy(text);
    }
  };

  // =========== 필터 관련 변수 선언 시작

  // 필터 지표 초기 설정
  const indicatorInfo = new Map([
    ["액면가", [0, 5000]],
    ["자본금", [0, 50000]],
    ["상장주식수", [0, 6000000]],
    ["신용비율", [0, 11]],
    ["연중최고", [0, 600000]],
    ["연중최저", [-500000, 10000]],
    ["시가총액", [0, 5000000]],
    ["외인소진율", [0, 100]],
    ["대용가", [0, 1000000]],
    ["PER", [0, 30000]],
    ["EPS", [-300000, 200000]],
    ["ROE", [0, 1000]],
    ["PBR", [-1000, 20000]],
    ["EV", [-8000, 5000]],
    ["BPS", [-300000, 4000000]],
    ["매출액", [0, 3000000]],
    ["영업이익", [-30000, 600000]],
    ["당기순이익", [-30000, 400000]],
    ["유통주식", [0, 5000000]],
    ["유통비율", [0, 100]],
  ]);

  const tag = {
    액면가: "face_value",
    자본금: "capital_stock",
    상장주식수: "number_of_listings",
    신용비율: "credit_rate",
    연중최고: "year_high_price",
    연중최저: "year_low_price",
    시가총액: "market_cap",
    외인소진율: "foreigner_percent",
    대용가: "substitute_price",
    PER: "per",
    EPS: "eps",
    ROE: "roe",
    PBR: "pbr",
    EV: "ev",
    BPS: "bps",
    매출액: "sales_revenue",
    영업이익: "operating_income",
    당기순이익: "net_income",
    유통주식: "shares_outstanding",
    유통비율: "shares_outstanding_rate",
  };

  const unitInfo = new Map([
    ["자본금", "백만"],
    ["신용비율", "%"],
    ["연중최고", "백만"],
    ["연중최저", "백만"],
    ["시가총액", "백만"],
    ["외인소진율", "%"],
    ["대용가", "백만"],
    ["매출액", "백만"],
    ["영업이익", "백만"],
    ["당기순이익", "백만"],
    ["유통비율", "%"],
  ]);

  // 모달 노출 여부
  const [isShowModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((cur) => !cur);
  };
  // 필터 데이터 가공
  const inputFilter = () => {
    setPageNo(1);
    let data = {};
    for (const select of checkedIndicators) {
      if (checkedIndicators.get(select[0]))
        data[tag[select[0]]] =
          checkedIndicators.get(select[0])[0] +
          "_" +
          checkedIndicators.get(select[0])[1];
    }
    setFilterData(data);
  };

  return (
    <>
      <div className="flex flex-row justify-start my-5">
        <button
          type="button"
          onClick={() => handleDeleteButton()}
          className="bg-active border border-active font-semibold text-white hover:bg-white duration-300 hover:text-active rounded text-sm w-40 shadow-lg"
        >
          관심종목 삭제
        </button>

        <button
          className="h-38px w-20 ml-2 px-3 py-1 rounded-md text-white bg-primary hover:bg-active duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
          onClick={toggleModal}
        >
          필터
        </button>
        {/* on/off 버튼 */}
        <OnOffToggle toggle={filterToggle} setToggle={clickFilterToggle} />
        <div className="w-full flex justify-end">
          {/* 검색창  */}
          <div className="w-1/3">
            <div className="relative">
              {/* 검색 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-2 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d1d5db"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* 검색창 */}
              <input
                type="text"
                name="price"
                id="price"
                className="hover:border-primary focus:ring-primary focus:border-primary text-xl block w-full h-9 pl-9 pr-9 border-gray-100 bg-gray-100 rounded-lg"
                placeholder="Search..."
                onChange={(e) => {
                  e.preventDefault();
                  onSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-collapse overflow-x-scroll text-center my-8">
        <ul className="min-w-[1200px]">
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <div className="col-span-1 my-auto grid grid-cols-2">
              <p className="col-span-1">
                <input
                  id="total-stock"
                  name="total-stock"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded duration-300"
                  onChange={onCheckedAll}
                  checked={isAllChecked ? true : false}
                />
              </p>
              <p className="col-span-1">No</p>
            </div>
            <p className="col-span-2 my-auto">종목명</p>
            <p
              className="col-span-1 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "current_price")}
            >
              현재가
              {sortBy === "current_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-current_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
            <p
              className="col-span-2 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "chages_ratio")}
            >
              변동률(전일대비)
              {sortBy === "chages_ratio" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-chages_ratio" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
            <p
              className="col-span-1 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "volume")}
            >
              거래량
              {sortBy === "volume" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-volume" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
            <p
              className="col-span-1 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "start_price")}
            >
              시가
              {sortBy === "start_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-start_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
            <p
              className="col-span-1 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "high_price")}
            >
              고가
              {sortBy === "high_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-high_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
            <p
              className="col-span-1 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "low_price")}
            >
              저가
              {sortBy === "low_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-low_price" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
            <p
              className="col-span-2 my-auto cursor-pointer flex justify-center"
              onClick={changeSort.bind(this, "market_cap")}
            >
              시가총액
              {sortBy === "market_cap" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                </svg>
              ) : sortBy === "-market_cap" ? (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2"
                >
                  <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-2 fill-gray-300"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              )}
            </p>
          </li>
          {stockList()}
        </ul>
      </div>
      <Pagenation
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
        onClickFirst={onClickFirst}
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
        onClickLast={onClickLast}
        onClickNumber={onClickNumber}
      ></Pagenation>
      {/* 모달창 */}
      {isShowModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 py-20 bg-gray-500 bg-opacity-75 transition-opacity"
          id="overlay"
        >
          <div className="bg-gray-200 max-w-xl py-2 px-3 rounded shadow-xl text-gray-800 max-h-[75vh] overflow-y-scroll">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold">필터 설정</h4>
              <ModalCancle
                onClick={() => {
                  toggleModal();
                }}
              />
            </div>
            {/* 체크박스 공간 */}
            <CheckBoxGrid
              indicators={Array.from(indicatorInfo.keys())}
              onChecked={setCheckedIndicators}
              checkedIndicators={checkedIndicators}
              indicatorInfo={indicatorInfo}
            />
            {/* 선택된 리스트 공간 */}
            <CheckedList
              checkedIndicators={checkedIndicators}
              indicatorInfo={indicatorInfo}
              unitInfo={unitInfo}
              onChange={setCheckedIndicators}
            />
            {/* 버튼 공간 */}
            <div className="mt-3 flex justify-end space-x-3">
              {/* 필터 선택 완료 버튼 */}
              <button
                className="px-3 py-1 bg-primary hover:bg-active duration-300 text-gray-200 rounded"
                onClick={() => {
                  toggleModal();
                  inputFilter();
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
