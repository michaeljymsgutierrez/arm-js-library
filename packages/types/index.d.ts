declare module "arm-js-library" {
    export { ApiResourceManager as default };
    class ApiResourceManager {
        /**
         * Creates a new instance of the class.
         *
         * @param {Object[]} collections - An optional array of collections to initialize. Defaults to an empty array.
         */
        constructor(collections?: any[]);
        namespace: string;
        host: any;
        collections: {};
        aliases: {};
        requestHashes: {};
        rootScope: {};
        payloadIncludedReference: string;
        /**
         * Initializes the Axios configuration with the base URL.
         *
         * Sets the `baseURL` property in the Axios defaults to the value
         * returned by the `_getBaseURL()` method. This ensures that all
         * Axios requests use the correct base URL for the API.
         *
         * @private
         */
        private _initializeAxiosConfig;
        /**
         * Initializes a collection of collections with optional default values.
         *
         * Iterates through the provided array of `collections` and calls the
         * `_addCollection` method for each collection name, initializing it
         * with an empty array (`[]`) as the default value.
         *
         * @private
         * @param {string[]} collections - An array of collection names to initialize.
         */
        private _initializeCollections;
        /**
         * Gets the base URL for API requests.
         *
         * Constructs the base URL by combining the `host` and `namespace`
         * properties of the instance.
         *
         * @private
         * @returns {string} The base URL constructed from `host` and `namespace`.
         */
        private _getBaseURL;
        /**
         * Checks if a collection exists in the current instance.
         *
         * This method verifies if a collection with the given `collectionName`
         * exists in the `collections` object of the `ApiResourceManager` instance.
         *
         * @private
         * @param {string} collectionName - The name of the collection to check.
         * @throws {Error} If the collection does not exist.
         */
        private _isCollectionExisting;
        /**
         * Adds a collection to the current instance.
         *
         * This method adds a new collection with the specified `collectionName`
         * to the `collections` object of the `ApiResourceManager`. The
         * `collectionRecords` array is used to initialize the collection's data.
         *
         * @private
         * @param {string} collectionName - The name of the collection to add.
         * @param {Array} collectionRecords - The initial records for the collection.
         */
        private _addCollection;
        /**
         * Adds an alias to the aliases object.
         *
         * This method creates an alias for a collection or a single record.
         * The `aliasName` specifies the name of the alias, and `aliasRecords`
         * can be either an array of records (for a collection alias) or a
         * single record object.
         *
         * If `aliasRecords` is an array, it's used directly (or an empty array
         * if `aliasRecords` is falsy). If it's a plain object, it's used directly
         * (or an empty object if `aliasRecords` is falsy).
         *
         * @private
         * @param {string} aliasName - The name of the alias.
         * @param {Array|Object} aliasRecords - The records to be aliased.
         */
        private _addAlias;
        /**
         * Generates a hash ID based on the provided object.
         *
         * This method generates a unique hash ID by stringifying the given
         * `object` and then calculating its MD5 hash using the `md5` library.
         * If no `object` is provided, it defaults to an object with an
         * `id` property generated using `uuidv1()`.
         *
         * @private
         * @param {Object} [object={ id: uuidv1() }] - The object to generate the hash ID from.
         * @returns {string} The generated hash ID.
         */
        private _generateHashId;
        /**
         * Sets multiple properties on a target object recursively.
         *
         * This method iterates through the `keyValuePairs` object and sets the
         * corresponding properties on the `targetObject`. It handles nested
         * objects by recursively calling itself with an updated `prefix`.
         *
         * @private
         * @param {Object} targetObject - The object on which to set the properties.
         * @param {Object} keyValuePairs - An object containing key-value pairs to set.
         */
        private _setProperties;
        /**
         * Gets a property from the current record.
         *
         * This method retrieves the value of a property with the given `key`
         * from the current record object (`this`). It uses Lodash's `get`
         * function (aliased as `getProperty`) to access the property.
         *
         * @private
         * @param {string} key - The key of the property to retrieve.
         * @returns {*} The value of the property.
         */
        private _getRecordProperty;
        /**
         * Sets a single property on the current record and updates its state
         * based on changes.
         *
         * This method sets the property with the given `key` to the specified
         * `value` on the current record object (`this`). It then checks if the
         * record has been modified by comparing it with the `originalRecord`.
         * If changes are detected, it updates the `isDirty` and `isPristine`
         * flags accordingly.
         *
         * @private
         * @param {string} key - The property key to set.
         * @param {*} value - The value to set for the property.
         */
        private _setRecordProperty;
        /**
         * Sets multiple properties on the current record and updates its state
         * based on changes.
         *
         * This method sets multiple properties on the current record object
         * (`this`) using the provided `values` object. It then compares the
         * updated record with the `originalRecord` to detect any modifications.
         * If the record has been changed, it updates the `isDirty` and
         * `isPristine` flags.
         *
         * @private
         * @param {Object} values - An object containing key-value pairs to set
         *                          on the record.
         */
        private _setRecordProperties;
        /**
         * Sorts an array of records based on specified properties and sort orders.
         *
         * This method sorts the `currentRecords` array using the provided
         * `sortProperties`. Each `sortProperty` should be a string in the
         * format "property:order", where "property" is the name of the property
         * to sort by and "order" is either "asc" (ascending) or "desc"
         * (descending).
         *
         * @private
         * @param {Array} currentRecords - The array of records to sort.
         * @param {Array<string>} [sortProperties=[]] - An array of sort properties.
         * @returns {Array} The sorted array of records.
         */
        private _sortRecordsBy;
        /**
         * Removes a record from a specified collection based on its hash ID.
         *
         * This method removes a `collectionRecord` from its corresponding
         * collection in the `collections` object. It determines the collection
         * using the record's `collectionName` property and finds the record's
         * index within the collection using its `hashId`. If the record is
         * found, it's removed from the collection using Lodash's `pullAt`.
         *
         * @private
         * @param {Object} collectionRecord - The record to be removed from
         *                                   the collection.
         */
        private _unloadFromCollection;
        /**
         * Removes a record from all request hashes based on its hash ID.
         *
         * This method iterates through all request hashes in the `requestHashes`
         * object and removes any occurrences of the `collectionRecord` based on
         * its `hashId`. It handles both array-based and object-based request
         * hash data.
         *
         * @private
         * @param {Object} collectionRecord - The record to be removed from
         *                                   request hashes.
         */
        private _unloadFromRequestHashes;
        /**
         * Removes a record from all aliases based on its hash ID.
         *
         * This method iterates through all aliases in the `aliases` object
         * and removes any occurrences of the `collectionRecord` based on its
         * `hashId`. It handles both array-based and object-based alias data.
         *
         * @private
         * @param {Object} collectionRecord - The record to be removed from aliases.
         */
        private _unloadFromAliases;
        /**
         * Unloads a record from the collection, request hashes, and aliases.
         *
         * This method removes a `currentRecord` from all relevant data stores
         * within the `ApiResourceManager`:
         *  - The main collection where the record belongs.
         *  - Any request hashes where the record might be present.
         *  - Any aliases that refer to the record.
         *
         * @param {Object} currentRecord - The record to be unloaded.
         */
        unloadRecord(currentRecord: any): void;
        /**
         * Saves a record to the server.
         *
         * This method saves the `currentRecord` to the server by making an API
         * request. It determines whether to use a PUT (update) or POST (create)
         * request based on the validity of the record's `id`. The `collectionConfig`
         * parameter can be used to provide additional configuration for the
         * request.
         *
         * @private
         * @param {Object} currentRecord - The record to be saved.
         * @param {Object} [collectionConfig={}] - Optional configuration for the
         *                                        save request.
         * @returns {Promise} A Promise that resolves when the save is successful
         *                    or rejects with an error.
         */
        private _saveRecord;
        /**
         * Deletes a record from the server.
         *
         * This method deletes the `currentRecord` from the server by making
         * a DELETE API request. The `collectionConfig` parameter can be used
         * to provide additional configuration for the request.
         *
         * @private
         * @param {Object} currentRecord - The record to be deleted.
         * @param {Object} [collectionConfig={}] - Optional configuration for the
         *                                        delete request.
         * @returns {Promise} A Promise that resolves when the deletion is
         *                    successful or rejects with an error.
         */
        private _deleteRecord;
        /**
         * Reloads a record from the server.
         *
         * This method reloads the `currentRecord` from the server by making
         * a GET API request. It fetches the latest data for the record and
         * updates the local copy.
         *
         * @private
         * @param {Object} currentRecord - The record to be reloaded.
         * @returns {Promise} A Promise that resolves with the updated record
         *                    or rejects with an error.
         */
        private _reloadRecord;
        /**
         * Retrieves records from a specified collection based on given criteria.
         *
         * This method retrieves records from the collection with the specified
         * `collectionName`, potentially fetching them asynchronously if needed.
         * It uses the `collectionConfig` to determine how to filter, sort,
         * and retrieve the records.
         *
         * The `currentRecord` is used to extract related records based on the
         * `referenceKey` provided in the `collectionConfig`. If the related
         * records are not already in the local collection and `async` is true
         * in the `collectionConfig`, it initiates an asynchronous request to
         * fetch them.
         *
         * @private
         * @param {string} collectionName - The name of the collection.
         * @param {Object} [collectionConfig={}] - Configuration for retrieving
         *                                        the records.
         * @param {Object|Array} currentRecord - The record containing potential
         *                                       related records.
         * @returns {Object|Array} The retrieved records (single object or array).
         */
        private _getCollectionRecord;
        /**
         * Injects action methods into a collection record.
         *
         * This method adds predefined action methods to a `collectionRecord`.
         * These methods provide convenient ways to interact with the record,
         * such as getting and setting properties, saving, deleting, reloading,
         * and retrieving related collections.
         *
         * @private
         * @param {Object} collectionRecord - The collection record to inject
         *                                   actions into.
         */
        private _injectCollectionActions;
        /**
         * Injects reference keys into a collection record.
         *
         * This method adds essential reference keys to a `collectionRecord`,
         * including:
         *  - `collectionName`: The name of the collection the record belongs to.
         *  - `hashId`: A unique hash ID generated for the record.
         *  - `isLoading`, `isError`, `isPristine`, `isDirty`: Flags to track
         *     the record's state.
         *  - `originalRecord`: A copy of the original record data for change
         *     tracking.
         *
         * @private
         * @param {string} collectionName - The name of the collection.
         * @param {Object} collectionRecord - The collection record to inject keys into.
         * @param {string} [collectionRecordHashId=null] - Optional pre-generated
         *                                                 hash ID for the record.
         */
        private _injectCollectionReferenceKeys;
        /**
         * Pushes records to a specified collection.
         *
         * This method adds or updates records in the collection with the given
         * `collectionName`. The `collectionRecords` can be either an array of
         * records or a single record object.
         *
         * If `collectionRecords` is an array, it iterates through the records
         * and adds them to the collection if they don't already exist. If a
         * record with the same `hashId` already exists, it updates the existing
         * record with the new data.
         *
         * If `collectionRecords` is a single object, it adds it to the collection
         * if it doesn't exist or updates the existing record if it has the same
         * `hashId`.
         *
         * @private
         * @param {string} collectionName - The name of the collection to push
         *                                 records to.
         * @param {Array|Object} collectionRecords - The records to be pushed.
         * @returns {Array|Object} The pushed records (array or single object).
         */
        private _pushToCollection;
        /**
         * Pushes records to specified aliases.
         *
         * This method updates aliases in the `aliases` object with the provided
         * `collectionRecords`. It handles both array-based and object-based
         * aliases.
         *
         * If an alias refers to an array of records, the method iterates through
         * the `collectionRecords` and updates any matching records within the
         * alias array based on their `hashId`.
         *
         * If an alias refers to a single record object, the method updates the
         * alias with the matching `collectionRecord` based on its `hashId`.
         *
         * @private
         * @param {Array|Object} collectionRecords - The records to be pushed to
         *                                          aliases.
         */
        private _pushToAliases;
        /**
         * Pushes records to specified request hashes.
         *
         * This method updates request hashes in the `requestHashes` object with
         * the provided `collectionRecords`. It handles both array-based and
         * object-based request hash data.
         *
         * If a request hash's `data` property is an array, the method iterates
         * through the `collectionRecords` and updates any matching records
         * within the `data` array based on their `hashId`.
         *
         * If a request hash's `data` property is a single record object, the
         * method updates the `data` with the matching `collectionRecord` based
         * on its `hashId`.
         *
         * @private
         * @param {Array|Object} collectionRecords - The records to be pushed to
         *                                          request hashes.
         */
        private _pushToRequestHashes;
        /**
         * Pushes records to a collection, aliases, and request hashes.
         *
         * This method orchestrates the process of adding or updating records
         * in various data stores within the `ApiResourceManager`. It takes a
         * `collectionName` and `collectionRecords` (which can be an array or
         * a single object) and performs the following actions:
         *
         * 1. Checks if the specified collection exists.
         * 2. Pushes the records to the collection using `_pushToCollection`.
         * 3. Updates any relevant aliases using `_pushToAliases`.
         * 4. Updates any relevant request hashes using `_pushToRequestHashes`.
         *
         * @private
         * @param {string} collectionName - The name of the collection.
         * @param {Array|Object} collectionRecords - The records to be pushed.
         * @returns {Array|Object} The updated collection records.
         */
        private _pushPayload;
        /**
         * Pushes records to a collection, aliases, and request hashes.
         *
         * This method orchestrates the process of adding or updating records
         * in various data stores within the `ApiResourceManager`. It takes a
         * `collectionName` and `collectionRecords` (which can be an array or
         * a single object) and performs the following actions:
         *
         * 1. Checks if the specified collection exists.
         * 2. Pushes the records to the collection using `_pushToCollection`.
         * 3. Updates any relevant aliases using `_pushToAliases`.
         * 4. Updates any relevant request hashes using `_pushToRequestHashes`.
         *
         * @param {string} collectionName - The name of the collection.
         * @param {Array|Object} collectionRecords - The records to be pushed.
         * @returns {Array|Object} The updated collection records.
         */
        pushPayload(collectionName: string, collectionRecords: any[] | any): any[] | any;
        /**
         * Pushes a request and its corresponding response to the request hash store.
         *
         * This method adds or updates a request hash in the `requestHashes` object.
         * It generates a unique `requestHashKey` using the `_generateHashId`
         * method based on the `requestObject`.
         *
         * If a request hash with the same key already exists and the `responseObject`
         * is marked as `isNew`, it updates the existing hash's `isNew` flag to
         * `false`. Otherwise, it adds a new request hash with the given key and
         * `responseObject`.
         *
         * @private
         * @param {Object} requestObject - The request object used to generate the
         *                                 hash key.
         * @param {Object} responseObject - The response object associated with
         *                                  the request.
         * @returns {Object} The updated or created request hash object.
         */
        private _pushRequestHash;
        /**
         * Sets the host URL for the client and initializes the Axios configuration.
         *
         * This method sets the `host` property of the `ApiResourceManager` instance
         * to the provided `host` URL. It then calls the `_initializeAxiosConfig`
         * method to update the Axios configuration with the new host, ensuring
         * that subsequent API requests use the correct base URL.
         *
         * @param {string} host - The base URL of the API server.
         */
        setHost(host: string): void;
        /**
         * Sets the namespace for the client.
         *
         * This method sets the `namespace` property of the `ApiResourceManager`
         * instance to the provided `namespace`. The namespace is typically used
         * as a path prefix in the base URL for API requests, allowing you to
         * version your API or organize it into different sections. For example,
         * a namespace of "api/v2" would result in a base URL like
         * "https://example.com/api/v2".
         *
         * @param {string} namespace - The namespace for API requests.
         */
        setNamespace(namespace: string): void;
        /**
         * Sets a common header for all Axios requests.
         *
         * This method sets a common header that will be included in all
         * Axios requests made by the `ApiResourceManager`. The `key` parameter
         * specifies the header name, and the `value` parameter specifies the
         * header value.
         *
         * @param {string} key - The header key (e.g., 'Authorization', 'Content-Type').
         * @param {string|number|boolean} value - The header value.
         */
        setHeadersCommon(key: string, value: string | number | boolean): void;
        /**
         * Sets the reference key used for included data in request payloads.
         *
         * This method sets the `payloadIncludedReference` property of the
         * `ApiResourceManager` instance. This property determines the key used
         * to identify the type of included data in API request payloads.
         * For example, if the payload includes related resources, this key
         * might be used to specify the type of each included resource.
         *
         * @param {string} key - The new reference key for included data.
         */
        setPayloadIncludeReference(key: string): void;
        /**
         * Makes the instance accessible globally in a browser environment.
         *
         * This method attaches the `ApiResourceManager` instance to the `window`
         * object in a browser environment, making it globally accessible as
         * `window.ARM`. The instance is frozen using `Object.freeze()` to prevent
         * accidental modifications.
         *
         * Caution: This method should be used with care as it modifies the
         * global scope and could potentially lead to naming conflicts.
         *
         */
        setGlobal(): void;
        /**
         * Retrieves a collection by its name.
         *
         * This method retrieves the collection with the specified `collectionName`
         * from the `collections` object of the `ApiResourceManager`. If the
         * collection does not exist, it returns an empty observable array.
         *
         * @param {string} collectionName - The name of the collection to retrieve.
         * @returns {Array} The collection data as an observable array.
         */
        getCollection(collectionName: string): any[];
        /**
         * Unloads a collection by resetting it to an empty array.
         *
         * This method removes all records from the specified collection in the
         * `collections` object of the `ApiResourceManager`.
         *
         * @private
         * @param {string} collectionName - The name of the collection to unload.
         */
        private _unloadCollection;
        /**
         * Clears the contents of a specified collection and unloads related data.
         *
         * This method removes all records from the collection with the given
         * `collectionName` in the `collections` object of the `ApiResourceManager`.
         * It also unloads the records from aliases and request hashes.
         *
         * @param {string} collectionName - The name of the collection to clear.
         */
        clearCollection(collectionName: string): void;
        /**
         * Retrieves an alias by its name, with optional fallback records.
         *
         * This method retrieves the alias with the specified `aliasName` from
         * the `aliases` object of the `ApiResourceManager`. If the alias does
         * not exist, it returns the provided `fallbackRecords` (if any).
         *
         * If `fallbackRecords` is a plain object, the method injects collection
         * actions into it using `_injectCollectionActions` before returning it.
         *
         * @param {string} aliasName - The name of the alias to retrieve.
         * @param {Array|Object} [fallbackRecords] - Optional fallback records
         *                                           to return if the alias
         *                                           is not found.
         * @returns {Array|Object} The alias data or the fallback records.
         */
        getAlias(aliasName: string, fallbackRecords?: any[] | any): any[] | any;
        /**
         * Creates a new record in a specified collection.
         *
         * This method creates a new record in the collection with the given
         * `collectionName`. The `collectionRecord` parameter can be used to
         * provide initial data for the record. If `collectionRecordRandomId`
         * is true (default), a unique ID is generated for the record using
         * `uuidv1()`. Otherwise, a NIL UUID is used.
         *
         * The method injects necessary reference keys and actions into the
         * record using `_injectCollectionReferenceKeys` and
         * `_injectCollectionActions`.
         *
         * @param {string} collectionName - The name of the collection to create
         *                                 the record in.
         * @param {Object} [collectionRecord={}] - Optional initial data for the
         *                                        record.
         * @param {boolean} [collectionRecordRandomId=true] - Whether to generate
         *                                                    a random ID.
         * @returns {Object} The created record.
         */
        createRecord(collectionName: string, collectionRecord?: any, collectionRecordRandomId?: boolean): any;
        /**
         * Resolves the request based on configuration.
         *
         * This method determines how to resolve an API request based on the
         * `autoResolve` option in the `config` object.
         *
         * If `autoResolve` is true (which is the default if not explicitly
         * provided), the method returns the `requestHashObject`, which likely
         * contains the cached response data.
         *
         * If `autoResolve` is false, the method returns the `requestXHR` object,
         * which represents the actual Axios request Promise. This allows for
         * more control over handling the response, such as accessing the raw
         * response data or handling specific HTTP status codes.
         *
         * @private
         * @param {Object} config - The configuration object for the request.
         * @param {Promise} requestXHR - The Axios request Promise.
         * @param {Object} requestHashObject - The request hash object containing
         *                                    cached response data.
         * @returns {Promise|Object} The resolved value based on the
         *                          `autoResolve` configuration.
         */
        private _resolveRequest;
        /**
         * Makes an API request based on the provided configuration.
         *
         * This method handles various HTTP methods (GET, POST, PUT, DELETE), resource URLs,
         * query parameters, payloads, and error handling. It also manages aliases,
         * request caching, and asynchronous loading of related resources.
         *
         * @param {Object} requestConfig - The configuration object for the request.
         * @param {string} requestConfig.resourceMethod - The HTTP method for the request (e.g., 'get', 'post', 'put', 'delete').
         * @param {string} requestConfig.resourceName - The name of the API resource being accessed.
         * @param {string|number} [requestConfig.resourceId] - Optional ID of the specific resource for GET/PUT/DELETE requests.
         * @param {Object} [requestConfig.resourceParams] - Optional query parameters for the request.
         * @param {Object} [requestConfig.resourcePayload] - Optional payload data for POST/PUT requests.
         * @param {*} [requestConfig.resourceFallback] - Optional fallback value to return if the request fails and no response data is available.
         * @param {Object} [requestConfig.resourceConfig] - Optional configuration overrides for the request (e.g., alias, autoResolve, skip).
         *
         * @returns {Promise<*>} A Promise that resolves with the API response data or the request hash object (if autoResolve is true), or rejects with an error.
         *
         * @async
         */
        _request({ resourceMethod, resourceName, resourceId, resourceParams, resourcePayload, resourceFallback, resourceConfig }: {
            resourceMethod: string;
            resourceName: string;
            resourceId?: string | number;
            resourceParams?: any;
            resourcePayload?: any;
            resourceFallback?: any;
            resourceConfig?: any;
        }, ...args: any[]): Promise<any>;
        /**
         * Processes the payload for a request, omitting specified keys and setting it in the request options.
         *
         * @param {string[]} resourceIgnorePayload - An array of keys to be ignored (omitted) from the payload.
         * @param {Object} resourcePayloadRecord - The record object containing the payload data.
         * @param {Object} requestOptions - The options object for the request, where the processed payload will be set.
         */
        _processRequestPayload(resourceIgnorePayload: string[], resourcePayloadRecord: any, requestOptions: any): void;
        /**
         * Processes the URL for a request, constructing it from the resource name and ID.
         *
         * @param {Object} requestOptions - The options object for the request, where the URL will be set.
         * @param {string} resourceName - The name of the resource being accessed.
         * @param {string|number} resourceId - The ID of the specific resource.
         */
        _processRequestURL(resourceName: string, resourceId: string | number, requestOptions: any): void;
        /**
         * Processes an alias for a request, adding it to the aliases store.
         *
         * @param {Object} resourceConfig - The configuration object for the resource request, containing the alias information.
         * @param {Array|Object} collectionRecords - The records to be aliased. Can be an array or an object.
         */
        _processRequestAlias(resourceConfig: any, collectionRecords: any[] | any): void;
        /**
         * Processes request overrides based on the provided configuration.
         *
         * This method modifies the `requestOptions` object to incorporate any overrides
         * specified in the `resourceConfig`.
         *
         * @param {Object} resourceConfig - The configuration object for the resource request.
         * @param {Object} resourceConfig.override - Optional overrides for the request.
         * @param {string} [resourceConfig.override.host] - Optional override for the base URL host.
         * @param {string} [resourceConfig.override.namespace] - Optional override for the API namespace.
         * @param {string} [resourceConfig.override.path] - Optional override for the request path.
         * @param {Object} [resourceConfig.override.headers] - Optional override for request headers.
         * @param {Object} requestOptions - The request options object to be modified.
         */
        _processRequestOverride(resourceConfig: {
            override: {
                host?: string;
                namespace?: string;
                path?: string;
                headers?: any;
            };
        }, requestOptions: any): void;
        /**
         * Queries a resource with specified parameters and configuration.
         *
         * This method sends a GET request to the specified `resource` with the
         * given `params` (query parameters) and `config` (request configuration).
         * It uses the `_request` method to handle the API request and the
         * `_resolveRequest` method to determine how to resolve the request
         * (either with cached data or the raw Axios Promise).
         *
         * @param {string} resource - The name of the API resource to query.
         * @param {Object} [params={}] - Optional query parameters for the request.
         * @param {Object} [config={}] - Optional configuration for the request.
         * @returns {Object|Promise} The resolved value based on the `autoResolve`
         *                          configuration in `config`.
         */
        query(resource: string, params?: any, config?: any): any | Promise<any>;
        /**
         * Queries a single record from a specified resource.
         *
         * This method sends a GET request to the specified `resource` to
         * retrieve a single record. The `params` (query parameters) and
         * `config` (request configuration) can be used to customize the
         * request. It uses the `_request` method to handle the API request
         * and the `_resolveRequest` method to determine how to resolve the
         * request (either with cached data or the raw Axios Promise).
         *
         * @param {string} resource - The name of the API resource to query.
         * @param {Object} [params={}] - Optional query parameters for the request.
         * @param {Object} [config={}] - Optional configuration for the request.
         * @returns {Object|Promise} The resolved value based on the `autoResolve`
         *                          configuration in `config`.
         */
        queryRecord(resource: string, params?: any, config?: any): any | Promise<any>;
        /**
         * Fetches a collection of records from a specified resource.
         *
         * This method sends a GET request to the specified `resource` to
         * retrieve all records. The `config` (request configuration) can be
         * used to customize the request. It uses the `_request` method to
         * handle the API request and the `_resolveRequest` method to determine
         * how to resolve the request (either with cached data or the raw
         * Axios Promise).
         *
         * @param {string} resource - The name of the API resource to query.
         * @param {Object} [config={}] - Optional configuration for the request.
         * @returns {Object|Promise} The resolved value based on the `autoResolve`
         *                          configuration in `config`.
         */
        findAll(resource: string, config?: any): any | Promise<any>;
        /**
         * Finds a specific record by ID from a given resource.
         *
         * This method sends a GET request to the specified `resource` to
         * retrieve a single record with the given `id`. The `params`
         * (query parameters) and `config` (request configuration) can be used
         * to customize the request. It uses the `_request` method to handle
         * the API request and the `_resolveRequest` method to determine how
         * to resolve the request (either with cached data or the raw Axios
         * Promise).
         *
         * @param {string} resource - The name of the API resource to query.
         * @param {number|string} id - The ID of the record to find.
         * @param {Object} [params={}] - Optional query parameters for the request.
         * @param {Object} [config={}] - Optional configuration for the request.
         * @returns {Object|Promise} The resolved value based on the `autoResolve`
         *                          configuration in `config`.
         */
        findRecord(resource: string, id: number | string, params?: any, config?: any): any | Promise<any>;
        /**
         * Peeks at all records in a specified collection without triggering
         * a request.
         *
         * This method retrieves all records from the collection with the
         * specified `collectionName` from the `collections` object of the
         * `ApiResourceManager`. It does not make an API request to fetch
         * the data; it only returns the locally stored records.
         *
         * @param {string} collectionName - The name of the collection to peek at.
         * @returns {Array|undefined} The collection records, or undefined if
         *                           the collection is not found.
         */
        peekAll(collectionName: string): any[] | undefined;
        /**
         * Peeks at a specific record in a collection without triggering a request.
         *
         * This method retrieves a specific record from the collection with the
         * given `collectionName` and `collectionRecordId` from the `collections`
         * object of the `ApiResourceManager`. It does not make an API request;
         * it only returns the locally stored record if found.
         *
         * @param {string} collectionName - The name of the collection.
         * @param {number|string} collectionRecordId - The ID of the record to find.
         * @returns {Object|undefined} The found record, or undefined if not found
         *                             in the local collection.
         */
        peekRecord(collectionName: string, collectionRecordId: number | string): any | undefined;
        /**
         * Internal method to set a property on the root scope.
         * @private
         * @param {string} rootScopeProperty - The property name to set.
         * @param {*} rootScopeValue - The value to set.
         */
        private _setRootScope;
        /**
         * Sets a property on the root scope.
         * @param {string} rootScopeProperty - The property name to set.
         * @param {*} rootScopeValue - The value to set.
         */
        setRootScope(rootScopeProperty: string, rootScopeValue: any): void;
        /**
         * Gets a property from the root scope.
         * @param {string} rootScopeProperty - The property name to get.
         * @returns {*} The value of the property.
         */
        getRootScope(rootScopeProperty: string): any;
        /**
         * Makes an AJAX request using the axios library.
         *
         * @param {Object} [config={}] - Configuration object for the axios request.
         * @returns {Promise} A Promise that resolves with the Axios response or
         *                    rejects with an error.
         */
        ajax(config?: any): Promise<any>;
        /**
         * Finds the first object in an array that matches the specified properties.
         *
         * @param {Array<Object>} objects - The array of objects to search.
         * @param {Object} [findProperties={}] - The properties to match.
         * @returns {Object|undefined} The found object, or undefined if not found.
         */
        findBy(objects: Array<any>, findProperties?: any): any | undefined;
        /**
         * Finds the index of the first object in an array that matches the
         * specified properties.
         *
         * @param {Array<Object>} objects - The array of objects to search.
         * @param {Object} [findIndexProperties={}] - The properties to match.
         * @returns {number} The index of the found object, or -1 if not found.
         */
        findIndexBy(objects: Array<any>, findIndexProperties?: any): number;
        /**
         * Filters an array of objects based on the specified properties.
         *
         * @param {Array<Object>} objects - The array of objects to filter.
         * @param {Object} [filterProperties={}] - The filter criteria.
         * @returns {Array<Object>} The filtered array of objects.
         */
        filterBy(objects: Array<any>, filterProperties?: any): Array<any>;
        /**
         * Creates a new array of unique objects based on a specified property.
         *
         * @param {Array<Object>} objects - The array of objects to process.
         * @param {string} uniqByProperty - The property to use for uniqueness
         *                                 comparison.
         * @returns {Array<Object>} The array of unique objects.
         */
        uniqBy(objects: Array<any>, uniqByProperty: string): Array<any>;
        /**
         * Groups objects into arrays based on a specified property.
         *
         * @param {Array<Object>} objects - The array of objects to group.
         * @param {string} groupByProperty - The property to group by.
         * @returns {Object} An object where keys are group values and values
         *                   are arrays of objects.
         */
        groupBy(objects: Array<any>, groupByProperty: string): any;
        /**
         * Maps an array of objects to a new array of values, extracting a specific property from each object.
         * @param {Array<Object>} objects - The array of objects to map.
         * @param {string} mapByProperty - The property to extract from each object.
         * @returns {Array<*>} A new array containing the extracted values.
         */
        mapBy(objects: Array<any>, mapByProperty: string): Array<any>;
        /**
         * Returns the first object in an array.
         *
         * @param {Array<Object>} [objects=[]] - The array of objects.
         * @returns {Object|undefined} The first object, or undefined if the
         *                             array is empty.
         */
        firstObject(objects?: Array<any>): any | undefined;
        /**
         * Returns the last object in an array.
         *
         * @param {Array<Object>} [objects=[]] - The array of objects.
         * @returns {Object|undefined} The last object, or undefined if the
         *                             array is empty.
         */
        lastObject(objects?: Array<any>): any | undefined;
        /**
         * Merges two arrays of objects into a single array, removing duplicates.
         *
         * @param {Array<Object>} [objects=[]] - The first array of objects.
         * @param {Array<Object>} [otherObjects=[]] - The second array of objects.
         * @returns {Array<Object>} The merged array of objects without duplicates.
         */
        mergeObjects(objects?: Array<any>, otherObjects?: Array<any>): Array<any>;
        /**
         * Splits an array of objects into chunks of a specified size.
         *
         * @param {Array<Object>} [objects=[]] - The array of objects to chunk.
         * @param {number} [chunkSize=1] - The size of each chunk.
         * @returns {Array<Array<Object>>} An array of chunks.
         */
        chunkObjects(objects?: Array<any>, chunkSize?: number): Array<Array<any>>;
        /**
         * Sorts an array of objects based on specified properties and sort orders.
         *
         * @param {Array<Object>} objects - The array of objects to sort.
         * @param {Array<string>} sortProperties - An array of sort properties in
         *                                       the format of 'property:order'.
         * @returns {Array<Object>} The sorted array of objects.
         */
        sortBy(objects: Array<any>, sortProperties: Array<string>): Array<any>;
        /**
         * Checks if a value is empty.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is empty, false otherwise.
         */
        isEmpty(value: any): boolean;
        /**
         * Checks if a value is present (not empty).
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is present, false otherwise.
         */
        isPresent(value: any): boolean;
        /**
         * Checks if two values are equal.
         *
         * @param {*} value - The first value.
         * @param {*} other - The second value.
         * @returns {boolean} True if the values are equal, false otherwise.
         */
        isEqual(value: any, other: any): boolean;
        /**
         * Checks if a value is a number.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is a number, false otherwise.
         */
        isNumber(value: any): boolean;
        /**
         * Checks if a value is null or undefined.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is null or undefined, false otherwise.
         */
        isNil(value: any): boolean;
        /**
         * Checks if a value is null.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is null, false otherwise.
         */
        isNull(value: any): boolean;
        /**
         * Checks if a value is greater than or equal to another value.
         *
         * @param {number} value - The first value.
         * @param {number} other - The second value.
         * @returns {boolean} True if the first value is greater than or equal
         *                   to the second value, false otherwise.
         */
        isGte(value: number, other: number): boolean;
        /**
         * Checks if a value is greater than another value.
         *
         * @param {number} value - The first value.
         * @param {number} other - The second value.
         * @returns {boolean} True if the first value is greater than the second
         *                   value, false otherwise.
         */
        isGt(value: number, other: number): boolean;
        /**
         * Checks if a value is less than or equal to another value.
         *
         * @param {number} value - The first value.
         * @param {number} other - The second value.
         * @returns {boolean} True if the first value is less than or equal to
         *                   the second value, false otherwise.
         */
        isLte(value: number, other: number): boolean;
        /**
         * Checks if a value is less than another value.
         *
         * @param {number} value - The first value.
         * @param {number} other - The second value.
         * @returns {boolean} True if the first value is less than the second
         *                   value, false otherwise.
         */
        isLt(value: number, other: number): boolean;
    }
}
