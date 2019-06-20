const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/db_connection.js');
const func = require('./function');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let adminGetHomeList = (req, res) => {
    let username = req.decoded.data;
    let usernameTogGet = req.body.usernameToGet;

    const queryDB = "SELECT h.home_id AS home_id, h.home_name AS home_name, a.username AS username FROM home AS h INNER JOIN account AS a ON h.user_id = a.user_id WHERE a.username = ?";

    func.checkIsRoot(username).then(result => {
        if(result === true){
            db.getConnection((err, conn) => {
                if(err){
                    res.json({
                        success: false,
                        reason: err
                    });
                }

                conn.query(queryDB, [usernameTogGet],(err, data) => {
                    console.log(data)
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
                            data
                        });
                    }
                });
            });
        }
        else{
            res.json({
                success: false,
                reason: 'Unauthorized Access'
            });
        }
    }).catch(error => {
        res.json({
            success: false,
            reason: error
        })
    });
};

/*
Checked
 */

let getHomeList = (req, res) => {
    let username = req.decoded.data;

    const queryDB = "SELECT h.home_id AS home_id, h.home_name AS home_name, a.username AS username FROM home AS h INNER JOIN account AS a ON h.user_id = a.user_id WHERE a.username = ?";

    db.getConnection((err, conn) => {
        if(err){
            res.json({
                success: false,
                reason: err
            });
        }

        conn.query(queryDB, [username],(err, data) => {
            conn.release();
            console.log(data)
            if(err){
                res.json({
                    success: false,
                    reason: err
                });
            }

            else{
                res.json({
                    success: true,
                    data
                });
            }
        });
    });
};

/*
Checked
 */

let addHome = (req, res) => {
    let username = req.decoded.data;
    let usernameToAdd = req.body.house_owner;

    const queryDB = "INSERT INTO home(user_id) VALUES(?)";
    const queryDB3 = "SELECT home_id FROM home WHERE user_id = ? ORDER BY home_id DESC LIMIT 1";

    func.checkIsRoot(username).then(fulfilled => {
        if(fulfilled === true){
            func.checkUsernameExist(usernameToAdd).then(result => {
                if(result !== null){
                    db.getConnection((err, conn) => {
                        if(err){
                            res.json({
                                success: false,
                                reason: err
                            });
                        }
                        else{
                            conn.query(queryDB, [result], (err) => {
                                if(err){
                                    res.json({
                                        success: false,
                                        reason: err
                                    });
                                }
                                else{
                                    conn.query(queryDB3, [result], (err, data3) => {
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
                                                home_id: data3[0].home_id,
                                                user_id: result
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }).catch(error => {
                res.json({
                    success: false,
                    reason: error
                });
            });
        }
        else{
            res.json({
                success: false,
                reason: "Only administrator can add new house into your account."
            });
        }
    }).catch(error => {
        res.json({
            success: false,
            reason: error
        });
    });
};

/*
Checked
 */

let deleteHome = (req, res) => {
    let username = req.decoded.data;
    let usernameToDelete = req.body.house_owner;
    let home_id = req.body.home_id;

    let queryDeleteHome = 'DELETE FROM home WHERE home_id = ?';

    func.checkIsRoot(username).then(fulfilled => {
        if(fulfilled === true) {
            func.checkHomeExistToUser(usernameToDelete, home_id).then(result => {
                if (result === true) {
                    db.getConnection((err, conn) => {
                        if (err) {
                            res.json({
                                success: false,
                                reason: err
                            });
                        }
                        else {
                            conn.query(queryDeleteHome, [home_id], (err) => {
                                conn.release();
                                if (err) {
                                    res.json({
                                        success: false,
                                        reason: err
                                    });
                                }
                                else {
                                    res.json({
                                        success: true,
                                        reason: "Success in deleting home_id " + home_id
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({
                        success: false,
                        reason: 'Home does not belong to this account'
                    });
                }
            }).catch(error => {
                res.json({
                    success: false,
                    reason: error
                });
            });
        }
        else{
            res.json({
                success: false,
                reason: "Only administrator can add new house into your account."
            });
        }
    }).catch(error => {
        res.json({
            success: false,
            reason: error
        });
    });
};

exports.getHomeList = getHomeList;
exports.addHome = addHome;
exports.deleteHome = deleteHome;
exports.adminGetHomeList = adminGetHomeList;