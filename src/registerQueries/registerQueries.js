var createQuery = require("./createQueries").createQuery;

function registerQueries(esClient, numQueries, batchSize) {

    function run(seq) {
        var batchPromise = registerQuery(seq, createBatch(seq));
        seq = seq + batchSize;
        if (seq >= numQueries) return batchPromise;
        return batchPromise.then(function () {
            return run(seq);
        });
    }

    function createBatch(offset) {
        var batch = [];
        for (var i = 0; i < batchSize; i++) {
            var id = "saved-search-" + (i + offset);
            batch.push({ index:  { _id: id } });
            batch.push(createQuery());

        }
        return batch;
    }

    function registerQuery(seq, batch) {
        return esClient.bulk({
            index: 'perco',
            type: '.percolator',
            body: batch
        });
    }


    return run(0);
}


module.exports = {
    "registerQueries": registerQueries
};