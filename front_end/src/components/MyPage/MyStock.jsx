import ListHeader from "../ListHeader";
import ListTitle from "../BackTestList/ListTitle";
import ListItem from "../BackTestList/ListItem";
export default function MyStock() {
  return (
    <>
      {/* <div className="flex">
        <ListHeader
          optionKind={["aaa", "bbb", "ccc"]}
          onClickFilter={onClickFilter}
          onSearch={onSearch}
        />
      </div>
      <div className="mt-5">
        <table className="table-auto w-full text-left">
          <colgroup>
            <col span="1" style={{ width: 5 + "%" }} />
            <col span="1" style={{ width: 5 + "%" }} />
            <col span="1" style={{ width: 70 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
          </colgroup>
          <ListTitle
            onCheckedAll={onCheckedAll}
            checked={
              checkedList.length && checkedList.length === backTestItems.length
                ? true
                : false
            }
            titles={["No", "테스트 이름", "생성일"]}
          />
          <tbody>{backTestItems.length && paintBackTestItems}</tbody>
        </table>
      </div> */}
      {/* <div className="relative w-full flex justify-center">
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
      </div> */}
    </>
  );
}
