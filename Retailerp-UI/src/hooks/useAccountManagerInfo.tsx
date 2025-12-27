import {
  AccountManagerInfo,
  AccountManagerInfoContext,
} from '../contexts/AccountManagerContext';
import { useContext } from 'react';

export const useAccountManagerInfo = (): AccountManagerInfo => {
  const userData = useContext(AccountManagerInfoContext);
  return userData;
};
