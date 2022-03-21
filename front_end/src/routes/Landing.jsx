import { Fade, Slide } from "react-awesome-reveal";
import Intro from "../components/Landing/Intro";
import SectionOne from "../components/Landing/SectionOne";
import SectionTwo from "../components/Landing/SectionTwo";

export default function Landing() {
  return (
    <div className="container max-w-7xl mx-auto px-10">
      <Fade direction="down">
        <Intro />
      </Fade>
      <Fade direction="right">
        <SectionOne />
      </Fade>
      <Fade direction="left">
        <SectionTwo />
      </Fade>
    </div>
  );
}
