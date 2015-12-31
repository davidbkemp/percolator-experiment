var randomItems = require('../randomItems.js');

function createQuery() {
    var query = {};
    addSuburbs(query);
    addFieldRange(query, "Bathrooms");
    addFieldRange(query, "Bedrooms");
    addKeywordsQuery(query);
    return query;
}

function addKeywordsQuery(query) {
    query.query = {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": randomItems.randomPhrase(),
                "type": "phrase",
                "fields": ["title", "description"]
            }},
            {
              "multi_match": {
                "query": randomItems.randomPhrase(),
                "type": "phrase",
                "fields": ["title", "description"]
            }}
          ]
        }
      };
}

function addSuburbs(query) {
    if (Math.random() < 0.01) return;
    var numIds = randomItems.getRandomInt(1, 5);
    query.suburbs = [];
    for (var i = 0; i < numIds; i++) {
        query.suburbs.push(randomItems.randomSuburb())
    }
}

function addFieldRange(query, rangeType) {
    var lower = randomItems.getRandomInt(0, 3);
    var upper = lower + randomItems.getRandomInt(0, 3);
    if (Math.random() < 0.5) query["min" + rangeType] = lower;
    if (Math.random() < 0.5) query["max" + rangeType] = upper;
}

module.exports = {
    "createQuery" : createQuery
};
