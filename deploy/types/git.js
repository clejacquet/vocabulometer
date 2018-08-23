const gulpGit = require('gulp-git');
const run = require('run-sequence');

module.exports = (gulp) => {
    return {
	'add': (server) => ({
	    task: (done) => {
		gulp.src(`${server.cwd}/*`)
		    .pipe(gulpGit.add({
			args: '-A',
			cwd: server.cwd
		    }))
		    .on('end', done);
	    }
	}),

	'commit': (server) => ({
	    task: (done) => {
		gulp.src(`${server.cwd}/*`)
		    .pipe(gulpGit.commit(Date(), {
			cwd: server.cwd
		    }))
		    .on('end', done);
	    }
	}),

	'push': (server) => ({
	    task: (done) => {
		gulpGit.push(server.specific.remote, server.specific.branch, {
		    cwd: server.cwd
		}, done);
	    }
	}),

	'deploy-git': (server) => ({
	    task: (done) => {
		run(`${server.name}:add`, `${server.name}:commit`, `${server.name}:push`, done);
	    }
	})
    };
};
