export default function OnOffToggle({ toggle, setToggle }) {
  const toggleClass = " transform translate-x-6";
  const tmpClass = "duration-300 transform -translate-x-6 text-white";

  return (
    <div
      className={`md:w-16 md:h-7 mx-2 w-15 h-6 flex items-center m-auto rounded-full p-1 cursor-pointer ${
        toggle ? null : "bg-indigo-700"
      }`}
      onClick={() => {
        setToggle(!toggle);
      }}
    >
      {/* Switch */}
      <div
        className={
          "bg-indigo-900 md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out z-10" +
          (toggle ? null : toggleClass)
        }
      ></div>
      <span className={`text-md ${toggle ? null : tmpClass}`}>
        {toggle && <>&nbsp;</>}
        {toggle ? "off" : "on"}
      </span>
    </div>
  );
}
