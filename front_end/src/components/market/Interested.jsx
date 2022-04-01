import { getInterest, getLive, deleteInterest } from "../../api/stock";
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";

export default function Interested() {
  const [stocks, setStocks] = useState([]);
  const [lives, setLives] = useState([]);
  const [refTime, setRefTime] = useState("");
  const [stockCount, setStockCount] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const init = async () => {
    const res = await getInterest({ page: 1, size: 5 });
    setStocks(res.data.results);
    setStockCount(res.data.count);
    if (!isInit) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    let temp = [];
    for (let stock of res.data.results) {
      let liveRes;
      try {
        const res = await getLive(stock.financial_info.basic_info.code_number);
        liveRes = res.data;
        liveRes["isError"] = false;
        setRefTime(liveRes.time);
      } catch {
        liveRes = {};
        liveRes["isError"] = true;
      }
      liveRes["company_name"] = stock.financial_info.basic_info.company_name;
      liveRes["code_number"] = stock.financial_info.basic_info.code_number;
      temp.push(liveRes);
    }
    setLives(temp);
    setIsInit(false);
  };

  useEffect(() => {
    init();
  }, [isProcessing]);

  // 관심 종목 페이지로
  const goMyStock = () => {
    navigate("/mypage");
  };

  // 종목 리스트 페이지로
  const goStockList = () => {
    navigate("/stock");
  };

  // 종목 상세 페이지로
  const goStockDetail = (codeNumber) => {
    navigate(`/stock/${codeNumber}/detail`);
  };

  const deleteBookMark = async (codeNumber) => {
    const res = await deleteInterest([codeNumber]);
    return res.status === 200 ? true : false;
  };

  // 관심 종목 삭제
  const clickDelete = async (codeNumber) => {
    const status = deleteBookMark(codeNumber);
    setIsProcessing(true);
    if (status) {
      await init();
      toast.success("관심종목 삭제에 성공하였습니다.");
    } else {
      toast.error("관심종목 삭제에 실패하였습니다.");
    }
    setIsProcessing(false);
  };

  // 10초마다 실시간 데이터 요청
  const TENSEC_MS = 10000;
  useEffect(() => {
    const interval = setInterval(() => {
      init();
    }, TENSEC_MS);

    return () => clearInterval(interval);
  }, []);

  // 실시간 데이터로 html 구성
  const liveList = () => {
    const result = [];
    for (let live of lives) {
      result.push(
        <div
          key={live.company_name}
          className="shadow-lg border-0 rounded-xl p-10 my-10 cursor-pointer hover:scale-[1.02] duration-300"
          onClick={goStockDetail.bind(this, live.code_number)}
        >
          <div>
            <div className="grid grid-cols-11">
              <div className="col-span-2 my-auto xl:text-xl lg:text-lg text-md font-bold">
                {live.company_name}
              </div>
              <div className="col-span-3 xl:text-base lg:text-sm text-xs">
                <div>현재가</div>
                {!live.isError && (
                  <div
                    className={
                      "xl:text-5xl lg:text-4xl text-3xl " +
                      (live.changes &&
                        (parseInt(live.changes) > 0
                          ? "text-red-500"
                          : parseInt(live.changes) < 0
                          ? "text-blue-600"
                          : "text-gray-600"))
                    }
                  >
                    {live.current_price}
                  </div>
                )}
                {!live.isError && (
                  <div className="flex mt-2">
                    <div className="mr-3 xl:text-base lg:text-sm text-xs">
                      전일대비
                    </div>
                    <div
                      className={
                        "flex xl:text-base lg:text-sm text-xs " +
                        (live.changes &&
                          (parseInt(live.changes) > 0
                            ? "text-red-500"
                            : parseInt(live.changes) < 0
                            ? "text-blue-600"
                            : "text-gray-600"))
                      }
                    >
                      <div>
                        {live.changes &&
                          (parseInt(live.changes) > 0
                            ? "▲ " + live.changes.substr(1)
                            : parseInt(live.changes) < 0
                            ? "▼ " + live.changes.substr(1)
                            : "- " + live.changes)}
                      </div>
                      <div className="text-gray-700 xl:text-base lg:text-sm text-xs">
                        &nbsp;|&nbsp;
                      </div>
                      <div>
                        {live.changes &&
                          (parseInt(live.changes) > 0
                            ? "▲ " + live.changes_ratio.substr(1)
                            : parseInt(live.changes) < 0
                            ? "▼ " + live.changes_ratio.substr(1)
                            : "- " + live.changes_ratio)}
                      </div>
                    </div>
                  </div>
                )}
                {live.isError && (
                  <div className="text-gray-400 xl:text-base lg:text-sm text-xs">
                    실시간 데이터가 없습니다..
                  </div>
                )}
              </div>
              <div className="col-start-6 col-end-8 font-bold xl:text-base lg:text-sm text-xs">
                <div className="flex justify-between mb-2">
                  <div>전일</div>
                  <div>{live.isError ? "-" : live.prev}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>상한가</div>
                  <div>{live.isError ? "-" : live.upper_limit}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>고가</div>
                  <div
                    className={
                      live.prev &&
                      parseInt(live.prev.replace(/,/g, "")) <
                        parseInt(live.high.replace(/,/g, ""))
                        ? "text-red-500"
                        : live.prev &&
                          parseInt(live.prev.replace(/,/g, "")) >
                            parseInt(live.high.replace(/,/g, ""))
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {live.isError ? "-" : live.high}
                  </div>
                </div>
              </div>
              <div className="col-start-9 col-end-11 font-bold xl:text-base lg:text-sm text-xs">
                <div className="flex justify-between mb-2">
                  <div>시가</div>
                  <div
                    className={
                      live.prev &&
                      parseInt(live.prev.replace(/,/g, "")) <
                        parseInt(live.open.replace(/,/g, ""))
                        ? "text-red-500"
                        : live.prev &&
                          parseInt(live.prev.replace(/,/g, "")) >
                            parseInt(live.open.replace(/,/g, ""))
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {live.isError ? "-" : live.open}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>하한가</div>
                  <div>{live.isError ? "-" : live.lower_limit}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>저가</div>
                  <div
                    className={
                      live.prev &&
                      parseInt(live.prev.replace(/,/g, "")) <
                        parseInt(live.low.replace(/,/g, ""))
                        ? "text-red-500"
                        : live.prev &&
                          parseInt(live.prev.replace(/,/g, "")) >
                            parseInt(live.low.replace(/,/g, ""))
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {live.isError ? "-" : live.low}
                  </div>
                </div>
              </div>

              <div className="col-span-1 flex justify-end items-start">
                <Menu
                  as="div"
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <Menu.Button>
                      <DotsVerticalIcon className="w-5 hover:border-2 hover:border-white cursor-pointer" />
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
                    <Menu.Items className="origin-top-right absolute right-0 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={
                                "flex flex-row hover:cursor-pointer " +
                                (active
                                  ? "bg-indigo-50 text-gray-900"
                                  : "text-gray-700")
                              }
                              onClick={clickDelete.bind(this, live.code_number)}
                            >
                              <svg
                                id="Layer_1"
                                version="1.1"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-1 w-4 my-auto fill-red-600"
                              >
                                <g>
                                  <path d="M256,32C132.3,32,32,132.3,32,256s100.3,224,224,224s224-100.3,224-224S379.7,32,256,32z M384,272H128v-32h256V272z" />
                                </g>
                              </svg>
                              <p className="block pl-1 py-2 text-sm">
                                관심종목에서 삭제
                              </p>
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return result;
  };

  return (
    <div className="mx-3 relative">
      {isProcessing && (
        <svg
          role="status"
          className="mr-2 w-20 h-20 text-gray-200 animate-spin dark:text-gray-300 fill-primary block absolute z-50 top-[50%] right-[50%]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
      <div className={isProcessing ? "opacity-50 pointer-events-none" : ""}>
        <div className="flex justify-between items-end">
          <div className="flex items-end">
            <svg
              version="1.1"
              viewBox="0 0 58 58"
              className="h-7 w-7 mr-2 my-auto"
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
            <div className="text-primary text-2xl font-bold">관심종목</div>
            <div className="ml-5 text-gray-400 flex items-center">
              {refTime && refTime + " 기준"}
              {isLoading && (
                <svg
                  role="status"
                  className="ml-1 w-4 h-4 text-gray-200 animate-spin dark:text-gray-300 fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </div>
          </div>
          {stockCount > 5 && (
            <div className="text-gray-400 cursor-pointer" onClick={goMyStock}>
              더 보기 +
            </div>
          )}
        </div>
        {isInit ? (
          <div className="flex justify-center">
            <svg
              role="status"
              className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-300 fill-primary mt-10"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <div>
            {stockCount === 0 ? (
              <div className="flex my-10 text-center w-full justify-center text-gray-400">
                관심 종목이 없습니다.&nbsp;
                <div className="cursor-pointer underline" onClick={goStockList}>
                  종목 리스트
                </div>
                에서 추가해 보세요!
              </div>
            ) : (
              liveList()
            )}
          </div>
        )}
      </div>
    </div>
  );
}
