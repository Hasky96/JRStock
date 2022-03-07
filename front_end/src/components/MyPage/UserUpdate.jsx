import { useEffect, useState } from "react";
import { validPassword } from "../../regex";
import { userDetail, userUpdate } from "../../api/user";
import PasswordHide from "./PasswordHide";
import "../../routes/background.css";
import { useNavigate } from "react-router-dom";

export default function UserUpdate() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    profile_img: null,
    profile_img_url: null,
  });
  const [userId, setUserId] = useState(null);
  const [passwordErr, setPasswordErr] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [lookPassword, setLookPassword] = useState(false);
  const inputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-yellow-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm";
  const disabledInputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-500 rounded-md sm:text-sm";
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleValueChange(name, value);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { id, email, name, profile_img, profile_img_url } =
        await userDetail();
      setValues((state) => {
        return {
          ...state,
          name,
          email,
          profile_img,
          profile_img_url,
        };
      });
      setUserId(id);
    };
    fetchUserInfo();
  }, []);

  const handleValueChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    // 비밀번호 유효성 검증
    if (validPassword.test(e.target.value)) setPasswordValid(true);
    else setPasswordValid(false);

    handleValueChange("password", e.target.value);
  };

  const handlePasswordCheckChange = (e) => {
    if (e.target.value === values.password) setPasswordErr(false);
    else setPasswordErr(true);
    handleValueChange("password2", e.target.value);
  };

  const handleSubmit = async () => {
    if (passwordErr) alert("비밀번호를 올바르게 입력하세요!");
    else {
      // 회원가입 정보 보내기
      const data = {
        name: values.name,
        new_password: values.password,
        profile_img: values.profile_img,
      };
      userUpdate(userId, data)
        .then((res) => console.log("@@", res))
        .catch((error) => console.log(error));

      window.location.reload();
    }
  };

  return (
    <div className="mt-8 w-96">
      <form className="space-y-6">
        {/* 이름 input 부분 */}
        <div className="rounded-md shadow-sm">
          <div className="my-5">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="off"
              value={values.name}
              onChange={(e) => handleInputChange(e)}
              required
              className={inputBoxStyle}
              placeholder="Name"
            />
          </div>
          {/* 이메일 input 부분 */}
          <div className="my-5">
            <label htmlFor="email-address">이메일</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="off"
              value={values.email}
              disabled
              className={disabledInputBoxStyle}
            />
          </div>
          {/* 비밀번호 input 부분 */}
          <div className="my-5 relative">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => handlePasswordChange(e)}
              required
              className={inputBoxStyle}
              placeholder="문자, 숫자, 특수문자 각 하나이상 포함 (8~16자)"
            />
            <PasswordHide
              lookPassword={lookPassword}
              setLookPassword={setLookPassword}
            />
            {!passwordValid && (
              <p className="text-red-500">비밀번호가 유효하지 않습니다.</p>
            )}
          </div>
          {/* 비밀번호 확인 input 부분 */}
          <div className="my-5">
            <label htmlFor="password2">비밀번호 확인</label>
            <input
              id="password2"
              name="password2"
              type="password"
              autoComplete="off"
              onChange={(e) => handlePasswordCheckChange(e)}
              required
              className={inputBoxStyle}
              placeholder="문자, 숫자, 특수문자 각 하나이상 포함 (8~16자)"
            />
            {passwordErr && (
              <p className="text-red-500">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>
        {/* 회원가입 버튼 */}
        <div>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-300 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
            회원 정보 수정
          </button>
        </div>
      </form>
    </div>
  );
}
