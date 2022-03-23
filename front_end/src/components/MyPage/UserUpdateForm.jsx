import { useEffect, useState } from "react";
import { validPassword } from "../../regex";
import { userDetail, userUpdate } from "../../api/user";
import { API_MEDIA_URL } from "../../config";
import { toast } from "react-toastify";
import PasswordHide from "./PasswordHide";

export default function UserUpdate() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    profile_img: null,
    profile_img_preview: null,
    profile_img_url: null,
  });
  const [userId, setUserId] = useState(null);
  const [passwordErr, setPasswordErr] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);
  const [lookPassword, setLookPassword] = useState(false);
  const inputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-indigo-900 placeholder-gray-900 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 sm:text-sm";
  const disabledInputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-900 text-gray-900 rounded-md sm:text-sm";
  const buttonStyle =
    "w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-primary hover:bg-active duration-300";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleValueChange(name, value);
  };

  const handleValueChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    // 비밀번호 유효성 검증
    if (validPassword.test(e.target.value)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }

    handleValueChange("password", e.target.value);
  };

  const handlePasswordCheckChange = (e) => {
    if (e.target.value === values.password) setPasswordErr(false);
    else setPasswordErr(true);
    handleValueChange("password2", e.target.value);
  };

  const handleImageChange = (e) => {
    handleValueChange("profile_img", e.target.files[0]);

    const reader = new FileReader();
    const url = reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = (e) => {
      handleValueChange("profile_img_preview", reader.result);
    };
  };

  const handleSubmit = async () => {
    if (!validPassword.test(values.password)) {
      alert("비밀번호가 유효하지 않습니다!");
      setPasswordValid(false);
      return;
    }

    if (values.password !== values.password2) {
      alert("비밀번호가 서로 일치하지 않습니다.");
      setPasswordErr(false);
      return;
    }

    // 회원가입 정보 보내기
    const data = {
      name: values.name,
      new_password: values.password,
      profile_img: values.profile_img,
    };

    const formData = new FormData();
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    await userUpdate(userId, formData)
      .then((res) => {
        alert("회원 정보가 수정되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.error("회원 정보 수정에 실패하였습니다.");
      });
  };

  return (
    <div className="w-1/2">
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
            {values.password && !passwordValid && (
              <p className="text-active">비밀번호가 유효하지 않습니다.</p>
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
            {values.password && passwordErr && (
              <p className="text-active">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <div className="my-5 flex flex-col">
            프로필 이미지 수정
            {values.profile_img_preview ? (
              <img
                className="rounded-full w-36"
                src={values.profile_img_preview}
                alt="profile_img_preview"
              />
            ) : (
              <>
                {values.profile_img ? (
                  <img
                    className="rounded-full w-36"
                    src={API_MEDIA_URL + `${values.profile_img}`}
                    alt="profile_img"
                  />
                ) : (
                  <img
                    className="rounded-full w-36"
                    src={values.profile_img_url}
                    alt="profile_img_url"
                  />
                )}
              </>
            )}
            <input
              id="profile_img"
              name="profile_img"
              type="file"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
        </div>
        {/* 회원가입 버튼 */}
        <div>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className={buttonStyle}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
            회원 정보 수정
          </button>
        </div>
      </form>
    </div>
  );
}
