const express = require('express');
const router = express.Router();
const auth = require('../controller/auth.controller.js');
const middleware = require('../middleware/middlewares.js');

/**
 * @api {post} /api/auth/register API register new user
 * @apiGroup Authentication API
 * @apiParam {String} username Username of new user
 * @apiParam {String} password Password of new user
 * @apiParam {String} email Email of new user
 * @apiParam {String} fullname fullname of user
 * @apiParam {Boolean} isRoot Default is 'F' - False
 * @apiParam {date} birthday Birthday of user
 * @apiParam {int} phone_number Phone number of user
 * @apiParamExample {json} Input
 *      {
 *          username: admin,
 *          password: admin,
 *          fullname: 'admin user'
 *
 *          birthday, email, phone_nnumber is not mandatory
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in creating account admin"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If username is already existed in the database
 *      {
 *          success: false,
 *          reason: 'This username is already existed!!'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/auth/register
 *
 */

router.post('/register', auth.regFunc);

/**
 * @api {post} /api/auth/login API process login request from client
 * @apiGroup Authentication API
 * @apiParam {String} username Username of user
 * @apiParam {String} password Password of user
 * @apiParamExample {json} Input
 *      {
 *          username: 'admin',
 *          password: 'admin',
 *      }
 * @apiSuccess {Boolean} success = true Successfully register new user
 * @apiSuccess {String} name Username of user after successfully login
 * @apiSuccess {String} token User's JWT token generate after successfully login
 * @apiSuccess {String} expires token's expiration
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          name: admin,
 *          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWQiLCJpYXQiOjE1NDAzNzEyNTcsImV4cCI6MTU0MDQ1NzY1N30.-3GriBVZ29xLZDFrmo5ErqsjhUchqhzoDGqqqawUhik',
 *          expires: '24h'
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If wrong username/password
 *      {
 *          success: false,
 *          reason: 'Wrong username/password'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/auth/login
 *
 */

router.post('/login', auth.loginFunc);

/**
 * @api {post} /api/auth/change_password API change password
 * @apiGroup Authentication API
 * @apiParam {String} username Username of user
 * @apiParam {String} old_password Old_password of user
 * @apiParam {String} new_password New_password of user
 * @apiParamExample {json} Input
 *      {
 *          'username': admin,
 *          'old_password': admin,
 *          'new_password': admin1
 *      }
 * @apiSuccess {Boolean} success = true Successfully change user's password
 * @apiSuccessExample {json} Success
 *      {
 *          success: true,
 *          reason: "Success in changing password of admin"
 *      }
 * @apiErrorExample {json} False to connect to database
 *      {
 *          success: false,
 *          reason: err
 *      }
 * @apiErrorExample {json} If wrong username/password
 *      {
 *          success: false,
 *          reason: 'Wrong username/password'
 *      }
 * @apiErrorExample {json} Error while querying into database
 *      {
 *          success: false,
 *          reason: 'failure in adding username and password to authorization database'
 *      }
 * @apiErrorExample {json} If account does not exist
 *      {
 *          success: false,
 *          reason: 'Account does not exist!'
 *      }
 * @apiExample Example URL:
 *      http://localhost:3000/api/auth/change_password?token={$TOKEN}
 */

router.post('/change_password', middleware.verify, auth.changePassFunc);

module.exports = router;