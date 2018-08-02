const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
const TOKEN_DIR = '.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';


module.exports = (cb) => {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            return cb(err);
        }
        // Authorize a client with the loaded credentials, then call the YouTube API.
        authorize(JSON.parse(content), getChannel);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const clientSecret = credentials.web.client_secret;
        const clientId = credentials.web.client_id;
        const redirectUrl = credentials.web.redirect_uris[0];
        const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {oauth2Client} oauth2Client The OAuth2 client to get token for.
     * @param {callback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback) {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,

        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, tokens) {
                if (err) {
                    return cb(err);
                }

                oauth2Client.setCredentials(tokens);
                storeToken(tokens);
                callback(oauth2Client);
            });

            oauth2Client.on('tokens', (tokens) => {
                if (tokens.refresh_token) {
                    storeToken(tokens);
                    oauth2Client.setCredentials({
                        refresh_token: tokens.refresh_token
                    });
                }
            });
        });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} tokens The token to store to disk.
     */
    function storeToken(tokens) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                return cb(err);
            }
        }

        fs.readFile(TOKEN_PATH, 'utf8', (err, file) => {
            let toWriteTokens;
            if (!err) {
                toWriteTokens = JSON.parse(file);
                Object.keys(tokens).forEach((key) => toWriteTokens[key] = tokens[key]);
            } else {
                toWriteTokens = tokens;
            }

            fs.writeFile(TOKEN_PATH, JSON.stringify(toWriteTokens), (err) => {
                if (err) {
                    return cb(err);
                }
                console.log('Token stored to ' + TOKEN_PATH);
            });
        });

        console.log('Token stored to ' + TOKEN_PATH);
    }

    /**
     * Lists the names and IDs of up to 10 files.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function getChannel(auth) {
        auth.apiKey = 'AIzaSyDOQLB0bV_JjN2kgphLl9X5zb4FK6vDB9M';

        const service = google.youtube({
            version: 'v3',
            auth: auth
        });

        cb(undefined, {
        });
    }
};