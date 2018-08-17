const shTask = require('../utils/shTask');
const del = require('del');

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
		del.sync([`${server.cwd}/`]);
	    }
	}),
	
	'deploy': (server) => ({
	    task: shTask('mvn clean heroku:deploy', {
		cwd: server.cwd
	    }),
	    deps: [ `${server.name}:copy` ]
	}),
    };
};
