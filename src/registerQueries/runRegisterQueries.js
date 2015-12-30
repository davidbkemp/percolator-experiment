var registerQueries = require("./registerQueries").registerQueries;

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({ host: 'localhost:9200' });

var ensureIndex = require("./ensureIndex").ensureIndex(client);

ensureIndex
  .then(function() {return registerQueries(client, 1000, 200)})
  .then(function() {
    console.log("done");
  }, function(err) {
    console.log("Oh Noes..", err);
  });
