const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/db_connection.js');
const func = require('./function.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + './'));

// Ham dang lay cuc suc' theo id , sau nho chinh
let getBasicLighting = (username, home_id, room_id) => {
    const  _query = "SELECT * FROM lighting_illuminance";
    let tmp = [];

    return new Promise((resolve, reject) => {
        func.checkUsernameExist(username).then(result => {
            if(result !== null){
                func.checkHomeExistToUser(username, home_id).then(_result => {
                    if(_result === true){
                        func.checkRoomExistToHome(home_id, room_id).then(__result => {
                            if(__result === true){
                                db.getConnection((err, conn) => {
                                    if(err){
                                        reject(error);
                                    }
                                    else{
                                        conn.query(_query, (err, data) => {
                                            conn.release();
                                            if(err){
                                                reject(err);
                                            }
                                            else{
                                                for (let i in data) {
                                                    tmp.push(data[i].value);
                                                }
                                                resolve(tmp)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

};

let getIlluminanceLight = (username, home_id, room_id) => {
    const _query = "SELECT mac_address, location FROM device_lighting WHERE room_id = ?";
    const __query = "SELECT illuminance_level, status FROM data_lighting_device WHERE mac_address = ? ORDER BY time DESC LIMIT 1";

    let tmp = [];
    let count = 0, limit = 0;

    return new Promise((resolve, reject) => {
        func.checkUsernameExist(username).then(result => {
            if(result !== null){
                func.checkHomeExistToUser(username, home_id).then(_result => {
                    if(_result === true){
                        func.checkRoomExistToHome(home_id, room_id).then(__result => {
                            if(__result === true){
                                db.getConnection((err, conn) => {
                                    if(err){
                                        reject(error);
                                    }
                                    else{
                                        conn.query(_query, [room_id], (err, data) => {
                                            conn.release();
                                            if(err){
                                                reject(err);
                                            }
                                            else{
                                                db.getConnection((err, conn) => {
                                                    if(err){
                                                        reject(err);
                                                    }
                                                    else{
                                                        for(let i in data){
                                                            limit++;
                                                            conn.query(__query, [data[i].mac_address], (err, _data) => {
                                                                if(err){
                                                                    reject(err);
                                                                }
                                                                else{
                                                                    if(parseInt(_data[0].status) === 1) {
                                                                        count++;
                                                                        let t = {
                                                                                    value: (parseInt(_data[0].illuminance_level)),
                                                                                    location: data[i].location,
                                                                                    mac_address: data[i].mac_address
                                                                                };
                                                                        tmp.push(t);
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        let timeOut = setTimeout(() => {
                                                            reject("Timed Out");
                                                        }, 13000);
                                                        let flagCheck = setInterval(() => {
                                                            if(count === limit){
                                                                clearInterval(flagCheck);
                                                                clearTimeout(timeOut);
                                                                resolve(tmp);
                                                            }
                                                        },100)
                                                    }
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
};

let getIlluminanceSensorValue = (username, home_id, room_id) => {
    const _query = "SELECT mac_address, location FROM device_illuminance_sensor WHERE room_id = ?";
    const __query = "SELECT illuminance_value FROM data_illuminance_sensor WHERE mac_address = ? ORDER BY time DESC LIMIT 1";

    let tmp = [];
    let count = 0, limit = 0;

    return new Promise((resolve, reject) => {
        func.checkUsernameExist(username).then(result => {
            if(result !== null){
                func.checkHomeExistToUser(username, home_id).then(_result => {
                    if(_result === true){
                        func.checkRoomExistToHome(home_id, room_id).then(__result => {
                            if(__result === true){
                                db.getConnection((err, conn) => {
                                    if(err){
                                        reject(error);
                                    }
                                    else{
                                        conn.query(_query, [room_id], (err, data) => {
                                            conn.release();
                                            if(err){
                                                reject(err);
                                            }
                                            else{
                                                db.getConnection((err, conn) => {
                                                    if(err){
                                                        reject(err);
                                                    }
                                                    else{
                                                        for(let i in data){
                                                            limit++;
                                                            conn.query(__query, [data[i].mac_address], (err, _data) => {
                                                                if(err){
                                                                    reject(err);
                                                                }
                                                                else{
                                                                    count++;
                                                                    let t = {
                                                                        value: (parseInt(_data[0].illuminance_value)),
                                                                        location: data[i].location
                                                                    };
                                                                    tmp.push(t);
                                                                }
                                                            })
                                                        }
                                                        let timeOut = setTimeout(() => {
                                                            reject("Timed Out");
                                                        }, 13000);
                                                        let flagCheck = setInterval(() => {
                                                            if(count === limit){
                                                                clearInterval(flagCheck);
                                                                clearTimeout(timeOut);
                                                                resolve(tmp);
                                                            }
                                                        },100)
                                                    }
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
};

exports.getIlluminanceLight = getIlluminanceLight;
exports.getIlluminanceSensorValue = getIlluminanceSensorValue;
exports.getBasicLighting = getBasicLighting;