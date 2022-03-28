import { Fade } from "react-awesome-reveal";

export default function Contact() {
  const handleSubmit = () => {};
  return (
    <div className="landing-block-container w-full flex flex-col md:flex-row justify-evenly items-center gap-10 ">
      <Fade direction="left">
        <div className="w-full">
          <h1>Contact Form</h1>
          <h2 className="content">
            서비스에 대해 궁금하신 사항이나 개선 희망 사항을 전해주세요
          </h2>
        </div>
      </Fade>
      <Fade direction="right">
        <form className="w-full">
          <div className="input-container">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              autoComplete="off"
              placeholder="Your Name."
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              autoComplete="off"
              placeholder="Your Email."
            />
          </div>
          <div className="input-container">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              autoComplete="off"
              placeholder="Your Message."
              className="h-60"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="button bg-primary text-white"
              onClick={() => handleSubmit()}
            >
              submit
            </button>
          </div>
        </form>
      </Fade>
    </div>
  );
}
