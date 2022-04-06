import type { RecoilState } from 'recoil';
import { atom } from 'recoil';

export interface UserState {
  user_id: number;
  email: string;
  phone_number: string;
  display_name: string;
  password: string;
  avatar?: string;
  birthday?: string;
  role_id: number;
  registration_time?: string;
}
export interface AccountState {
  login_id: number;
  token: string;
  user: UserState;
}

const initialState = null as AccountState | null;

export const accountState: RecoilState<AccountState | null> = atom({
  key: 'accountStateKey',
  default: initialState,
});
