const shTask = require('../utils/shTask');
const rename = require('gulp-rename');

module.exports = (gulp) => {
    return {
	'copy-dockerfile': (server) => ({
	    task: (done) => {
		gulp.src(server.specific.dockerfilePath)
		    .pipe(rename('Dockerfile'))
		    .pipe(gulp.dest(server.cwd))
		    .on('end', done);
	    }
	}),

	'init': (server) => ({
	    deps: [ `${server.name}:copy-dockerfile` ]
	}),

	'build': (server) => ({
	    task: shTask(`docker build -t ${server.specific.dockerTag} ./`, {
		cwd: server.cwd,
		onError: (err) => console.error(`An error occurred while building the docker image. Make sure you have the directory \'servers/docker/web\' correctly initialized (you can run \'gulp ${server.name}:init\' for that purpose).\n` + err)
	    })
	}),

	'push': (server) => ({
	    task: shTask(`docker push ${server.specific.dockerTag}`)
	})
    };
};
