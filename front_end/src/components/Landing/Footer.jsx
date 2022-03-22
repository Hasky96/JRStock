export default function Footer() {
  return (
    <div className="h-60 w-full bg-gray-200 border-t-4 grid md:grid-cols-2 p-5">
      <div className="col-span-1 flex flex-col">
        <h1 className="text-xl text-indigo-900 font-bold">4차동학개미운동</h1>
        <p className="text-indigo-900 ">
          강진 박지후 안영원 이재만 장하석 정지욱
        </p>
      </div>
      <div className="col-span-1 flex flex-col">
        이용약관 / 개인정보처리방침
      </div>
      {/* <div className="col-span-2 bg-red-200"></div> */}
    </div>
  );
}
