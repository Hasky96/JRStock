import "./PageContainer.css";

export default function PageContainer({ children, pt, pl, pr, minH }) {
  return (
    <div
      className={
        (pt ? `pt-${pt}` : "pt-36") +
        (pl ? ` pl-${pl}` : " pl-10") +
        (pr ? ` pr-${pr}` : " pr-10")
      }
    >
      <div
        className={
          "bg-white rounded-lg drop-shadow-lg p-5" +
          (minH ? ` my-h-${minH}` : " my-h-80")
        }
      >
        {children}
      </div>
    </div>
  );
}
