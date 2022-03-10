import { useRef, useState } from "react";
import TabItem from "./TabItem";
import "./TabBar.css";

export default function TabBar({ setCurrentTab, tabInfo }) {
  const marker = useRef();

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
