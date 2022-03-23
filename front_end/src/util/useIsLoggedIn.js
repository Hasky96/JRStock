import useSessionToken from "./useSessionToken";

export default function useIsLoggedIn() {
  const token = useSessionToken();

  return token;
}
