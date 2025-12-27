import React, { useState } from 'react';

export type AdminDetails = {
  id: number;
  user_name: string;
  email: string;
  password: string;
  mobile_number: number;
  is_deleted: boolean;
  role_id: number;
  permissions: number[];
  created_at: string;
  updated_at: string;
};

export type AdminInfo = {
  userDetails: AdminDetails;
  updateAdminInfo: React.Dispatch<React.SetStateAction<AdminDetails>>;
};

export const INITIAL_STATE: AdminInfo = {
  userDetails: {
    id: 0,
    user_name: '',
    email: '',
    password: '',
    mobile_number: 0,
    is_deleted: false,
    created_at: '',
    updated_at: '',
    role_id: 0,
    permissions: [],
  },
  updateAdminInfo: () => undefined,
};

export const AdminInfoContext = React.createContext({
  ...INITIAL_STATE,
});

type Props = {
  children: any;
};

export const AdminInfoProvider = ({ children }: Props) => {
  const [userDetails, setUserDetails] = useState<AdminDetails>(
    INITIAL_STATE.userDetails
  );
  const contextValue = React.useMemo(() => {
    return {
      userDetails: userDetails,
      updateAdminInfo: setUserDetails,
    };
  }, [userDetails, setUserDetails]);

  return (
    <AdminInfoContext.Provider value={contextValue}>
      {children}
    </AdminInfoContext.Provider>
  );
};
