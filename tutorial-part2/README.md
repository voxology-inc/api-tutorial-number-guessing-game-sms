SMS Tutorial Part 2
===================
This tutorial's project architecture is based off of the QuickStart
project provided in this project bundle. To familiarize yourself with
how the project is setup, built, and deployed, please review the QuickStart's ReadMe.md.
After you are done familiarizing yourself with it, create a copy of the QuickStart
project and begin this tutorial with Part 1. This part of the tutorial is a continuation of
the work done in Part 1.

In this part of the tutorial you will create a simple number guessing game using inbound/outbound sms messages.

>**NOTE:** You must have an SMS enabled number provisioned under your account. Please use the [PhoneNumbers API](https://voxolo.gy/api-reference/#list-available-inbound-numbers) to do so.

Index:

1.  Mocking User Instances
2.  Handling User Responses

### 1. Mocking User Instances

Since we want callers to be guessing their own individual number,
we will need to mock a caller session. While the Voxology API provides
call id's for each call to distinguish them from one another, it also assigns
call id's for individual text messages. Therefore, to distinguish between
users, we will use the number they reach our number from.

1. At the top of the *game.js* file, underneath the initialization of
   the `API_KEY`, initialize a variable called `text_cache` like so:

    ```javascript
    var text_cache = {};
    ```

   We will be using this object to relate users with the number they
   should be guessing for and the number of guesses they've made.
2. Next, we need to check if the text message that we get is from a number that currently has
   a game in progress or if they are starting a new one. If they are starting a new one, we need
   to create a new mock instance for them, otherwise we need to handle their guess. Change the
   code inside your endpoint to the following.

   ```javascript
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

           // Handle user guesses.

       }

   }
   ```

### 2. Handling User Responses
1. Copy paste the following code inside the else statement of your endpoint to replace where it says `// Handle user guesses`

    ```javascript
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
    ```

    The code above compares the text message that we received to the number that the user should be guessing for.
    One thing to note is the fact that the `text_message` attribute that we receive from the Voxology server is
    a string, so it needs to be casted as an int before being compared to the user's number. Another note is the
    fact that when they user does guess the correct number, we delete their instance from `text_cache` so that
    they may start a new game.

Congrats! You know have a program that will now play a number guessing game with users using inbound/outbound sms capabilities.

Please compare your code to the code provided to make sure that they are identical.