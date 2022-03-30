/**
 * message: 보여줄 메시지
 * Btn: 버튼 이름
 * onClickBtn: 버튼 클릭시 콜백 함수
 */

export default function Dialog({ message, Btn, onClickBtn }) {
  return (
    <>
      <div
        className="fixed inset-0 flex justify-center items-center z-[500] py-20"
        id="overlay"
      >
        <div className="shadow-xl rounded-lg bg-white border-2 border-slate-200">
          <div className="xl:w-[350px] py-4 px-4 text-gray-800 max-h-[75vh]">
            <p className="text-lg mx-4 overflow-hidden whitespace-pre-wrap">
              {message}
            </p>
          </div>
          <div className="flex justify-end mx-8 mb-2">
            <button
              className="bg-primary rounded-lg w-16 py-[5px] hover:bg-active duration-300 text-white"
              onClick={onClickBtn}
            >
              {Btn}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
