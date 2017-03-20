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

function mode(array) {
    if (array.length == 0)
        return null;

    var modeMap = {},
        maxEl = array[0],
        maxCount = 1;

    for(var i = 0; i < array.length; i++) {
        var el = array[i];

        if (modeMap[el] == null) {
            modeMap[el] = 1;
        } else {
            modeMap[el]++;
        }

        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        } else if (modeMap[el] == maxCount) {
        	// tie
            maxEl += '&' + el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

// how many users to scrape through
var limit = 5;

// get list of users from csv file
fs.createReadStream(inputFile)
	.pipe(parse({delimiter: ','}))
	.on('data', function(csvrow) {
		// process each user asyncronously
		async.eachSeries(
			csvrow.slice(0,limit - 1),
			//csvrow,
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
								if (res.length > 0) {
									console.log("------ Converted " + data.location + " to " + res[0].formattedAddress);
									console.log("------ " + res[0].latitude + " " + res[0].longitude);
									//console.log(res);
									geojson = {};
									geojson.type = "Feature";
									geojson.geometry = {"type": "Point", "coordinates": [res[0].latitude, res[0].longitude]};
									
									// get languages used
									console.log("--- Getting most language most used by " + user + "...");
									url = user + '?tab=repositories';
									var langs = [];
									gs(url, function(err, data) {
										//console.log(data);
										for (var i = 0; i < data.entries.length; i++) {
											//console.log(data.entries[i].lang);
											langs.push(data.entries[i].lang);
										}
										//console.log(langs);
										var mostUsed = mode(langs);
										console.log("------ Most used language: " + mostUsed);
										geojson.properties = {"user": user, "language": mostUsed};
										
										users.features.push(geojson);
										callback();
									});
								} else {
									console.log("--- Invalid location, skipping");
						  			callback();
								}
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
				console.log("Number of users scraped: " + users.features.length)
				jsonfile.writeFile(outputFile, users);
			}
		);
	});

