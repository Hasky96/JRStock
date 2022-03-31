import { useEffect, useState } from "react";
import { userDetail, userUpdate } from "../../api/user";
import { API_MEDIA_URL } from "../../config";
import { toast } from "react-toastify";

export default function GoogleUserUpdateForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    profile_img: null,
    profile_img_preview: null,
    profile_img_url: null,
  });
  const [userId, setUserId] = useState(null);
  const inputBoxStyle =
    "appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-900 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ";
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

  const handleImageChange = (e) => {
    e.preventDefault();
    handleValueChange("profile_img", e.target.files[0]);

    const reader = new FileReader();
    const url = reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = (e) => {
      handleValueChange("profile_img_preview", reader.result);
    };
  };

  const handleImageDelete = (e) => {
    e.preventDefault();
    handleValueChange("profile_img_preview", "");
    handleValueChange("profile_img", "");
  };

  const handleSubmit = async () => {
    // 회원가입 정보 보내기
    const data = {
      name: values.name,
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
    <div className="w-full sm:w-96 shadow-lg p-5">
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
          <div className="my-5 flex flex-col">
            프로필 이미지 수정
            <div className="flex items-end">
              {values.profile_img_preview ? (
                <img
                  className="rounded-full w-20"
                  src={values.profile_img_preview}
                  alt="profile_img_preview"
                />
              ) : (
                <>
                  {values.profile_img ? (
                    <img
                      className="rounded-full w-20"
                      src={API_MEDIA_URL + `${values.profile_img}`}
                      alt="profile_img"
                    />
                  ) : (
                    <img
                      className="rounded-full w-20"
                      src={values.profile_img_url}
                      alt="profile_img_url"
                    />
                  )}
                </>
              )}
              <label
                htmlFor="profile_img"
                className="ml-3 w-30 h-10 rounded-lg shadow-lg p-2 text-primary border hover:bg-active hover:text-white duration-300 font-bold hover:cursor-pointer"
              >
                이미지 변경
              </label>
              <button
                type="button"
                onClick={(e) => handleImageDelete(e)}
                className="ml-3 w-30 h-10 rounded-lg shadow-lg p-2 text-primary border hover:bg-active hover:text-white duration-300 font-bold"
              >
                삭제
              </button>
              <input
                id="profile_img"
                name="profile_img"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
            </div>
          </div>
        </div>
        {/* 회원가입 버튼 */}
        <div>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className={buttonStyle}
          >
            회원 정보 수정
          </button>
        </div>
      </form>
    </div>
  );
}
