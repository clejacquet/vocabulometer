const run = require('run-sequence');

module.exports = (gulp) => {
    return {
	'deploy': (server) => ({
	    task: (done) => {
		run(`${server.name}:build`, `${server.name}:push`, done);
	    },
	    deps: [ `${server.name}:copy-client`, `${server.name}:copy-server` ]
	})
    };
};
