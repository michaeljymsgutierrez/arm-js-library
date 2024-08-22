declare module "arm-js-library.umd" {
    const _exports: {
        new (collections?: any[]): {
            namespace: string;
            host: any;
            collections: {};
            aliases: {};
            requestHashIds: {};
            payloadIncludedReference: string;
            /**
             * Initializes the Axios configuration with the base URL.
             *
             * @private
             */
            _initializeAxiosConfig(): void;
            /**
             * Initializes a collection of collections with optional default values.
             *
             * @private
             * @param {string[]} collections - An array of collection names to initialize.
             */
            _initializeCollections(collections: string[]): void;
            /**
             * Gets the base URL for API requests.
             *
             * @private
             * @returns {string} The base URL constructed from `host` and `namespace` properties.
             */
            _getBaseURL(): string;
            /**
             * Checks if a collection exists in the current instance.
             *
             * @private
             * @param {string} collectionName - The name of the collection to check.
             * @throws {Error} If the collection does not exist.
             */
            _isCollectionExisting(collectionName: string): void;
            /**
             * Adds a collection to the current instance.
             *
             * @private
             * @param {string} collectionName - The name of the collection to add.
             * @param {Array} collectionRecords - The records for the collection.
             */
            _addCollection(collectionName: string, collectionRecords: any[]): void;
            /**
             * Adds an alias to the aliases object.
             *
             * @private
             * @param {string} aliasName - The name of the alias.
             * @param {Array|Object} aliasRecords - The records for the alias. Can be an array or an object.
             */
            _addAlias(aliasName: string, aliasRecords: any[] | any): void;
            /**
             * Generates a hash ID based on the provided object.
             *
             * @private
             * @param {Object} object - The object to generate the hash ID from. Defaults to an object with an `id` property generated using `uuidv1()`.
             * @returns {string} The generated hash ID.
             */
            _generateHashId(object?: any): string;
            /**
             * Sets multiple properties on a target object recursively.
             *
             * @private
             * @param {Object} targetObject - The object to set properties on.
             * @param {Object} keyValuePairs - An object containing key-value pairs to set.
             */
            _setProperties(targetObject: any, keyValuePairs: any): void;
            /**
             * Gets a property from the current object.
             *
             * @private
             * @param {string} key - The key of the property to retrieve.
             * @returns {*} The value of the property, or undefined if not found.
             */
            _getRecordProperty(key: string): any;
            /**
             * Sets a single property on the current record and updates its state based on changes.
             *
             * @private
             * @param {string} key - The property key to set.
             * @param {*} value - The value to set for the property.
             */
            _setRecordProperty(key: string, value: any): void;
            /**
             * Sets properties on the current record and updates its state based on changes.
             *
             * @private
             * @param {Object} values - An object containing key-value pairs to set.
             */
            _setRecordProperties(values: any): void;
            /**
             * Sorts an array of records based on specified properties and sort orders.
             *
             * @private
             * @param {Array} currentRecords - The array of records to sort.
             * @param {Array<string>} sortProperties - An array of sort properties in the format of 'property:order'.
             *  Valid orders are 'asc' (ascending) and 'desc' (descending).
             * @returns {Array} The sorted array of records.
             */
            _sortRecordsBy(currentRecords: any[], sortProperties?: Array<string>): any[];
            /**
             * Removes a record from a specified collection based on its hash ID.
             *
             * @private
             * @param {Object} collectionRecord - The record to be removed from the collection.
             */
            _unloadFromCollection(collectionRecord: any): void;
            /**
             * Removes a record from all request hashes based on its hash ID.
             *
             * @private
             * @param {Object} collectionRecord - The record to be removed from request hashes.
             */
            _unloadFromRequestHashes(collectionRecord: any): void;
            /**
             * Removes a record from all aliases based on its hash ID.
             *
             * @private
             * @param {Object} collectionRecord - The record to be removed from aliases.
             */
            _unloadFromAliases(collectionRecord: any): void;
            /**
             * Unloads a record from the collection, request hashes, and aliases.
             *
             * @param {Object} currentRecord - The record to be unloaded.
             */
            unloadRecord(currentRecord: any): void;
            /**
             * Saves a record to the server.
             *
             * @private
             * @param {Object} currentRecord - The record to be saved.
             * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
             */
            _saveRecord(currentRecord: any, collectionConfig?: {}): Promise<any>;
            /**
             * Deletes a record from the server.
             *
             * @private
             * @async
             * @param {Object} currentRecord - The record to be deleted.
             * @param {Object} [collectionConfig] - Optional configuration for the deletion request.
             * @returns {Promise} A Promise that resolves when the deletion is successful or rejects with an error.
             */
            _deleteRecord(currentRecord: any, collectionConfig?: any): Promise<any>;
            /**
             * Reloads a record from the server.
             *
             * @private
             * @async
             * @param {Object} currentRecord - The record to be reloaded.
             * @returns {Promise} A Promise that resolves with the updated record or rejects with an error.
             */
            _reloadRecord(currentRecord: any): Promise<any>;
            /**
             * Retrieves records from a specified collection based on given criteria.
             *
             * @private
             * @param {string} collectionName - The name of the collection to retrieve records from.
             * @param {Object} collectionConfig - Optional configuration for the collection, including referenceKey, async, filterBy, and sortBy properties.
             * @param {Object|Array} currentRecord - The current record containing potential related records.
             * @returns {Object|Array} The retrieved records, either a single object or an array depending on the input.
             */
            _getCollectionRecord(collectionName: string, collectionConfig: any, currentRecord: any | any[]): any | any[];
            /**
             * Injects action methods into a collection record.
             *
             * @private
             * @param {Object} collectionRecord - The collection record to inject actions into.
             */
            _injectCollectionActions(collectionRecord: any): void;
            /**
             * Injects reference keys into a collection record.
             *
             * @private
             * @param {string} collectionName - The name of the collection.
             * @param {Object} collectionRecord - The collection record to inject keys into.
             * @param {string} collectionRecordHashId - Optional hash ID for the record.
             */
            _injectCollectionReferenceKeys(collectionName: string, collectionRecord: any, collectionRecordHashId?: string): void;
            /**
             * Pushes records to a specified collection.
             *
             * @private
             * @param {string} collectionName - The name of the collection to push records to.
             * @param {Array|Object} collectionRecords - The records to be pushed. Can be an array or an object.
             * @returns {Array|Object} The pushed records, either an array or an object depending on the input.
             */
            _pushToCollection(collectionName: string, collectionRecords: any[] | any): any[] | any;
            /**
             * Pushes records to specified aliases.
             *
             * @private
             * @param {Array|Object} collectionRecords - The records to be pushed to aliases.
             */
            _pushToAliases(collectionRecords: any[] | any): void;
            /**
             * Pushes records to specified request hashes.
             *
             * @private
             * @param {Array|Object} collectionRecords - The records to be pushed to request hashes.
             */
            _pushToRequestHashes(collectionRecords: any[] | any): void;
            /**
             * Pushes records to a collection, aliases, and request hashes.
             *
             * @private
             * @param {string} collectionName - The name of the collection.
             * @param {Array|Object} collectionRecords - The records to be pushed.
             * @returns {Array|Object} The updated collection records.
             */
            _pushPayload(collectionName: string, collectionRecords: any[] | any): any[] | any;
            /**
             * Pushes records to a specified collection.
             *
             * @param {string} collectionName - The name of the collection to push records to.
             * @param {Array<Object>|Object} collectionRecords - The records to be pushed. Can be an array or a single object.
             */
            pushPayload(collectionName: string, collectionRecords: Array<any> | any): void;
            /**
             * Pushes a request and its corresponding response to the request hash store.
             *
             * @private
             * @param {Object} requestObject - The request object.
             * @param {Object} responseObject - The initial response object.
             * @returns {Object} The updated or created request hash object.
             */
            _pushRequestHash(requestObject: any, responseObject: any): any;
            /**
             * Sets the host URL for the client and initializes the Axios configuration.
             *
             * @param {string} host - The base URL of the API server.
             */
            setHost(host: string): void;
            /**
             * Sets the namespace for the client.
             *
             * @param {string} namespace - The namespace for API requests.
             */
            setNamespace(namespace: string): void;
            /**
             * Sets a common header for all Axios requests.
             *
             * @param {string} key - The header key.
             * @param {string|number|boolean} value - The header value.
             */
            setHeadersCommon(key: string, value: string | number | boolean): void;
            /**
             * Sets the reference key used for included data in request payloads.
             *
             * @param {string} key - The new reference key.
             */
            setPayloadIncludeReference(key: string): void;
            /**
             * Makes the instance accessible globally in a browser environment.
             *
             * Attaches the instance to the `window` object as `window.ARM`.
             * **Caution:** This method should be used with care as it modifies the global scope.
             */
            setGlobal(): void;
            /**
             * Retrieves a collection by its name.
             *
             * @param {string} collectionName - The name of the collection to retrieve.
             * @returns {Array} The collection data, or an empty array if not found.
             */
            getCollection(collectionName: string): any[];
            /**
             * Clears the contents of a specified collection.
             *
             * @param {string} collectionName - The name of the collection to clear.
             */
            clearCollection(collectionName: string): void;
            /**
             * Retrieves an alias by its name, with optional fallback records.
             *
             * @param {string} aliasName - The name of the alias to retrieve.
             * @param {Object} fallbackRecords - Optional fallback records to return if the alias is not found.
             * @returns {Array|Object} The alias data or the fallback records.
             */
            getAlias(aliasName: string, fallbackRecords: any): any[] | any;
            /**
             * Creates a new record in a specified collection.
             *
             * @param {string} collectionName - The name of the collection.
             * @param {Object} collectionRecord - Optional initial data for the record.
             * @param {boolean} collectionRecordRandomId - Whether to generate a random ID for the record. Defaults to true.
             * @returns {Object} The created record.
             */
            createRecord(collectionName: string, collectionRecord?: any, collectionRecordRandomId?: boolean): any;
            /**
             * Resolves the request based on configuration.
             *
             * @private
             * @param {Object} config - Configuration object for the request.
             * @param {Promise} requestXHR - The Axios request Promise.
             * @param {Object} requestHashObject - The request hash object.
             * @returns {Promise|Object} Returns the request hash object if autoResolve is true, otherwise returns the Axios request Promise.
             */
            _resolveRequest(config: any, requestXHR: Promise<any>, requestHashObject: any): Promise<any> | any;
            /**
             * Makes an API request based on the provided configuration.
             *
             * This method is private and should not be called directly.
             *
             * @param {Object} requestConfig - Configuration object for the request.
             * @param {string} requestConfig.resourceMethod - HTTP method for the request (e.g. 'get', 'post', 'delete').
             * @param {string} requestConfig.resourceName - API endpoint name.
             * @param {string} [requestConfig.resourceId] - Optional resource ID for GET/DELETE requests.
             * @param {Object} [requestConfig.resourceParams] - Optional query parameters for the request.
             * @param {Object} [requestConfig.resourcePayload] - Optional payload data for POST requests.
             * @param {*} [requestConfig.resourceFallback] - Optional value to return if the request fails and no fallback data is provided.
             * @param {Object} [requestConfig.resourceConfig] - Optional configuration overrides for the request.
             * @param {boolean} [requestConfig.resourceConfig.override] - Whether to override default client configuration.
             * @param {string} [requestConfig.resourceConfig.host] - Optional override for the base URL host.
             * @param {string} [requestConfig.resourceConfig.namespace] - Optional override for the API namespace.
             * @param {Object} [requestConfig.resourceConfig.headers] - Optional override for request headers.
             * @param {boolean} [requestConfig.resourceConfig.skip] - Whether to skip making the request (useful for data pre-population).
             * @returns {Promise<*>} Promise resolving to the API response data or rejecting with the error.
             */
            _request({ resourceMethod, resourceName, resourceId, resourceParams, resourcePayload, resourceFallback, resourceConfig }: {
                resourceMethod: string;
                resourceName: string;
                resourceId?: string;
                resourceParams?: any;
                resourcePayload?: any;
                resourceFallback?: any;
                resourceConfig?: {
                    override?: boolean;
                    host?: string;
                    namespace?: string;
                    headers?: any;
                    skip?: boolean;
                };
            }, ...args: any[]): Promise<any>;
            /**
             * Queries a resource with specified parameters and configuration.
             *
             * @param {string} resource - The resource to query.
             * @param {Object} params - Optional query parameters.
             * @param {Object} config - Optional configuration for the request.
             * @returns {Object} The request hash object.
             */
            query(resource: string, params?: any, config?: any): any;
            /**
             * Queries a single record from a specified resource.
             * @param {string} resource - The name of the resource to query.
             * @param {Object} params - Optional query parameters for the request.
             * @param {Object} config - Optional configuration for the request.
             * @returns {Object} The request hash object containing the query status and results.
             */
            queryRecord(resource: string, params?: any, config?: any): any;
            /**
             * Fetches a collection of records from a specified resource.
             *
             * @param {string} resource - The name of the resource to query.
             * @param {Object} config - Optional configuration for the request.
             * @returns {Object} The request hash object containing the query status and results.
             */
            findAll(resource: string, config?: any): any;
            /**
             * Finds a specific record by ID from a given resource.
             *
             * @param {string} resource - The name of the resource to query.
             * @param {number|string} id - The ID of the record to find.
             * @param {Object} params - Optional query parameters for the request.
             * @param {Object} config - Optional configuration for the request.
             * @returns {Object} The request hash object containing the query status and results.
             */
            findRecord(resource: string, id: number | string, params?: any, config?: any): any;
            /**
             * Peeks at all records in a specified collection without triggering a request.
             *
             * @param {string} collectionName - The name of the collection to peek at.
             * @returns {Array} The collection records, or an empty array if the collection is not found.
             */
            peekAll(collectionName: string): any[];
            /**
             * Peeks at a specific record in a collection without triggering a request.
             *
             * @param {string} collectionName - The name of the collection to peek at.
             * @param {number|string} collectionRecordId - The ID of the record to find.
             * @returns {Object|undefined} The found record, or undefined if not found.
             */
            peekRecord(collectionName: string, collectionRecordId: number | string): any | undefined;
            /**
             * Makes an AJAX request using the axios library.
             *
             * @param {Object} config - Configuration object for the axios request.
             * @returns {Promise} A Promise that resolves with the Axios response or rejects with an error.
             */
            ajax(config?: any): Promise<any>;
            /**
             * Finds the first object in an array that matches the specified properties.
             *
             * @param {Array<Object>} objects - The array of objects to search.
             * @param {Object} findProperties - The properties to match.
             * @returns {Object|undefined} The found object, or undefined if not found.
             */
            findBy(objects: Array<any>, findProperties?: any): any | undefined;
            /**
             * Finds the index of the first object in an array that matches the specified properties.
             *
             * @param {Array<Object>} objects - The array of objects to search.
             * @param {Object} findIndexProperties - The properties to match.
             * @returns {number} The index of the found object, or -1 if not found.
             */
            findIndexBy(objects: Array<any>, findIndexProperties?: any): number;
            /**
             * Filters an array of objects based on the specified properties.
             *
             * @param {Array<Object>} objects - The array of objects to filter.
             * @param {Object} filterProperties - The filter criteria.
             * @returns {Array<Object>} The filtered array of objects.
             */
            filterBy(objects: Array<any>, filterProperties?: any): Array<any>;
            /**
             * Creates a new array of unique objects based on a specified property.
             *
             * @param {Array<Object>} objects - The array of objects to process.
             * @param {string} uniqByProperty - The property to use for uniqueness comparison.
             * @returns {Array<Object>} The array of unique objects.
             */
            uniqBy(objects: Array<any>, uniqByProperty: string): Array<any>;
            /**
             * Groups objects into arrays based on a specified property.
             *
             * @param {Array<Object>} objects - The array of objects to group.
             * @param {string} groupByProperty - The property to group by.
             * @returns {Object} An object where keys are group values and values are arrays of objects.
             */
            groupBy(objects: Array<any>, groupByProperty: string): any;
            /**
             * Returns the first object in an array.
             *
             * @param {Array<Object>} objects - The array of objects.
             * @returns {Object|undefined} The first object, or undefined if the array is empty.
             */
            firstObject(objects?: Array<any>): any | undefined;
            /**
             * Returns the last object in an array.
             *
             * @param {Array<Object>} objects - The array of objects.
             * @returns {Object|undefined} The last object, or undefined if the array is empty.
             */
            lastObject(objects?: Array<any>): any | undefined;
            /**
             * Merges two arrays of objects into a single array, removing duplicates.
             *
             * @param {Array<Object>} objects - The first array of objects.
             * @param {Array<Object>} otherObjects - The second array of objects.
             * @returns {Array<Object>} The merged array of objects without duplicates.
             */
            mergeObjects(objects?: Array<any>, otherObjects?: Array<any>): Array<any>;
            /**
             * Splits an array of objects into chunks of a specified size.
             *
             * @param {Array<Object>} objects - The array of objects to chunk.
             * @param {number} chunkSize - The size of each chunk.
             * @returns {Array<Array<Object>>} An array of chunks.
             */
            chunkObjects(objects?: Array<any>, chunkSize?: number): Array<Array<any>>;
            /**
             * Sorts an array of objects based on specified properties and sort orders.
             *
             * @param {Array<Object>} objects - The array of objects to sort.
             * @param {Array<string>} sortProperties - An array of sort properties in the format of 'property:order'.
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
             * @returns {boolean} True if the first value is greater than or equal to the second value, false otherwise.
             */
            isGte(value: number, other: number): boolean;
            /**
             * Checks if a value is greater than another value.
             *
             * @param {number} value - The first value.
             * @param {number} other - The second value.
             * @returns {boolean} True if the first value is greater than the second value, false otherwise.
             */
            isGt(value: number, other: number): boolean;
            /**
             * Checks if a value is less than or equal to another value.
             *
             * @param {number} value - The first value.
             * @param {number} other - The second value.
             * @returns {boolean} True if the first value is less than or equal to the second value, false otherwise.
             */
            isLte(value: number, other: number): boolean;
            /**
             * Checks if a value is less than another value.
             *
             * @param {number} value - The first value.
             * @param {number} other - The second value.
             * @returns {boolean} True if the first value is less than the second value, false otherwise.
             */
            isLt(value: number, other: number): boolean;
        };
    };
    export = _exports;
}
