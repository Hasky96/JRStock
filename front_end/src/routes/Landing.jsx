import { Fade, Slide } from "react-awesome-reveal";
import Intro from "../components/Landing/Intro";
import SectionOne from "../components/Landing/SectionOne";
import SectionTwo from "../components/Landing/SectionTwo";
import SectionThree from "../components/Landing/SectionThree";
import "../components/Landing/Landing.css";

export default function Landing() {
  return (
    <div className="container max-w-7xl mx-auto px-10">
      <Fade direction="left">
        <Intro />
      </Fade>
      <Fade direction="up">
        <SectionOne />
      </Fade>
      <Fade direction="up">
        <SectionTwo />
      </Fade>
      <Fade direction="up">
        <SectionThree />
      </Fade>
      {/* <Fade direction="up">
        <SectionTwo />
      </Fade> */}
    </div>
  );
}
