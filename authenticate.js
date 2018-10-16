const jwt = require('jsonwebtoken');
const Member = require('./models/User.js').User;

const response = require('./response');

var config = require('./config');

function authenticate(req, res) {
    if (req.body.email && req.body.password) {
        authenticate_user(req.body.email, req.body.password, function (err, user) {
            if(err){
                response.failureResponse(res, err, null);
            }
            else if(!user){
                response.failureResponse(res, null, "User not found!");
            }
            else {
                const token = jwt.sign(user.toJSON(), config.SECRET);

                // return the information including token as JSON
                res.header("Set-Cookie","x-access-token="+token);
                response.successResponse(res, {token: token}, "Token generated!");
            }
        })
    }
}

function authenticate_user(username, password, callback) {
    Member.findOne({ email: username }, function (err, user) {
        if (err) {
            return callback(err, null);
        }
        else if (!user) {
            return callback(null, null);
        }
        user.verifyPassword(password, function (error, value) {
            if(value){return callback(null, user);}
            else {return callback(error, null);}
        });
    });
}

function check_token(req, res, next) {

    // check header or url parameters or post parameters for token
    const token = req.headers['x-access-token'];
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.SECRET, function(err, decoded) {
            if (err) {
                return response.failureResponse(res, null, "Failed to authenticate token")
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return response.failureResponse(res, null, "No Token Provided")
    }
}

module.exports = {authenticate: authenticate, verify_token: check_token};