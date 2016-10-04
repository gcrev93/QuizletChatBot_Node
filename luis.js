//=========================================================
// gcrev93 @NoWaySheCodes
// KSLHacks @KSLHacks
// MHacksChatBot using Node JS with LUIS.ai integration
//=========================================================

var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js')
var quiz = require('./api.js');
var index = 0;  // index for flashcard containers (terms + def)
var username; //= "gabrielle_crevecoeur"; // login info for user


(function () {
    if (username)
        quiz.GetSets(username);   // I will invoke myself
})();

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
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=9358489c-d440-488e-82de-d465b65b75f2&subscription-key=' + process.env.LUIS_KEY;
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

//=========================================================
// Bots Dialogs With LUIS.AI !
// TODO: Scoring functionality
// TODO: LUIS for YES and No
// TODO: Comment code
// TODO:  for session.privateConversationData.name
//=========================================================

// Greetings! Gather name from user so we can address them by name.
dialog.matches('Greeting', [
    function (session, args, next) {
        builder.Prompts.text(session, "Hello! Welcome to the Mhacks Quiz Bot. Would you like to study today?");
    },
    function (session, results, next) {
        if ((results.response == "yes") || (results.response == "Yes")) {
            // user wants to study
            if (username) {
                // user has username
                next();
            } else {
                // user does NOT have username
                session.beginDialog('/askName');
            }
        } else {
            // user does not want to study
            session.beginDialog('/Exit');
        }
    },
    function (session, results) {
        session.beginDialog('/PickTopic');
    }
]);
// prompt the user for their name and store response -- Called from /Greeting
bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, "What is your quizlet username?");
    },
    function (session, results) {
        session.privateConversationData.name = results.response;
        quiz.GetSets(results.response);
        session.endDialogWithResult();
    }
]);

// Choose a topic so we can load the flashcards from API
dialog.matches('PickTopic', [
    function (session) {
        session.beginDialog('/PickTopic');
    }
]);

bot.dialog('/PickTopic', [
    function (session) {
        setTimeout(function() {
            builder.Prompts.text(session, "What study set would you like today?" + quiz.Sets);
        }, 2000)
    },
    function (session, results) {
        quiz.GetTerms(results.response);
        session.send("Ok! I got your flashcards! Send 'ready' to begin. Send 'flip' for definition. Send 'next' for the next card. Send 'exit' when you are done");
        session.endDialogWithResult();
    }
]);

// Start the quiz --> display first flashcard
dialog.matches('StartQuiz', [
    function (session, args, next) {
        if (!session.privateConversationData.topic) {
            session.beginDialog('/PickTopic');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send(quiz.Terms[index]);
        session.endDialog();
    }
]);

// Display the opposite side of the flashcard -- answer
dialog.matches('FlipCard', [
    function(session) {
        session.send(quiz.Def[index]);
        session.endDialog();
    }
]);

// Display the next flashcard
dialog.matches('NextCard', [
    function(session) {
        if(++index == quiz.Terms.length)
            //all flashcards exhausted
            session.send("You are all out of cards! Hope you had fun studying! :)");
        else {
            session.send(quiz.Terms[index])
        }
    }
]);

// TODO Score will be displayed "x out of y correct"
dialog.matches('ShowScore', builder.DialogAction.send('ShowScore'));

// User wishes to leave the session -- Data will be cleared for new user
dialog.matches('Exit', [
        function (session) {
            session.beginDialog('/Exit');
        }
]);

bot.dialog('/Exit', [
    function (session, results) {
        // end conversation.. clear privateConversationData stack
        if (username) {
            session.endConversation("Hope you had fun studying. See ya later %s :)", session.privateConversationData.name);
        } else {
            session.endConversation("Hope you had fun studying. See ya later :)");
        }
    }
]);

// Waterfall fall through catch -- default messages
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand.."));