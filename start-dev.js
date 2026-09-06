process.chdir('C:\\Users\\gvear\\20th-sfg');
if (!process.argv.includes('dev')) {
  process.argv.splice(2, 0, 'dev');
}
const port = process.env.PORT;
if (port && !process.argv.includes('--port')) {
  process.argv.push('--port', port);
}
require('C:\\Users\\gvear\\20th-sfg\\node_modules\\next\\dist\\bin\\next');
