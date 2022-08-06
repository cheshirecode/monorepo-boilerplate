import tap from 'tap';
import { ESLint } from 'eslint';
import config from './index.js';

const eslint = new ESLint({
  baseConfig: config,
  useEslintrc: false
});

tap.test('eslint should pass', async (t) => {
  const results = await eslint.lintFiles(['passes/**/*.ts*']);
  results.map((r) => r.messages).forEach((r) => t.same(r, [], 'without warnings/errors'));
  t.end();
});

tap.test('eslint should fail', async (t) => {
  const results = await eslint.lintFiles(['fails/**/*.ts*']);
  results.map((r) => r.messages).forEach((r) => t.not(r, [], 'with some warnings/errors'));
  t.end();
});
