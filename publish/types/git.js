const gulpGit = require('gulp-git');
const run = require('run-sequence');

module.exports = (gulp, server) => {
    gulp.task(`${server.name}:add`, (done) => {
        gulp.src(`${server.cwd}/*`)
            .pipe(gulpGit.add({
                args: '-A',
                cwd: server.cwd
            }))
            .on('end', done);
    });

    gulp.task(`${server.name}:commit`, (done) => {
        gulp.src(`${server.cwd}/*`)
            .pipe(gulpGit.commit(Date(), {
                cwd: server.cwd
            }))
            .on('end', done);
    });

    gulp.task(`${server.name}:push`, (done) => {
        gulpGit.push(server.specific.remote, server.specific.branch, {
            cwd: server.cwd
        }, done);
    });

    gulp.task(`${server.name}:publish`, (done) => {
        run(`${server.name}:add`, `${server.name}:commit`, `${server.name}:push`, done);
    });
};