var express = require('express');
var request = require('request');
var router = express.Router();

var API_KEY = "YOUR API KEY";
var text_cache = {};

router.post('/', function(req, res) {
    if(req.body.type == "sms"){

        res.json({});

        if(!(req.body.caller_no in text_cache)){

            text_cache[req.body.caller_no] ={

                number: Math.ceil(Math.random() * 100),
                numGuesses: 0

            };

            sendTxt(req, "Welcome to Voxology's SMS demo. This is a number guessing game. I am thinking of a number between 1 and 100.");

        }
        else{

            text_cache[req.body.caller_no].numGuesses += 1;
            if(+req.body.text_message > text_cache[req.body.caller_no].number){
                sendTxt(req, "Your guess was too high! Guess again.");
            }
            else if(+req.body.text_message < text_cache[req.body.caller_no].number){
                sendTxt(req, "Your guess was too low! Guess again.");
            }
            else if(+req.body.text_message === text_cache[req.body.caller_no].number){
                sendTxt(req, "Congratulations! "+ "You took " + text_cache[req.body.caller_no].numGuesses + " guesses.");
                delete text_cache[req.body.caller_no];
            }
            else{
                sendTxt(req, "That was an invalid guess, please try again. ");
            }

        }

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