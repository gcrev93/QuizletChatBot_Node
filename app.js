var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js');
var username = 'gabrielle_crevecoeur';
var quiz = require('./api.js');
var data;
var index = 0;



(function () {
    quiz.GetSets();   // I will invoke myself
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

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
   // setTimeout(function () {

        session.send("Welcome to the MHacks ChatBot. Would you like to study today?")
        session.beginDialog('/subject')

  //  }, 3000)
});


bot.dialog('/subject', new builder.IntentDialog()
    .matches(/^yes/i, [
        function (session) {
            session.privateConversationData.sets = quiz.Sets;
            builder.Prompts.text(session, "What session would you like today?" + session.privateConversationData.sets);

        },
        function (session, results) {
            quiz.GetTerms(results.response);
            session.send("Ok! let me know when you are ready! Send next for next card. Send flip for defintion. Press Exit when you are done")
            session.beginDialog('/study')
        }])
);

bot.dialog('/study', new builder.IntentDialog()
    .matches(/^ready/i, [
        function (session) {
           session.send(quiz.Terms[index])
        }])
    .matches(/^flip/i, [
        function(session){
            session.send(quiz.Def[index])
        }]
    )
    .matches(/^next/i, [
        function (session){
            session.send(Terms[++index])
        }])
);
