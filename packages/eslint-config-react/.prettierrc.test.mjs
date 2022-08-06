import tap from 'tap';
import prettier from 'prettier';

prettier.resolveConfigFile().then((filepath) => {
  const options = {
    filepath
  };
  tap.test('prettier should work', async (t) => {
    t.same(prettier.format('foo ( )', options), 'foo();\n', 'extra whitespaces should be removed');
    // const formattedImports = Array(3)
    // .fill(0)
    // .map((v, i) => [`console.log(i);`]);
    // t.same(
    //   prettier.format(formattedImports.join(' '), options),
    //   formattedImports.join('\n'),
    //   'imports should be on individual line'
    // );
    t.end();
  });
});
