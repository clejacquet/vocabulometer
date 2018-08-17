const run = require('run-sequence');

module.exports = (gulp) => {
    return {
	'deploy': (server) => ({
	    task: (done) => {
		run(`${server.name}:add`, `${server.name}:commit`, `${server.name}:push`, done);
	    },
	    deps: [ `${server.name}:copy-client`, `${server.name}:copy-server` ]
	})
    };
};
