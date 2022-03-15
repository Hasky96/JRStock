import { useState } from "react";
import { userPasswordCheck } from "../../api/user";
import { toast } from "react-toastify";

export default function PasswordCheck({ setIsAuthorized }) {
  const [accessPassword, setAccessPassword] = useState("");

  const inputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-yellow-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm";

  const buttonStyle =
    "relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-300 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500";

  const handleAccessPasswordChange = (e) => setAccessPassword(e.target.value);

  const handleAccessPasswordSubmit = async (e) => {
    if (accessPassword.length === 0) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    const data = {
      password: accessPassword,
    };

    await userPasswordCheck(data)
      .then((res) => {
        if (res.data.password_check) {
          setIsAuthorized(true);
          toast.dismiss();
          toast.success("비밀번호 인증 완료!");
        } else {
          toast.error("비밀번호 인증 실패!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("비밀번호 인증 실패!");
      });

    // if (password_check) {
    //   setIsAuthorized(true);
    //   console.log("here");
    //   toast.success("비밀번호 인증 완료!");
    // } else {
    //   console.log("here2");
    //   toast.error("잘못된 비밀번호입니다.");
    // }
  };

  return (
    <div className="my-5 w-full sm:w-1/2 lg:w-1/3">
      <input
        id="accessPassword"
        name="accessPassword"
        type="password"
        required
        className={inputBoxStyle}
        placeholder="password"
        onChange={(e) => handleAccessPasswordChange(e)}
      />
      <div className="w-1/2 mx-auto mt-2">
        <button
          type="button"
          onClick={() => handleAccessPasswordSubmit()}
          className={buttonStyle}
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
          비밀번호 인증
        </button>
      </div>
    </div>
  );
}
