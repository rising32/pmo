import type { RecoilState } from 'recoil';
import { atom } from 'recoil';

export interface DarkModeState {
  theme: 'dark' | 'light' | 'default';
  systemTheme: 'dark' | 'light' | 'not-ready';
}

export const darkModeState: RecoilState<DarkModeState> = atom({
  key: 'darkModeState',
  default: {
    theme: 'light',
    systemTheme: 'light',
  } as DarkModeState,
});
