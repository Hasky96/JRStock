import { useEffect, useState } from "react";
import IntroContent from "./IntroContent";
import IntroImage from "./IntroImage";

export default function Intro() {
  const [windowSize, setWindowSize] = useState(window.screen.width);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(document.documentElement.clientWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="intro"
      className="landing-block-container w-full h-screen flex flex-col mt-40 md:mt-0 md:flex-row xl:justify-evenly items-center gap-10"
    >
      {windowSize > 757 ? (
        <>
          <IntroContent />
          <IntroImage />
        </>
      ) : (
        <>
          <IntroImage />
          <IntroContent />
        </>
      )}
    </div>
  );
}
