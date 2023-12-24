import '../src/styles/index.css';
import '../src/styles/reset.css';
// uno
import 'uno.css';
import { applyTheme } from '../src/features/ThemeToggle/utils';
applyTheme();
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
