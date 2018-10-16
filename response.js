function successResponse(res, data, message) {

    res.json({
        code: 0,
        success: true,
        message: message,
        data: data
    })
}

function failureResponse(res, data, message) {
    if(message===null) message = "Oops! Something went wrong.";

    res.json({
        code: 1,
        success: false,
        message: message,
        data: data
    })
}

module.exports = {successResponse: successResponse, failureResponse: failureResponse};