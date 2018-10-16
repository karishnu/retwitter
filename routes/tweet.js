var express = require('express');
var router = express.Router();
const authenticate = require('../authenticate');

const Tweet = require('../models/Tweet').Tweet;
const User = require('../models/User').User;

const responseHandler = require('../response');

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

router.get('/feed', function (req, res, next) {
    User.findOne({username: req.decoded.username}, function (error_user, user) {

        if(error_user){
            responseHandler.failureResponse(res, error_user, null);
        }
        else {
            Tweet.find({posted_by: {"$in": user.following}}, function (error, tweets) {
                if(error) {
                    responseHandler.failureResponse(res, error, null);
                }
                else {
                    responseHandler.successResponse(res, tweets, "Tweets Found!");
                }
            })
        }
    });
});

router.get('/', function (req, res, next) {
    Tweet.findOne({_id: req.query._id}, function (error, tweet) {
        if(error){
            responseHandler.failureResponse(res, error, null);
        }
        else {
            responseHandler.successResponse(res, tweet, "Tweet Found!");
        }
    })
});

router.post('/like', function (req, res, next) {
    Tweet.findOneAndUpdate({_id: req.query._id}, {$addToSet: {likes: req.decoded._id}}, function (error, tweet) {
        if(error){
            responseHandler.failureResponse(res, error, null);
        }
        else{
            responseHandler.successResponse(res, tweet, "Tweet Liked!");
        }
    })
});

router.post('/', function (req, res, next) {

    var tweet = new Tweet({
        type: req.body.type,
        text: req.body.text,
        assoc_tweet: req.body.assoc_tweet,
        posted_by: req.decoded._id
    });

    tweet.save(function (error_tweet, tweet) {
        if(error_tweet){
            responseHandler.failureResponse(res, error_tweet, null)
        }
        else{
            User.findOneAndUpdate({username: req.decoded.username}, {$addToSet: {tweets: tweet._id}}, function (error_user, user) {
                if(error_user){
                    responseHandler.failureResponse(res, error_user, null)
                }
                else {
                    responseHandler.successResponse(res, tweet, "Tweet has been posted!")
                }
            });
        }
    });
});

router.delete('/', function (req, res, next) {

    var id = req.query._id;

    User.findOneAndUpdate({username: req.decoded.username}, {$pull: {tweets: id}}, function (error_user, user) {
        if(error_user){
            responseHandler.failureResponse(res, error_user, null)//error response
        }
        else {
            Tweet.findOneAndDelete({_id: id, posted_by: user._id}, function (error_tweet, tweet) {
                if(error_tweet){
                    responseHandler.failureResponse(res, error_tweet, null)
                }
                else{
                    responseHandler.successResponse(res, tweet, "Tweet has been deleted!")
                }
            });
        }
    });
});

module.exports = router;