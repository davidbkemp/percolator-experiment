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

  function createIndex() {
    console.log("creating index");
    return client.indices.create({index: "perco"})
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

