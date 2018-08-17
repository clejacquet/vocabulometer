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

types.forEach((type, i) => {
    type.inherits = type.inherits || [];
    typeMap[type.name] = {
	value: require(type.path)(gulp),
	id: i
    }
});

fullTypeMap = Array(types.length).fill(0);

const recFunc = (i, visited) => {
    // if already visited throws an error
    if (visited.has(i)) {
	console.error('Error: Circular inheritance found');
	process.exit(1);
    }

    visited = new Set([...visited]).add(i);

    const typeList = types[i].inherits.map(oType => [...recFunc(typeMap[oType].id, visited)]);
    fullTypeMap[i] = new Set([i, ..._.flatten(typeList, 1)]);
    return fullTypeMap[i];
}

types.forEach((_, i) => recFunc(i, new Set()));

fullTypeMap.forEach((fullTypeEntry, i) => {
    const type = types[i];
    const srcTypes = [...fullTypeEntry].map(entry => {
	return typeMap[types[entry].name].value
    });
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

gulp.task('heroku:container-login', shTask('heroku container:login'));



gulp.task('clean-all', () => {
    del.sync([ './servers' ]);
});

gulp.task('install-all', [
    'dev:clone',
    'prod:clone',
    'docker-web:init',
    'docker-nlp-en:init',
    'heroku-nlp-en:copy',
    'heroku-nlp-jp:init'
], () => {});

gulp.task('setup', [ 'clean-all' ], (done) => {
    run('install-all', done);
});
