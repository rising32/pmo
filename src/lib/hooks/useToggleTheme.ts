import { useTheme } from './useTheme';
import { useRecoilState } from 'recoil';
import { darkModeState, DarkModeState } from '../../modules/darkMode';

export function useToggleTheme() {
  const theme = useTheme();
  const [darkMode, setDarkModeState] = useRecoilState<DarkModeState>(darkModeState);

  const toggle = () => {
    if (!theme) return;
    if (theme === 'dark') {
      setDarkModeState({ theme: 'light', systemTheme: darkMode.systemTheme });
    } else {
      setDarkModeState({ theme: 'dark', systemTheme: darkMode.systemTheme });
    }
  };

  return [theme, toggle] as const;
}
