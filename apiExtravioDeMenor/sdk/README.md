# Welcome
Welcome to your new Alloy SDK!


## Installation
To use this SDK, you should copy the ApiExtravioDeMenor directory in its entirety in to the appropriate place within your Alloy project.


## Usage
Once you have it installed, you can require your main SDK file to get models, endpoints, and change configuration at runtime:

    var ApiExtravioDeMenor = require('ApiExtravioDeMenor');
    ApiExtravioDeMenor.port = 8080;
    // ApiExtravioDeMenor.domain = 'http://your.domain.com';
    // Basic Auth.
    ApiExtravioDeMenor.Authorization = 'X0DW44oD7qld21Rt2oqAxgBNoc2cJ7b4';
    // Production Basic Auth.
    ApiExtravioDeMenor.Authorization = '1YJPTW2nigEcdhFMcxckE46CdTB0+eDd';
    // Development Basic Auth.
    ApiExtravioDeMenor.Authorization = 'X0DW44oD7qld21Rt2oqAxgBNoc2cJ7b4';
    // ApiExtravioDeMenor.timeout = 30000;
    
    var users = Alloy.createCollection('User');
    
    // Standard Backbone methods are available:
    users.fetch({
        success: function () {
            console.log(users.at(0).toJSON());
        }
    });
    
    // Or, you can use ApiExtravioDeMenor methods:
    // (Note that they don't manipulate the Backbone model/collection)
    users.findAll(function (err, results, client) {
        console.log(results[1]);
    });



## Caching
The client SDK can cache GET results for quick retrieval later using various strategies. By default, it doesn't do
any caching. But you can change that very easily:

    // For everything:
    var ApiExtravioDeMenor = require('ApiExtravioDeMenor');
    ApiExtravioDeMenor.cachePolicy = {
    	type: ApiExtravioDeMenor.Policy.CacheElseNetwork, // Use cached results right away if we can.
    	duration: 60 * 60 * 1000 // Cache for one hour (in milliseconds)
    };
    
    // For an ApiExtravioDeMenor model:
    var users = Alloy.createCollection('User');
    users.cachePolicy = ...;
    
    // For a particular ApiExtravioDeMenor method:
    users.findAll(function(err, results, client) {}, { cachePolicy: ... });

There are multiple strategies available:

### NoCache
No caches are used or saved. This is the default caching policy.

### CacheElseNetwork
If a local cache of the results is available, it will be used; otherwise, the network will be used. Results will
be cached.

### NetworkElseCache
If the network is available, it will be used for results; otherwise, the local cache will be used. Results will
be cached.

### CacheThenNetwork
If a local cache of the result is available, it will be used immediately, and then the network will be used. The
callback will, thus, be called twice. Results will be cached.
### CacheOnly
If a local cache of results is available, it will be used.

### NetworkOnly
If the network is available, it will be used for results. Results will be cached.
