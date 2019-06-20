const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/db_connection.js');
const func = require('./function');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
Checked
 */

let getRoomList = (req, res) => {
    let home_id = req.params.id_home;
    let username = req.decoded.data;

    const queryDB = "SELECT room_id, room_name FROM room WHERE home_id = ?";

    func.checkHomeExistToUser(username, home_id).then((fulfilled) => {
        if(fulfilled === true){
            db.getConnection((err, conn) => {
                if(err){
                    res.json({
                        success: false,
                        reason: err
                    });
                }
                else{
                    conn.query(queryDB, [home_id], (err, data) =>  {
                        conn.release();
                        if(err){
                            res.json({
                                success: false,
                                reason: err
                            });
                        }
                        else {
                            res.json({
                                success: true,
                                data
                            });
                        }
                    })
                }
            });
        }
        else {
            res.json({
                success: false,
                reason: 'Home does not belong to the user'
            });
        }
    }).catch(error => {
        res.json({
            success: false,
            reason: error
        });
    });
};

let getRoomName = (req, res) => {
    let username = req.decoded.data;
    let room_id = req.params.room_id;

    const _query = "SELECT room_name FROM room WHERE room_id = ?";

    func.checkUsernameExist(username).then(result => {
       if(result !== null){
           db.getConnection((err, conn) => {
               if(err){
                   res.json({
                       success: false,
                       reason: err
                   });
               }
               else{
                   conn.query(_query, [room_id], (err, data) => {
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
                           })
                       }
                   });
               }
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

let addRoom = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.body.home_id;
    let room_name = req.body.room_name;

    const queryDB = "INSERT INTO room(home_id, room_name) VALUES(?, ?)";
    const queryDB2 = "SELECT room_id, room_name FROM room WHERE home_id = ? ORDER BY room_id DESC LIMIT 1";

    func.checkUsernameExist(username).then(result => {
        if(result !== null){
            func.checkHomeExistToUser(username, home_id).then(_result => {
                if(_result === true){
                    db.getConnection((err, conn) => {
                        if(err){
                            res.json({
                                success: false,
                                reason: err
                            });
                        }
                        else{
                            conn.query(queryDB, [home_id, room_name], err => {
                                if(err){
                                    res.json({
                                        success: false,
                                        reason: err
                                    });
                                }
                                else{
                                    conn.query(queryDB2, [home_id], (err, data) => {
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
                                                home_id: home_id,
                                                room_id: data[0].room_id,
                                                room_name: data[0].room_name
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
                else{
                    res.json({
                        success: false,
                        reason: "Home does not belong to this account"
                    });
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

let deleteRoom = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.body.home_id;
    let room_id = req.body.room_id;

    const queryDB = "DELETE FROM room WHERE room_id = ?";

    func.checkUsernameExist(username).then(result => {
        if(result != null){
            func.checkHomeExistToUser(username, home_id).then(_result => {
                if(_result === true){
                    func.checkRoomExistToHome(home_id, room_id).then(__result => {
                       if(__result === true){
                            db.getConnection((err, conn) => {
                                if(err){
                                    res.json({
                                        success: false,
                                        reason: err
                                    });
                                }
                                else{
                                    conn.query(queryDB, [room_id], err => {
                                        conn.release();
                                        if(err){
                                            res.json({
                                                success: false,
                                                reason: err
                                            });
                                        }
                                        else{
                                            let message = "Successfully delete room " + room_id;
                                            res.json({
                                                success: true,
                                                message: message
                                            });
                                        }
                                    });
                                }
                            });
                       }
                       else{
                           res.json({
                               success: false,
                               reason: "Room does not belong to this home"
                           });
                       }
                    });
                }
                else{
                    res.json({
                        success: false,
                        reason: "Home does not belong to this account"
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
};

exports.getRoomList = getRoomList;
exports.addRoom = addRoom;
exports.deleteRoom = deleteRoom;
exports.getRoomName = getRoomName;