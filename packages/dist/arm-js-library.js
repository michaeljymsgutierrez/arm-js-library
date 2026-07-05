import axios from "axios";
import _ from "lodash";
import * as mobx from "mobx";
import { v1, validate, NIL } from "uuid";
import md5 from "md5";
import qs from "qs";
/**
 * ARM JavaScript Library
 *
 * Version: 2.9.2
 *
 * @author Michael Jyms Gutierrez
 * @license MIT
 *
 * Axios library for making HTTP requests.
 * @see https://axios-http.com/docs/
 *
 * Lodash utility library.
 * @see https://lodash.com/docs/
 *
 * MobX state management library.
 * @see https://mobx.js.org/
 *
 * UUID generation library.
 * @see https://www.npmjs.com/package/uuid
 *
 * md5 library for MD5 hashing.
 * @see https://www.npmjs.com/package/md5
 *
 * qs library for query string serialization.
 * @see https://www.npmjs.com/package/qs
 */
const { makeObservable, observable, action, runInAction, toJS } = mobx;
const {
  get: getProperty,
  set: setProperty,
  find,
  findIndex,
  isObject,
  isArray,
  isPlainObject,
  isNumber,
  isString,
  isNull,
  isNil,
  isEmpty,
  isEqual,
  gte,
  gt,
  lte,
  lt,
  assign,
  flatMap,
  map,
  entries,
  forEach,
  filter,
  defer,
  keysIn,
  concat,
  chunk,
  uniqWith,
  omit,
  first,
  last,
  orderBy,
  uniqBy,
  uniq,
  groupBy,
  sum,
  sumBy,
  pullAt,
  cloneDeep
} = _;
const defaultRequestArrayResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  error: null,
  included: [],
  meta: null
};
const defaultRequestObjectResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: {},
  error: null,
  included: [],
  meta: null
};
const keysToBeOmittedOnDeepCheck = [
  "destroyRecord",
  "getCollection",
  "reload",
  "save",
  "set",
  "get",
  "setProperties",
  "isDirty",
  "isError",
  "isLoading",
  "isPristine",
  "originalRecord",
  "getARMContext"
];
const keysToBeOmittedOnRequestPayload = [
  "destroyRecord",
  "getCollection",
  "reload",
  "save",
  "set",
  "get",
  "setProperties",
  "isDirty",
  "isError",
  "isLoading",
  "isPristine",
  "hashId",
  "collectionName",
  "originalRecord",
  "getARMContext"
];
class ApiResourceManager {
  /**
   * Creates a new instance of the class.
   *
   * @param {Object[]} collections - An optional array of collections to initialize. Defaults to an empty array.
   */
  constructor(collections = []) {
    this.namespace = "api/v1";
    this.host = typeof window !== "undefined" ? window.location.origin : "";
    this.collections = {};
    this.aliases = {};
    this.requestAliases = {};
    this.requestHashes = {};
    this.rootScope = {};
    this.payloadIncludedReference = "type";
    this._initializeCollections(collections);
    this._initializeAxiosConfig();
    makeObservable(this, {
      collections: observable,
      aliases: observable,
      requestAliases: observable,
      requestHashes: observable,
      rootScope: observable,
      _pushPayload: action,
      _pushRequestHash: action,
      _addCollection: action,
      _addAlias: action,
      _addRequestAlias: action,
      _unloadCollection: action,
      _unloadFromCollection: action,
      _unloadFromRequestHashes: action,
      _unloadFromAliases: action,
      _setRootScope: action,
      _setProperties: action,
      _reloadRequest: action,
      createRecord: action
    });
  }
  /**
   * Initializes the Axios configuration with the base URL.
   *
   * Sets the `baseURL` property in the Axios defaults to the value
   * returned by the `_getBaseURL()` method. This ensures that all
   * Axios requests use the correct base URL for the API.
   *
   * @private
   */
  _initializeAxiosConfig() {
    setProperty(axios, ["defaults", "baseURL"], this._getBaseURL());
    setProperty(
      axios,
      ["defaults", "headers", "common", "X-Powered-By"],
      "ARM JS Library/2.9.2"
    );
  }
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
  _initializeCollections(collections) {
    forEach(collections, (collection) => this._addCollection(collection, []));
  }
  /**
   * Gets the base URL for API requests.
   *
   * Constructs the base URL by combining the `host` and `namespace`
   * properties of the instance.
   *
   * @private
   * @returns {string} The base URL constructed from `host` and `namespace`.
   */
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
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
  _isCollectionExisting(collectionName) {
    if (isNil(getProperty(this.collections, collectionName)))
      throw `Collection ${collectionName} does not exist.
Fix: Try adding ${collectionName} on your ARM config initialization.`;
  }
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
  _addCollection(collectionName, collectionRecords) {
    setProperty(this.collections, collectionName, collectionRecords);
  }
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
  _addAlias(aliasName, aliasRecords) {
    let aliasCollectionRecords = null;
    if (isArray(aliasRecords)) aliasCollectionRecords = aliasRecords || [];
    if (isPlainObject(aliasRecords)) aliasCollectionRecords = aliasRecords || {};
    setProperty(this.aliases, aliasName, aliasCollectionRecords);
  }
  /**
   * Adds a request alias to the request aliases object.
   *
   * This method maps a specific `aliasName` to a `requestHashKey` in the
   * `requestAliases` dictionary. This allows the system to reference a
   * specific request context using a human-readable alias.
   *
   * @private
   * @param {string} aliasName - The name of the alias for the request.
   * @param {string} requestHashKey - The unique hash key identifying the request.
   */
  _addRequestAlias(aliasName, requestHashKey) {
    setProperty(this.requestAliases, aliasName, requestHashKey);
  }
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
  _generateHashId(object = { id: v1() }) {
    const stringifyObject = JSON.stringify(object);
    return md5(stringifyObject).toString();
  }
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
  _setProperties(targetObject, keyValuePairs) {
    function objectToArray(obj, prefix = "") {
      return flatMap(entries(obj), ([key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (isObject(value) && !isArray(value) && value !== null) {
          return objectToArray(value, newKey);
        } else {
          return { key: newKey, value };
        }
      });
    }
    const keysAndValues = objectToArray(keyValuePairs);
    forEach(
      keysAndValues,
      ({ key, value }) => setProperty(targetObject, key, value)
    );
  }
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
  _getRecordProperty(key) {
    return getProperty(this, key);
  }
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
  _setRecordProperty(key, value) {
    setProperty(this, key, value);
    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    );
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck);
    const isOriginalAndCurrentRecordEqual = isEqual(
      originalRecord,
      currentRecord
    );
    this.getARMContext()._setProperties(this, {
      isDirty: isOriginalAndCurrentRecordEqual ? false : true,
      isPristine: isOriginalAndCurrentRecordEqual ? true : false
    });
  }
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
  _setRecordProperties(values) {
    this.getARMContext()._setProperties(this, values);
    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    );
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck);
    const isOriginalAndCurrentRecordEqual = isEqual(
      originalRecord,
      currentRecord
    );
    this.getARMContext()._setProperties(this, {
      isDirty: isOriginalAndCurrentRecordEqual ? false : true,
      isPristine: isOriginalAndCurrentRecordEqual ? true : false
    });
  }
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
  _sortRecordsBy(currentRecords, sortProperties = []) {
    const properties = map(
      sortProperties,
      (sortProperty) => first(sortProperty.split(":"))
    );
    const sorts = map(
      sortProperties,
      (sortProperty) => last(sortProperty.split(":"))
    );
    return orderBy(currentRecords, properties, sorts);
  }
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
  _unloadFromCollection(collectionRecord) {
    const collection = getProperty(
      this.collections,
      getProperty(collectionRecord, "collectionName")
    );
    const collectionRecordIndex = findIndex(collection, {
      hashId: getProperty(collectionRecord, "hashId")
    });
    if (gte(collectionRecordIndex, 0)) pullAt(collection, collectionRecordIndex);
  }
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
  _unloadFromRequestHashes(collectionRecord) {
    const requestHashesKeys = keysIn(this.requestHashes);
    const collectionRecordHashId = getProperty(collectionRecord, "hashId");
    forEach(requestHashesKeys, (requestHashKey) => {
      const requestHash = getProperty(this.requestHashes, requestHashKey);
      const requestHashData = getProperty(requestHash, "data");
      if (isArray(requestHashData)) {
        const requestHashRecordIndex = findIndex(requestHashData, {
          hashId: collectionRecordHashId
        });
        if (gte(requestHashRecordIndex, 0))
          pullAt(getProperty(requestHash, "data"), requestHashRecordIndex);
      }
      if (isPlainObject(requestHashData)) {
        if (isEqual(
          collectionRecordHashId,
          getProperty(requestHashData, "hashId")
        ))
          setProperty(requestHash, "data", null);
      }
    });
  }
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
  _unloadFromAliases(collectionRecord) {
    const aliasesKeys = keysIn(this.aliases);
    const collectionRecordHashId = getProperty(collectionRecord, "hashId");
    forEach(aliasesKeys, (aliasKey) => {
      const aliasCollection = getProperty(this.aliases, aliasKey);
      if (isArray(aliasCollection)) {
        const aliasCollectionRecordIndex = findIndex(aliasCollection, {
          hashId: collectionRecordHashId
        });
        if (gte(aliasCollectionRecordIndex, 0))
          aliasCollection.splice(aliasCollectionRecordIndex, 1);
      }
      if (isPlainObject(aliasCollection)) {
        if (isEqual(
          collectionRecordHashId,
          getProperty(aliasCollection, "hashId")
        ))
          setProperty(this.aliases, aliasKey, null);
      }
    });
  }
  /**
   * Removes a record from all local data stores: its collection, any aliases, and any
   * request hashes that reference it.
   *
   * This is called automatically after a successful `destroyRecord`. You can also call
   * it manually to remove a record from local state without hitting the server.
   *
   * @param {CollectionRecord} currentRecord - The record to remove.
   *
   * @example
   * const record = ARM.peekRecord('addresses', 123)
   * ARM.unloadRecord(record)
   * // record is now gone from the collection and any aliases/request hashes
   */
  unloadRecord(currentRecord) {
    this._unloadFromCollection(currentRecord);
    this._unloadFromAliases(currentRecord);
    this._unloadFromRequestHashes(currentRecord);
  }
  /**
   * Saves a record to the server.
   *
   * Determines the HTTP method based on the record's `id`:
   * - **POST** when `id` is a UUID (i.e. a record created locally via `createRecord` that
   *   has never been persisted). After a successful POST, the temporary local record is
   *   unloaded and replaced with the server response.
   * - **PUT** when `id` is any non-UUID value (numeric or string) - meaning the record
   *   already exists on the server.
   *
   * @private
   * @param {CollectionRecord} currentRecord    - The record to be saved.
   * @param {RequestConfig}    [collectionConfig={}] - Optional request configuration.
   * @returns {Promise<CollectionRecord>} Resolves with the updated record on success.
   */
  _saveRecord(currentRecord, collectionConfig = {}) {
    const collectionName = getProperty(currentRecord, "collectionName");
    const collectionRecord = find(
      getProperty(this.collections, collectionName),
      {
        hashId: getProperty(currentRecord, "hashId")
      }
    );
    const collectionRecordId = getProperty(collectionRecord, "id");
    const isCollectionRecordIdValid = isEqual(
      validate(collectionRecordId),
      false
    );
    return this._request({
      resourceMethod: isCollectionRecordIdValid ? "put" : "post",
      resourceName: collectionName,
      resourceId: isCollectionRecordIdValid ? collectionRecordId : null,
      resourceParams: {},
      resourcePayload: { data: collectionRecord },
      resourceFallback: {},
      resourceConfig: { ...collectionConfig, autoResolveOrigin: "_internal" }
    });
  }
  /**
   * Deletes a record from the server.
   *
   * Sends a DELETE request using the record's `collectionName` and `id`. On success,
   * the record is automatically unloaded from the local collection, aliases, and
   * request hashes.
   *
   * @private
   * @param {CollectionRecord} currentRecord    - The record to delete.
   * @param {RequestConfig}    [collectionConfig={}] - Optional request configuration.
   * @returns {Promise<CollectionRecord>} Resolves with the server response record on success.
   */
  async _deleteRecord(currentRecord, collectionConfig = {}) {
    return this._request({
      resourceMethod: "delete",
      resourceName: getProperty(currentRecord, "collectionName"),
      resourceId: getProperty(currentRecord, "id"),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { ...collectionConfig, autoResolveOrigin: "_internal" }
    });
  }
  /**
   * Reloads a record from the server.
   *
   * Sends a GET request using the record's `collectionName` and `id`, then merges the
   * server response back into the local record. A unique `skipId` is added automatically
   * so the cache is always bypassed and the latest data is fetched.
   *
   * @private
   * @param {CollectionRecord} currentRecord    - The record to reload.
   * @param {RequestConfig}    [collectionConfig={}] - Optional request configuration.
   * @returns {Promise<CollectionRecord>} Resolves with the refreshed record on success.
   */
  async _reloadRecord(currentRecord, collectionConfig = {}) {
    return this._request({
      resourceMethod: "get",
      resourceName: getProperty(currentRecord, "collectionName"),
      resourceId: getProperty(currentRecord, "id"),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {
        ...collectionConfig,
        skipId: v1(),
        autoResolveOrigin: "_internal"
      }
    });
  }
  /**
   * Reverts the record's attributes to their original state.
   *
   * This method retrieves the stored `originalRecord` (excluding internal
   * ARM properties), applies those values back to the current record instance,
   * and resets the `isDirty` and `isPristine` state flags.
   *
   * @private
   * @returns {void}
   */
  _rollbackRecordAttributes() {
    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    );
    this.getARMContext()._setProperties(this, {
      ...originalRecord,
      isDirty: false,
      isPristine: true
    });
  }
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
  _getCollectionRecord(collectionName, collectionConfig = {}, currentRecord) {
    const collectionReferenceKey = getProperty(collectionConfig, "referenceKey") || "";
    const collectionAsync = getProperty(collectionConfig, "async") || false;
    const collectionFilterBy = getProperty(collectionConfig, "filterBy") || {};
    const collectionSortBy = getProperty(collectionConfig, "sortBy") || [];
    const recordsFromCurrentRecord = getProperty(currentRecord, collectionReferenceKey) || [];
    const isRecordsFromCurrentRecordObject = isPlainObject(
      recordsFromCurrentRecord
    );
    const resourceConfig = omit(collectionConfig, [
      "referenceKey",
      "async",
      "filterBy",
      "sortBy"
    ]);
    const relatedRecords = isRecordsFromCurrentRecordObject ? [recordsFromCurrentRecord] : recordsFromCurrentRecord;
    const collectionRecords = observable([]);
    forEach(relatedRecords, (relatedRecord) => {
      const relatedRecordId = getProperty(relatedRecord, "id");
      const collectionRecord = find(
        getProperty(this.collections, collectionName),
        {
          hashId: this._generateHashId({
            id: relatedRecordId,
            collectionName
          })
        }
      );
      if (!isEmpty(collectionRecord)) {
        collectionRecords.push(collectionRecord);
      } else {
        if (isEqual(collectionAsync, true)) {
          const requestObject = {
            resourceMethod: "get",
            resourceName: collectionName,
            resourceId: relatedRecordId,
            resourceParams: {},
            resourcePayload: null,
            resourceFallback: {},
            resourceConfig
          };
          const responseObject = defaultRequestObjectResponse;
          defer(() => {
            this._pushRequestHash(requestObject, responseObject);
            this._request(requestObject);
          });
        }
      }
    });
    return isRecordsFromCurrentRecordObject ? first(collectionRecords) : this._sortRecordsBy(
      filter(collectionRecords, collectionFilterBy),
      collectionSortBy
    );
  }
  /**
   * Injects action methods into a collection record.
   *
   * Decorates `collectionRecord` with the full record-level API defined in {@link CollectionRecord}:
   * - `get(key)` / `set(key, value)` / `setProperties(values)` - reactive property access
   * - `rollbackAttributes()` - revert unsaved changes
   * - `save(config)` - POST (new) or PUT (existing)
   * - `reload(config)` - re-fetch from server
   * - `destroyRecord(config)` - DELETE and unload
   * - `getCollection(collectionName, config)` - resolve related records from a local collection
   * - `getARMContext()` - returns the ARM instance that owns this record
   *
   * @private
   * @param {Object} collectionRecord - The collection record to decorate.
   */
  _injectCollectionActions(collectionRecord) {
    const armInstance = this;
    const actions = {
      get: armInstance._getRecordProperty,
      set: armInstance._setRecordProperty,
      setProperties: armInstance._setRecordProperties,
      rollbackAttributes: armInstance._rollbackRecordAttributes,
      getARMContext: () => armInstance,
      save: function(collectionConfig) {
        return armInstance._saveRecord(this, collectionConfig);
      },
      destroyRecord: function(collectionConfig) {
        return armInstance._deleteRecord(this, collectionConfig);
      },
      reload: function(collectionConfig) {
        return armInstance._reloadRecord(this, collectionConfig);
      },
      getCollection: function(collectionName, collectionConfig) {
        return armInstance._getCollectionRecord(
          collectionName,
          collectionConfig,
          this
        );
      }
    };
    const actionKeys = keysIn(actions);
    forEach(
      actionKeys,
      (actionKey) => setProperty(collectionRecord, actionKey, getProperty(actions, actionKey))
    );
  }
  /**
   * Decorates the response object with actionable methods.
   * * Attaches a `reload` method to the `responseObject` that, when invoked,
   * triggers a re-fetch of the original request using the stored hash key.
   *
   * @private
   * @param {Object} requestObject - The original request configuration.
   * @param {Object} responseObject - The object to be decorated with actions.
   * @param {string} requestHashKey - The unique identifier for the request in the store.
   */
  _injectRequestHashActions(requestObject, responseObject, requestHashKey) {
    const armInstance = this;
    const actions = {
      reload: function() {
        return armInstance._reloadRequest(requestObject, requestHashKey);
      }
    };
    const actionKeys = keysIn(actions);
    forEach(
      actionKeys,
      (actionKey) => setProperty(responseObject, actionKey, actions[actionKey])
    );
  }
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
  _injectCollectionReferenceKeys(collectionName, collectionRecord, collectionRecordHashId = null) {
    const recordHashId = isNull(collectionRecordHashId) ? this._generateHashId({
      id: getProperty(collectionRecord, "id"),
      collectionName
    }) : collectionRecordHashId;
    this._setProperties(collectionRecord, {
      collectionName,
      hashId: recordHashId,
      isLoading: false,
      isError: false,
      isPristine: true,
      isDirty: false
    });
    this._setProperties(collectionRecord, {
      originalRecord: omit(toJS(collectionRecord), keysToBeOmittedOnDeepCheck)
    });
  }
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
  _pushToCollection(collectionName, collectionRecords) {
    const collection = getProperty(this.collections, collectionName);
    if (isArray(collectionRecords)) {
      const collectionRecordsHashIds = map(collectionRecords, "hashId");
      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordIndex = findIndex(collection, {
          hashId: getProperty(collectionRecord, "hashId")
        });
        this._injectCollectionActions(collectionRecord);
        if (lt(collectionRecordIndex, 0)) collection.push(collectionRecord);
        if (gte(collectionRecordIndex, 0))
          this._setProperties(
            getProperty(collection, collectionRecordIndex),
            collectionRecord
          );
      });
      return map(
        collectionRecordsHashIds,
        (collectionRecordHashId) => find(collection, {
          hashId: collectionRecordHashId
        })
      );
    }
    if (isPlainObject(collectionRecords)) {
      const collectionRecordHashId = getProperty(collectionRecords, "hashId");
      const collectionRecordIndex = findIndex(collection, {
        hashId: collectionRecordHashId
      });
      this._injectCollectionActions(collectionRecords);
      if (lt(collectionRecordIndex, 0)) collection.push(collectionRecords);
      if (gte(collectionRecordIndex, 0))
        this._setProperties(
          getProperty(collection, collectionRecordIndex),
          collectionRecords
        );
      return find(collection, {
        hashId: collectionRecordHashId
      });
    }
  }
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
  _pushToAliases(collectionRecords) {
    const aliasesKeys = keysIn(this.aliases);
    collectionRecords = isArray(collectionRecords) ? collectionRecords : [collectionRecords];
    forEach(aliasesKeys, (aliasKey) => {
      const aliasCollection = getProperty(this.aliases, aliasKey);
      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordHashId = getProperty(collectionRecord, "hashId");
        if (isArray(aliasCollection)) {
          const aliasCollectionRecordIndex = findIndex(aliasCollection, {
            hashId: collectionRecordHashId
          });
          if (gte(aliasCollectionRecordIndex, 0))
            setProperty(
              aliasCollection,
              aliasCollectionRecordIndex,
              collectionRecord
            );
        }
        if (isPlainObject(aliasCollection)) {
          if (isEqual(
            collectionRecordHashId,
            getProperty(aliasCollection, "hashId")
          ))
            setProperty(this.aliases, aliasKey, collectionRecord);
        }
      });
    });
  }
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
  _pushToRequestHashes(collectionRecords) {
    const requestHashesKeys = keysIn(this.requestHashes);
    collectionRecords = isArray(collectionRecords) ? collectionRecords : [collectionRecords];
    forEach(requestHashesKeys, (requestHashKey) => {
      const requestHash = getProperty(this.requestHashes, requestHashKey);
      const requestHashData = getProperty(requestHash, "data");
      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordHashId = getProperty(collectionRecord, "hashId");
        if (isArray(requestHashData)) {
          const requestHashRecordIndex = findIndex(requestHashData, {
            hashId: collectionRecordHashId
          });
          if (gte(requestHashRecordIndex, 0))
            setProperty(
              requestHash,
              ["data", requestHashRecordIndex],
              collectionRecord
            );
        }
        if (isPlainObject(requestHashData)) {
          if (isEqual(
            collectionRecordHashId,
            getProperty(requestHashData, "hashId")
          ))
            setProperty(requestHash, "data", collectionRecord);
        }
      });
    });
  }
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
  _pushPayload(collectionName, collectionRecords) {
    this._isCollectionExisting(collectionName);
    const updatedCollectionRecords = this._pushToCollection(
      collectionName,
      collectionRecords
    );
    this._pushToAliases(updatedCollectionRecords);
    this._pushToRequestHashes(updatedCollectionRecords);
    return updatedCollectionRecords;
  }
  /**
   * Injects ARM reference keys into raw record objects and pushes them into the named collection.
   *
   * Unlike the internal `_pushPayload`, this public method first stamps each record with ARM's
   * internal metadata (`hashId`, `collectionName`, `isLoading`, `isError`, `isPristine`,
   * `isDirty`, `originalRecord`) before pushing. Use this to load records into a collection
   * from sources other than an API request (e.g. server-side props, local fixtures).
   *
   * @param {string}         collectionName    - The collection to push records into.
   * @param {Object|Object[]} collectionRecords - A single record object or an array of records.
   * @throws {Error} If `collectionName` was not registered during ARM initialization.
   *
   * @example
   * ARM.pushPayload('addresses', [
   *   { id: 1, type: 'addresses', attributes: { address1: '123 Main St' } },
   *   { id: 2, type: 'addresses', attributes: { address1: '456 Oak Ave' } },
   * ])
   *
   * @example
   * // Single record
   * ARM.pushPayload('addresses', { id: 'ABC-001', type: 'addresses', attributes: { address1: 'HQ' } })
   */
  pushPayload(collectionName, collectionRecords) {
    this._isCollectionExisting(collectionName);
    if (isArray(collectionRecords))
      forEach(
        collectionRecords,
        (collectionRecord) => this._injectCollectionReferenceKeys(collectionName, collectionRecord)
      );
    if (isPlainObject(collectionRecords))
      this._injectCollectionReferenceKeys(collectionName, collectionRecords);
    this._pushPayload(collectionName, collectionRecords);
  }
  /**
   * Caches a request/response pair in the internal hash store.
   * * Generates a unique key based on the request and performs one of two actions:
   * 1. If the key exists and the new response is marked `isNew`, it toggles the
   * existing entry's `isNew` flag to `false`.
   * 2. Otherwise, it stores the new response object under that key.
   * * Also injects contextual actions (e.g., reload) into the response object.
   *
   * @private
   * @param {Object} requestObject - The source object used to generate the hash key.
   * @param {Object} responseObject - The data/state to be stored.
   * @returns {Object} The stored request hash entry.
   */
  _pushRequestHash(requestObject, responseObject) {
    const requestHashKey = this._generateHashId(requestObject);
    this._injectRequestHashActions(
      requestObject,
      responseObject,
      requestHashKey
    );
    if (!isNil(getProperty(this.requestHashes, requestHashKey)) && getProperty(responseObject, "isNew")) {
      setProperty(this.requestHashes, [requestHashKey, "isNew"], false);
    } else {
      setProperty(this.requestHashes, requestHashKey, responseObject);
    }
    return getProperty(this.requestHashes, requestHashKey);
  }
  /**
   * Sets the API base host URL and updates the Axios `baseURL` immediately.
   *
   * @param {string} host - The base URL of the API server (no trailing slash).
   *
   * @example
   * ARM.setHost('https://api.example.com')
   */
  setHost(host) {
    setProperty(this, "host", host);
    this._initializeAxiosConfig();
  }
  /**
   * Sets the API namespace used as the path prefix in every request URL.
   *
   * Combined with `host`, this forms the Axios `baseURL`: `{host}/{namespace}`.
   * Defaults to `'api/v1'`.
   *
   * @param {string} namespace - The namespace (e.g. `'api/v2'`).
   *
   * @example
   * ARM.setNamespace('api/v2')
   * // All subsequent requests go to https://api.example.com/api/v2/...
   */
  setNamespace(namespace) {
    setProperty(this, "namespace", namespace);
  }
  /**
   * Sets a header that is sent on every Axios request made by ARM.
   *
   * @param {string}                key   - Header name (e.g. `'Authorization'`, `'Content-Type'`).
   * @param {string|number|boolean} value - Header value.
   *
   * @example
   * ARM.setHeadersCommon('Authorization', `Bearer ${token}`)
   * ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
   * ARM.setHeadersCommon('X-Client-Platform', 'Web')
   */
  setHeadersCommon(key, value) {
    setProperty(axios, ["defaults", "headers", "common", key], value);
  }
  /**
   * Sets the key ARM reads from each `included` item to determine which collection it belongs to.
   *
   * Defaults to `'type'`, matching the JSON:API convention where `included[].type` names
   * the resource type. Override this if your API uses a different field name.
   *
   * @param {string} key - The property name to read from each included record (default: `'type'`).
   *
   * @example
   * // JSON:API default - included items have a `type` field
   * ARM.setPayloadIncludeReference('type')
   *
   * @example
   * // Custom API that uses `resource_type` instead
   * ARM.setPayloadIncludeReference('resource_type')
   */
  setPayloadIncludeReference(key) {
    setProperty(this, "payloadIncludedReference", key);
  }
  /**
   * Attaches this ARM instance to `window.ARM` in browser environments.
   *
   * The instance is frozen with `Object.freeze()` to prevent accidental mutation.
   * This is a convenience for debugging and for accessing ARM from outside a React
   * component tree. No-op in non-browser (SSR) environments.
   *
   * @example
   * ARM.setGlobal()
   * // Now accessible anywhere in the browser as window.ARM
   */
  setGlobal() {
    if (typeof window !== "undefined") window.ARM = Object.freeze(this);
  }
  /**
   * Returns all records in a collection as a MobX observable array.
   *
   * Returns an empty observable array if the collection has no records yet.
   * Unlike `peekAll`, this always returns an observable so components can
   * react to future changes.
   *
   * @param {string} collectionName - The registered collection name.
   * @returns {CollectionRecord[]} Observable array of all records in the collection.
   *
   * @example
   * const addresses = ARM.getCollection('addresses')
   * // addresses is a live observable array - updates when records are added/removed
   */
  getCollection(collectionName) {
    return getProperty(this.collections, collectionName) || observable([]);
  }
  /**
   * Unloads a collection by resetting it to an empty array.
   *
   * This method removes all records from the specified collection in the
   * `collections` object of the `ApiResourceManager`.
   *
   * @private
   * @param {string} collectionName - The name of the collection to unload.
   */
  _unloadCollection(collectionName) {
    setProperty(this.collections, collectionName, []);
  }
  /**
   * Removes all records from a collection and cleans up any references to those
   * records in aliases and request hashes.
   *
   * @param {string} collectionName - The registered collection name to clear.
   *
   * @example
   * ARM.clearCollection('addresses')
   * // All address records are removed from local state
   */
  clearCollection(collectionName) {
    const clonedCollectionRecords = cloneDeep(
      getProperty(this.collections, collectionName)
    );
    this._unloadCollection(collectionName);
    forEach(clonedCollectionRecords, (clonedCollectionRecord) => {
      this._unloadFromAliases(clonedCollectionRecord);
      this._unloadFromRequestHashes(clonedCollectionRecord);
    });
  }
  /**
   * Returns the records stored under an alias, or `fallbackRecords` if the alias is not yet set.
   *
   * Aliases are populated when a request is made with `{ alias: 'myAlias' }` in the config.
   * If `fallbackRecords` is a plain object, ARM injects the record-level action methods into
   * it so it can be used as a placeholder record before the real data arrives.
   *
   * @param {string}           aliasName       - The alias name to look up.
   * @param {Object|Object[]}  [fallbackRecords] - Returned as an observable if the alias is empty.
   * @returns {CollectionRecord|CollectionRecord[]} The aliased records or the fallback.
   *
   * @example
   * // Populate the alias via a request
   * ARM.findRecord('addresses', 123, null, { alias: 'currentAddress' })
   *
   * // Read it back (returns fallback object until the request resolves)
   * const address = ARM.getAlias('currentAddress', {})
   *
   * @example
   * // Array alias
   * ARM.findAll('addresses', { alias: 'allAddresses' })
   * const addresses = ARM.getAlias('allAddresses', [])
   */
  getAlias(aliasName, fallbackRecords) {
    if (isPlainObject(fallbackRecords))
      this._injectCollectionActions(fallbackRecords);
    return getProperty(this.aliases, aliasName) || observable(fallbackRecords);
  }
  /**
   * Returns the request hash object for a named alias.
   *
   * The request hash contains the full request state (`isLoading`, `isError`, `data`,
   * `error`, `included`, `meta`, and a `reload()` method) for the most recent request
   * that used the given `alias`. Returns `null` if no request has used that alias yet.
   *
   * @param {string} aliasName - The alias name to resolve.
   * @returns {Object|null} The request hash object, or `null` if not found.
   *
   * @example
   * ARM.findAll('addresses', { alias: 'allAddresses' })
   *
   * const requestState = ARM.getRequestAlias('allAddresses')
   * console.log(requestState.isLoading) // true while fetching
   * console.log(requestState.meta)      // pagination metadata, etc.
   * requestState.reload()               // re-trigger the original request
   */
  getRequestAlias(aliasName) {
    const requestHashKey = getProperty(this.requestAliases, aliasName);
    return getProperty(this.requestHashes, requestHashKey) || null;
  }
  /**
   * Creates a new local record in the named collection without making a network request.
   *
   * The record is pushed into the collection immediately as an observable object with
   * the full ARM record API injected (`get`, `set`, `save`, `reload`, etc.).
   *
   * By default, ARM assigns a UUID v1 as the record's `id`. This UUID signals to
   * `record.save()` that the record is new and should be sent as a POST request.
   * Pass `collectionRecordRandomId = false` to assign the nil UUID instead (useful
   * when you need a known placeholder ID).
   *
   * @param {string}  collectionName           - The registered collection to create the record in.
   * @param {Object}  [collectionRecord={}]    - Initial attribute data for the record.
   * @param {boolean} [collectionRecordRandomId=true] - `true` to assign a random UUID; `false` for nil UUID.
   * @returns {CollectionRecord} The newly created observable record.
   *
   * @example
   * const newAddress = ARM.createRecord('addresses', {
   *   attributes: { address1: '123 Main St', kind: 'home' },
   * })
   *
   * // Persist to the server (sends POST /addresses)
   * await newAddress.save()
   */
  createRecord(collectionName, collectionRecord = {}, collectionRecordRandomId = true) {
    const collection = getProperty(this.collections, collectionName);
    const collectionRecordId = collectionRecordRandomId ? v1() : NIL;
    const isCollectionRecordNotExisting = isNil(
      find(collection, {
        id: collectionRecordId
      })
    );
    setProperty(collectionRecord, "id", collectionRecordId);
    this._injectCollectionReferenceKeys(collectionName, collectionRecord);
    this._injectCollectionActions(collectionRecord);
    if (isCollectionRecordNotExisting) collection.push(collectionRecord);
    return find(collection, {
      id: collectionRecordId
    });
  }
  /**
   * Reloads a request by updating its skip ID and re-executing the request.
   *
   * This method modifies the `requestObject` by generating a new skip ID
   * using `uuidv1()` and setting `autoResolve` to `false` and `autoResolveOrigin`
   * to `'_internal'`. It then re-executes the request using the `_request`
   * method. During the reload process, it sets the `isLoading` flag of the
   * corresponding request hash to `true` and resets it to `false` after
   * the request is completed.
   *
   * @private
   * @param {Object} requestObject - The request object to reload.
   * @param {string} requestHashKey - The key of the request hash to update.
   * @returns {Promise<void>} A promise that resolves when the request is reloaded.
   */
  async _reloadRequest(requestObject, requestHashKey) {
    runInAction(() => {
      setProperty(this.requestHashes, [requestHashKey, "isLoading"], true);
      setProperty(requestObject, "resourceConfig.skipId", v1());
      setProperty(requestObject, "resourceConfig.autoResolve", false);
      setProperty(
        requestObject,
        "resourceConfig.autoResolveOrigin",
        "_internal"
      );
    });
    await this._request(requestObject);
    runInAction(() => {
      setProperty(this.requestHashes, [requestHashKey, "isLoading"], false);
    });
    return getProperty(this.requestHashes, requestHashKey);
  }
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
  _resolveRequest(config, requestXHR, requestHashObject) {
    const hasAutoResolveConfig = !isNil(getProperty(config, "autoResolve"));
    const isAutoResolve = hasAutoResolveConfig ? getProperty(config, "autoResolve") : true;
    if (isAutoResolve) {
      return requestHashObject;
    } else {
      return requestXHR;
    }
  }
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
   * @param {Object} [requestConfig.resourceConfig] - Optional configuration overrides for the request (e.g., alias, autoResolve, skip, ignorePayload, override).
   *
   * @returns {Promise<*>} A Promise that resolves with the API response data or the request hash object (if autoResolve is true), or rejects with an error.
   *
   * @async
   */
  async _request({
    resourceMethod,
    resourceName,
    resourceId,
    resourceParams,
    resourcePayload,
    resourceFallback,
    resourceConfig
  }) {
    const requestOptions = {
      method: resourceMethod,
      url: resourceName,
      paramsSerializer: {
        serialize: function(params) {
          return qs.stringify(params, { arrayFormat: "brackets" });
        }
      }
    };
    const isResourceMethodGet = isEqual(resourceMethod, "get");
    const isResourceMethodDelete = isEqual(resourceMethod, "delete");
    const isResourceMethodPost = isEqual(resourceMethod, "post");
    const isResourceIdValid = isNumber(resourceId) || isString(resourceId);
    const hasResourceParams = !isEmpty(resourceParams);
    const hasResourcePayload = !isEmpty(resourcePayload);
    const hasResourceAlias = !isNil(getProperty(resourceConfig, "alias"));
    const hasResourceConfigOverride = !isNil(
      getProperty(resourceConfig, "override")
    );
    const resourceIgnorePayload = getProperty(resourceConfig, "ignorePayload") || [];
    const resourcePayloadRecord = getProperty(resourcePayload, "data") || null;
    const collectionRecordById = isResourceIdValid ? find(getProperty(this.collections, resourceName), {
      id: resourceId
    }) : null;
    const hasResourceAutoResolveOrigin = !isNil(
      getProperty(resourceConfig, "autoResolveOrigin")
    );
    const hasResourceAutoResolve = !isNil(
      getProperty(resourceConfig, "autoResolve")
    );
    const isAutoResolve = hasResourceAutoResolve ? getProperty(resourceConfig, "autoResolve") : true;
    if (isResourceIdValid)
      this._processRequestURL(resourceName, resourceId, requestOptions);
    if (hasResourceConfigOverride)
      this._processRequestOverride(resourceConfig, requestOptions);
    if (hasResourceParams) setProperty(requestOptions, "params", resourceParams);
    if (hasResourcePayload)
      this._processRequestPayload(
        resourceIgnorePayload,
        resourcePayloadRecord,
        requestOptions
      );
    const hasSkipRequest = !isNil(getProperty(resourceConfig, "skip"));
    const skipRequest = isEqual(getProperty(resourceConfig, "skip"), true);
    const requestHashKey = this._generateHashId({ ...arguments[0] });
    const requestHash = getProperty(this.requestHashes, requestHashKey);
    const isRequestHashExisting = !isNil(requestHash);
    const isRequestNew = getProperty(requestHash, "isNew");
    if (isResourceMethodGet) {
      if (hasSkipRequest && skipRequest) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash);
        return;
      }
      if (!hasSkipRequest && isRequestHashExisting && !isRequestNew) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash);
        return;
      }
      if (hasSkipRequest && !skipRequest && isRequestHashExisting && !isRequestNew) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash);
        return;
      }
    }
    if (hasResourcePayload)
      setProperty(resourcePayloadRecord, "isLoading", true);
    if (isResourceIdValid) setProperty(collectionRecordById, "isLoading", true);
    try {
      const resourceRequest = await axios(requestOptions);
      const resourceResults = getProperty(resourceRequest, ["data", "data"]) || resourceFallback;
      const resourceIncludedResults = getProperty(resourceRequest, ["data", "included"]) || [];
      const resourceMetaResults = getProperty(resourceRequest, ["data", "meta"]) || {};
      let updatedDataCollectionRecords = null;
      let updatedIncludedCollectionRecords = [];
      if (isArray(resourceResults))
        forEach(
          resourceResults,
          (resourceResult) => this._injectCollectionReferenceKeys(resourceName, resourceResult)
        );
      if (isPlainObject(resourceResults))
        this._injectCollectionReferenceKeys(resourceName, resourceResults);
      forEach(resourceIncludedResults, (resourceIncludedResult) => {
        this._injectCollectionReferenceKeys(
          getProperty(resourceIncludedResult, this.payloadIncludedReference),
          resourceIncludedResult
        );
        updatedIncludedCollectionRecords.push(
          this._pushPayload(
            getProperty(resourceIncludedResult, "collectionName"),
            resourceIncludedResult
          )
        );
      });
      updatedDataCollectionRecords = await this._pushPayload(
        resourceName,
        resourceResults
      );
      if (hasResourceAlias)
        this._processRequestAlias(arguments[0], updatedDataCollectionRecords);
      if (isResourceMethodPost) this.unloadRecord(resourcePayloadRecord);
      if (isResourceMethodDelete)
        this.unloadRecord(updatedDataCollectionRecords);
      this._pushRequestHash(arguments[0], {
        isLoading: false,
        isError: false,
        isNew: false,
        data: updatedDataCollectionRecords,
        error: null,
        included: updatedIncludedCollectionRecords,
        meta: resourceMetaResults
      });
      if (hasResourceAutoResolveOrigin)
        return Promise.resolve(updatedDataCollectionRecords);
      return Promise.resolve(requestHash);
    } catch (errors) {
      if (hasResourcePayload)
        this._setProperties(resourcePayloadRecord, {
          isError: true,
          isLoading: false
        });
      if (isResourceIdValid)
        this._setProperties(collectionRecordById, {
          isError: true,
          isLoading: false
        });
      this._pushRequestHash(arguments[0], {
        isLoading: false,
        isError: true,
        isNew: false,
        data: resourceFallback,
        error: errors,
        included: [],
        meta: {}
      });
      if (hasResourceAutoResolveOrigin) return Promise.reject(errors);
      return Promise.reject(requestHash);
    }
  }
  /**
   * Processes the payload for a request, omitting specified keys and setting it in the request options.
   *
   * @param {string[]} resourceIgnorePayload - An array of keys to be ignored (omitted) from the payload.
   * @param {Object} resourcePayloadRecord - The record object containing the payload data.
   * @param {Object} requestOptions - The options object for the request, where the processed payload will be set.
   */
  _processRequestPayload(resourceIgnorePayload, resourcePayloadRecord, requestOptions) {
    setProperty(requestOptions, "data", {
      data: omit(resourcePayloadRecord, [
        ...resourceIgnorePayload,
        ...keysToBeOmittedOnRequestPayload
      ])
    });
  }
  /**
   * Processes the URL for a request, constructing it from the resource name and ID.
   *
   * @param {Object} requestOptions - The options object for the request, where the URL will be set.
   * @param {string} resourceName - The name of the resource being accessed.
   * @param {string|number} resourceId - The ID of the specific resource.
   */
  _processRequestURL(resourceName, resourceId, requestOptions) {
    setProperty(requestOptions, "url", `${resourceName}/${resourceId}`);
  }
  /**
   * Processes an alias for a request, mapping both the records and the request hash.
   *
   * This method extracts the alias name from the request configuration and:
   * 1. Maps the alias name to the provided collection records in the aliases store.
   * 2. Maps the alias name to the generated request hash key in the request aliases store.
   *
   * @private
   * @param {Object} requestObject - The full request object used to generate the hash ID
   * and containing the resource configuration.
   * @param {Array|Object} collectionRecords - The records to be aliased. Can be an array
   * or a single object.
   */
  _processRequestAlias(requestObject, collectionRecords) {
    const requestHashKey = this._generateHashId(requestObject);
    const requestAliasName = getProperty(requestObject, "resourceConfig.alias");
    this._addAlias(requestAliasName, collectionRecords);
    this._addRequestAlias(requestAliasName, requestHashKey);
  }
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
  _processRequestOverride(resourceConfig, requestOptions) {
    const override = getProperty(resourceConfig, "override") || {};
    const overrideHost = !isNil(getProperty(override, "host")) ? getProperty(override, "host") : this.host;
    const overrideNamespace = !isNil(getProperty(override, "namespace")) ? getProperty(override, "namespace") : this.namespace;
    const overrideBaseURL = `${overrideHost}/${overrideNamespace}`;
    const overrideURL = !isNil(getProperty(override, "path")) ? getProperty(override, "path") : getProperty(requestOptions, "url");
    const overrideHeaders = !isNil(getProperty(override, "headers")) ? getProperty(override, "headers") : {};
    const commonHeaders = getProperty(axios, ["defaults", "headers", "common"]);
    const overrideCommonHeaders = assign(commonHeaders, overrideHeaders);
    this._setProperties(requestOptions, {
      baseURL: overrideBaseURL,
      url: overrideURL,
      headers: overrideCommonHeaders
    });
  }
  /**
   * Fetches multiple records from the server (`GET /{resource}`).
   *
   * By default returns a reactive request hash object immediately (before the request
   * resolves) so it can be bound directly in a component. Set `config.autoResolve: false`
   * to receive a Promise instead.
   *
   * @param {string}        resource    - The resource name / collection name (e.g. `'addresses'`).
   * @param {Object}        [params={}] - Query parameters appended to the request URL.
   * @param {RequestConfig} [config={}] - Request configuration options.
   * @returns {Object|Promise} Reactive request hash (default) or Axios Promise when `autoResolve: false`.
   * @throws {Error} If `resource` is not a registered collection.
   *
   * @example
   * // Reactive (default) - bind directly in a component
   * const result = ARM.query('addresses', { 'filter[kind]': 'home' }, { alias: 'homeAddresses' })
   * result.isLoading // true while fetching
   * result.data      // array of CollectionRecord
   *
   * @example
   * // Awaitable - full control over loading state
   * const result = await ARM.query('addresses', { include: 'users' }, { autoResolve: false })
   */
  query(resource, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: "get",
      resourceName: resource,
      resourceId: null,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: config
    };
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestArrayResponse
    );
    const requestXHR = this._request(requestObject);
    return this._resolveRequest(config, requestXHR, requestHashObject);
  }
  /**
   * Fetches a single record from the server without an ID (`GET /{resource}`).
   *
   * Unlike `findRecord`, no ID is appended to the URL - the server is expected to
   * return a single object (e.g. the current user's profile, a singleton resource).
   *
   * @param {string}        resource    - The resource name / collection name.
   * @param {Object}        [params={}] - Query parameters appended to the request URL.
   * @param {RequestConfig} [config={}] - Request configuration options.
   * @returns {Object|Promise} Reactive request hash (default) or Axios Promise when `autoResolve: false`.
   * @throws {Error} If `resource` is not a registered collection.
   *
   * @example
   * // Reactive
   * const result = ARM.queryRecord('addresses', { 'filter[id]': 123 }, { alias: 'currentAddress' })
   * result.isLoading // true while fetching
   * result.data      // CollectionRecord once resolved
   *
   * @example
   * // Awaitable
   * await ARM.queryRecord('profile', {}, { autoResolve: false })
   */
  queryRecord(resource, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: "get",
      resourceName: resource,
      resourceId: null,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: config
    };
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestObjectResponse
    );
    const requestXHR = this._request(requestObject);
    return this._resolveRequest(config, requestXHR, requestHashObject);
  }
  /**
   * Fetches all records from the server without query parameters (`GET /{resource}`).
   *
   * Equivalent to `query(resource, {}, config)` but signals intent more clearly when
   * no filtering is needed.
   *
   * @param {string}        resource    - The resource name / collection name.
   * @param {RequestConfig} [config={}] - Request configuration options.
   * @returns {Object|Promise} Reactive request hash (default) or Axios Promise when `autoResolve: false`.
   * @throws {Error} If `resource` is not a registered collection.
   *
   * @example
   * // Reactive
   * const result = ARM.findAll('addresses', { alias: 'allAddresses' })
   * result.isLoading // true while fetching
   * result.data      // CollectionRecord[] once resolved
   *
   * @example
   * // Awaitable
   * await ARM.findAll('addresses', { autoResolve: false })
   */
  findAll(resource, config = {}) {
    const requestObject = {
      resourceMethod: "get",
      resourceName: resource,
      resourceId: null,
      resourceParams: null,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: config
    };
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestArrayResponse
    );
    const requestXHR = this._request(requestObject);
    return this._resolveRequest(config, requestXHR, requestHashObject);
  }
  /**
   * Fetches a single record by ID from the server (`GET /{resource}/{id}`).
   *
   * Accepts both numeric and string IDs (string ID support added in v2.9.0).
   *
   * @param {string}        resource    - The resource name / collection name.
   * @param {number|string} id          - The record ID to fetch.
   * @param {Object}        [params={}] - Query parameters appended to the request URL.
   * @param {RequestConfig} [config={}] - Request configuration options.
   * @returns {Object|Promise} Reactive request hash (default) or Axios Promise when `autoResolve: false`.
   * @throws {Error} If `resource` is not a registered collection.
   *
   * @example
   * // Reactive - numeric ID
   * const result = ARM.findRecord('addresses', 123, null, { alias: 'currentAddress' })
   * result.isLoading // true while fetching
   * result.data      // CollectionRecord once resolved
   *
   * @example
   * // String ID
   * ARM.findRecord('addresses', 'JO-26181S4VPU65', null, { alias: 'currentAddress' })
   *
   * @example
   * // Awaitable with query params
   * await ARM.findRecord('addresses', 123, { include: 'user' }, { autoResolve: false })
   */
  findRecord(resource, id, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: "get",
      resourceName: resource,
      resourceId: id,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: config
    };
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestObjectResponse
    );
    const requestXHR = this._request(requestObject);
    return this._resolveRequest(config, requestXHR, requestHashObject);
  }
  /**
   * Returns all locally cached records in a collection without making a network request.
   *
   * @param {string} collectionName - The registered collection name.
   * @returns {CollectionRecord[]|undefined} The array of cached records, or `undefined`
   *   if the collection has not been initialized.
   *
   * @example
   * const addresses = ARM.peekAll('addresses')
   * // Returns whatever is currently in the local collection (may be empty)
   */
  peekAll(collectionName) {
    return getProperty(this.collections, collectionName);
  }
  /**
   * Returns a single locally cached record by ID without making a network request.
   *
   * Accepts both numeric and string IDs (string ID support added in v2.9.0).
   *
   * @param {string}        collectionName    - The registered collection name.
   * @param {number|string} collectionRecordId - The record ID to look up.
   * @returns {CollectionRecord|undefined} The matching record, or `undefined` if not in the local cache.
   *
   * @example
   * // Numeric ID
   * const address = ARM.peekRecord('addresses', 123)
   *
   * @example
   * // String ID
   * const address = ARM.peekRecord('addresses', 'JO-26181S4VPU65')
   */
  peekRecord(collectionName, collectionRecordId) {
    return find(getProperty(this.collections, collectionName), {
      id: collectionRecordId
    });
  }
  /**
   * @private
   * @param {string} rootScopeProperty - Property name.
   * @param {*}      rootScopeValue    - Value to set.
   */
  _setRootScope(rootScopeProperty, rootScopeValue) {
    setProperty(this.rootScope, rootScopeProperty, rootScopeValue);
  }
  /**
   * Stores a value in the shared reactive root scope.
   *
   * The root scope is a MobX observable object that lives on the ARM instance,
   * making it a lightweight global state store accessible from any component
   * that has access to ARM.
   *
   * @param {string} rootScopeProperty - The property name to set (supports dot notation).
   * @param {*}      rootScopeValue    - The value to store.
   *
   * @example
   * ARM.setRootScope('currentUser', { id: 1, name: 'Alice' })
   * ARM.setRootScope('ui.sidebarOpen', true)
   */
  setRootScope(rootScopeProperty, rootScopeValue) {
    this._setRootScope(rootScopeProperty, rootScopeValue);
  }
  /**
   * Reads a value from the shared reactive root scope.
   *
   * @param {string} rootScopeProperty - The property name to read (supports dot notation).
   * @returns {*} The stored value, or `undefined` if not set.
   *
   * @example
   * const user = ARM.getRootScope('currentUser')
   * const isOpen = ARM.getRootScope('ui.sidebarOpen')
   */
  getRootScope(rootScopeProperty) {
    return getProperty(this.rootScope, rootScopeProperty);
  }
  /**
   * Makes a raw Axios request using the ARM instance's configured headers and base URL.
   *
   * Use this for one-off requests that don't map to a collection (e.g. file uploads,
   * action endpoints, or any API call where you don't need record management).
   *
   * @param {Object} [config={}] - Any valid Axios request config object.
   * @returns {Promise} Resolves with the Axios response or rejects with an error.
   *
   * @example
   * const response = await ARM.ajax({
   *   method: 'post',
   *   url: '/addresses/bulk-delete',
   *   data: { ids: [1, 2, 3] },
   * })
   */
  ajax(config = {}) {
    return axios.request(config);
  }
  /**
   * Returns the first object in an array that matches the given properties.
   *
   * @param {Object[]} objects              - The array to search.
   * @param {Object}   [findProperties={}] - Key-value pairs to match against.
   * @returns {Object|undefined} The first matching object, or `undefined`.
   *
   * @example
   * const home = ARM.findBy(addresses, { attributes: { kind: 'home' } })
   */
  findBy(objects, findProperties = {}) {
    return find(objects, findProperties);
  }
  /**
   * Returns the index of the first object in an array that matches the given properties.
   *
   * @param {Object[]} objects                   - The array to search.
   * @param {Object}   [findIndexProperties={}]  - Key-value pairs to match against.
   * @returns {number} The index of the first match, or `-1` if not found.
   *
   * @example
   * const idx = ARM.findIndexBy(addresses, { id: 123 })
   */
  findIndexBy(objects, findIndexProperties = {}) {
    return findIndex(objects, findIndexProperties);
  }
  /**
   * Returns all objects in an array that match the given properties.
   *
   * @param {Object[]} objects               - The array to filter.
   * @param {Object}   [filterProperties={}] - Key-value pairs to match against.
   * @returns {Object[]} Array of matching objects (empty array if none match).
   *
   * @example
   * const homeAddresses = ARM.filterBy(addresses, { attributes: { kind: 'home' } })
   */
  filterBy(objects, filterProperties = {}) {
    return filter(objects, filterProperties);
  }
  /**
   * Returns a new array with duplicate objects removed, comparing by a given property.
   *
   * @param {Object[]} objects        - The source array.
   * @param {string}   uniqByProperty - The property to determine uniqueness by.
   * @returns {Object[]} Array with duplicates (by property) removed.
   *
   * @example
   * const unique = ARM.uniqBy(addresses, 'attributes.city')
   */
  uniqBy(objects, uniqByProperty) {
    return uniqBy(objects, uniqByProperty);
  }
  /**
   * Returns a new array with duplicate primitive values removed.
   *
   * @param {*[]} values - The source array of primitive values.
   * @returns {*[]} Array with duplicates removed.
   *
   * @example
   * ARM.uniq([1, 2, 2, 3]) // [1, 2, 3]
   */
  uniq(values) {
    return uniq(values);
  }
  /**
   * Groups objects into arrays keyed by the value of a specified property.
   *
   * @param {Object[]} objects          - The array to group.
   * @param {string}   groupByProperty  - The property whose value becomes the group key.
   * @returns {Object} An object where each key is a distinct property value and each
   *   value is an array of matching objects.
   *
   * @example
   * const byKind = ARM.groupBy(addresses, 'attributes.kind')
   * // { home: [...], office: [...] }
   */
  groupBy(objects, groupByProperty) {
    return groupBy(objects, groupByProperty);
  }
  /**
   * Extracts a single property from every object in an array.
   *
   * @param {Object[]} objects       - The array to map over.
   * @param {string}   mapByProperty - Dot-notation path to the property to extract.
   * @returns {*[]} A new array of the extracted values.
   *
   * @example
   * const ids = ARM.mapBy(addresses, 'id')
   * const cities = ARM.mapBy(addresses, 'attributes.city')
   */
  mapBy(objects, mapByProperty) {
    return map(objects, mapByProperty);
  }
  /**
   * Returns the first element of an array.
   *
   * @param {Object[]} [objects=[]] - The source array.
   * @returns {Object|undefined} The first element, or `undefined` if the array is empty.
   *
   * @example
   * const first = ARM.firstObject(addresses)
   */
  firstObject(objects = []) {
    return first(objects);
  }
  /**
   * Returns the last element of an array.
   *
   * @param {Object[]} [objects=[]] - The source array.
   * @returns {Object|undefined} The last element, or `undefined` if the array is empty.
   *
   * @example
   * const last = ARM.lastObject(addresses)
   */
  lastObject(objects = []) {
    return last(objects);
  }
  /**
   * Concatenates two arrays and removes duplicate objects (deep equality check).
   *
   * @param {Object[]} [objects=[]]      - The first array.
   * @param {Object[]} [otherObjects=[]] - The second array to merge in.
   * @returns {Object[]} A new array with all unique objects from both inputs.
   *
   * @example
   * const merged = ARM.mergeObjects(localAddresses, serverAddresses)
   */
  mergeObjects(objects = [], otherObjects = []) {
    return uniqWith(concat(objects, otherObjects), isEqual);
  }
  /**
   * Splits an array into smaller arrays (chunks) of a given size.
   *
   * @param {Object[]} [objects=[]]  - The array to split.
   * @param {number}   [chunkSize=1] - Maximum number of elements per chunk.
   * @returns {Object[][]} Array of chunk arrays.
   *
   * @example
   * ARM.chunkObjects(addresses, 10)
   * // [[...10 items...], [...10 items...], ...]
   */
  chunkObjects(objects = [], chunkSize = 1) {
    return chunk(objects, chunkSize);
  }
  /**
   * Sorts an array of objects by one or more properties.
   *
   * Each entry in `sortProperties` is a string in the format `'property:order'`
   * where `order` is `'asc'` or `'desc'`. Supports dot-notation for nested properties.
   *
   * @param {Object[]} objects         - The array to sort.
   * @param {string[]} sortProperties  - Sort descriptors in `'property:order'` format.
   * @returns {Object[]} A new sorted array.
   *
   * @example
   * ARM.sortBy(addresses, ['attributes.city:asc', 'id:desc'])
   */
  sortBy(objects, sortProperties) {
    return this._sortRecordsBy(objects, sortProperties);
  }
  /**
   * Returns the sum of all values in an array of numbers.
   *
   * @param {number[]} objects - The array of numbers to sum.
   * @returns {number} The total sum.
   *
   * @example
   * ARM.sum([10, 20, 30]) // 60
   */
  sum(objects) {
    return sum(objects);
  }
  /**
   * Sums the value of a specific numeric property across all objects in an array.
   *
   * Returns `0` if the result is not a number (guards against `NaN` from missing properties).
   *
   * @param {Object[]} objects       - The array of objects.
   * @param {string}   sumByProperty - Dot-notation path to the numeric property.
   * @returns {number} The total sum, or `0` if the result is not a valid number.
   *
   * @example
   * ARM.sumBy(orderItems, 'attributes.quantity')
   */
  sumBy(objects, sumByProperty) {
    const total = sumBy(objects, sumByProperty);
    return isNumber(total) ? total : 0;
  }
  /**
   * Returns `true` if the value is empty (empty string, array, object, `null`, or `undefined`).
   *
   * @param {*} value - The value to check.
   * @returns {boolean}
   *
   * @example
   * ARM.isEmpty([])    // true
   * ARM.isEmpty('')    // true
   * ARM.isEmpty(null)  // true
   * ARM.isEmpty([1])   // false
   */
  isEmpty(value) {
    return isEmpty(value);
  }
  /**
   * Returns `true` if the value is not empty. Inverse of `isEmpty`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean}
   *
   * @example
   * ARM.isPresent([1])  // true
   * ARM.isPresent([])   // false
   */
  isPresent(value) {
    return !isEmpty(value);
  }
  /**
   * Returns `true` if two values are deeply equal.
   *
   * @param {*} value - The first value.
   * @param {*} other - The second value.
   * @returns {boolean}
   *
   * @example
   * ARM.isEqual({ a: 1 }, { a: 1 }) // true
   */
  isEqual(value, other) {
    return isEqual(value, other);
  }
  /**
   * Returns `true` if the value is a number (including `NaN` and `Infinity`).
   *
   * @param {*} value - The value to check.
   * @returns {boolean}
   *
   * @example
   * ARM.isNumber(42)    // true
   * ARM.isNumber('42')  // false
   */
  isNumber(value) {
    return isNumber(value);
  }
  /**
   * Returns `true` if the value is `null` or `undefined`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean}
   *
   * @example
   * ARM.isNil(null)      // true
   * ARM.isNil(undefined) // true
   * ARM.isNil(0)         // false
   */
  isNil(value) {
    return isNil(value);
  }
  /**
   * Returns `true` if the value is strictly `null`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean}
   *
   * @example
   * ARM.isNull(null)      // true
   * ARM.isNull(undefined) // false
   */
  isNull(value) {
    return isNull(value);
  }
  /**
   * Returns `true` if `value >= other`.
   *
   * @param {number} value - The value to compare.
   * @param {number} other - The threshold.
   * @returns {boolean}
   *
   * @example
   * ARM.isGte(5, 5) // true
   * ARM.isGte(4, 5) // false
   */
  isGte(value, other) {
    return gte(value, other);
  }
  /**
   * Returns `true` if `value > other`.
   *
   * @param {number} value - The value to compare.
   * @param {number} other - The threshold.
   * @returns {boolean}
   *
   * @example
   * ARM.isGt(6, 5) // true
   * ARM.isGt(5, 5) // false
   */
  isGt(value, other) {
    return gt(value, other);
  }
  /**
   * Returns `true` if `value <= other`.
   *
   * @param {number} value - The value to compare.
   * @param {number} other - The threshold.
   * @returns {boolean}
   *
   * @example
   * ARM.isLte(5, 5) // true
   * ARM.isLte(6, 5) // false
   */
  isLte(value, other) {
    return lte(value, other);
  }
  /**
   * Returns `true` if `value < other`.
   *
   * @param {number} value - The value to compare.
   * @param {number} other - The threshold.
   * @returns {boolean}
   *
   * @example
   * ARM.isLt(4, 5) // true
   * ARM.isLt(5, 5) // false
   */
  isLt(value, other) {
    return lt(value, other);
  }
}
export {
  ApiResourceManager as default
};
