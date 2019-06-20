const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../config/db_connection.js');
const func = require('./function.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + './'));

let getPowerConsumtionPerDevice = (mac_address) => {
  const _query = "SELECT illuminance_level FROM data_lighting_device WHERE mac_address = ? ORDER BY time DESC LIMIT 1";

  return new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
          if(err){
              reject(err);
          }
          else{
              conn.query(_query, [mac_address], (err, data) => {
                  conn.release();
                  if(err){
                      reject(err);
                  }
                  else{
                      let n = parseInt(data[0].illuminance_level);
                      let tmp = (n * 60)/25;
                      resolve(tmp);
                  }
              })
          }
      })
  })
};

let getPowerConsumptionAll = username => {
    let sum = 0;
    let limit = 0;
    let count = 0;

    const queryDB = "SELECT home_id FROM home WHERE user_id IN (SELECT user_id FROM account WHERE username = ?)";
    const _queryDB = "SELECT room_id FROM room WHERE home_id = ?";
    const __queryDB = "SELECT mac_address FROM device_lighting WHERE room_id = ?";

    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if(err){
                reject(err);
            }

            conn.query(queryDB, [username],(err, data) => {
                conn.release();
                if(err){
                    reject(err)
                }
                else{
                    for(let i in data){
                        func.checkHomeExistToUser(username, data[i].home_id).then((fulfilled) => {
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
                                                for(let j in data2){
                                                    func.checkRoomExistToHome(data[i].home_id, data2[j].room_id).then(result => {
                                                        if(result === true){
                                                            db.getConnection((err, conn) => {
                                                                if(err){
                                                                    reject(err);
                                                                }
                                                                else{
                                                                    conn.query(__queryDB, [data2[j].room_id], (err, data3) => {
                                                                        conn.release();
                                                                        if(err){
                                                                            reject(err);
                                                                        }
                                                                        else{
                                                                            for(let k in data3){
                                                                                limit++;
                                                                                func.getDeviceStatus(data3[k].mac_address).then(_result => {
                                                                                    count++;
                                                                                    if(_result === "ON"){
                                                                                        getPowerConsumtionPerDevice(data3[k].mac_address).then(__result => {
                                                                                            sum += __result;
                                                                                        }).catch(err => {
                                                                                            reject(err);
                                                                                        })
                                                                                    }
                                                                                }).catch(err => {
                                                                                    reject(err);
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
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
                            resolve(sum);
                        }
                    },500)
                }
            });
        });
    });
};

exports.getPowerConsumptionAll = getPowerConsumptionAll;