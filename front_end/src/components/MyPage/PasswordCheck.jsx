import { useState } from "react";
import { userPasswordCheck } from "../../api/user";
import { toast } from "react-toastify";

export default function PasswordCheck({ setIsAuthorized }) {
  const [accessPassword, setAccessPassword] = useState("");

  const inputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-900 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  const buttonStyle =
    "relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-active duration-300 ";

  const handleAccessPasswordChange = (e) => setAccessPassword(e.target.value);

  const handleAccessPasswordSubmit = async (e) => {
    if (accessPassword.length === 0) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    const data = {
      password: accessPassword,
    };

    userPasswordCheck(data)
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
  };

  return (
    <div className="my-5 w-full sm:w-72">
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
          비밀번호 인증
        </button>
      </div>
    </div>
  );
}
