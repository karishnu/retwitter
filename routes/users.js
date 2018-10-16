var express = require('express');
var router = express.Router();
const authenticate = require('../authenticate');
const responseHandler = require('../response');

const User = require('../models/User').User;

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");

    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        res.writeHead(200, headers);
        res.end();
    } else {
        authenticate.verify_token(req, res, next);
    }
});

/*
    FOLLOW A USER
 */

router.post('/follow', function (req, res, next) {
    const user_to_follow = req.query._id;

    User.findOneAndUpdate({username: req.decoded.username}, {$addToSet: {following: user_to_follow}}, function (error_follower, follower) {
        if (error_follower) {
            responseHandler.failureResponse(res, error_follower, null)
        }
        else {
            User.findOneAndUpdate({_id: user_to_follow}, {$addToSet: {followers: follower._id}}, function (error_to_follow, to_follow) {
                if(error_to_follow){
                    responseHandler.failureResponse(res, error_to_follow, null)
                }
                else {
                    responseHandler.successResponse(res, null, "Followed Successfully!")
                }
            });
        }
    })
});

/*
    UNFOLLOW A USER
 */


router.post('/unfollow', function (req, res, next) {
    const user_to_unfollow = req.query._id;

    User.findOneAndUpdate({username: req.decoded.username}, {$pull: {following: user_to_unfollow}}, function (error_follower, follower) {
        if (error_follower) {
            responseHandler.failureResponse(res, error_follower, null)
        }
        else {
            User.findOneAndUpdate({_id: user_to_unfollow}, {$pull: {followers: follower._id}}, function (error_to_follow, to_follow) {
                if(error_to_follow){
                    responseHandler.failureResponse(res, error_to_follow, null)
                }
                else {
                    responseHandler.successResponse(res, null, "Unfollowed Successfully!")
                }
            });
        }
    })
});

module.exports = router;
