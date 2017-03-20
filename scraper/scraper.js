var gs = require('github-scraper');
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var jsonfile = require('jsonfile');
var NodeGeocoder = require('node-geocoder');

var options = {
	provider: 'google'
};
var geocoder = NodeGeocoder(options);

var inputFile = 'data/users.csv';
var outputFile = 'scraped_data/data.json';
var users = {"type": "FeatureCollection",
			 "features": []};

// get list of users from csv file
fs.createReadStream(inputFile)
	.pipe(parse({delimiter: ','}))
	.on('data', function(csvrow) {
		var limit = 5;
		// process each user asyncronously
		async.eachSeries(
			csvrow.slice(0,limit - 1),
			function(user, callback) {
				console.log("Processing user: " + user + "...");
				url = user;
				gs(url, function(err, data) {
					//console.log(user + " profile data: \n" + JSON.stringify(data));
					if (typeof data == "object") {
						console.log("--- Broken user profile, skipping.");
						callback();
					} else {
						data = JSON.parse(data);
						if (data.location) {
							// convert location to coordinates
							console.log("--- Converting " + user + "'s location " + data.location + " to coordinates...");
							geocoder.geocode(data.location, function(err, res) {
								console.log("------ Converted " + data.location + " to " + res[0].formattedAddress);
								console.log("------ " + res[0].latitude + " " + res[0].longitude);
								//console.log(res);
								geojson = {};
								geojson.type = "Feature";
								geojson.geometry = {"type": "Point", "coordinates": [res[0].latitude, res[0].longitude]};
								geojson.properties = {"user": user, "language": ""};
								users.features.push(geojson);
								//console.log(data);
								callback();
							});
						} else { //empty location
							console.log("--- No location, skipping.");
							callback();
						}	
					}		
				});
			},
			function done(){
				// called when everything is done
				jsonfile.writeFile(outputFile, users);
			}
		);
	});


/*
var url = val; // github username goes here
*/

