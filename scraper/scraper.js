var gs = require('github-scraper');
var fs = require('fs');
var parse = require('csv-parse');
//var async = require('async');

// get list of users from csv file
var inputFile = 'data/users.csv';
var csvData = [];
fs.createReadStream(inputFile)
	.pipe(parse({delimiter: ','}))
	.on('data', function(csvrow) {
		//for (var i = 0; i < csvrow.length - 1; i++) {
		for (var i = 0; i < 10; i++) {
			userProfile(csvrow[i]);
		}
	});

function userProfile(user) {
	console.log("Processing user: " + user + "...");
	url = user;
	gs(url, function(err, data) {
		console.log(user + " profile data: \n" + data);
	});
}
/*
var url = val; // github username goes here
*/

