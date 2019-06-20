const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const path = require('path');
const db = require('../config/db_connection.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + './'));

/*
Checked
 */

let checkHomeExistToUser = (username, home_id) => {
    return new Promise((resolve, reject) => {
        let queryDB = "SELECT home_id FROM home WHERE user_id = (SELECT user_id FROM account WHERE username = ?)";

        db.getConnection((err, conn) => {
            if(err){
                reject(err);
            }
            else{
                conn.query(queryDB, [username], (err, data) => {
                    conn.release();
                    if(err){
                        reject(err);
                    }
                    else{
                        let check = false;
                        for(let i in data) {
                            if (data[i].home_id == home_id) {
                                check = true;
                                break;
                            }
                        }
                        resolve(check);
                    }
                });
            }
        });
    });
};

/*
Checked
 */

let checkRoomExistToHome = (home_id, room_id) => {
    return new Promise((resolve, reject) => {
        let queryDB = "SELECT room_id FROM room WHERE home_id = ?";

        db.getConnection((err, conn) => {
            if(err){
                reject(err);
            }
            else{
                conn.query(queryDB, [home_id], (err, data) => {
                    conn.release();
                    if(err){
                        reject(err);
                    }
                    else{
                        let check = false;
                        for(let i in data){
                            if(data[i].room_id == room_id){
                                check = true;
                                break;
                            }
                        }
                        resolve(check);
                    }
                });
            }
        });
    });
};

/*
Checked
 */

let checkDeviceExistToRoom = (room_id, device_id, device_type) => {
    return new Promise((resolve, reject) => {
        let queryDB = "SELECT mac_address FROM ?? WHERE room_id = ?";

        db.getConnection((err, conn) => {
            if(err){
                reject(err);
            }
            else{
                conn.query(queryDB, [device_type, room_id], (err, data) => {
                    conn.release();
                    if(err){
                        reject(err);
                    }
                   else{
                       let check = false;
                       for(let i in data){
                           if(data[i].mac_address === device_id){
                               check = true;
                               break;
                           }
                       }
                       resolve(check);
                   }
                });
            }
        });
    });
};

/*
Checked
 */

let pdkbf2Hash = password => {
    return new Promise((resolve, reject) => {
        let pyProgram = spawn('python', [path.join(__dirname + '/pbkdf2/hash.py'), password]);
        pyProgram.stdout.on('data', data => {
            let tmp = new Buffer(String.fromCharCode.apply(null, data));
            let tmp2 = tmp.toString();
            resolve(tmp2);
        });

        pyProgram.stderr.on('data', data => {
            let tmp = String.fromCharCode.apply(null, data);
            let tmp2 = tmp.toString();
            reject(tmp2);
        });
    });
};

/*
Checked
 */

let checkIsRoot = username => {
  return new Promise((resolve, reject) => {
      const query_db = 'SELECT isRoot FROM account WHERE username = ?';

      db.getConnection((err, conn) => {
         if(err){
             reject(err);
         }
         else{
             conn.query(query_db, [username], (err, data) => {
                 conn.release();
                 if(err){
                     reject(err);
                 }
                 else{
                     let result = false;
                     if(data[0].isRoot === 'T'){
                         result = true;
                     }
                     resolve(result);
                 }
             });
         }
      });
  });
};

/*
Checked
 */

let checkUsernameExist = username => {
    return new Promise((resolve, reject) => {
        const queryDB = "SELECT user_id FROM account WHERE username = ?";

        db.getConnection((err, conn) => {
            if (err) {
                reject(err);
            }
            else {
                conn.query(queryDB, [username], (err, data) => {
                    conn.release();
                    if (err) {
                        reject(err);
                    }
                    else{
                        if(data.length > 0){
                            resolve(data[0].user_id);
                        }
                        else{
                            reject("Username does not exist!!");
                        }
                    }
                });
            }
        });
    });
};

/*
Checked
 */

let getNumberOfHome = (username) => {
    const _query = "SELECT COUNT(home_id) dem FROM home WHERE user_id = ?";

    return new Promise((resolve, reject) => {
        checkUsernameExist(username).then(result => {
            if(result !== null){
                db.getConnection((err, conn) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        conn.query(_query, [result], (err, data) => {
                            conn.release();
                            if(err){
                                reject(err);
                            }
                            else{
                                if(data.length > 0){
                                    resolve(data[0].dem);
                                }
                                else{
                                    reject("No result");
                                }
                            }
                        })
                    }
                })
            }
        }).catch(error => {
            reject(error);
        });
    });
};

/*
Checked
 */

let getNumberOfDevice = (username) => {
    const _query = 'SELECT COUNT(mac_address) dem FROM device_lighting WHERE room_id IN (SELECT room_id FROM room WHERE home_id IN (SELECT home_id FROM home WHERE user_id = ?))';

    return new Promise((resolve, reject) => {
        checkUsernameExist(username).then(result => {
            if(result !== null){
                db.getConnection((err, conn) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        conn.query(_query, [result], (err, data) => {
                            conn.release();
                            if(err){
                                reject(err);
                            }
                            else{
                                resolve(data[0].dem);
                            }
                        })
                    }
                })
            }
            else{
                reject("No data");
            }
        }).catch(error => {
            reject(error);
        })
    })
};

let getDeviceStatus = (device_id) => {
    const _query = "SELECT illuminance_level FROM data_lighting_device WHERE mac_address = ? ORDER BY time DESC LIMIT 1";

    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if(err){
                reject(err);
            }
            else{
                conn.query(_query, [device_id], (err, data) =>{
                    conn.release();
                    if(err){
                        reject(err);
                    }
                    else{
                        if(data[0].illuminance_level === '0'){
                            resolve('ON');
                        }
                        else if(data[0].illuminance_level !== '0'){
                            resolve('OFF');
                        }
                    }
                })
            }
        })
    })
};

