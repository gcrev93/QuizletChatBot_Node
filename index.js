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

var request = require('request');
var username = 'gabrielle_crevecoeur';
var table = new Object();
// thinking arrays

GetSets();

function GetSets() {
    request.get({
        uri: 'https://api.quizlet.com/2.0/users/' + username + '/sets?client_id=X46hm4RZVz&whitespace=1',

    },
        function (error, response, body) {
            if (error)
                console.log(error);
            else {
                body = JSON.parse(body);
                for (var x = 0; x < body.length; x++) {
                    console.log(body[x].title);
                    table[body[x].title] = body[x].id; //creating a hash table to store set names and IDs
                }
                GetTerms();
            }
        });

}


function GetTerms() {
        request.get({
        uri: 'https://api.quizlet.com/2.0/sets/'+ table['Biology'] + '?client_id=X46hm4RZVz&whitespace=1',

    },
        function (error, response, body) {
            if (error)
                console.log(error);
            else {
                body = JSON.parse(body);
                console.log(body);
                /*for (var x = 0; x < body.length; x++) {
                    console.log(body[x].title);
                    table[body[x].title] = body[x].id;
                }
                console.log(table);*/
            }
        });
}