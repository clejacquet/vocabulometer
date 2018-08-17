const spawn = require('child_process').spawn;
const path = require('path');

module.exports = (command, options) => {
    options = options || {};
    const onError = options.onError || ((err) => console.error(err));
    delete options.onError;
    
    return (done) => {
	const s = spawn(command, {
	    cwd: options.cwd,
	    shell: true,
	    stdio: 'inherit'
	});

	s.on('error', (err) => {
	    onError(err);
	});
	s.on('close', (code) => {
	    if (code === 0) {
		done();
	    } else {
		done(code);
	    }
	});
    }
}
