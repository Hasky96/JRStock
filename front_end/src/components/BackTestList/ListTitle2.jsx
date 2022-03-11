export default function ListTitle({ onCheckedAll, checked }) {
  return (
    <div className="grid grid-cols-12 h-12 bg-slate-100">
      <div className="col-span-1 my-auto grid grid-cols-2">
        <p className="col-span-1">
          <input
            id="checkAll"
            name="checkAll"
            type="checkbox"
            className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
            onChange={(e) => onCheckedAll(e)}
            checked={checked}
          />
        </p>
        <p className="col-span-1">No</p>
      </div>
      <p className="col-span-5 my-auto">테스트 이름</p>
      <p className="col-span-3 my-auto">생성일</p>
      <p className="col-span-3 my-auto">수정일</p>
    </div>
  );
}
