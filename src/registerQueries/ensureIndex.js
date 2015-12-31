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

  function indexSettings() {
    return {
      index: "perco",
      body: {
        settings: {
          "number_of_shards": 1,
          "number_of_replicas": 0
        }
      }
    };
  }

  function createIndex() {
    console.log("creating index");
    return client.indices.create(indexSettings())
      .then(waitForGreen);
  }

  function waitForGreen() {
    return client.cluster.health({waitForStatus: "green"});
  }

  return client.indices.exists({index: "perco"})
    .then(deleteIfTrue)
    .then(createIndex);
}

module.exports = {
  ensureIndex: ensureIndex
}

