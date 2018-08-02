const gulp = require('gulp');
const fs = require('fs');

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