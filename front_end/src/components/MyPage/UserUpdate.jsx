import { useState } from "react";
import UserUpdateForm from "./UserUpdateForm";
import PasswordCheck from "./PasswordCheck";

export default function UserUpdate() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <div className="mt-8 w-96">
      {isAuthorized ? (
        <UserUpdateForm />
      ) : (
        <PasswordCheck setIsAuthorized={setIsAuthorized} />
      )}
    </div>
  );
}
