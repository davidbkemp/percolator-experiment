var createQuery = require("./createQueries").createQuery;

function registerQueries(esClient, numQueries, batchSize) {

    function run(seq) {
        var queryCreationPromise = registerQuery(seq, createQuery());
        seq = seq + 1;
        if (seq >= numQueries) return queryCreationPromise;
        return queryCreationPromise.then(function () {
            return run(seq);
        });
    }

    function registerQuery(seq, query) {
        console.log("registering query", JSON.stringify(query));
        return esClient.index({
            id: "saved-search-" + seq,
            index: 'perco',
            type: '.percolator',
            body: query
        });
    }


    return run(0);
}


module.exports = {
    "registerQueries": registerQueries
};