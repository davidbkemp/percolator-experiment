var randomItems = require('../randomItems.js');

var batchSize = 10;

function randomlyPercolate(esClient) {
    return function () {
        return esClient.mpercolate({
            index: 'perco',
            type: '.percolator',
            body: createPercolationBatch()
        });
    }
}


function createPercolationBatch() {
    var batch = [];
    for (var i = 0; i < batchSize; i++) {
        batch.push({"percolate" : {}});
        batch.push({"percolate" : randomPercolation()});
    }
    return batch;
}

function randomPercolation() {
    var suburb = randomItems.randomSuburb();
    var title = randomItems.randomPhrase();
    var description = randomItems.randomPhrase() + " " + randomItems.randomPhrase();
    var bathrooms = randomItems.getRandomInt(0, 6);
    var bedrooms = randomItems.getRandomInt(0, 6);
    return {
      "doc": {
        "title": title,
        "description": description
      },
      "filter": {
        "bool": {
           "must_not": [
            {"range": {"minBathrooms": {"gt": bathrooms}}},
            {"range": {"maxBathrooms": {"lt": bathrooms}}},
            {"range": {"minBedrooms": {"gt": bedrooms}}},
            {"range": {"maxBedrooms": {"lt": bedrooms}}}
            ],
         "filter": {
           "bool":{
             "should":[
               {"term": {"suburbs": suburb}},
               {"missing": {"field": "suburbs"}}
            ]}}
        }
      }
    }
}



module.exports = {
    "randomlyPercolate" : randomlyPercolate
};
