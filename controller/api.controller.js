const express = require('express');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const db = require('../config/db_connection.js');
const func = require('./function');
const path = require('path');
const getData = require('./getTurnOnLightLevel.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../public'));

/**
Checked
 */

let getDeviceList = (req, res) =>  {
    let room_id = req.params.id_room;
    let home_id = req.params.id_home;
    let username = req.decoded.data;
    let device_type = req.params.device_type;

    const queryDB = "SELECT device_id, device_name, mac_address, location FROM ?? WHERE room_id = ?";

    func.checkHomeExistToUser(username, home_id)
        .then(result => {
            if(result === true){
                func.checkRoomExistToHome(home_id, room_id)
                    .then(fulfilled => {
                        if(fulfilled === true){
                            db.getConnection((err, conn) => {
                                if (err) {
                                    res.json({
                                        success: false,
                                        reason: err
                                    });
                                }
                                else{
                                    conn.query(queryDB, [device_type, room_id], (err, data) =>  {
                                        conn.release();
                                        if(err){
                                            res.json({
                                                success: false,
                                                reason: err
                                            });
                                        }
                                        res.json({
                                            success: true,
                                            data
                                        });
                                    });
                                }
                            });
                        }
                        else{
                            res.json({
                                success: false,
                                reason: 'Room does not belong to this home'
                            });
                        }
                    });
            }
            else{
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
};

/**
Checked
 */

let getParameterLighting =  (req, res) => {
    let username = req.decoded.data;
    let room_id = req.params.id_room;
    let home_id = req.params.id_home;
    let mac_address = req.params.id_device;
    let device_type = 'device_lighting';
    let start_duration = req.query.start_duration;
    let end_duration = req.query.end_duration;

    const queryDB = "SELECT id, illuminance_level, status, power_usage, mac_address, DATE_FORMAT(time,'%Y-%m-%d %H:%i:%s') coming_time FROM data_lighting_device WHERE mac_address = ? AND time BETWEEN ? AND ? ORDER BY coming_time ASC LIMIT 500";

    func.checkHomeExistToUser(username, home_id)
        .then(resultCheckHome => {
            if(resultCheckHome === true){
                func.checkRoomExistToHome(home_id, room_id)
                    .then(resultCheckRoom => {
                        if(resultCheckRoom === true){
                            func.checkDeviceExistToRoom(room_id, mac_address, device_type)
                                .then(fulfilled => {
                                    if(fulfilled === true){
                                        db.getConnection((err, conn) =>  {
                                            if (err) {
                                                res.json({
                                                    success: false,
                                                    reason: err
                                                });
                                            }
                                            else{
                                                conn.query(queryDB, [mac_address, start_duration, end_duration], (err, data2) => {
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
                                                            data2
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else{
                                        res.json({
                                            success: false,
                                            reason: 'Device does not belong to this home/room'
                                        });
                                    }
                                });
                        }
                        else{
                            res.json({
                                success: false,
                                reason: 'Room does not belong to this home'
                            });
                        }
                    });
            }
            else{
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
};

let getParameterSensor = (req, res) => {
    let username = req.decoded.data;
    let room_id = req.params.id_room;
    let home_id = req.params.id_home;
    let mac_address = req.params.id_device;
    let device_type = 'device_illuminance_sensor';
    let start_duration = req.query.start_duration;
    let end_duration = req.query.end_duration;

    const queryDB = "SELECT id, illuminance_value, status, location , mac_address, DATE_FORMAT(time,'%Y-%m-%d %H:%i:%s') coming_time FROM data_illuminance_sensor WHERE mac_address = ? AND time BETWEEN ? AND ? ORDER BY coming_time ASC LIMIT 500";

    func.checkHomeExistToUser(username, home_id)
        .then(resultCheckHome => {
            if(resultCheckHome === true){
                func.checkRoomExistToHome(home_id, room_id)
                    .then(resultCheckRoom => {
                        if(resultCheckRoom === true){
                            func.checkDeviceExistToRoom(room_id, mac_address, device_type)
                                .then(fulfilled => {
                                    if(fulfilled === true){
                                        db.getConnection((err, conn) =>  {
                                            if (err) {
                                                res.json({
                                                    success: false,
                                                    reason: err
                                                });
                                            }
                                            else{
                                                conn.query(queryDB, [mac_address, start_duration, end_duration], (err, data2) => {
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
                                                            data2
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else{
                                        res.json({
                                            success: false,
                                            reason: 'Device does not belong to this home/room'
                                        });
                                    }
                                });
                        }
                        else{
                            res.json({
                                success: false,
                                reason: 'Room does not belong to this home'
                            });
                        }
                    });
            }
            else{
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
};

let getDeviceNoInfo = (req, res) => {
    let username = req.decoded.data;
    let device_type = req.params.device_type;

    if(username !== null){
        let _query = "SELECT * FROM ?? WHERE room_id = null";

        db.getConnection((err, conn) => {
            if(err){
                res.json({
                    success: false,
                    reason: err
                });
            }
            else{
                conn.query(_query, [device_type], (err, data) => {
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
            }
        })
    }
    else{
        res.json({
            success: false,
            reason: 'Unauthorized season!!'
        })
    }
};

let addDevice = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.body.home_id;
    let room_id = req.body.room_id;
    let device_id = req.body.mac_address;
    let device_type = req.body.device_type;

    let _query = "UPDATE ?? SET room_id = ? WHERE mac_address = ? OR device_id = ?";

    func.checkUsernameExist(username).then(result => {
        if(result === true){
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
                                   conn.query(_query, [device_type, room_id, device_id], err => {
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
                                              reason: "Success in adding device " + device_id + " into room " + room_id
                                           });
                                       }
                                   })
                               }
                           });
                       }
                       else{
                           res.json({
                               success: false,
                               reason: "Room does not belong to this home!!"
                           })
                       }
                    }).catch(err => {
                        res.json({
                            success: false,
                            reason: err
                        });
                    });
                }
                else{
                    res.json({
                        success: false,
                        reason: "Home does not belong to user!!"
                    })
                }
            }).catch(err => {
                res.json({
                    success: false,
                    reason: err
                });
            });
        }
        else{
            res.json({
                success: false,
                reason: "Username does not exist!!"
            })
        }
    }).catch(err => {
        res.json({
            success: false,
            reason: err
        });
    });
};

/**
 * đang sửa
 * @param req
 * @param res
 */

let getParameter_Realtime =  (req, res) => {
    let username = req.decoded.data;
    //username="root";
    const client = mqtt.connect('mqtt://' + process.env.MQTT_ADD,{username:username,password:'12345678'});
    let room_name = req.params.room_name;
    let home_id = req.params.id_home;
    let mac_ipnode = req.params.id_device;
    let device_type = req.params.device_type;

    //getting data from broker and return in JSON format
    let mess;
    let topic = 'user/'+username+'/'+home_id+'/'+room_name+'/'+device_type+'/'+mac_ipnode+'/data';
    //client.reconnect()
    new Promise((resolve, reject) => {
        client.subscribe(topic , (err) => {
            if (err) {
                console.log('fail in subscribing topic :' + topic);
                reject(err)
            }
            else {
                let timeOut = setTimeout(() => {
                    client.unsubscribe(topic);
                    console.log('fail in subscribing topic :' + topic);
                    reject('Time out')
                }, 9000);
                client.on('message', (topic, message) => {
                    console.log('Receive message from topic: ' + topic);
                    console.log(message.toString());
                    mess = message.toString();
                    mess = JSON.parse(mess);
                    resolve(mess);
                    client.unsubscribe(topic);
                    client.end();
                    clearTimeout(timeOut);
                    console.log('success in subscribing topic :' + topic);
                });
            }
        });
    }).then((fulfilled) => {
        res.json({
            success: true,
            fulfilled
        })
    }).catch((err) => {
        res.json({
            success: false,
            reason: err
        });
    })
};

/**
 * Đang sửa
 * @param req
 * @param res
 */

let sendCommand =  (req, res) => {
    let username = req.decoded.data;
    username = 'root';
    const client = mqtt.connect('mqtt://' + process.env.MQTT_ADD,{username:username,password:'12345678'});
    let room_name = req.body.room_name;
    let home_id = req.body.home_id;
    let mac_ipnode = req.body.device_id;
    let device_type = req.body.device_type;
    let level = req.body.level;
    level = parseInt(level, 10).toString(16);
    console.log(req.body.switch_code);
    let command;
    if (device_type == 'lighting_device') {
        // 0x80 is EPC code with ON: 0x30, OFF: 0x31.
        if (req.body.switch_code == 1){
            command = {'B0': level,'80': '30'};
        }
        else {
            command = {'B0': level,'80': '31'};
        }
    }

    command = JSON.stringify(command);
    console.log(command);

    let topic = 'user/'+ username +'/'+ home_id +'/'+ room_name +'/'+ device_type +'/'+ mac_ipnode +'/command';
    console.log(topic);
    let subscribed_topic = 'user/'+username+'/'+home_id+'/'+room_name+'/'+device_type+'/'+mac_ipnode+'/data';
    new Promise(((resolve, reject) => {
        client.subscribe(subscribed_topic , (err) => {
            if (err) {
                console.log('fail in subscribing topic :' + subscribed_topic);
                reject(err);
            }
            else {
                resolve();
                console.log('success in subscribing topic :' + subscribed_topic);
            }
        });
    })).then(fulfilled => {
            client.publish(topic,command,(err) =>  {
                if (! err) {
                    console.log('success in publishing message to topic:' + topic);
                    //res.json({success: true})
                    new Promise((resolve ,reject) => {
                        let timeOut = setTimeout(() => {
                            client.unsubscribe(topic);
                            console.log('do not receive any messages from broker when subscribing topic:' + topic);
                            reject('Time out')
                        }, 12000);

                        setTimeout(() => {
                            client.on('message', (topic, message) => {
                                console.log('Receive message from topic: ' + topic);
                                console.log(message.toString());
                                mess = message.toString();
                                mess = JSON.parse(mess);
                                resolve(mess);
                                client.unsubscribe(topic);
                                clearTimeout(timeOut);
                                console.log('success in subscribing topic :' + topic);
                            })
                        }, 8000)

                    }).then((fulfilled) => {
                        client.end();
                        let status = 0;
                        if (fulfilled.operation_status == true) status = 1;
                        let illuminance_level = 0;
                        illuminance_level = fulfilled.illuminance_level
                        console.log(status+' '+req.body.switch_code+' '+fulfilled.operation_status);
                        console.log(illuminance_level+' '+req.body.level+' '+fulfilled.illuminance_level);
                        if (status != req.body.switch_code || illuminance_level != req.body.level) {
                            res.json({ success: false, reason: "failure in changing status code"});
                        }
                        else {
                            console.log('success in publishing message to topic:' + topic);
                            res.json({success: true})
                        }
                    }).catch((err) => {
                        client.end();
                        res.json({
                            success: false,
                            reason: err
                        });
                    })
                }
                else {
                    console.log('fail in publishing message to topic:' + topic);
                    res.json({ success: false, reason: "failure in publishing command to mqtt broker"});
                }
            });
        }).catch((err) => {
            client.end();
            res.json({
                success: false,
                reason: err
            });
        })
};

let delete_device = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.body.home_id;
    let room_id = req.body.room_id;
    let device_id = req.body.device_id;
    let device_type = req.body.device_type;

    const queryDB = "DELETE FROM ?? WHERE mac_address = ?";

    func.checkUsernameExist(username).then(result => {
        if(result != null){
            func.checkHomeExistToUser(username, home_id).then(_result => {
                if(_result === true){
                    func.checkRoomExistToHome(home_id, room_id).then(__result => {
                        if(__result === true){
                            func.checkDeviceExistToRoom(room_id, device_id, device_type).then(___result => {
                                if(___result === true){
                                    db.getConnection((err, conn) => {
                                        if(err){
                                            res.json({
                                                success: false,
                                                reason: err
                                            });
                                        }
                                        else{
                                            conn.query(queryDB, [device_type, device_id], err => {
                                                conn.release();
                                                if(err){
                                                    res.json({
                                                        success: false,
                                                        reason: err
                                                    });
                                                }
                                                else{
                                                    let message = "Successfully in deleting device " + device_id;
                                                    res.json({
                                                        success: true,
                                                        message: message
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                                else{
                                    res.json({
                                        success: false,
                                        reason: 'Device does not belong to this home/room'
                                    });
                                }
                            })
                        }
                        else{
                            res.json({
                                success: false,
                                reason: 'Room does not belong to this home'
                            });
                        }
                    })
                }
                else{
                    res.json({
                        success: false,
                        reason: 'Home does not belong to this account'
                    });
                }
            })
        }
    });
};

let getIlluminanceLightLevel = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.params.home_id;
    let room_id = req.params.room_id;

    getData.getIlluminanceLight(username, home_id, room_id).then(result => {
        res.json({result})
    }).catch(err => {
        res.json({err});
    })
};

let getIlluminaceSensorValue = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.params.home_id;
    let room_id = req.params.room_id;

    getData.getIlluminanceSensorValue(username, home_id, room_id).then(result => {
        res.json({result})
    }).catch(err => {
        res.json({err});
    })
};

let getBasicLighting = (req, res) => {
    let username = req.decoded.data;
    let home_id = req.params.home_id;
    let room_id = req.params.room_id;

    getData.getBasicLighting(username, home_id, room_id).then(result => {
        res.json({result})
    }).catch(err => {
        res.json({err});
    })
};

// let test = (req, res) => {
//     let username = req.decoded.data;
//     let home_id = req.params.home_id;
//     let room_id = req.params.room_id;
//
//     testfunc.getIlluminanceSensorValue(username,home_id, room_id).then(result => {
//         res.json({result});
//     }).catch(err => {
//         res.json({err});
//     })
// };

exports.getDeviceList = getDeviceList;
exports.getParameterLighting = getParameterLighting;
exports.sendCommand = sendCommand;
exports.getParameter_Realtime = getParameter_Realtime;
exports.getParameterSensor = getParameterSensor;
exports.delete_device = delete_device;
exports.addDevice = addDevice;
exports.getDeviceNoInfo = getDeviceNoInfo;
// exports.test = test;
exports.getIlluminanceLightLevel = getIlluminanceLightLevel;
exports.getIlluminaceSensorValue = getIlluminaceSensorValue;
exports.getBasicLighting = getBasicLighting;
