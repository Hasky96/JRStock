import { useState } from "react";
import UserUpdateForm from "./UserUpdateForm";
import PasswordCheck from "./PasswordCheck";

export default function UserUpdate() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {isAuthorized ? (
        <UserUpdateForm />
      ) : (
        <PasswordCheck setIsAuthorized={setIsAuthorized} />
      )}
    </div>
  );
}
