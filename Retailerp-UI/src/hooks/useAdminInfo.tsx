import { AdminInfo, AdminInfoContext } from "../contexts/AdminContext";
import { useContext } from "react";

export const useAdminInfo = (): AdminInfo => {
  const userData = useContext(AdminInfoContext);
  return userData;
};