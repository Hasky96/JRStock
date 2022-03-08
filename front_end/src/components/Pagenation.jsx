import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";

/**
 * itemCnt: 전체 아이템 수
 * pageCnt: 페이지당 보여줄 아이템 수
 * onClickLeft: '<' 버튼이 눌렸을 때 작동할 함수
 * onCLickRight: '>' 버튼이 눌렸을 때 작동할 함수
 * onClickNumber: 숫자 버튼이 눌렸을 때 작동할 함수
 * onClickFirst: '<<' 버튼이 눌렸을 때 작동할 함수
 * onClickEnd: '>> 버튼이 눌렸을 때 작동할 함수
 */
export default function Pagenation({
  itemCnt,
  pageCnt,
  onClickLeft,
  onClickRight,
  onClickNumber,
  onClickFirst,
  onClickLast,
  onClickEnd,
}) {
  const [selectedNum, setSelectedNum] = useState(1);
  const lastPageNum =
    parseInt(itemCnt / pageCnt) + (itemCnt % pageCnt === 0 ? 0 : 1);

  // 처음으로 이동 버튼
  const firstBtn = (
    <a
      href="#"
      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-yellow-50"
      onClick={(e) => {
        e.preventDefault();
        setSelectedNum(1);
        // onClickFirst();
      }}
    >
      <span className="sr-only">First</span>
      <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
    </a>
  );

  // 왼쪽 이동 버튼
  const leftBtn = (
    <a
      href="#"
      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-yellow-50"
      onClick={(e) => {
        e.preventDefault();
        if (selectedNum > 1) {
          setSelectedNum((cur) => {
            return cur - 1;
          });
        }
        // onClickLeft();
      }}
    >
      <span className="sr-only">Previous</span>
      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
    </a>
  );

  // 오른쪽 이동 버튼
  const rightBtn = (
    <a
      href="#"
      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-yellow-50"
      onClick={(e) => {
        e.preventDefault();
        if (selectedNum < lastPageNum) {
          setSelectedNum((cur) => {
            return cur + 1;
          });
        }
        // onClickRight();
      }}
    >
      <span className="sr-only">Next</span>
      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
    </a>
  );

  // 끝으로 이동 버튼
  const LastBtn = (
    <a
      href="#"
      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-yellow-50"
      onClick={(e) => {
        e.preventDefault();
        setSelectedNum((cur) => {
          return lastPageNum;
        });
        // onClickEnd();
      }}
    >
      <span className="sr-only">End</span>
      <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
    </a>
  );

  // 숫자 버튼 리스트
  const numBtnList = [];
  let pageNum =
    selectedNum - ((selectedNum % 5) + (selectedNum % 5 === 0 ? 5 : 0)) + 1;
  let cnt = 0;
  // 선택된 버튼 className
  const selectedItemClassName =
    "z-10 bg-yellow-50 border-yellow-500 text-yellow-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium";
  // 선택 안된 버튼 className
  const notSelectedItemClassName =
    "bg-white border-gray-300 text-gray-500 hover:bg-yellow-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium";
  // 숫자 버튼 리스트에 담기
  while (cnt < 5 && pageNum <= lastPageNum) {
    numBtnList.push(
      <a
        key={pageNum}
        href="#"
        className={
          selectedNum == pageNum
            ? selectedItemClassName
            : notSelectedItemClassName
        }
        onClick={(e) => {
          e.preventDefault();
          setSelectedNum(parseInt(e.target.innerText));
          // onClickNumber();
        }}
      >
        {pageNum}
      </a>
    );
    pageNum++;
    cnt++;
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      {/* 작은 화면용 버튼 */}
      <div className="flex-1 flex justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-yellow-50"
          onClick={(e) => {
            e.preventDefault();
            if (selectedNum > 1) {
              setSelectedNum((cur) => {
                return cur - 1;
              });
            }
            // onClickLeft();
          }}
        >
          Previous
        </a>
        <a
          href="#"
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-yellow-50"
          onClick={(e) => {
            e.preventDefault();
            if (selectedNum < lastPageNum) {
              setSelectedNum((cur) => {
                return cur + 1;
              });
            }
            // onClickRight();
          }}
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {firstBtn}
            {leftBtn}
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            {numBtnList}
            {rightBtn}
            {LastBtn}
          </nav>
        </div>
      </div>
    </div>
  );
}
