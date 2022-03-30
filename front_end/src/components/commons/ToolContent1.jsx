export default function ToolContent1({ contents }) {
  const paragraphList = (str) => {
    return str.split("/n").map((content, idx) => {
      return (
        <p
          className=" text-base leading-normal text-gray-600 my-2 text-ellipsis overflow-hidden whitespace-pre-wrap"
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
          <div className="flex justify-between mb-5 ">
            <p className="text-xl font-semibold text-gray-800 whitespace-pre-wrap text-center">
              {title}
            </p>
          </div>
          <div className="grid justify-center items-center">
            <img
              className="max-w-[400px] max-h-[400px] rounded-lg"
              src={require(`../../assets/${src}`)}
              alt={alt}
            />
            {paragraphList(content)}
          </div>
          <button
            className="float-right bg-primary text-white rounded-lg px-2 py-2 hover:bg-active duration-300"
            onClick={(e) => {
              e.preventDefault();
              // 위키로 이동
              window.open(
                `https://ko.wikipedia.org/wiki/%EC%9D%B4%EB%8F%99%ED%8F%89%EA%B7%A0%EC%84%A0`,
                "_blank"
              );
            }}
          >
            자세히 보기
          </button>
        </div>
      );
    });
  };

  return <div className="pb-6">{contentsList()}</div>;
}
