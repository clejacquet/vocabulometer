const gulp = require('gulp');
const gulpGit = require('gulp-git');
const fs = require('fs');
const run = require('run-sequence');
const del = require('del');
const shTask = require('./utils/shTask');
const _ = require('underscore');

const loadJsonFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
};

const types = loadJsonFile('types.json');
const servers = loadJsonFile('servers.json');

const typeMap = {};

types.forEach(type => {
    type.inherits = type.inherits || [];
    typeMap[type.name] = require(type.path)(gulp);
});

types.forEach(type => {
    const srcTypes = type.inherits.concat([type.name]).map(otherTypeName => typeMap[otherTypeName]);
    const allTaskBuilders = _.extend({}, ...srcTypes);

    servers
	.filter(server => server.type === type.name)
	.forEach(server => {
	    Object.keys(allTaskBuilders).forEach(taskName => {
		const taskBuilder = allTaskBuilders[taskName];
		const taskItem = taskBuilder(server);

		taskItem.task = taskItem.task || (() => {});
		taskItem.deps = taskItem.deps || [];

		gulp.task(`${server.name}:${taskName}`, taskItem.deps, taskItem.task);
	    });
	});
});

gulp.task('heroku:install', shTask('curl https://cli-assets.heroku.com/install.sh | sh'));

gulp.task('heroku:uninstall', shTask('sudo rm /usr/local/bin/heroku && sudo rm -rf /usr/local/lib/heroku /usr/local/heroku && sudo rm -rf ~/.local/share/heroku ~/.cache/heroku'));

gulp.task('heroku:login', shTask('heroku login'));



gulp.task('clean-all', () => {
    del.sync([ './servers' ]);
});

gulp.task('install-all', [
    'dev:clone',
    'prod:clone',
    'docker-web:init',
    'docker-nlp-en:init',
    'heroku-nlp-en:copy'
], () => {});

gulp.task('setup', [ 'clean-all' ], (done) => {
    run('install-all', done);
});
