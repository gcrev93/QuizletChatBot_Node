# MHacks ChatBot Tech Talk
#### Technical Evangelists: Gabby Crevecoeur (@NoWaySheCodes) & Kevin Leung (@KSLHacks)

## Bring on the Bots!
Jazz up your hack with the Microsoft Bot Framework. Add a conversational platform to any application you are building to take your project to the next level. They can be built for almost anything to help automate and create a more natural human interaction for everyday tasks. Join us and learn how to code a chat bot that helps you study, have fun and ace your exams!

Check out the .ppt for more information/resources/walkthroughs or read below

## The Quizlet Chat Bot
The Chat Bot created by Kevin and Gabby is actually a flashcards bot! If you are on the go but would like to get your study on, use this bot to study your Quizlet flashcards anytime. So lets get started.

### Prerequisites
1. You are going to need an Azure account. Sign up at [here](https://azure.microsoft.com/en-us/free/) for your free trial
2. [Node.js](https://nodejs.org/)
3. [Quizlet Developer Account](https://quizlet.com/api/2.0/docs)

## Step 1: Setup on Azure
After you have created your Azure account, it is time to create a web application for the ChatBot to run on. This is where the endpoints for communication with your bot are created.

1. Go to http://portal.azure.com
2. Select ‘New’
3. Then ‘Web + mobile’
4. And finally ‘Web App’
5. Create a name for your App
6. Choose your subscription
7. Resource Group: choose Default
8. App Service Plan: choose Default
9. Click Create.

Once your Web App is created and available in the 'All Resources' menu. Go to your Web Apps Overview section and find the url! Save that url somewhere because it will come in handy later.

## Step 2: Register Your Bot
After your web app has been created, you will need to register your bot on the bot framework site.

1. Go to http://dev.framework.com/bots/new
2. Give your bot a name, a bot handle (which will be used in the web link of the bot) and the description of your bot
3. Next, you need to configure your Message Endpoint. This is the url you got from your Azure Web App. You need to be sure you use https at the beginning of the link and add /api/messages to the end of the link. i.e. https://mhackschatbotnode.azurewebsites.net/api/messages
4. Then Generate your Microsoft App Id and Password by pressing the 'Create Microsoft App ID and password.'
5. Your App ID will automatically populate and you need to save your App password somewhere separately, because it will be hidden, until you regenerate a new one.
6. Lastly, you will need to add your APP ID and APP PASSWORD to your Azure settings. Go back to your web app overview, and in the task pnnel, go down to Application Settings.
7.  Scroll down to the App settings section and fill in your APP ID ad APP PASSWORD. The Key column should state MICROSOFT_APP_ID and the value is the App ID you got from Bot registration. Same goes for the App password, except the Key is MICROSOFT_APP_PASSWORD and the value is the App Password you got from Bot registration.

## Step 3: Get coding
First create a directory! In the working directory, you will need to set up the projec as a node project and then download the proper node modules.

1. Initialize the node project `npm init`
2. Install proper node modules `npm install --save botbuilder` `npm install --save restify `
3. Create an app.js file in your directory
4. Create an another js file that will communicate with the quizlet API (in this repository, the file is called api.js)

In your app.js file you will need the following required code just to properly set up your bot:

        var restify = require('restify');
        var builder = require('botbuilder');

        //=========================================================
        // Bot Setup
        //=========================================================

        // Setup Restify Server
        var server = restify.createServer();
        server.listen(process.env.port || process.env.PORT || 3978, function () {
           console.log('%s listening to %s', server.name, server.url);
        });

        // Create chat bot
        var connector = new builder.ChatConnector({
           appId: <YOUR APP ID>,
            appPassword: <YOUR APP PASSWORD>
        });

        var bot = new builder.UniversalBot(connector);
        server.post('/api/messages', connector.listen());



This is just the bare bones of the bot. Before we add any dialogs, lets be sure your api file is set up correctly.

####Quizlet API Code
In order for this bot to work, we are going to have to makw two API calls. One to retrieve the different sets a user has and other to retrieve the cards in a set. Before you can make any of the calls be sure to get your Quizlet Developer Client ID from the Quizlet API 2.0 Developer Dashboard. You can also retrieve the api code from the api.js file in this repository.

Lets take a look at the GetSets function:

        exports.GetSets = function (user, callback) {
            request.get({
                uri: 'https://api.quizlet.com/2.0/users/' + user + '/sets?client_id=<ENTER CLIENT ID here>',

            },
                function (error, response, body) {
                    if (error)
                        callback(error);
                    else {
                        body = JSON.parse(body);
                        for (var x = 0; x < body.length; x++) {
                            if ((x + 1) == body.length) {
                                // last set
                                sets = sets + body[x].title;
                            } else {
                                sets = sets + body[x].title + ', ';
                            }
                            table[body[x].title] = body[x].id; //creating a hash table to store set names and IDs
                        }
                        console.log('Got sets');
                        exports.Sets = sets;

                    }
                })
        }

Because the api.js file will be used a node module in other files, all variables and functions needed outside of this file will be exported . The GetSets function does a Get call to a Quizlet uri specific to retrieving a users study sets, with  username passed into it and the client ID you received from Quizlet.( The username is passed in from outside files calling the function, so it is not a variable you need to instantiate in this file.) The body received back from the API will contain the different study sets and other information associated with them. The rest of this function will manipulate the the body so that we can store the names of the sets (in the set array) and the set IDs (which will be needed in the next function) using a hash table. Lets take a look at the GetTerms function.

        exports.GetTerms = function (key, callback) {
            request.get({
                uri: 'https://api.quizlet.com/2.0/sets/' + table[key] + '?client_id=<ENTER CLIENT ID here>',
            },
                function (error, response, body) {
                    if (error)
                        console.log(error);
                    else {
                        body = JSON.parse(body);
                        for (var x = 0; x < body.terms.length; x++) {
                            terms.push(body.terms[x].term)
                            def.push(body.terms[x].definition);
                        }
                        console.log('Got terms');
                        exports.Terms = terms;
                        exports.Def = def;
                    }
                })
        }


The GetTerms function does a Get call to the Quizlet uri specific to retrieving the flashcards of a specified set, using the hash table of set IDs and the client ID. The key parameter will be what set name the user chooses in the bot dialog (in which we will discuss later).The rest of this function will manipulate the the body so that we can store the terms of the flashcards (in the terms array) and the definitions in another array.

Now that we have gone over the api file we can go back to creating your bot. In your app.js file, after the bot setup section, we will add bot dialogs. Before we do that, be sure to add the following right before Bot Setup:

        var username; 
        var quiz = require('./api.js');
        var index = 0;



        (function () {
            if (username)
                quiz.GetSets(username);   // I will invoke myself
        })();
The code we added instantiated a username variable, that will be used to determing the username of the user, the API module that will be referred to as quiz and an index value that will be used later. Under the new variables, you will see a self invoking function (in which you never have to explicitly call it, it will run automatically). The self invoking function is in case you would like to hardcode the username and skip some steps in the bot dialogs we are going to discuss next; if the username is hardcoded it will call the GetSets function in the API, so it is ready for the user.

Dialogs are used to manage the bots conversation with a user. They are called upon the same way you would call a webpage on a website, routing.
ie. '/' is the root dialog -- which is the first thing the bot will say when the user calls upon it. '/test' is a dialog named tes

The Dialog section to app.js is below:

        //=========================================================
        // Bots Dialogs
        //=========================================================

        bot.dialog('/',

            function (session) {
                session.send("Hello! Welcome to the Mhacks Quiz Bot. Would you like to study today?")
                session.beginDialog('/user');
            });

        bot.dialog('/user', new builder.IntentDialog()
            .matches(/^yes/i, [
                function (session) {
                // setTimeout(function () {
                if (username)
                    session.beginDialog('/subject')
                else {
                    builder.Prompts.text(session, "What is your quizlet username?")
                }
                //  }, 3000)
            },
            function (session, results) {
                quiz.GetSets(results.response);
                session.beginDialog('/subject')
            }])
            .matches(/^no/i, function(session){
                session.send("Ok see ya later!")
                session.endConversation;
            }));


        bot.dialog('/subject', [
                function (session) {
                   setTimeout(function(){
                    builder.Prompts.text(session, "What study set would you like today?" + quiz.Sets);
                    }, 2000)
                },
                function (session, results) {
                    quiz.GetTerms(results.response);
                    session.send("Ok! I got your flashcards! Send 'ready' to begin. Send 'flip' for definition. Send 'next' for the next card. Send 'exit' when you are done")
                    session.beginDialog('/study')
                }]
        );

        bot.dialog('/study', new builder.IntentDialog()
            .matches(/^ready/i, [
                function (session) {
                    session.send(quiz.Terms[index])
                }])
            .matches(/^flip/i, [
                function (session) {
                    session.send(quiz.Def[index])
                }]
            )
            .matches(/^next/i, [
                function (session) {
                    if (++index == quiz.Terms.length)
                        session.send("You are all out of cards! Hope you had fun studying! :)")
                    else
                        session.send(quiz.Terms[index])
                }])
             .matches(/^exit/i, [
                function (session) {
                    session.send("Hope you had fun studying. See ya later :)")
                }]
            )

        );



Looking at this code, you see that the dialog starts with the root function. Simply asking the user if they would actually run to the program. The next dialog, '/user', checks to see if the user would like to study; if they choose yes, it then checks to see if there is a hardcoded username or if we need to ask the user for one. If the username was hardcoded it will just jump to to the '/subject' dialog because the users study sets were found already in the self invoking function discussed earlier, if not it will prompt for the username, call the GetSets function with the new username and then call the '/subject' dialog. In the '/subject' dialog the user is prompted as to what study set they would like to study. Once they choose, GetTerms is called based on their decision and then the bot will go to the '/study' dialog. In the '/study' dialog, the act of looking at terms, "flipping" the card for the definition, moving to the next card and possibly exiting early is possible. We use the index variable to keep track of what card we are in for both the term and def arrays.

Lets break down some components of this dialog. 

####Sessions
In every dialog, you see a parameter named session. The session object is passed to your dialog handlers anytime your bot receives a message from the user. The session object is the primary mechanism you’ll use to manage messages received from and sent to the user

ex:

        bot.dialog('/', function (session) {
                        session.send("Hello! Welcome to the Mhacks Quiz Bot. Would you like to study today?")​
                        session.beginDialog('/user');

        });
        
####Waterfalls
Waterfalls are seen in several of the dialogs seen above.Waterfalls are used to let you collect input from the user using a sequence of steps.  Many dialogs will have several functions inside of them in which one function will be called after the user. Most waterfalls work in a way such that you prompt a user for information in one function, then the answer is passed to the next function, in which you will manipulate the answer received.

ex:

        bot.dialog('/subject', [
                function (session) {
                   setTimeout(function(){
                    builder.Prompts.text(session, "What study set would you like today?" + quiz.Sets);
                    }, 2000)
                },
                function (session, results) {
                    quiz.GetTerms(results.response);
                    session.send("Ok! I got your flashcards! Send 'ready' to begin. Send 'flip' for definition. Send                            'next' for the next card. Send 'exit' when you are done")
                    session.beginDialog('/study')
                }]
        );
        
####Prompts
As you noticed in the '/subject' example and other functions as well, many times users are asked for an answer, in which we need the data, there is a line that states `builder.Prompts.text()`. The bot framework has built in prompts available that can be used to collect input from a user.

Different return types of prompts available:
`builder.Prompts.text(session, "What's your name?");`
`builder.Prompts.number(session, "How many do you want?");`
`builder.Prompts.time(session, "When is your appointment?");`
`builder.Prompts.choice(session, "Which color?", "red|green|blue");`

####Intents
So what if you want to know how the user responds to a question, but you dont need access to the answer data? There are Intents! The IntentDialog class lets you listen for the user to say a specific keyword or phrase. Once a user sends a response, you can see if their response "matches" certain words/phrases:

ex:

        bot.dialog('/study', new builder.IntentDialog()
            .matches(/^ready/i, [
                function (session) {
                    session.send(quiz.Terms[index])
                }])
            .matches(/^flip/i, [
                function (session) {
                    session.send(quiz.Def[index])
                }]
            )
            .matches(/^next/i, [
                function (session) {
                    if (++index == quiz.Terms.length)
                        session.send("You are all out of cards! Hope you had fun studying! :)")
                    else
                        session.send(quiz.Terms[index])
                }])
             .matches(/^exit/i, [
                function (session) {
                    session.send("Hope you had fun studying. See ya later :)")
                }]
            )

        );
        
## Step 4: Continuous Integration
If you noticed, your web app has no code to know what exactly to run. First in you code directory, create an index.html file, where you simply print "Hello World!"

        <html>
        <head>
            <title>Mhacks Bot</title>
        </head>
        <body>
            Hello world! This is the Bots home page :)
        </body>	
        </html>
        
 After push your whole directory to Github! And then you will need to set up continious integration via Github in your Azure Web App. Here is a step by step on how to do so:
 
 https://azure.microsoft.com/en-us/documentation/articles/app-service-continuous-deployment/
 
## Step 5: Testing Your Bot
 
If you have a Windows Machine! You can test your bot on the Bot Emulator. You can install it here https://docs.botframework.com/en-us/tools/bot-framework-emulator/ ! You will need your APP ID and APP Password to enter it into the emulator and get to testing :)
