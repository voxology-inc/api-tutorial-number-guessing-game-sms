var express = require('express');
var request = require('request');
var router = express.Router();

var API_KEY = "YOUR API KEY";

router.post('/', function(req, res) {

    if(req.body.type == "sms"){

        res.json({});
        sendTxt(req, "Hello World!");

    }

});

function sendTxt(req, message){

    request({
        url: "https://api.voxolo.gy/v1/Dials/SMS",
        method: "POST",
        headers:{

            "content-type": "application/json",
            "X-API-KEY": API_KEY

        },
        json: true,
        body: {
            "call": {
                "no": req.body.caller_no,
                "caller_id_no": req.body.api_no
            },
            "message": message

        }
    }, function(error, response, body){});
}

module.exports = router;