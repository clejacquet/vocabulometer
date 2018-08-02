const gulp = require('gulp');
const gulpSh = require('gulp-shell');
const fs = require('fs');
const run = require('run-sequence');

const loadJsonFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
};

const types = loadJsonFile('types.json');
const servers = loadJsonFile('servers.json');

const toProcessArray = types.map(type => ({
    processorPath: type.path,
    servers: servers.filter(server => server.type === type.name)
}));

toProcessArray.forEach(typeItem => {
    const typeProcessor = require(typeItem.processorPath);

    typeItem.servers.forEach(server => {
        typeProcessor(gulp, server);
    });
});

gulp.task('heroku:install', gulpSh.task('curl https://cli-assets.heroku.com/install.sh | sh'));

gulp.task('heroku:uninstall', gulpSh.task('sudo rm /usr/local/bin/heroku && sudo rm -rf /usr/local/lib/heroku /usr/local/heroku && sudo rm -rf ~/.local/share/heroku ~/.cache/heroku'));

gulp.task('heroku:login', gulpSh.task('heroku login'));

gulp.task('heroku:clone-dev', gulpSh.task('heroku git:clone -a vocabulometer-dev servers/heroku/dev'));

gulp.task('heroku:clone-prod', gulpSh.task('heroku git:clone -a vocabulometer servers/heroku/stable'));

gulp.task('heroku:init', [ 'heroku:clone-dev', 'heroku:clone-prod' ]);
