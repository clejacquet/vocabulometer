const gulpShell = require('gulp-shell');
const gulpGit = require('gulp-git');
const del = require('del');
const run = require('run-sequence');

const clientPath = '../modules/client';
const serverPath = '../modules/server';

module.exports = (gulp, server) => {
    gulp.task(`${server.name}:add`, (done) => {
        gulp.src(`${server.cwd}/*`, { read: false })
            .pipe(gulpGit.add({
                args: '-A',
                cwd: server.cwd
            }))
            .on('end', done);
    });

    gulp.task(`${server.name}:commit`, (done) => {
        gulp.src(`${server.cwd}/*`, { read: false })
            .pipe(gulpGit.commit(Date(), {
                cwd: server.cwd
            }))
            .on('end', done);
    });

    gulp.task(`${server.name}:push`, (done) => {
        gulpGit.push('heroku', 'master', {
            cwd: server.cwd
        }, done);
    });

    gulp.task(`${server.name}:generate-client`, gulpShell.task(`ng build -env=${server.specific.ngEnv} --prod`, {
        cwd: clientPath
    }));

    gulp.task(`${server.name}:clean-client`, () => {
        del.sync([`${server.cwd}/dist`]);
    });

    gulp.task(`${server.name}:copy-client`, [ `${server.name}:clean-client`, `${server.name}:generate-client` ],  (done) => {
        gulp.src([`${clientPath}/dist/**/*`], { base: `${clientPath}/dist` })
            .pipe(gulp.dest(`${server.cwd}/dist/`))
            .on('end', done);
    });

    gulp.task(`${server.name}:clean-server`, () => {
        del.sync([`${server.cwd}/!(bin|.git|dist)`]);
    });

    gulp.task(`${server.name}:copy-server`, [ `${server.name}:clean-server` ], (done) => {
        gulp.src([
            `${serverPath}/!(node_modules|.idea|dist|tools|*.log)`,
            `${serverPath}/src/**/*`,
            `${serverPath}/assets/**/*`
        ], { base: `${serverPath}` })
            .pipe(gulp.dest(`${server.cwd}`))
            .on('end', done);
    });

    gulp.task(`${server.name}:deploy`, [ `${server.name}:copy-client`, `${server.name}:copy-server` ], (done) => {
        run(`${server.name}:add`, `${server.name}:commit`, `${server.name}:push`, done);
    });
};
