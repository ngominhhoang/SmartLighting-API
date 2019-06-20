const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/db_connection.js');
const func = require('./function');
const getPowerConsumption = require('./getPowerUsage.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
Checked
 */

let getAllInfoAboutUser = (req, res) => {
    let username = req.decoded.data;
    func.getNumberOfHome(username).then(result1 => {
        if(result1 !== null){
            func.getNumberOfRoom(username).then(result2 => {
                if(result2 !== null){
                    func.getNumberOfDevice(username).then(result3 => {
                        if(result3 !== null){
                            func.getNumberOfUser(username).then(result4 => {
                                if(result4 !== null){
                                    func.getNumberOfTurnOnLight(username).then(result5 => {
                                        if(result5 !== null){
                                            let tmp;
                                            getPowerConsumption.getPowerConsumptionAll(username).then(result6 => {
                                                tmp = result6;
                                                console.log(result4);
                                                res.json({
                                                    success: true,
                                                    numberOfHome: result1,
                                                    numberOfRoom: result2,
                                                    numberOfDevice: result3,
                                                    numberOfUser: result4,
                                                    numberOfTurnOnLight: result5,
                                                    powerConsumption: result6
                                                })
                                            }).catch(e => {
                                                res.json({
                                                    success: true,
                                                    numberOfHome: result1,
                                                    numberOfRoom: result2,
                                                    numberOfDevice: result3,
                                                    numberOfTurnOnLight: result5,
                                                    powerConsumption: tmp
                                                })
                                            });
                                        }
                                    }).catch(e => {
                                        res.json({
                                            success: false,
                                            reason: e
                                        })
                                    })
                                }
                            }).catch(e => {
                                res.json({
                                    success: false,
                                    reason: e
                                })
                            })
                        }
                    }).catch(error => {
                        res.json({
                            success: false,
                            reason: error
                        })
                    })
                }
            }).catch(error => {
                res.json({
                    success: false,
                    reason: error
                })
            })
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

let getUserInfo = (req, res) => {
    let username = req.decoded.data;
    const queryDB = "SELECT fullname, email, phone_number, birthday, isRoot FROM account WHERE user_id = ?";

    func.checkUsernameExist(username).then(fulfilled => {
        console.log(fulfilled);
        if(fulfilled !== null){
            db.getConnection((err, conn) => {
                if(err){
                    res.json({
                        success: false,
                        reason: err
                    });
                }
                else{
                    conn.query(queryDB, [fulfilled], (err, data) => {
                        conn.release();
                        if(err){
                            res.json({
                                success: false,
                                reason: err
                            });
                        }
                        else{
                            if(data[0].isRoot === 'T'){
                                data[0].isRoot = 'root'
                            }else{
                                data[0].isRoot = 'user'
                            }

                            data[0].phone_number = "0" + data[0].phone_number;

                            res.json({
                                success: true,
                                data
                            })
                        }
                    })
                }
            });
        }
    });
};

/*
Checked
 */

let deleteUser = (req, res) => {
    let username = req.decoded.data;
    let usernameToDelete = req.body.user_delete;

    const queryDB = "DELETE FROM account WHERE user_id = ?";

    func.checkIsRoot(username).then(result => {
        if(result === true) {
            func.checkUsernameExist(usernameToDelete).then(fulfilled => {
                if (fulfilled !== null) {
                    db.getConnection((err, conn) => {
                        if(err){
                            res.json({
                                success: false,
                                reason: err
                            });
                        }
                        else{
                            conn.query(queryDB, [fulfilled], err => {
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
                                        reason: "Success in deleteing user " + usernameToDelete
                                    })
                                }
                            })
                        }
                    })
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

let getListOfUser = (req, res) => {
    let username = req.decoded.data;

    const _query = "SELECT user_id, username, fullname, email, phone_number, birthday FROM account";

    func.checkIsRoot(username).then(result => {
        if(result === true){
            db.getConnection((err, conn) => {
                if(err){
                    res.json({
                        success: false,
                        reason: err
                    })
                }
                else{
                    conn.query(_query, (err, data) => {
                        conn.release();
                        if(err){
                            res.json({
                                success: false,
                                reason: err
                            })
                        }
                        else{
                            res.json({
                                success: true,
                                data
                            })
                        }
                    })
                }
            })
        }
    })
};

exports.getAllInfoAboutUser = getAllInfoAboutUser;
exports.getUserInfo = getUserInfo;
exports.deleteUser = deleteUser;
exports.getListOfUser = getListOfUser;
