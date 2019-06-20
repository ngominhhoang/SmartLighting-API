const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('../config/config.js');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('superSecret', config.SECRET_KEY);

let verifyJWT = (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, app.get('superSecret'), (err, decode) => {
            if(err){
                res.status(403).json({
                    success: false,
                    reason: err
                });
            }
            else{
                req.decoded = decode;
                next();
            }
        });
    }
    else{
        res.status(403).json({
            success: false,
            reason: "No Token"
        });
    }
};

let notFoundPage = (req, res) => {
    res.json({status: 404})
};

let internalError = (req, res) => {
    res.json({status: 500})
};

exports.verify = verifyJWT;
exports.notFoundPage = notFoundPage;
exports.internalError = internalError;