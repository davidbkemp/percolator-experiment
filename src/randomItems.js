

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

function randomSuburb() {
    return "suburb" + getRandomInt(1, 10000);
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
    "randomPhrase" : randomPhrase,
    "randomSuburb" : randomSuburb,
    "getRandomInt" : getRandomInt
};
