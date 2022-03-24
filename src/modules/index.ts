import { DarkModeState } from './darkMode';
import { UserState } from './user';

export interface RootState {
  user: UserState;
  darkMode: DarkModeState;
}
