var commandLineArgs = require('command-line-args');
 
var cli = commandLineArgs([
  { name: 'numdocs', alias: 'n', type: Number, defaultValue: 1000000 }
]);

var options = cli.parse();
var numDocs = options.numdocs;
console.log("Registering " + numDocs + " queries.");

var registerQueries = require("./registerQueries").registerQueries;

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({ host: 'localhost:9200' });

var ensureIndex = require("./ensureIndex").ensureIndex(client);

ensureIndex
  .then(function() {return registerQueries(client, numDocs);})
  .then(function() {return client.indices.optimize({index: 'perco'});})
  .then(function() {
    console.log("done");
  }, function(err) {
    console.log("Oh Noes..", err);
  });
