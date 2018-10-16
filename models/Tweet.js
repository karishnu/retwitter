var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
    type: {type: String, required: true, default: "tweet", enum: ["tweet", "reply", "retweet"]},
    assoc_tweet: {type: mongoose.Schema.ObjectId, ref: 'Tweet'},
    text: {type: String, required: true},
    time_posted: {type: Date, required: true, default: Date.now},
    posted_by: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    likes: [{type: mongoose.Schema.ObjectId, ref: 'User', required: true}]
});

var Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = {Tweet: Tweet};