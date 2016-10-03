//=========================================================
// gcrev93 @NoWaySheCodes
// KSLHacks @KSLHacks
// MHacksChatBot using Node JS with LUIS.ai integration
//=========================================================

var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js')

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
// TODO: Help intent for commands
//=========================================================

// Greetings! Gather name from user so we can address them by name.
dialog.matches('Greeting', [
    function (session, args, next) {
        if (!session.privateConversationData.name) {
            session.beginDialog('/askName');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.privateConversationData.name);
    }
]);
// prompt the user for their name and store response -- Called from /Greeting
bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, 'Hello MHacks Hacker! What is your name?');
    },
    function (session, results) {
        session.privateConversationData.name = results.response;
        session.endDialogWithResult();
    }
]);

// Choose a topic so we can load the flashcards from API
dialog.matches('PickTopic', [
    function (session) {
        //session.send('%s, what topic would you like to study?', session.privateConversationData.name);
        builder.Prompts.text(session, '\'American History\', \'Biology\' or \'Azure\'?');
    },
    function (session, results) {
        session.privateConversationData.topic = results.response;
        session.endDialogWithResult();
    }
]);

// Start the quiz --> display first flashcard
dialog.matches('StartQuiz', [
    function (session, args, next) {
        if (!session.privateConversationData.topic) {
            session.beginDialog('PickTopic');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Topic: %s', session.privateConversationData.topic);
    }
]);

// Display the opposite side of the flashcard -- answer
dialog.matches('FlipCard', builder.DialogAction.send('FlipCard'));

// Display the next flashcard
dialog.matches('NextCard', builder.DialogAction.send('NextCard'));

// TODO Score will be displayed "x out of y correct"
dialog.matches('ShowScore', builder.DialogAction.send('ShowScore'));

// User wishes to leave the session -- Data will be cleared for new user
dialog.matches('Exit', [
    function (session, results) {
        // end conversation.. clear privateConversationData stack
        session.endConversation('Okay.. See you soon %s.', session.privateConversationData.name);
    }
]);

// Waterfall fall through catch -- default messages
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand.."));