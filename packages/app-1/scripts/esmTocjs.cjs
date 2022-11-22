/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const { unlinkSync } = require('fs');
const { resolve } = require('path');

const esbuild = require('esbuild');

module.exports = (filePath, cleanup = false) => {
  const outdir = resolve(__dirname, '../temp/');
  const outFilePath = `${outdir}/${filePath}`.split('.').slice(0, -1).concat('js').join('.');
  const workingDir = resolve(__dirname, '..');
  esbuild.buildSync({
    entryPoints: [resolve(__dirname, '..', filePath)],
    outdir,
    format: 'cjs',
    bundle: true,
    platform: 'node',
    absWorkingDir: workingDir,
    external: ['./node_modules/*'],
    mainFields: ['module', 'main']
  });
  if (cleanup) {
    execSync(`sed -i -e 's/.es.js/.umd.js/g' -e 's/.mjs/.cjs/g' ${outFilePath}`);
  }

  return [
    outFilePath,
    outdir,
    () => {
      unlinkSync(outFilePath);
    }
  ];
};
