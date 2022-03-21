import { useNavigate } from "react-router-dom";
import { ReactComponent as Launch } from "../../assets/landing_page/product-launch.svg";
import "./Intro.css";

export default function SectionTwo() {
  return (
    <div className="w-full flex flex-col md:flex-row justify-evenly items-center gap-10 landing-block-container">
      <div className="content-wrapper w-full lg:w-2/3">
        <h1>Light, fast {`&`} responsive</h1>
        <h2 className="content">
          This template is ready to use, so you don't need to change anything at
          a component level, unless you want to customize the default styling.
        </h2>
      </div>
      <div className="w-full lg:w-1/3">
        <Launch />
      </div>
    </div>
  );
}
