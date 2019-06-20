const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middlewares.js');
const user = require('../controller/user.controller.js');

/**
 * @api {post} /api/users API get information about user
 * @apiGroup User API
 * @apiParam {String} token user's token provided after successfully login

 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccess {String} fullname User's fullname
 * @apiSuccess {String} email
 * @apiSuccess {String} birthday
 * @apiSuccess {String} isRoot User's privilege
 * @apiSuccessExample {json} Success
 * {
 *  "success": true,
 *   "data": [
 *       {
 *          "fullname": "Root User",
 *           "email": "root@localhost",
 *           "phone_number": "0353151669",
 *           "birthday": null,
 *           "isRoot": "root"
 *       }
 *   ]
 * }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If username does not exist
 *      {
 *          success: false,
 *          reason: 'Username does not exist!!'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/users?token={$TOKEN}
 */

router.get('/',middleware.verify, user.getUserInfo);

/**
 * @api {post} /api/users/delete_user API delete user
 * @apiGroup User API
 * @apiParam {String} token user's token provided after successfully login
 * @apiParam {String} user_delete username to delete
 * @apiSuccessExample {json} Success
 *      }
 *          success: true,
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If username does not exist
 *      {
 *          success: false,
 *          reason: 'Username does not exist!!'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/users/delete_user?token={$TOKEN}
 */

router.post('/delete_user', middleware.verify, user.deleteUser);

/**
 * @api {get} /api/users/info API get number of home, device, room,... belong to user
 * @apiGroup User API
 * @apiParam {String} token user's token provided after successfully login
 * @apiSuccessExample {json} Success for normal user
 *      }
 *          success: true,
 *          numberOfHome: 1,
 *          numberOfRoom: 2,
 *          numberOfDevice: 3
 *      }
 * @apiSuccessExample {json} Success for normal user
 *      }
 *          success: true,
 *          numberOfHome: 1,
 *          numberOfRoom: 2,
 *          numberOfDevice: 3,
 *          numberOfUser: 4
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If username does not exist
 *      {
 *          success: false,
 *          reason: 'Username does not exist!!'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/users/info?token={$TOKEN}
 */

router.get('/info', middleware.verify, user.getAllInfoAboutUser);

/**
 * @api {get} /api/users/list_user API get list of user - For Admin only
 * @apiGroup User API
 * @apiParam {String} token user's token provided after successfully login
 * @apiSuccessExample {json} Success for normal user
 *      }
 *          success: true,
 *          data: [{
 *              user_id: 1,
 *              username: abc,
 *              fullname: abc,
 *              email: abc@localhost,
 *              phone_number: 123456,
 *              birthday: 11/11/1990
 *          }]
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If username does not exist
 *      {
 *          success: false,
 *          reason: 'Username does not exist!!'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/users/list_user?token={$TOKEN}
 */

router.get('/list_user', middleware.verify, user.getListOfUser);

module.exports = router;