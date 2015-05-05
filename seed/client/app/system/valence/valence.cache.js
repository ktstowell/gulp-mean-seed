'use strict';

/***********************************************************************************************************************************************
 * VALENCE CACHE
 ***********************************************************************************************************************************************
 * @description
 */
angular.module('Valence')
  .service('Valence.Cache', ['$q', function($q) {

    //
    // CACHE NAMESPACE
    //------------------------------------------------------------------------------------------//
    // @description
    var Cache = window.Valence.Cache = {__cache__: {}};

    //
    // CACHE VALIDATION
    //------------------------------------------------------------------------------------------//
    // @description

    /**
     * Validate
     *
     * @param cache
     * @returns {*}
     */
    Cache.validate = function(cache) {
      var def = $q.defer();
      var failed = [];

      if(cache && cache.data) {
        for(var option in cache.config) {
          var validator = Cache.validators[option];

          if(validator) {
            if(!validator(cache)) {
              failed.push(validator.error(cache));
              // Logging for he purpose of demos.
              console.log(failed);
            }
          }
        }

        if(failed.length) {
          def.reject(failed);
        } else {
          def.resolve();
        }
      } else {
        def.reject(Cache.validators.empty);
      }

      return def.promise;
    };

    //
    // VALIDATORS
    //------------------------------------------------------------------------------------------//
    // @description
    Cache.validators = {};

    /**
     * Empty
     *
     * returns when no cache exists.
     * @type {string}
     */
    Cache.validators.empty = 'Requested cache not found';

    /**
     * Expires
     *
     * returns false if the current time minus the last modified time is greater than the cache onfig
     * @param cache
     * @returns {boolean}
     */
    Cache.validators.expires = function(cache) {
      console.log((Date.now() - (cache.__meta__.updated || cache.__meta__.added)), cache.config.expires);
      return !((Date.now() - (cache.__meta__.updated || cache.__meta__.added)) >= cache.config.expires);
    };

    /**
     * Expires error.
     *
     * @param cache
     * @returns {string}
     */
    Cache.validators.expires.error = function(cache) { return 'Cache for: '+ cache.name +' is stale. Please refresh.'}

    Cache.defaults = {
      expires: 0
    };

    //
    // CACHE CRUD
    //------------------------------------------------------------------------------------------//
    // @description

    /**
     * Add
     *
     * @param url
     * @param config
     */
    Cache.add = function(url, config) {
      this.__cache__[url] = {__meta__: {added: Date.now()}, config: _.merge(Cache.defaults, config), name: url};
    };

    /**
     * Remove
     *
     * @param url
     * @param config
     */
    Cache.remove = function(url, config) {
      delete this.__cache__[url];
    };

    /**
     * Get
     *
     * @param url
     * @returns {*}
     */
    Cache.get = function(url) {
      var def = $q.defer();
      var cache = this.__cache__[url];

      this.validate(cache).then(function() {
        def.resolve(cache.data);
      }, function(err) {
        def.reject(err);
      });

      return def.promise;
    };

    Cache.set = function(url, data) {
      var def = $q.defer();
      var cache = this.__cache__[url];

      if(cache) {
        // Set data
        cache.data = data;
        // Set updated
        cache.__meta__.updated = Date.now();
        // Resolve data;
        def.resolve(cache.data);
      } else {
        def.reject('Cache not found');
      }

      return def.promise;
    };

    return Cache;
  }]);