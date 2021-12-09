const {spawn} = require('child_process');

const options = {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
};

const svelteProcess = spawn("npx rollup -c -w", [], options);
const serverProcess = spawn("nodemon node server.js", [], options);