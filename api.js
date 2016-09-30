//=========================================================
// Quizlet API
//=========================================================

var request = require('request');
var username = 'gabrielle_crevecoeur';
var table = new Object();
var sets = "";

// thinking arrays



exports.getSets = function(callback){
    request.get({
        uri: 'https://api.quizlet.com/2.0/users/' + username + '/sets?client_id=X46hm4RZVz&whitespace=1',

    },
        function (error, response, body) {
            if (error)
                callback(error);
            else {
              /*  body = JSON.parse(body);
                for (var x = 0; x < body.length; x++) {
                    sets = sets + body[x].title + ',';
                    table[body[x].title] = body[x].id; //creating a hash table to store set names and IDs
                }   */           
               callback(null, JSON.parse(body)); 
            }
        })
}


exports.getTerms = function () {
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