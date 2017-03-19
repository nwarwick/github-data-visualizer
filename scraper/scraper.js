var gs = require('github-scraper');

process.argv.forEach(function (val, index, array) {
	if (index > 1) {
		var url = val; // github username goes here
		gs(url, function(err, data) {
			console.log(data);
		});
	}
});

