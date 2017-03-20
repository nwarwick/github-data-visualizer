var gs = require('github-scraper');
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var jsonfile = require('jsonfile');

var inputFile = 'data/users.csv';
var outputFile = 'scraped_data/data.json'
var data = {}
users = []

// get list of users from csv file
fs.createReadStream(inputFile)
	.pipe(parse({delimiter: ','}))
	.on('data', function(csvrow) {
		// process each user asyncronously
		async.eachSeries(csvrow, function userProfile(user, callback) {
			console.log("Processing user: " + user + "...");
			url = user;
			if (url === "errfree") {
				callback();
				// don't have time to make a betterworkaround
			}
			gs(url, function(err, data) {
				//console.log(user + " profile data: \n" + data);
				data = JSON.parse(data);
				if (data.location) {
					users.push(data);
					console.log(data);
					callback();
				} else { //empty location
					console.log("--- No location, skipping.");
					callback();
				}	
			});
		});
	});


/*
var url = val; // github username goes here
*/

