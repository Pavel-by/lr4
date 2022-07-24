import app from './app.js';
import {io} from './socket/io.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import root from 'app-root-path';

let appSettings = {
    port: 443,
    host: 'lr4.test',
    ssl: {
        key: fs.readFileSync(path.join(root.path, "key.pem")),
        cert: fs.readFileSync(path.join(root.path, "cert.pem")),
        passphrase: "pass",
    },
};

//app.set('host', appSettings.host);
//app.listen(appSettings.port, appSettings.host);

let server = https.createServer(appSettings.ssl, app);
io.attach(server);

server.listen(appSettings.port);

server.on('listening', () => { console.log("Listening " + appSettings.port); });
server.on('error', onError);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
