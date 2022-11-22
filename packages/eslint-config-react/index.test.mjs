import { ESLint } from 'eslint';
import tap from 'tap';

import config from './index.js';

const eslint = new ESLint({
  baseConfig: config,
  useEslintrc: false
});

tap.test('eslint should pass', async (t) => {
  const results = await eslint.lintFiles(['passes/**/*.ts*']);
  results
    .map((r) => [r.filePath, r.messages])
    .forEach((x) => t.same(x[1], [], `${x[0]} without warnings/errors`));
  t.end();
});

tap.test('eslint should fail', async (t) => {
  const results = await eslint.lintFiles(['fails/**/*.ts*']);
  results
    .map((r) => [r.filePath, r.messages])
    .forEach((x) => t.not(x[1], [], `${x[0]} with some warnings/errors`));
  t.end();
});
