import { LoginInfo, LoginInfoContext } from "../contexts/LoginContext";
import { useContext } from "react";

export const useLoginInfo = (): LoginInfo => {
  const loginData = useContext(LoginInfoContext);
  return loginData;
};