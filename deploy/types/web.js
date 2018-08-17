const shTask = require('../utils/shTask');
const del = require('del');

const clientPath = '../modules/client';
const serverPath = '../modules/server';

module.exports = (gulp) => {
    return {
	'generate-client': (server) => ({
	    task: shTask(`ng build -env=${server.specific.ngEnv} --prod`, {
		cwd: clientPath
	    })
	}),

	'clean-client': (server) => ({
	    task: () => {
		del.sync([`${server.cwd}/dist`]);
	    }
	}),

	'copy-client': (server) => ({
	    task: (done) => {
		gulp.src([`${clientPath}/dist/**/*`], { base: `${clientPath}/dist` })
		    .pipe(gulp.dest(`${server.cwd}/dist/`))
		    .on('end', done);
	    },
	    deps: [ `${server.name}:clean-client`, `${server.name}:generate-client` ]
	}),

	'clean-server': (server) => ({
	    task: () => {
		del.sync([`${server.cwd}/(src|assets|package.json|package-lock.json)`]);
	    }
	}),

	'copy-server': (server) => ({
	    task: (done) => {
		gulp.src([
		    `${serverPath}/!(node_modules|.idea|dist|tools|*.log)`,
		    `${serverPath}/src/**/*`,
		    `${serverPath}/assets/**/*`
		], { base: `${serverPath}` })
		    .pipe(gulp.dest(`${server.cwd}`))
		    .on('end', done);
	    },
	    deps: [ `${server.name}:clean-server` ]
	})
    }
};
