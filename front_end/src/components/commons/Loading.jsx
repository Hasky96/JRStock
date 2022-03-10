import "./loading.css";
export default function Loading({ message }) {
  return (
    <div id="loading" className="absolute hidden w-full h-full">
      {/* 배경 */}
      <div className="z-30 w-full h-full bg-white opacity-50"></div>
      {/* 로딩 아이콘 */}
      <div id="loading-icon"></div>
      {/* 로딩 메시지 */}
      <div id="loading-msg" className="text-2xl">
        <span>{message}</span>
      </div>
    </div>
  );
}
