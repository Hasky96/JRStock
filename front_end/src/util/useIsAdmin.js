import { useEffect, useState } from "react";

function getIsAdmin() {
  return window.sessionStorage.getItem("is_admin");
}

export default function useIsAdmin() {
  const [isAdmin, setAdmin] = useState(getIsAdmin());

  useEffect(() => {
    function handleChangeStorage() {
      setAdmin(getIsAdmin());
    }

    window.addEventListener("storage", handleChangeStorage);
    return () => window.removeEventListener("storage", handleChangeStorage);
  }, []);

  return isAdmin === "true" ? true : false;
}
