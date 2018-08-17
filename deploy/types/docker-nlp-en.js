const shTask = require('../utils/shTask');
const del = require('del');
const run = require('run-sequence');


module.exports = (gulp) => {
    return {
	'copy': (server) => ({
	    task: (done) => {
		gulp.src(`${server.specific.srcDirectory}/**/*`, { base: `${server.specific.srcDirectory}` })
		    .pipe(gulp.dest(`${server.cwd}/`))
		    .on('end', done);
	    },
	    deps: [ `${server.name}:clean` ]
	}),

	'clean': (server) => ({
	    task: () => {
		del.sync([`${server.cwd}/!(Dockerfile)`]);
	    }
	}),
	
	'deploy': (server) => ({
	    task: (done) => {
		run(`${server.name}:build`, `${server.name}:push`, done);
	    },
	    deps: [ `${server.name}:copy` ]
	})
    };
};