let getNumberOfTurnOnLightEachRoom = (username, home_id, room_id, device_type) => {
    const queryDB = "SELECT mac_address FROM ?? WHERE room_id = ?";

    return new Promise((resolve, reject) => {
        checkHomeExistToUser(username, home_id)
            .then(result => {
                if(result === true){
                    checkRoomExistToHome(home_id, room_id)
                        .then(fulfilled => {
                            if(fulfilled === true){
                                db.getConnection((err, conn) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else{
                                        conn.query(queryDB, [device_type, room_id], (err, data) =>  {
                                            conn.release();
                                            if(err){
                                                reject(err);
                                            }
                                            else {
                                                let count = 0;
                                                let numOfDevice = 0;
                                                let limit = 0;
                                                return new Promise((resl, rej) => {
                                                    for (let i in data) {
                                                        ++limit;
                                                    }
                                                    for (let i in data) {
                                                        getDeviceStatus(data[i].mac_address).then(result => {
                                                            count++;
                                                            if (result === "ON") {
                                                                numOfDevice++;
                                                            }
                                                        }).catch(error => {
                                                            rej(error);
                                                        });
                                                    }
                                                    let timeOut = setTimeout(() => {
                                                        reject('Timed out')
                                                    }, 10000);

                                                    let _flagCheck = setInterval(function() {
                                                        if (count === limit) {
                                                            clearInterval(_flagCheck);
                                                            clearTimeout(timeOut);
                                                            resl(numOfDevice);
                                                        }
                                                    }, 500);
                                                }).then(_result => {
                                                    resolve(_result);
                                                }).catch(error => {
                                                    reject(error);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }).catch(error => {
                            reject(error);
                        });
                }
            }).catch(error => {
                reject(error);
            });
    });
};

let getNumberOfTurnOnLight = username => {
    let tmp = 0;
    let limit = 0;
    let count = 0;

    const queryDB = "SELECT home_id FROM home WHERE user_id IN (SELECT user_id FROM account WHERE username = ?)";
    const _queryDB = "SELECT room_id FROM room WHERE home_id = ?";

    return new Promise(((resolve, reject) => {
        db.getConnection((err, conn) => {
            if(err){
                reject(err);
            }

            conn.query(queryDB, [username],(err, data) => {
                if(err){
                    reject(err)
                }
                else{
                    for(let i in data){
                        checkHomeExistToUser(username, data[i].home_id).then((fulfilled) => {
                            if(fulfilled === true){
                                db.getConnection((err, conn) => {
                                    if(err){
                                        reject(err);
                                    }
                                    else{
                                        conn.query(_queryDB, [data[i].home_id], (err, data2) =>  {
                                            conn.release();
                                            if(err){
                                                reject(err);
                                            }
                                            else {
                                                for(let i in data2){
                                                    limit++;
                                                }
                                                for(let j in data2){
                                                    getNumberOfTurnOnLightEachRoom(username, data[i].home_id, data2[j].room_id, 'device_lighting').then(result => {
                                                        count++;
                                                        tmp += result;
                                                    }).catch(err => {
                                                        reject(err);
                                                    })
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                            else {
                                reject('Home does not belong to the user');
                            }
                        }).catch(error => {
                            reject(error);
                        });
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
                    },500)
                }
            });
        });
    }));
};

/*
Checked
 */

let getNumberOfUser = (username) => {
    const _query = "SELECT COUNT(user_id) dem FROM account WHERE isRoot = 'F'";

    return new Promise((resolve, reject) => {
        checkUsernameExist(username).then(result => {
            if(result !== null){
                checkIsRoot(username).then(_result => {
                    if(_result === true){
                       db.getConnection((err, conn) => {
                           if(err){
                               reject(err);
                           }
                           else{
                               conn.query(_query, [result], (err, data) => {
                                   conn.release();
                                   if(err){
                                       reject(err);
                                   }
                                   else{
                                       resolve(data[0].dem);
                                       console.log(data[0].dem);
                                   }
                               })
                           }
                       })
                   }
                   else{
                       reject("Unauthorized!!");
                   }
                }).catch(error => {
                    reject(error);
                });
            }
        }).catch(error => {
            reject(error);
        });
    })
};

/*
Checked
 */

let getNumberOfRoom = (username) => {
    const _query = 'SELECT COUNT(room_id) dem FROM room WHERE home_id IN (SELECT home_id FROM home WHERE user_id = ?)';

    return new Promise((resolve, reject) => {
        checkUsernameExist(username).then(result => {
            if(result !== null){
                db.getConnection((err, conn) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        conn.query(_query, [result], (err, data) => {
                            conn.release();
                            if(err){
                                reject(err);
                            }
                            else{
                                resolve(data[0].dem);
                            }
                        });
                    }
                })
            }
            else{
                reject("No data");
            }
        }).catch(error => {
            reject(error);
        })
    })
};

exports.checkHomeExistToUser = checkHomeExistToUser;
exports.checkRoomExistToHome = checkRoomExistToHome;
exports.checkDeviceExistToRoom = checkDeviceExistToRoom;
exports.pdkbf2Hash = pdkbf2Hash;
exports.checkIsRoot = checkIsRoot;
exports.checkUsernameExist = checkUsernameExist;
exports.getNumberOfRoom = getNumberOfRoom;
exports.getNumberOfDevice = getNumberOfDevice;
exports.getNumberOfUser = getNumberOfUser;
exports.getNumberOfHome = getNumberOfHome;
exports.getNumberOfTurnOnLight = getNumberOfTurnOnLight;
exports.getDeviceStatus = getDeviceStatus;