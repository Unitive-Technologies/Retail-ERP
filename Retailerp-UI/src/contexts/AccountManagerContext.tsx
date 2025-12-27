import React, { useState } from 'react';

type moduleProps = {
  module_id: number;
  module_name: string;
};

export type AccountManagerDetails = {
  id: number;
  first_name: string;
  last_name: string;
  mobile_number: number;
};

export type AccountManagerInfo = {
  userDetails: AccountManagerDetails;
  updateAccountManagerInfo: React.Dispatch<
    React.SetStateAction<AccountManagerDetails>
  >;
};

export const INITIAL_STATE: AccountManagerInfo = {
  userDetails: {
    id: 0,
    first_name: '',
    last_name: '',
    mobile_number: 0,
  },
  updateAccountManagerInfo: () => undefined,
};

export const AccountManagerInfoContext = React.createContext({
  ...INITIAL_STATE,
});

type Props = {
  children: any;
};

export const AccountManagerInfoProvider = ({ children }: Props) => {
  const [userDetails, setUserDetails] = useState<AccountManagerDetails>(
    INITIAL_STATE.userDetails
  );
  const contextValue = React.useMemo(() => {
    return {
      userDetails: userDetails,
      updateAccountManagerInfo: setUserDetails,
    };
  }, [userDetails, setUserDetails]);

  return (
    <AccountManagerInfoContext.Provider value={contextValue}>
      {children}
    </AccountManagerInfoContext.Provider>
  );
};
