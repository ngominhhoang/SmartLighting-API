const express = require('express');
const router = express.Router();
const api = require('../controller/api.controller.js');
const middleware = require('../middleware/middlewares.js');
const home = require('../controller/home.controller.js');
const room = require('../controller/room.controller.js');

router.post('/admin_gethomelist', middleware.verify, home.adminGetHomeList);

/**
 * @api {get} /api/data/ APi get list of home based belong to user
 * @apiGroup Home API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {String} usernameToGet username which admin want to get list of house
 * @apiSuccess {Number} home_id User's home id
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          data: [
 *              {
 *                  home_id: 1
 *              }
 *          ]
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data?token={$TOKEN}
 */

router.get('/', middleware.verify, home.getHomeList);

/**
 * @api {get} /api/data/home/:id_home API get list of room in a house
 * @apiGroup Room API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {Number} id_home user's Home id
 * @apiSuccess {Number} room_id User's room id
 * @apiSuccess {String} room_name User's room name
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          data:[
 *              {
 *                  room_id: 1,
 *                  room_name: 'bedroom'
 *              }
 *          ]
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiErrorExample {json} If home does not belong to user
 *      {
 *          success: false,
 *          reason: 'Home does not belong to the user'
 *      }
 * @apiErrorExample {json} Other err
 *      {
 *          success: false,
 *          reason: error
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/home/3?token={$TOKEN}
 */

router.get('/home/:id_home', middleware.verify, room.getRoomList);

/**
 * @api {get} /api/data/home/:id_home/room/:id_room/device_type/:device_type APi get device list in each room
 * @apiGroup Device API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {Number} id_home user's Home id
 * @apiParam {Number} id_room user's Room id
 * @apiSuccess {String} mac_ipnode Device unique identification
 * @apiSuccess {String} device_type Device type
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          data:[
 *              {
 *                  device_id: 1,
 *                  device_name: 'test',
 *                  mac_address: '84:f3:eb:0e:2b:85-1',
 *                  location: 'abcxyz'
 *              }
 *          ]
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiErrorExample {json} If home does not belong to user
 *      {
 *          success: false,
 *          reason: 'Home does not belong to the user'
 *      }
 * @apiErrorExample {json} If room does not belong to home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      }
 * @apiErrorExample {json} Other err
 *      {
 *          success: false,
 *          reason: error
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/home/3/room/1/device_type/device_lighting?token={$TOKEN}
 */

router.get('/home/:id_home/room/:id_room/device_type/:device_type', middleware.verify, api.getDeviceList);

/**
 * @api {get} /api/data/home/:id_home/room/:id_room/device_type/:device_type/device_id/:id_device/type/db API get parameter of a device from database (Similar to Illuminance Sensor)
 * @apiGroup Data API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {Number} id_home user's Home id
 * @apiParam {Number} id_room user's Room id
 * @apiParam {Number} device_type Device type
 * @apiParam {Number} id_device Device unique identification
 * @apiParam {String} device_type Device type
 * @apiParam {String} start_duration Start range of query time
 * @apiParam {String} end_duration End range of query time
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          data2:[
 *              {
 *                  id: 1,
 *                  illuminance_level: 75,
 *                  status: 1,
 *                  power_usage: 5,
 *                  mac_address: '84:f3:eb:0e:2b:85-1'
 *              }
 *          ]
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiErrorExample {json} If home does not belong to user
 *      {
 *          success: false,
 *          reason: 'Home does not belong to the user'
 *      }
 * @apiErrorExample {json} If room does not belong to home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      }
 * @apiErrorExample {json} If device does not belong to room/home
 *      {
 *          success: false,
 *          reason: 'Device does not belong to this home/room'
 *      }
 * @apiErrorExample {json} Other err
 *      {
 *          success: false,
 *          reason: error
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/home/3/room/1/device_type/device_lighting/device_id/84:f3:eb:0e:2b:85-1/type/db?token={$TOKEN}&&start_duration=2018-10-15 00:00:00&&end_duration=2018-10-15 23:59:00
 *      http://localhost:3000/api/data/home/3/room/1/device_type/device_illuminance_sensor/device_id/84:f3:eb:0e:2b:85-1/type/db?token={$TOKEN}&&start_duration=2018-10-15 00:00:00&&end_duration=2018-10-15 23:59:00
 */

router.get('/home/:id_home/room/:id_room/device_type/light/device_id/:id_device/type/db', middleware.verify, api.getParameterLighting);

router.get('/home/:id_home/room/:id_room/device_type/sensor/device_id/:id_device/type/db', middleware.verify, api.getParameterSensor);

