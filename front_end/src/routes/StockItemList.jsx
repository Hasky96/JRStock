import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStockItemList } from "../api/stock";
import Pagenation from "../components/Pagenation";
import ListHeader from "../components/ListHeader";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import CheckBoxGrid from "../components/FilterModal/CheckBoxGrid";
import CheckedList from "../components/FilterModal/CheckedList";

import { ReactComponent as ModalCancle } from "../assets/modalCancle.svg";
import OnOffToggle from "../components/OnOffToggle";

export default function StockItemList() {
  const navigate = useNavigate();
  const [checkedList, setcheckedList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const [stocks, setStocks] = useState([]);

  // 주식 종목 초기화
  const init = async () => {
    const res = await getStockItemList(1, pageSize);
    setStocks(res.data.results);
    setTotalCount(res.data.count);
  };

  useEffect(() => {
    init();
  }, []);

  // 페이지네이션 동작
  const onClickFirst = async () => {
    setPageNo(1);
    const res = await getStockItemList(1, pageSize);
    setStocks(res.data.results);
  };

  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
    const res = await getStockItemList(pageNo - 1, pageSize);
    setStocks(res.data.results);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
    const res = await getStockItemList(pageNo + 1, pageSize);
    setStocks(res.data.results);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
    const res = await getStockItemList(lastPageNum, pageSize);
    setStocks(res.data.results);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
    const res = await getStockItemList(num, pageSize);
    setStocks(res.data.results);
  };

  // 시가총액 표시
  const marketCap = (num) => {
    if (num.length < 5) {
      return num;
    }
    let result = "";
    const unit = ["", "만", "억", "조", "경"];
    let size = parseInt(num.length / 4);
    let rem = num.length % 4;
    if (rem === 0) {
      size -= 1;
      rem = 4;
    }
    result += num.substr(0, rem) + unit[size] + " ";
    let flag = true;
    for (let i = rem; i < rem + 4; i++) {
      if (num[i] === "0" && flag) {
        continue;
      }
      result += num[i];
      flag = false;
    }
    if (!flag) {
      result += unit[size - 1];
    }
    return result;
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
                className="h-4 w-4 text-amber-300 focus:ring-amber-900 border-gray-300 rounded"
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
              : "- " + (+stocks[i].changes).toLocaleString()
              }{" "}
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
            {marketCap(stocks[i].market_cap)}
          </p>
        </li>
      );
    }
    return result;
  };

  // 전체 체크 클릭 시
  const onCheckedAll = (e) => {
    if (e.target.checked) {
      const checkedListArray = [];

      stocks.forEach((stock) =>
        checkedListArray.push(stock.financial_info.basic_info.code_number)
      );

      setcheckedList(checkedListArray);
    } else {
      setcheckedList([]);
    }
  };

  // 개별 체크 클릭 시
  const onChecked = (id, e) => {
    if (e.target.checked) {
      setcheckedList([...checkedList, id]);
    } else {
      setcheckedList(checkedList.filter((el) => el !== id));
    }
  };

  // 종목 클릭 시 해당 종목 디테일 페이지로
  const goDetailPage = (id) => {
    navigate({ pathname: `${id}/detail` });
  };

  const onClickFilter = (filter) => {
    console.log(filter);
    // 필터 state를 filter 로 변경
    // 전반적인 notice item 검색 api에 filter 조건 추가
    // pageNo 1로 초기화
  };

  const onSearch = (word) => {
    console.log(word);
    // 검색어 state을 word로 변경
    // 전반적으로 notice item 검색 api에 word 조건 추가
    // pageNo 1로 초기화
  };

  // 관심 종목 추가
  const addBookMark = () => {
    if (checkedList.length) {
      console.log(checkedList);
      alert("관심종목에 추가되었습니다.");
    } else {
      alert("하나 이상의 종목을 선택해주세요.");
    }
  };

  // =========== 필터 관련 변수 선언 시작

  // 필터 지표 초기 설정
  const indicatorInfo = new Map([
    ["PER", [0, 100]],
    ["매출액", [-100, 100]],
    ["PSR", [-100, 100]],
    ["PBR", [-100, 100]],
    ["순이익율", [-100, 100]],
    ["200일 이동평균", [-100, 100]],
    ["50일 이동평균", [-100, 100]],
    ["A", [0, 100]],
    ["B", [-100, 100]],
    ["C", [-100, 100]],
    ["D", [-100, 100]],
    ["E", [-100, 100]],
    ["F", [-100, 100]],
  ]);

  // 모달 노출 여부
  const [isShowModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((cur) => !cur);
  };

  // 선택된 필터 지표
  const [checkedIndicators, setCheckedIndicators] = useState(new Map());

  // filter on/off
  const [filterToggle, setFilterToggle] = useState(true);

  return (
    <div className={"my-pt-28 my-pl-10 my-pr-10"}>
      <div className={"bg-white rounded-lg p-5 my-h-80 drop-shadow-lg"}>
        <div className="flex flex-row justify-start my-5">
          {sessionStorage.access_token && (
            <div className="">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 hover:border-indigo-900 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-900">
                    Actions
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={addBookMark}
                            className={
                              "flex flex-row hover:cursor-pointer " +
                              (active
                                ? "bg-yellow-50 text-gray-900"
                                : "text-gray-700")
                            }
                          >
                            <div className="ml-4 my-auto">
                              <svg
                                version="1.1"
                                viewBox="0 0 58 58"
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M31.7569,1.14435 L39.2006,16.94809 C39.4742047,17.5450605 40.0274966,17.9662669 40.67576,18.07109 L57.32037,20.60534 C58.0728338,20.7512497 58.6840769,21.2991656 58.9110909,22.0312558 C59.1381048,22.7633461 58.9440977,23.560962 58.4062,24.107 L46.36205,36.40845 C45.8969861,36.8906851 45.6879532,37.5647752 45.79858,38.22553 L48.64182,55.59553 C48.7969313,56.3422303 48.5093863,57.1116407 47.9025754,57.5735945 C47.2957646,58.0355484 46.4775729,58.1079148 45.7991,57.75964 L30.9117,49.55864 C30.3445605,49.2442297 29.6554395,49.2442297 29.0883,49.55864 L14.2009,57.75964 C13.5224271,58.1079148 12.7042354,58.0355484 12.0974246,57.5735945 C11.4906137,57.1116407 11.2030687,56.3422303 11.35818,55.59553 L14.20142,38.22553 C14.3120468,37.5647752 14.1030139,36.8906851 13.63795,36.40845 L1.5938,24.107 C1.05593046,23.5609597 0.861941478,22.7633618 1.08895299,22.0312898 C1.31596449,21.2992177 1.92718692,20.7513115 2.67963,20.60539 L19.32424,18.0711 C19.9725034,17.9662769 20.5257953,17.5450705 20.7994,16.9481 L28.2431,1.14435 C28.5505421,0.448721422 29.2394609,-5.16717968e-06 30,-5.16717968e-06 C30.7605391,-5.16717968e-06 31.4494579,0.448721422 31.7569,1.14435 Z"
                                  fill="#F6AB27"
                                  id="Shape"
                                />
                                <path
                                  d="M37.39,13.11 C32.5890747,15.6770414 28.15587,18.8791741 24.21,22.63 C20.0044812,26.6560517 16.436883,31.2993247 13.63,36.4 L1.59009,24.11 C1.05224467,23.5636351 0.858777828,22.7655877 1.086713,22.0335783 C1.31464817,21.3015689 1.92698179,20.7544339 2.67993,20.61 L19.32007,18.07 C19.967444,17.9624793 20.520694,17.5438036 20.80007,16.95 L28.24,1.14 C28.5507895,0.446404951 29.2399578,1.95277886e-05 30,1.95277886e-05 C30.7600422,1.95277886e-05 31.4492105,0.446404951 31.76,1.14 L37.39,13.11 Z"
                                  fill="#F4CD1E"
                                  id="Shape"
                                />
                              </svg>
                            </div>
                            <p className="block px-2 py-2 text-sm">
                              관심종목 추가
                            </p>
                          </div>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}
          <button
            className="h-38px w-20 ml-2 px-3 py-1 rounded-md text-white bg-indigo-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
            onClick={toggleModal}
          >
            필터
          </button>
          {/* on/off 버튼 */}
          <OnOffToggle toggle={filterToggle} setToggle={setFilterToggle} />
          <div className="w-full">
            <ListHeader
              optionKind={["aaa", "bbb", "ccc"]}
              onClickFilter={onClickFilter}
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className="border-collapse w-full text-center my-8">
          <ul>
            <li className="grid grid-cols-12 h-12 bg-slate-100">
              <div className="col-span-1 my-auto grid grid-cols-2">
                <p className="col-span-1">
                  <input
                    id="total-stock"
                    name="total-stock"
                    type="checkbox"
                    className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
                    onChange={onCheckedAll}
                    checked={
                      checkedList.length === 0
                        ? false
                        : checkedList.length === stocks.length
                        ? true
                        : false
                    }
                  />
                </p>
                <p className="col-span-1">No</p>
              </div>
              <p className="col-span-2 my-auto">종목명</p>
              <p className="col-span-1 my-auto">현재가</p>
              <p className="col-span-2 my-auto">변동률(전일대비)</p>
              <p className="col-span-1 my-auto">거래량</p>
              <p className="col-span-1 my-auto">시가</p>
              <p className="col-span-1 my-auto">고가</p>
              <p className="col-span-1 my-auto">저가</p>
              <p className="col-span-2 my-auto">시가총액</p>
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
            className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-start z-50 overflow-auto py-20"
            id="overlay"
          >
            <div className="bg-gray-200 max-w-xl py-2 px-3 rounded shadow-xl text-gray-800">
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
                onChange={setCheckedIndicators}
              />
              {/* 버튼 공간 */}
              <div className="mt-3 flex justify-end space-x-3">
                {/* 필터 선택 완료 버튼 */}
                <button
                  className="px-3 py-1 bg-indigo-900 hover:bg-indigo-700 text-gray-200 rounded"
                  onClick={() => {
                    toggleModal();
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
