const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middlewares.js');
const home = require('../controller/home.controller.js');
const room = require('../controller/room.controller.js');
const api = require('../controller/api.controller.js');

/**
 * @api {post} /api/modify/add_home API to add home
 * @apiGroup Home API
 * @apiParam {String} token Token of currently login user
 * @apiParam {String} house_owner House owner's username
 * @apiParamExample {json} Input
 *      {
 *          house_owner: user1,
 *      }
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          home_id: 11,
 *          user_id: 5
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If username does not exist in the database
 *      {
 *          success: false,
 *          reason: 'Username does not exist!'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Insufficient privilege
 *      {
 *          success: false,
 *          reason: 'Only administrator can add new house into your account.'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/modify/add_home?token={$TOKEN}
 */

router.post('/add_home', middleware.verify, home.addHome);

/**
 * @api {post} /api/modify/delete_home API to delete home
 * @apiGroup Home API
 * @apiParam {String} token Token of currently login user
 * @apiParam {String} house_owner House_owner name
 * @apiParam {Number} home_id House owner's Home id
 * @apiParamExample {json} Input
 *      {
 *          house_owner: user1,
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in deleting home 1"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If home does not exist to this account
 *      {
 *          success: false,
 *          reason: 'Home does not belong to this account'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Insufficient privilege
 *      {
 *          success: false,
 *          reason: 'Only administrator can add new house into your account.'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/modify/delete_home?token={$TOKEN}
 */

router.post('/delete_home', middleware.verify, home.deleteHome);

/**
 * @api {post} /api/modify/add_room API to add room
 * @apiGroup Room API
 * @apiParam {String} token Token of currently login user
 * @apiParam {String} room_name House's owner room name
 * @apiParam {Number} home_id House owner's Home id
 * @apiParamExample {json} Input
 *      {
 *          home_id: user1
 *          room_name: 'test'
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in adding room 1"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If home does not exist to this account
 *      {
 *          success: false,
 *          reason: 'Home does not belong to this account'
 *      }
 * @apiErrorExample {json} If room does not exist to this home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Insufficient privilege
 *      {
 *          success: false,
 *          reason: 'Only administrator can add new house into your account.'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/modify/add_room?token={$TOKEN}
 */

router.post('/add_room', middleware.verify, room.addRoom);

/**
 * @api {post} /api/modify/delete_room API to delete room
 * @apiGroup Room API
 * @apiParam {String} token Token of currently login user
 * @apiParam {String} room_id room id
 * @apiParam {Number} home_id House owner's Home id
 * @apiParamExample {json} Input
 *      {
 *          home_id: 1,
 *          room_id: 1
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in deleting room 1"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If home does not exist/belong to this account
 *      {
 *          success: false,
 *          reason: 'Home does not belong to this account'
 *      }
 * @apiErrorExample {json} If room does not exist/belong to this home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Insufficient privilege
 *      {
 *          success: false,
 *          reason: 'Only administrator can add new house into your account.'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/modify/delete_room?token={$TOKEN}
 */

router.post('/delete_room', middleware.verify, room.deleteRoom);

/**
 * @api {post} /api/modify/delete_device API to delete device
 * @apiGroup Device API
 * @apiParam {String} token Token of currently login user
 * @apiParam {String} room_id room id
 * @apiParam {Number} home_id House owner's Home id
 * @apiParam {Number} device_id Device id
 * @apiParam {String} device_type Type of device
 * @apiParamExample {json} Input
 *      {
 *          home_id: 1,
 *          room_id: 1,
 *          device_id: 2,
 *          device_type: device_lighting
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in deleting device abc"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If home does not exist/belong to this account
 *      {
 *          success: false,
 *          reason: 'Home does not belong to this account'
 *      }
 * @apiErrorExample {json} If room does not exist/belong to this home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      }
 * @apiErrorExample {json} If device does not exist/belong to this room
 *      {
 *          success: false,
 *          reason: 'Device does not belong to this room'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Insufficient privilege
 *      {
 *          success: false,
 *          reason: 'Only administrator can add new house into your account.'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/modify/delete_device?token={$TOKEN}
 */

router.post('/delete_device', middleware.verify, api.delete_device);

/**
 * @api {post} /api/modify/add_device API to delete device
 * @apiGroup Device API
 * @apiParam {String} token Token of currently login user
 * @apiParam {String} room_id room id
 * @apiParam {Number} home_id House owner's Home id
 * @apiParam {Number} device_id Device id
 * @apiParam {String} device_type Type of device
 * @apiParamExample {json} Input
 *      {
 *          home_id: 1,
 *          room_id: 1,
 *          device_id: 2,
 *          device_type: device_lighting
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in adding device abc into room xyz"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If home does not exist/belong to this account
 *      {
 *          success: false,
 *          reason: 'Home does not belong to this account'
 *      }
 * @apiErrorExample {json} If room does not exist/belong to this home
 *      {
 *          success: false,
 *          reason: 'Room does not belong to this home'
 *      }
 * @apiErrorExample {json} If device does not exist/belong to this room
 *      {
 *          success: false,
 *          reason: 'Device does not belong to this room'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} Insufficient privilege
 *      {
 *          success: false,
 *          reason: 'Only administrator can add new house into your account.'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/modify/add_device?token={$TOKEN}
 */

router.post('/add_device', middleware.verify, api.addDevice);

module.exports = router;