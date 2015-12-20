var registerQueries = require("./registerQueries").registerQueries;

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({ host: 'localhost:9200' });

registerQueries(client, 1000, 200).then(function() {
    console.log("done");
}, function(err) {
    console.log("Oh Noes..", err);
});