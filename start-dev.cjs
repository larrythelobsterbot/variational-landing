const { execSync } = require('child_process');
process.chdir(__dirname);
execSync('npx vite --host --port ' + (process.env.PORT || 5173), { stdio: 'inherit' });
