import { useEffect, useState } from "react";

function getToken() {
  return window.sessionStorage.getItem("access_token");
}

export default function useSessionToken() {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    function handleChangeStorage() {
      setToken(getToken());
    }

    window.addEventListener("storage", handleChangeStorage);
    return () => window.removeEventListener("storage", handleChangeStorage);
  }, []);

  return token;
}
