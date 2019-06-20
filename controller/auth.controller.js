const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bodyParser = require('body-parser');
const db = require('../config/db_connection.js');
const func = require('./function.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('superSecret', config.SECRET_KEY);

/*
Checked
 */

let loginFunc = (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let phone_num = req.body.phone_number;
    let pass = req.body.password;

    let queryDB = "SELECT * FROM account WHERE username = ? OR email = ? OR phone_number = ?";

    db.getConnection((err, conn) => {
        if (err) {
            res.json({
                success: false,
                reason: err
            });
        }
        conn.query(queryDB, [username, email, phone_num], (error, data) => {
            conn.release();
            if (err) {
                res.json({
                    success: false,
                    reason: err
                });
            }
            else {
                if (data.length > 0) {
                    bcrypt.compare(pass, data[0].password, (err, result) => {
                        if (result == true) {
                            let _token = jwt.sign({data: data[0].username}, app.get('superSecret'), {expiresIn: '24h'});
                            res.json({
                                success: true,
                                name: data[0].fullname,
                                token: _token,
                                expires: '24h',
                                isRoot: data[0].isRoot
                            });
                        }
                        else {
                            res.json({
                                success: false,
                                reason: "Wrong username/password"
                            });
                        }
                    });
                }
                else {
                    res.json({
                        success: false,
                        reason: "Account does not exist!!"
                    });
                }
            }
        });
    });
};

/*
Checked
 */

let regFunc = (req, res) => {
    let username = req.body.username;
    let pass = req.body.password;
    let email = req.body.email;
    let fullname = req.body.fullname;
    let birthday = req.body.birthday;
    let phone_num = req.body.phone_number;
    let isRoot = 'F';
    let hashedPass = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
    console.log(email)
    let query_check_DB = "SELECT * FROM account WHERE username = ?";

    let queryDB = "INSERT INTO account(username, password, fullname ,email, phone_number, birthday, isRoot) VALUES(?, ?, ?, ?, ?, ?, ?)";

    db.getConnection((err, conn) => {
        if(err){
            res.json({
                success: false,
                reason: "Error while connecting to the database."
            });
        }
        else{
            conn.query(query_check_DB, [username], (err, data, field) => {
                if(err){
                    res.json({
                        success: false,
                        reason: err
                    });
                }
                else{
                    console.log(data);
                    if(data.length > 0){
                        res.json({
                            success: false,
                            reason: "This username is already existed!!"
                        });
                    }
                    else{
                        conn.query(queryDB,[username, hashedPass, fullname, email, phone_num, birthday, isRoot], (err) => {
                            conn.release();
                            if(err){
                                res.json({
                                    success: false,
                                    reason: err
                                });
                            }
                            else{
                                res.json({
                                    success: true,
                                    reason: "Success in creating account " + username
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};

/*
Checked
 */

let changePassFunc = (req, res) => {
    let username = req.decoded.data;
    let old_password = req.body.old_password;
    let new_password = req.body.new_password;
    let hashed_pass = bcrypt.hashSync(new_password, bcrypt.genSaltSync(10));

    let queryDB_check = "SELECT password FROM account WHERE username = ?";

    let queryDB_update = "UPDATE account SET password = ? WHERE username = ?";

    db.getConnection((err, conn) => {
        if(err){
            res.json({
                success: false,
                reason: err
            });
        }
        else{
            conn.query(queryDB_check, [username], (err, data) => {
                if(err){
                    res.json({
                        success: false,
                        reason: err
                    });
                }
                else{
                    if(data.length === 0){
                        res.json({
                           success: false,
                           reason: "Account does not exist!"
                        });
                    }
                    else{
                        bcrypt.compare(old_password, data[0].password, (err, result) => {
                            if(result == true) {
                                conn.query(queryDB_update, [hashed_pass, username], (err) => {
                                    conn.release();
                                    if(err){
                                        res.json({
                                            success: false,
                                            reason: err
                                        });
                                    }
                                    else{
                                        res.json({
                                            success: true,
                                            reason: "Success in changing password of " + username
                                        })
                                    }
                                });
                            }
                            else{
                                res.json({
                                    success: false,
                                    reason: "Wrong username or password"
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};

exports.loginFunc = loginFunc;
exports.regFunc = regFunc;
exports.changePassFunc = changePassFunc;