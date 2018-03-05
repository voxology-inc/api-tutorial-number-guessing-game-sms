SMS Tutorial Part 1
===================
This tutorial's project architecture is based off of the QuickStart
project provided in this project bundle. To familiarize yourself with
how the project is setup, built, and deployed, please review the QuickStart's ReadMe.md.
After you are done familiarizing yourself with it, create a copy of the QuickStart
project and begin this tutorial.

In this part of the tutorial you will learn how to handle an inbound text message and how to respond with a text message.

>**NOTE:** You must have an SMS enabled number provisioned under your account. If you do not, please use the [PhoneNumbers API](https://voxolo.gy/api-reference/#list-available-inbound-numbers) to provision yourself one.

Index:

1. Creating the route
2. Checking for an inbound text message
3. Sending a text message back

### 1. Creating the route

1.  In your project, under the **routes** directory, create a new file called *game.js*.
2.  Copy the code from *index.js* and paste it into *game.js*
3.  In your project's root directory, open *application.js*
4.  Under line 6, which reads:

    ```javascript
    var routes = require('./routes/index');
    ```

    Add the code:

    ```javascript
    var game = require('./routes/game');
    ```

5.  Under line 16, which reads:

    ```javascript
    app.use('/', routes);
    ```

    Add the code:

    ```javascript
    app.use('/game', game);
    ```

6.  This effectively adds the route of `/game` to your web server

### 2. Checking for an inbound text message
1.  To check what kind of inbound message is coming we first have to allow our endpoint to receive information. We can do that by changing the endpoint in *game.js* from

    ```
    router.get('\', {...});
    ```
    to
    ```
    router.post('\', {...});
    ```
    All this really does is change the endpoint from a **GET** endpoint to a **POST** endpoint, meaning that we will now recieve the response body back from Voxology's servers to get information about the state of the inbound call/text.

2.  Next, we want to dig into the request body and see what type of inbound call it is. There are four types:
    1. sms
    2. init_call
    3. live_call
    4. end_call

    We are primarily interested in the first one for this tutorial. We can check the type by looking at the `type` attribute of the `body` object, which is an attribute of the `req` object. We compare that `type` attribute to sms like so:

    ```javascript
    if(req.body.type == "sms"){
        res.json({});
    }
    ```
    For now, when we recieve a text message, we'll just respond with an empty object.

3.  Your endpoint can now discern when it is recieving a text message and how to respond when doing so.

### 3. Sending a text message back
1.  To send a text message back to whoever sent us a text, we're going to need to use the [Dials API's SMS](https://voxolo.gy/api-reference/#send-sms) request. To ease this process, we'll be using the `request` library.
2.  In command line, change to your project's root directory. There type

    ```
    npm install request --save
    ```
    You should now see `request` in your *package.json* file, located in your root directory, under the dependencies category.
3.  Next, we bring the `request` library into our project by using the `require` module provided by Node. In the *game.js* file, under the line of code:

    ```javascript
    var express = require('express');
    ```

    add this to pull the request library in:

    ```javascript
    var request = require('request');
    ```
4.  Before we send a text message, we need to first define our API key. In *game.js*, under the line

    ```javascript
    var router = express.Router();
    ```

    add the line

    ```javascript
    var API_KEY = "YOUR API KEY"
    ```

    Make sure you initialize this variable with your API key for the Voxology API.
5.  Next, add this function underneath your endpoint which takes the request sent by Voxology and a message that it then sends to whoever called or texted us.
    ```javascript
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
    ```
    We will be using this function to handle sending messages back to user's who     message our system.

6.  Finally, back inside the code snippet inside your endpoint
    ```javascript
    if(req.body.type == "sms"){
        res.json({});
    }
    ```
    underneath `res.json({});` add
    ```javascript
    sendTxt(req, "Hello World!");
    ```

This program, when deployed, will now send the text message "Hello World!" to anyone who sends it a text message!

Please compare your code to the code provided to make sure that they are identical.