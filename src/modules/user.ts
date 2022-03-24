import type { RecoilState } from 'recoil';
import { atom } from 'recoil';

export interface UserState {
  user_id: number;
  email: string;
  phone_number: string;
  display_name: string;
  password: string;
  avatar?: string | null;
  birthday?: string | null;
  is_project_manager?: number | 0;
  registration_time?: string | null;
}
export interface AccountState {
  login_id: number;
  user: UserState;
}

const initialState = null as AccountState | null;

export const accountState: RecoilState<AccountState | null> = atom({
  key: 'accountStateKey',
  default: initialState,
});
