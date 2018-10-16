var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');

// create a schema
var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String},
    time_sign_up: {type: Date, required: true, default: Date.now},
    location: {type: String},
    birthday: {type: Date},
    webpage: {type: String},
    tweets: [{type: mongoose.Schema.ObjectId, ref: 'Tweet', required: true}],
    following: [{type: mongoose.Schema.ObjectId, ref: 'User', required: true}],
    followers: [{type: mongoose.Schema.ObjectId, ref: 'User', required: true}]
});

// Execute before each user.save() call
userSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return callback(err);
        user.password = hash;
        callback();
    });
});

userSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, res) {
        if (err) {
            callback(err, null)
        }
        else if (!res) {
            callback("Authentication Failed!", false);
        }
        else {
            callback(null, true);
        }
    });
};

var User = mongoose.model('User', userSchema);
module.exports = {User: User};