/**
 * @api {get} /api/data/home/:id_home/room/:room_name/device_type/:device_type/device_id/:id_device/type/broker API get parameter of a device from broker
 * @apiGroup Data API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {Number} id_home user's Home id
 * @apiParam {String} room_name user's Room name
 * @apiParam {String} device_type Device type
 * @apiParam {String} id_device Device unique identification
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          mac_ipnode: '84:f3:eb:0e:2b:85-1',
 *          operation_status: 'On',
 *          medium_capacity: 64,3434,
 *          coming_time: '23-10-2018 19:20:21'
 *      }
 * @apiErrorExample {json} Time out connecting to broker
 *      {
 *          success: false,
 *          reason: 'Time out'
 *      }
 * @apiErrorExample {json} Error while subscribing into topic MQTT Broker
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Other err
 *      {
 *          success: false,
 *          reason: error
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/home/3/room/bedroom/device_type/lighting_device/device_id/b4:e6:2d:28:e6:9f-1/type/broker?token={$TOKEN}
 */

router.get('/home/:id_home/room/:room_name/device_type/:device_type/device_id/:id_device/type/broker', middleware.verify, api.getParameter_Realtime);

/**
 * @api {post} /api/command API to send ON/OFF signals to devices
 * @apiGroup Control API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {Number} id_home user's Home id
 * @apiParam {String} room_name user's Room name
 * @apiParam {String} device_type Device type
 * @apiParam {String} id_device Device unique identification
 * @apiParam {Number} level Illuminance level
 * @apiParam {Number} status_code On/Off code
 * @apiParamExample {json} Input
 *      {
 *          id_home: 1,
 *          room_name: 'bedroom192',
 *          device_type: 'lighting_device',
 *          id_device: {MAC_ADDRESS},
 *          switch_code: 1,
 *          level: 75,
 *      }
 * @apiSuccessExample {json} Success
 *      {
 *          success: true
 *      }
 * @apiErrorExample {json} Time out connecting to broker
 *      {
 *          success: false,
 *          reason: 'Time out'
 *      }
 * @apiErrorExample {json} Error while subscribing into topic MQTT Broker
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If error while changing status code
 *      {
 *          success: false,
 *          reason: 'failure in changing status code'
 *      }
 * @apiErrorExample {json} If error while publishing into MQTT Broker
 *      {
 *          success: false,
 *          reason: 'failure in publishing command to mqtt broker'
 *      }
 * @apiErrorExample {json} Other err
 *      {
 *          success: false,
 *          reason: error
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/command?token={$TOKEN}
 */

router.post('/command', middleware.verify, api.sendCommand);

/**
 * @api {get} /api/unregisteredDevice/:device_type API to send ON/OFF signals to devices
 * @apiGroup Data API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {String} device_type Device type
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          data: [{
 *              device_id: 1,
 *              room_id: 1,
 *              device_name: abc,
 *              mac_address: avcxvvsd,
 *              location: home
 *          }]
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/unregisteredDevice/device_lighting?token={$TOKEN}
 */

router.get('/unregisteredDevice/:device_type', middleware.verify, api.getDeviceNoInfo);

/**
 * @api {post} /api/command API to send ON/OFF signals to devices
 * @apiGroup Control API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {Number} id_home user's Home id
 * @apiParam {Number} room_id user's Room id
 * @apiParam {String} device_type Device type
 * @apiParam {String} id_device Device unique identification
 * @apiParamExample {json} Input
 *      {
 *          home_id: 1,
 *          room_id: 'bedroom192',
 *          device_type: 'lighting_device',
 *          id_device: {MAC_ADDRESS}
 *      }
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in adding device 1 to room 1"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiErrorExample {json} If home does not belong to user
 *      {
 *          success: false,
 *          reason: 'Home does not belong to the user'
 *      }
 * @apiErrorExample {json} If room does not belong to home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      } * @apiErrorExample {json} Other err
 *      {
 *          success: false,
 *          reason: error
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/data/command?token={$TOKEN}
*/

router.post('/addUnregistedDevice', middleware.verify, api.addDevice);

router.get('/room/:room_id', middleware.verify, room.getRoomName);

router.get('/getIlluminanceLevel/home/:home_id/room/:room_id', middleware.verify, api.getIlluminanceLightLevel);

router.get('/getIlluminanceSensor/home/:home_id/room/:room_id', middleware.verify, api.getIlluminaceSensorValue);

router.get('/getBasicLighting/home/:home_id/room/:room_id', middleware.verify, api.getBasicLighting);

// router.get('/test/:home_id/:room_id', middleware.verify, api.test);

module.exports = router;