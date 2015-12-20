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
    var bathRooms = randomItems.getRandomInt(0, 6);
    var bedRooms = randomItems.getRandomInt(0, 6);
    return {
      "doc": {
        "title": title,
        "description": description
      },
      "filter": {
        "bool": {
           "must_not": [
            {"range": {"minBathRooms": {"gt": bathRooms}}},
            {"range": {"maxBathRooms": {"lt": bathRooms}}},
            {"range": {"minBedRooms": {"gt": bedRooms}}},
            {"range": {"maxBedRooms": {"lt": bedRooms}}}
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