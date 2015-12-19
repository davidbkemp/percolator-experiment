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

var phrases = [
    "gas cooking",
    "investment",
    "siwmming pool",
    "electric cooking",
    "gas heating",
    "electric heating",
    "garage",
    "garden",
    "air conditioning",
    "multi-story"
];


function randomPercolation() {
    var suburb = randomSuburb();
    var title = randomPhrase();
    var description = randomPhrase() + " " + randomPhrase();
    var bathRooms = getRandomInt(0, 6);
    var bedRooms = getRandomInt(0, 6);
    return {
      "doc": {
        "title": title,
        "description": description
      },
      "filter": {
        "bool": {
           "must_not": [
            {"range": {"minBathrooms": {"gt": bathRooms}}},
            {"range": {"maxBathrooms": {"lt": bathRooms}}},
            {"range": {"minBedrooms": {"gt": bedRooms}}},
            {"range": {"maxBedrooms": {"lt": bedRooms}}}
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


function randomPhrase() {
    return phrases[getRandomInt(0, phrases.length - 1)];
}


function randomSuburb() {
    return "suburb" + getRandomInt(1, 16000);
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


module.exports = {
    "randomlyPercolate" : randomlyPercolate
};