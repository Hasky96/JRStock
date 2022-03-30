import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { toast } from "react-toastify";
import { contact } from "../../api/user";

export default function Contact() {
  const initValue = { name: "", email: "", message: "" };
  const [values, setValues] = useState(initValue);

  const handleSubmit = (e) => {
    e.preventDefault();

    const storageCount = window.localStorage.getItem("submit_count");
    const submitCount = storageCount ? parseInt(storageCount) : 0;

    if (submitCount >= 5) {
      toast.error("메시지를 너무 많이 전송하였습니다. 멈춰!");
      return;
    }

    contact(values);
    toast.success("메세지가 전송되었습니다. 감사합니다!");

    window.localStorage.setItem("submit_count", submitCount + 1);
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    handleStateChange(name, value);
  };

  const handleStateChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

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
        <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
          <div className="input-container">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="off"
              placeholder="Your Name."
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="off"
              placeholder="Your Email."
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              autoComplete="off"
              placeholder="Your Message."
              className="h-60"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="button bg-primary text-white">
              submit
            </button>
          </div>
        </form>
      </Fade>
    </div>
  );
}
