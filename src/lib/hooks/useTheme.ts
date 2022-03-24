import { useRecoilValue } from 'recoil';
import { darkModeState, DarkModeState } from '../../modules/darkMode';

export function useTheme() {
  const darkMode = useRecoilValue<DarkModeState>(darkModeState);
  const theme = (() => {
    if (darkMode.systemTheme === 'not-ready') return 'light';
    if (darkMode.theme !== 'default') return darkMode.theme;
    return darkMode.systemTheme;
  })();

  return theme;
}
