var q = require('q');
var fs = require('fs');
var readFile = q.nfBind(fs.readFile);

function ensureIndex(client) {
  function deleteIfTrue(exists) {
    if (exists) {
      console.log("Index exists");
      return client.indices.delete({index: "perco"})
        .then(waitForGreen);
    } else {
      console.log("Index doesn't exist");
      return waitForGreen();
    }
  }

  function readSettings() {
    return readFile('file', 'utf-8');
  }

  function createIndexWithSettings(body) {
    return client.indices.create({
      index: "perco",
      body: body
    });
  }

  function createIndex() {
    console.log("creating index");
    return readSettings().
      then(createIndexWithSettings)
      .then(waitForGreenIndex);
  }

  function waitForGreen() {
    return client.cluster.health({waitForStatus: "green"});
  }

  function waitForGreenIndex() {
    return client.cluster.health({index: "perco", waitForStatus: "green"});
  }

  return client.indices.exists({index: "perco"})
    .then(deleteIfTrue)
    .then(createIndex);
}

module.exports = {
  ensureIndex: ensureIndex
}

