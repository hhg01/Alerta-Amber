var config = {
	headers: {},
	timeout: 30000,
	domain: 'http://localhost',
	port: 0
};

var NoCache = 1,
	CacheElseNetwork = 2,
	NetworkElseCache = 4,
	CacheThenNetwork = 8,
	CacheOnly = 16,
	NetworkOnly = 32;

var SDK = module.exports = {
	/*
	 Constants.
	 */
	Policy: {
		/**
		 * No caches are used or saved. This is the default caching policy for models.
		 */
		NoCache: 1,
		/**
		 * If a local cache of the results is available, it will be used; otherwise, the network will be used. Results will
		 * be cached.
		 */
		CacheElseNetwork: 2,
		/**
		 * If the network is available, it will be used for results; otherwise, the local cache will be used. Results will
		 * be cached.
		 */
		NetworkElseCache: 4,
		/**
		 * If a local cache of the result is available, it will be used immediately, and then the network will be used. The
		 * callback will, thus, be called twice. Results will be cached.
		 */
		CacheThenNetwork: 8,
		/**
		 * If a local cache of results is available, it will be used.
		 */
		CacheOnly: 16,
		/**
		 * If the network is available, it will be used for results. Results will be cached.
		 */
		NetworkOnly: 32
	},

	/*
	 Configuration.
	 */
	cachePolicy: {type: NoCache},
	get domain() { return config.domain; },
	set domain(val) { config.domain = val; },
	get port() { return config.port; },
	set port(val) { config.port = val; },
	get timeout() { return config.timeout; },
	set timeout(val) { config.timeout = val; },
	get APIKey() { return config.APIKey; },
	set APIKey(val) {
		config.APIKey = val;
		config.headers.APIKey = val;
	},
	get Authorization() { return config.Authorization; },
	set Authorization(val) {
		if (0 === val.indexOf('Basic ')) {
			config.headers.Authorization = val;
		}
		else if (':' === val.slice(-1)) {
			config.headers.Authorization = 'Basic ' + Ti.Utils.base64encode(val);
		}
		else {
			config.headers.Authorization = 'Basic ' + Ti.Utils.base64encode(val + ':');
		}
	},
	

	/*
	 Utility.
	 */
	parseParentNode: function (data) {
		if (data.key) {
			return data[data.key];
		}
		else {
			return data;
		}
	},
	getDefaultHeaders: function () {
		return config.headers;
	},
	getURL: function (path) {
		var url = config.domain;
		if (config.port && config.port !== 80) {
			url += ':' + config.port;
		}
		url += path;
		return url;
	},

	/**
	 * Turns a url and method in to a hash that can uniquely and securely identify it.
	 */
	getCacheHash: function getCacheHash(method, url) {
		var key = method + ':' + url + '\n';
		// Add headers.
		for (var headerName in config.headers) {
			if (config.headers.hasOwnProperty(headerName)) {
				key += headerName + ':' + config.headers[headerName] + '\n';
			}
		}
		return Ti.Utils.sha256(key);
	},

	/**
	 * Gets the cache db, ensuring it has the proper schema set up.
	 * @returns {Window}
	 */
	getCacheDB: function () {
		if (this.cacheDB) {
			return Ti.Database.open(this.cacheDB);
		}
		this.cacheDB = 'ApiExtravioDeMenorCache';
		var db = Ti.Database.open(this.cacheDB);
		db.execute('CREATE TABLE IF NOT EXISTS cache(hash TEXT PRIMARY KEY, until INTEGER, result BLOB);');
		db.file.setRemoteBackup(false);
		return db;
	},

	/**
	 * Checks the cache to see if results have been cached for the specific request.
	 * @param hash A string that uniquely identifies the request.
	 * @returns The cached results, or undefined.
	 */
	readCache: function (hash) {
		var db = this.getCacheDB();
		db.execute('DELETE FROM cache WHERE until < ?', Date.now());
		var result = db.execute('SELECT result FROM cache WHERE hash = ? LIMIT 1', hash),
			retVal;
		if (result.isValidRow()) {
			retVal = JSON.parse(result.fieldByName('result'));
		}
		result.close();
		db.close();
		return retVal;
	},

	/**
	 *
	 * @param hash
	 * @param duration
	 * @param results
	 */
	writeCache: function (hash, duration, results) {
		var db = this.getCacheDB();
		db.execute('INSERT OR REPLACE INTO cache (hash, until, result) VALUES (?, ?, ?);',
			hash,
			Date.now() + duration,
			JSON.stringify(results));
		db.close();
	},

	appendQuery: function appendQuery(url, query) {
		for (var queryName in query) {
			if (query.hasOwnProperty(queryName)) {
				url += (url.indexOf('?') === -1 ? '?' : '&') + queryName;
				if (query[queryName] !== '') {
					url += '=' + encodeURIComponent(query[queryName]);
				}
			}
		}
		return url;
	},
	constructHTTP: function constructHTTP(method, url, onLoad, onError) {
		var client = Ti.Network.createHTTPClient({
			onload: onLoad,
			onerror: onError,
			timeout: config.timeout
		});
		client.open(method, url);

		// Add headers.
		for (var headerName in config.headers) {
			if (config.headers.hasOwnProperty(headerName)) {
				client.setRequestHeader(headerName, config.headers[headerName]);
			}
		}

		return client;
	}

};
