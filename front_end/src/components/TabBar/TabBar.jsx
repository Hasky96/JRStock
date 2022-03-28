import { useEffect, useRef } from "react";
import TabItem from "./TabItem";
import "./TabBar.css";

export default function TabBar({
  currentTab,
  setCurrentTab,
  tabInfo,
  baseURL,
}) {
  const marker = useRef();

  useEffect(() => {
    let selectedTab;
    if (currentTab) {
      selectedTab = document.querySelectorAll(".tab-item");
      for (let i = 0; i < selectedTab.length; i++) {
        if (selectedTab[i].innerText === currentTab) {
          selectedTab = selectedTab[i];
          break;
        }
      }
    } else {
      selectedTab = document.querySelector(".tab-item");
    }
    marker.current.style.left = selectedTab.offsetLeft + "px";
    marker.current.style.width = selectedTab.offsetWidth + "px";
  }, [currentTab]);

  const indicator = (e) => {
    marker.current.style.left = e.offsetLeft + "px";
    marker.current.style.width = e.offsetWidth + "px";
  };

  const handleOnClick = (e, text) => {
    indicator(e.target);
    setCurrentTab(text);
  };

  const setting = {
    종합정보: "detail",
    뉴스: "news",
    "종목토론 게시판": "board",
  };

  const paintTabItem = tabInfo.map((text, index) => (
    <TabItem
      key={index}
      handleOnClick={handleOnClick}
      text={text}
      link={setting[text] ? baseURL + `/${setting[text]}` : ""}
    />
  ));

  return (
    <div className="tab-box h-10 w-max border-b-4">
      <div ref={marker} className="marker"></div>
      {paintTabItem}
    </div>
  );
}
