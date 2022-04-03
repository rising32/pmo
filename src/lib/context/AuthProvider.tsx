import * as React from 'react';
import { toast } from 'react-toastify';
import { AccountState, UserState } from '../../modules/user';
import { sendAuthEmailPassword, signOut } from '../api';
import useRequest from '../hooks/useRequest';

interface AuthContextType {
  account: AccountState | null;
  signin: (email: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = React.useState<AccountState | null>(null);
  const [_sendSignOut, , signOutRes] = useRequest(signOut);

  const signin = (email: string, password: string, callback: VoidFunction) => {
    sendAuthEmailPassword(email, password)
      .then(res => {
        console.log(res);
        const newAccount = res as AccountState;
        localStorage.setItem('user_token', newAccount.token);
        setAccount(newAccount);
        toast.success('login successed!');
        return callback();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const signout = (callback: VoidFunction) => {
    const user_id = account?.user.user_id;
    _sendSignOut(user_id);

    if (signOutRes) {
      localStorage.removeItem('user_token');
      setAccount(null);
      toast.success('sign out successed!');
      return callback();
    }
  };

  const value = { account, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export function useAuth() {
  return React.useContext(AuthContext);
}
