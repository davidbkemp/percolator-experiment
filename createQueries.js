
function createQuery() {
    var query = {};
    addSuburbs(query);
    addFieldRange(query, "BathRooms");
    addFieldRange(query, "BedRooms");
    addKeywordsQuery(query);
    return query;
}

function addKeywordsQuery(query) {
    query.query = {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": randomPhrase(),
                "type": "phrase",
                "fields": ["title", "description"]
            }},
            {
              "multi_match": {
                "query": randomPhrase(),
                "type": "phrase",
                "fields": ["title", "description"]
            }}
          ]
        }
      };
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

function randomPhrase() {
    return phrases[getRandomInt(0, phrases.length - 1)];
}

function addSuburbs(query) {
    if (Math.random() < 0.01) return;
    var numIds = getRandomInt(1, 5);
    query.suburbs = [];
    for (var i = 0; i < numIds; i++) {
        query.suburbs.push(randomSuburb())
    }
}

function addFieldRange(query, rangeType) {
    var lower = getRandomInt(0, 3);
    var upper = lower + getRandomInt(0, 3);
    if (Math.random() < 0.5) query["min" + rangeType] = lower;
    if (Math.random() < 0.5) query["max" + rangeType] = upper;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomSuburb() {
    return "suburb" + getRandomInt(1, 16000);
}

module.exports = {
    "createQuery" : createQuery
};