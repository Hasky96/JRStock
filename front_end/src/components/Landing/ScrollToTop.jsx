import { useEffect, useState } from "react";
import { ReactComponent as Up } from "../../assets/expand_less.svg";

export default function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = (e) => {
    const offsetFromTop = window.pageYOffset;

    if (!showScroll && offsetFromTop > 350) {
      setShowScroll(true);
    } else if (offsetFromTop <= 350) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  const scrollUp = () => {
    const element = document.getElementById("intro");
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <div
      className="scroll-to-top"
      onClick={scrollUp}
      style={{
        visibility: showScroll ? "visible" : "hidden",
        opacity: showScroll ? "1" : "0",
      }}
    >
      <Up />
    </div>
  );
}
