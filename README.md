# percolator-experiment

Code to simulate the use of Elasticsearch percolators to implement saved-search notifications.

Uses entirely randomly generated synthetic data.

## Prerequisites

- Elasticsearch 2.x
- Node 4.x

## Usage

- Make sure you give ELasticsearch at least 4G of heap (the percolators are all kept in memory).
- `npm run-script registerQueries -- -n 1000000` (registers 1000000 queries and can take several minutes to run).
- `npm run-script percolatorServer` (starts a little web server)
- Point your browser at http://localhost:3000

The percolator-server submits a batch of 10 randomly generated percolator queries
and responds with the total matches for the 10 queries.
With 1 million registered queries, you should typically get about 5000 matches.
i.e. 500 matches per query.

On my ancient mac-mini, after a few warm-up requests,
I am getting response times under 500ms for
batches of 10 percolator queries against
1 million registered queries.
And so I am getting under 50ms per query.

## More notes

See perco.json to get an idea of the expected structure of the registered queries.

A typical registered query for a saved search looks like this:

```
         {
            "_index": "perco",
            "_type": ".percolator",
            "_id": "saved-search-1",
            "_score": 1,
            "_source": {
               "suburbs": [
                  "suburb654",
                  "suburb9874",
                  "suburb1478",
                  "suburb2196"
               ],
               "minBathrooms": 2,
               "minBedrooms": 2,
               "maxBedrooms": 3,
               "query": {
                  "bool": {
                     "must": [
                        {
                           "multi_match": {
                              "query": "electric heating",
                              "type": "phrase",
                              "fields": [ "title", "description" ]
                           }
                        },
                        {
                           "multi_match": {
                              "query": "siwmming pool",
                              "type": "phrase",
                              "fields": [ "title", "description"]
                           }
                        }
                     ]
                  }
               }
            }
         }
```

A typical percolation request for a new "listing"
in suburb6348,
with one bathroom, two bedrooms,
a title of "electric heating"
and a description of "garden gas cooking"
looks like this:

```
{
  "percolate": {
    "doc": {
      "title": "electric heating",
      "description": "garden gas cooking"
    },
    "filter": {
      "bool": {
        "must_not": [
          { "range": { "minBathrooms": { "gt": 1}}},
          { "range": { "maxBathrooms": { "lt": 1}}},
          { "range": { "minBedrooms": { "gt": 2}}},
          { "range": { "maxBedrooms": { "lt": 2}}}
        ],
        "filter": {
          "bool": {
            "should": [
              { "term": { "suburbs": "suburb6348"}},
              { "missing": { "field": "suburbs"}}
            ]
          }
        }
      }
    }
  }
}

```

Note the double-negative nature of the bedroom & bathroom filters.
This is so that the percolator request will match registered queries that have no specified values for these.
I could have alternatively used the "missing field" query like I do in the suburbs filter.

## Caveats

- This is completely synthetic data and highly unlikely to reflect the data distribution of real queries and listings.

- The range of keyword queries and different listing titles & descriptions is artificially small.
I doubt it will make much difference to the results,
but I should add at least a couple of hundred different phrases to the phrases list,
and increase the number of phrases used in the title and description fields of the listings.
