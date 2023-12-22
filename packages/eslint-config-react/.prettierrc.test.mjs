import prettier from 'prettier';
import tap from 'tap';

prettier.resolveConfigFile().then((filepath) => {
  const options = {
    filepath
  };
  tap.test('prettier should work', async (t) => {
    t.same(
      await prettier.format('foo ( )', options),
      'foo();\n',
      'extra whitespaces should be removed'
    );
    const formattedImports = Array(3)
      .fill(0)
      .map(() => [`console.log(i);`]);
    t.match(
      await prettier.format(formattedImports.join(' '), options),
      formattedImports.join('\n'),
      'imports should be on individual line'
    );
    t.end();
  });
});
