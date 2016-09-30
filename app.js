/*var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js');
var username = 'gabrielle_crevecoeur';

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
});

*/

//=========================================================
// Quizlet API
//=========================================================
var quiz = require('./api.js')
var request = require('request');
var username = 'gabrielle_crevecoeur';
var table = new Object();
var sets = "";
// thinking arrays

(function () {
    GetSets();   // I will invoke myself
})();

setTimeout(function () {
    console.log("getting sets");
    console.log(sets);
}, 1000);


function GetSets() {
    quiz.GetSets(function (err, res) {
        if (err)
            console.log(err);
        else {
            for (var x = 0; x < res.length; x++) {
                sets = sets + res[x].title + ',';
                table[res[x].title] = res[x].id; //creating a hash table to store set names and IDs
            }

        }
    })
}


function GetTerms() {
       
}