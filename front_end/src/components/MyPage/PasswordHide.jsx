import { ReactComponent as PasswordLook } from "../../assets/passwordLook.svg";
import { ReactComponent as PasswordNoLook } from "../../assets/passwordNoLook.svg";

export default function PasswordHide({ lookPassword, setLookPassword }) {
  const handleClick = () => {
    const password = document.getElementById("password");
    lookPassword ? (password.type = "text") : (password.type = "password");
    setLookPassword((state) => !state);
  };
  return (
    <div className="absolute right-2 top-8 z-20 hover:opacity-50">
      {lookPassword ? (
        <PasswordLook onClick={(e) => handleClick()} />
      ) : (
        <PasswordNoLook onClick={(e) => handleClick()} />
      )}
    </div>
  );
}
