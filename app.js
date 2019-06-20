const express = require('express');
const bodyParser = require('body-parser');
const middleware = require('./middleware/middlewares.js');
const app = express();
const routes = require('./route/routes.js');
const http = require('http');
const https = require('https');
const cors = require('cors');

let httpsSer = {};

if(process.env.NODE_ENV == 'production'){
    const fs = require('fs');
    /**
     * point to SSL Cert
     */
    const ssl_key = fs.readFileSync('/etc/letsencrypt/live/k61iotlab.ddns.net/privkey.pem');
    const ssl_cert = fs.readFileSync('/etc/letsencrypt/live/k61iotlab.ddns.net/cert.pem');
    const ca = fs.readFileSync('/etc/letsencrypt/live/k61iotlab.ddns.net/chain.pem');

    httpsSer = {
        key: ssl_key,
        cert: ssl_cert,
        ca: ca
    };
}

/**
 * Config PORT for nodejs server
 */
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Middleware to fix CORS
 */
app.use(cors());

/**
 * Route
 */
app.use('/', routes);

/**
 * Error code
 */
app.use(middleware.notFoundPage);
app.use(middleware.internalError);

/**
 * Fire up the server
 */
const httpServ = http.createServer(app);
httpServ.listen(app.get('port'));

if(process.env.NODE_ENV == 'production'){
    const httpsServ = https.createServer(httpsSer, app);
    httpsServ.listen(3001);
}

