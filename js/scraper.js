var gs = require('github-scraper');
var url = 'james-gray'; // github username goes here
gs(url, function(err, data) {
	console.log(data);
});