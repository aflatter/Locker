/*
*
* Copyright (C) 2011, The Locker Project
* All rights reserved.
*
* Please see the LICENSE file for more information.
*
*/

/*
*
* Data access endpoints.
*
*/

var lfs = require('../../Common/node/lfs.js');
var fs = require('fs');
var dataStore = require('./dataStore.js');

module.exports = function(app, callback) {

dataStore.init(function() {
    
// In adherence with the contact/* provider API
// Returns a list of the current set of contacts (friends and followers)
app.get('/allContacts', function(req, res) {
    dataStore.getAllContacts(function(allContacts) {
        res.writeHead(200, {'content-type' : 'application/json'});
        res.end(JSON.stringify(allContacts));
    });
});

// In adherence with the contact/* provider API
// Returns a list of the current set of contacts (friends and followers)
app.get('/:type/getAll', function(req, res) {
    if(req.params.type == 'followers' || req.params.type == 'friends') {
        dataStore.getPeople(req.params.type, function(err, allPeople) {
            res.writeHead(200, {'content-type' : 'application/json'});
            res.end(JSON.stringify(allPeople));
        });
    }
});

// In adherence with the contact/* provider API
// Returns a list of the current set of contacts (friends and followers)
app.get('/:type/getSince', function(req, res) {
    if(req.params.type == 'followers' || req.params.type == 'friends') {
        var query = {};
        if(req.query.recordID) {
            query.recordID = req.query.recordID;
        } else if(req.query.timeStamp) {
            query.timeStamp = req.query.timeStamp;
        } else {
            //this is just /getAll
            query = {recordID:-1};
        }
        dataStore.getPeople(req.params.type, query, function(err, allPeople) {
            res.writeHead(200, {'content-type' : 'application/json'});
            res.end(JSON.stringify(allPeople));
        });
    }
});

// Reads a list of statuses from disk
function readStatuses(req, res, type) {
    lfs.readObjectsFromFile(type + '.json', function(data) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        data.reverse();
        res.end(JSON.stringify(data));
    });
}

// Returns the person's home timeline
app.get('/get_home_timeline', function(req, res) {
    readStatuses(req, res, 'home_timeline');
});

// Returns the person's mentions
app.get('/get_mentions', function(req, res) {
    readStatuses(req, res, 'mentions');
});

app.get('/get_profile', function(req, res) {
    lfs.readObjectFromFile('userInfo.json', function(userInfo) {
        res.writeHead(200, {"Content-Type":"text/json"});
        res.end(JSON.stringify(userInfo));        
    });
});

callback();

});
};
