/*var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js');*/
var username = 'gabrielle_crevecoeur';
var quiz = require('./api.js');
/*var sets;


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

bot.dialog('/', function(session){
    session.send("Welcome to the MHacks ChatBot. We are hoping this will blow your mind and help you access your flashcards.")
    session.beginDialog('/sets')
});

bot.dialog('/sets', function(session){
    

});
*/
Go();

function Go(){
    quiz.getSets(function(err,res){
        if (err)
            console.log(err);
        else
            console.log(res);
    })
}