const shTask = require('../utils/shTask.js');

module.exports = (gulp) => {
    return {
	'clone': (server) => ({
	    task: shTask(`heroku git:clone -a ${server.specific.appName} ${server.cwd}`)
	})
    };
};
