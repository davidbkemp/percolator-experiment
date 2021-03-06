var express = require('express');
var app = express();

var elasticsearch = require('elasticsearch');

var esClient = new elasticsearch.Client({ host: 'localhost:9200' });

var randomlyPercolate = require("./performRandomPercolation").randomlyPercolate(esClient);

app.get('/', function (req, res) {
    randomlyPercolate()
        .then(
            function (data) {handlePercolationResponse(data, req, res);},
            function(err) {console.error("Oh Noes...", err);}
        );

});

function handlePercolationResponse(data, req, res) {

    function addResponseHitsToTotal(total, response) {
        return total + response.total;
    }

    var matchCount = data.responses.reduce(addResponseHitsToTotal, 0);
    res.send('Match count: ' + matchCount);
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});