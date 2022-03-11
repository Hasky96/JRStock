import { useEffect, useRef, useState } from "react";
import TabItem from "./TabItem";
import "./TabBar.css";

export default function TabBar({ setCurrentTab, tabInfo }) {
  const marker = useRef();

  useEffect(() => {
    const firstTab = document.querySelector(".tab-item");
    marker.current.style.left = firstTab.offsetLeft + "px";
    marker.current.style.width = firstTab.offsetWidth + "px";
  }, []);

  const indicator = (e) => {
    marker.current.style.left = e.offsetLeft + "px";
    marker.current.style.width = e.offsetWidth + "px";
  };

  const handleOnClick = (e, text) => {
    indicator(e.target);
    setCurrentTab(text);
  };

  const paintTabItem = tabInfo.map((text, index) => (
    <TabItem key={index} handleOnClick={handleOnClick} text={text} link={``} />
  ));

  return (
    <div className="tab-box h-10 w-max border-b-4">
      <div ref={marker} className="marker"></div>
      {paintTabItem}
    </div>
  );
}
