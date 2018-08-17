const shTask = require('../utils/shTask');
const run = require('run-sequence');

module.exports = (gulp) => {
    return {
	'copy': (server) => ({
	    task: (done) => {
		gulp.src(`${server.specific.srcDirectory}/**/*`, { base: `${server.specific.srcDirectory}` })
		    .pipe(gulp.dest(`${server.cwd}`))
		    .on('end', done);
	    }
	}),
	
	'push-to-registry': (server) => ({
	    task: shTask(`docker tag ${server.specific.dockerTag} registry.heroku.com/${server.specific.appName}/web && docker push registry.heroku.com/${server.specific.appName}/web`, { cwd: server.cwd })
	}),

	'release': (server) => ({
	    task: shTask(`heroku container:release web -a ${server.specific.appName}`, { cwd: server.cwd })
	}),

	'deploy': (server) => ({
	    task: (done) => {
		run(`${server.name}:build`, `${server.name}:push-to-registry`, `${server.name}:release`, done);
	    },
	    deps: [ `${server.name}:copy` ]
	})
    };
};
