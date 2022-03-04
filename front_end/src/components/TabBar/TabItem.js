export default function TabItem({ text, handleOnClick }) {
  return (
    <div onClick={(e) => handleOnClick(e, text)} className="tab-item">
      {text}
    </div>
  );
}
