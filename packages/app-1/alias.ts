import { resolve } from 'path';

const alias: Record<string, string> = {
  '@': resolve(__dirname, './src')
};

export default alias;
