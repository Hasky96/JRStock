/**
 * message: 보여줄 메시지
 * leftBtn: 왼쪽 버튼 이름
 * rightBtn: 오른쪽 버튼 이름
 * onClickBtn: 버튼 클릭시 콜백 함수 (왼쪽 버튼 클릭 시, 매개변수 true)
 */

export default function Dialog({ message, leftBtn, rightBtn, onClickBtn }) {
  return (
    <>
      <div
        className="fixed inset-0 flex justify-center items-center z-50 py-20"
        id="overlay"
      >
        <div className="shadow-xl rounded-lg bg-white border-2 border-slate-200">
          <div className="xl:w-[350px] w-[250px] py-4 px-4 text-gray-800 max-h-[75vh]">
            <p className="text-xl mx-4 text-ellipsis overflow-hidden">
              {message}
            </p>
          </div>
          <div className="flex justify-between mx-8 mb-2">
            <button
              className="bg-primary rounded-lg w-16 hover:bg-active duration-300 text-white"
              onClick={() => onClickBtn(true)}
            >
              {leftBtn}
            </button>
            <button
              className="bg-red-600 rounded-lg w-16  hover:bg-active duration-300 text-white"
              onClick={() => onClickBtn(false)}
            >
              {rightBtn}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
