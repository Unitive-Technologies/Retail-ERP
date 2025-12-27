import React, { useState } from 'react';

export type LoginDetails = {
  id: number;
  password: string;
  mobile_number: number;
  is_deleted: boolean;
  role_id: number;
  login_type: string;
  created_at: string;
  updated_at: string;
  status_id: string
  permissions: any[];
  first_name: string;
  last_name: string;
  email: string;
};

export type LoginInfo = {
  loginDetails: LoginDetails;
  updateLoginInfo: React.Dispatch<React.SetStateAction<LoginDetails>>;
};

export const INITIAL_STATE: LoginInfo = {
  loginDetails: {
    id: 0,
    password: '',
    mobile_number: 0,
    is_deleted: false,
    created_at: '',
    updated_at: '',
    role_id: 0,
    login_type: '',
    status_id: '',
    permissions: [],
    first_name: '',
    last_name: '',
    email: ''
  },
  updateLoginInfo: () => undefined,
};

export const LoginInfoContext = React.createContext({
  ...INITIAL_STATE,
});

type Props = {
  children: any;
};

export const LoginInfoProvider = ({ children }: Props) => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>(
    INITIAL_STATE.loginDetails
  );
  const contextValue = React.useMemo(() => {
    return {
      loginDetails: loginDetails,
      updateLoginInfo: setLoginDetails,
    };
  }, [loginDetails, setLoginDetails]);

  return (
    <LoginInfoContext.Provider value={contextValue}>
      {children}
    </LoginInfoContext.Provider>
  );
};
