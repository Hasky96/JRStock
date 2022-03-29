export default function ToolContent1({ contents }) {
  const paragraphList = (str) => {
    return str.split("/n").map((content, idx) => {
      return (
        <p
          className=" text-xs leading-none text-gray-600 pt-2 pb-2 text-ellipsis overflow-hidden"
          key={idx}
        >
          {content}
        </p>
      );
    });
  };

  const contentsList = () => {
    return contents.map(({ title, src, alt, content }, idx) => {
      return (
        <div key={idx} className="content-item mb-5">
          <p className="text-sm font-semibold leading-none mb-2 text-gray-800">
            {title}
          </p>
          <div className="grid justify-center items-center gap-1">
            <img
              className="max-w-[200px] max-h-[200px] rounded-lg"
              src={src}
              alt={alt}
            />
            {paragraphList(content)}
          </div>
        </div>
      );
    });
  };

  return <>{contentsList()}</>;
}
