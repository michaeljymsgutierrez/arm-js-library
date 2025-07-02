/**
 * ARM JavaScript Library
 *
 * Version: 2.1.3
 * Date: 2024-05-09 2:19PM GMT+8
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
 */

import axios from 'axios'
import _ from 'lodash'
import * as mobx from 'mobx'
import { v1 as uuidv1, NIL as NIL_UUID } from 'uuid'
import md5 from 'md5'

/**
 * Destructured MobX functions.
 */
const { makeObservable, observable, action, toJS } = mobx

/**
 * Destructured Lodash functions.
 */
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
  keysIn,
  concat,
  chunk,
  uniqWith,
  omit,
  first,
  last,
  orderBy,
  uniqBy,
  groupBy,
  pullAt,
  cloneDeep,
} = _

/**
 * Default response object for array-based requests.
 *
 * @typedef {Object} DefaultRequestArrayResponse
 * @property {boolean} isLoading - Indicates if the request is loading.
 * @property {boolean} isError - Indicates if an error occurred during the request.
 * @property {boolean} isNew - Indicates if the response is new.
 * @property {Array} data - The main data array returned by the request.
 * @property {Array} included - Additional included data related to the response.
 * @property {Object} meta - Metadata about the response.
 * @property {?Object} error - Error information, if any (null if no error).
 */
const defaultRequestArrayResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  error: null,
  included: [],
  meta: null,
}

/**
 * Default response object for object-based requests.
 *
 * @typedef {Object} DefaultRequestObjectResponse
 * @property {boolean} isLoading - Indicates if the request is loading.
 * @property {boolean} isError - Indicates if an error occurred during the request.
 * @property {boolean} isNew - Indicates if the response is new.
 * @property {Object} data - The main data object returned by the request.
 * @property {Array} included - Additional included data related to the response.
 * @property {Object} meta - Metadata about the response.
 * @property {?Object} error - Error information, if any (null if no error).
 */
const defaultRequestObjectResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: {},
  error: null,
  included: [],
  meta: null,
}

/**
 * An array of keys to be omitted during a deep check operation.
 * These keys typically represent internal properties or methods that
 * should not be considered when comparing the current state of a record
 * with its original state.
 *
 * @type {string[]}
 * @constant
 */
const keysToBeOmittedOnDeepCheck = [
  'destroyRecord',
  'getCollection',
  'reload',
  'save',
  'set',
  'get',
  'setProperties',
  'isDirty',
  'isError',
  'isLoading',
  'isPristine',
  'originalRecord',
  'getARMContext',
]

/**
 * An array of keys to be omitted when constructing a request payload.
 * These keys typically represent internal object properties or methods
 * that should not be included in the data sent to the server.
 *
 * @type {string[]}
 * @constant
 */
const keysToBeOmittedOnRequestPayload = [
  'destroyRecord',
  'getCollection',
  'reload',
  'save',
  'set',
  'get',
  'setProperties',
  'isDirty',
  'isError',
  'isLoading',
  'isPristine',
  'hashId',
  'collectionName',
  'originalRecord',
  'getARMContext',
]

export default class ApiResourceManager {
  /**
   * Creates a new instance of the class.
   *
   * @param {Object[]} collections - An optional array of collections to initialize. Defaults to an empty array.
   */
  constructor(collections = []) {
    /**
     * The namespace for API requests. Defaults to 'api/v1'.
     * @type {string}
     */
    this.namespace = 'api/v1'

    /**
     * The base URL for API requests.
     * Defaults to the current origin if running in a browser, otherwise an empty string.
     * @type {string}
     */
    this.host = typeof window !== 'undefined' ? window.location.origin : ''

    /**
     * A dictionary to store collections of data.
     * @type {Object}
     */
    this.collections = {}

    /**
     * A dictionary to store aliases for collections.
     * @type {Object}
     */
    this.aliases = {}

    /**
     * A dictionary to store request hash keys.
     * @type {Object}
     */
    this.requestHashes = {}

    /**
     * The root scope object.
     * @type {Object}
     */
    this.rootScope = {}

    /**
     * The reference key used for included data in request payloads. Defaults to 'type'.
     * @type {string}
     */
    this.payloadIncludedReference = 'type'

    /**
     * Initializes collections in the instance.
     * @private
     */
    this._initializeCollections(collections)

    /**
     * Initializes Axios configuration with the base URL.
     * @private
     */
    this._initializeAxiosConfig()

    /**
     * Makes specific properties observable using a library like MobX.
     */
    makeObservable(this, {
      collections: observable,
      aliases: observable,
      requestHashes: observable,
      rootScope: observable,
      _pushPayload: action,
      _pushRequestHash: action,
      _addCollection: action,
      _addAlias: action,
      _unloadCollection: action,
      _unloadFromCollection: action,
      _unloadFromRequestHashes: action,
      _unloadFromAliases: action,
      _setRootScope: action,
      _setProperties: action,
      createRecord: action,
    })
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
    setProperty(axios, ['defaults', 'baseURL'], this._getBaseURL())
    setProperty(
      axios,
      ['defaults', 'headers', 'common', 'X-Powered-By'],
      'ARM JS Library/2.1.3'
    )
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
    forEach(collections, (collection) => this._addCollection(collection, []))
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
    return `${this.host}/${this.namespace}`
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
      throw `Collection ${collectionName} does not exist.\nFix: Try adding ${collectionName} on your ARM config initialization.`
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
    setProperty(this.collections, collectionName, collectionRecords)
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
    let aliasCollectionRecords = null

    if (isArray(aliasRecords)) aliasCollectionRecords = aliasRecords || []
    if (isPlainObject(aliasRecords)) aliasCollectionRecords = aliasRecords || {}

    setProperty(this.aliases, aliasName, aliasCollectionRecords)
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
  _generateHashId(object = { id: uuidv1() }) {
    const stringifyObject = JSON.stringify(object)
    return md5(stringifyObject).toString()
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
    function objectToArray(obj, prefix = '') {
      return flatMap(entries(obj), ([key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key
        if (isObject(value) && !isArray(value) && value !== null) {
          return objectToArray(value, newKey)
        } else {
          return { key: newKey, value: value }
        }
      })
    }
    const keysAndValues = objectToArray(keyValuePairs)
    forEach(keysAndValues, ({ key, value }) =>
      setProperty(targetObject, key, value)
    )
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
    return getProperty(this, key)
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
    setProperty(this, key, value)

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)
    const isOriginalAndCurrentRecordEqual = isEqual(
      originalRecord,
      currentRecord
    )

    this.getARMContext()._setProperties(this, {
      isDirty: isOriginalAndCurrentRecordEqual ? false : true,
      isPristine: isOriginalAndCurrentRecordEqual ? true : false,
    })
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
    this.getARMContext()._setProperties(this, values)

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)
    const isOriginalAndCurrentRecordEqual = isEqual(
      originalRecord,
      currentRecord
    )

    this.getARMContext()._setProperties(this, {
      isDirty: isOriginalAndCurrentRecordEqual ? false : true,
      isPristine: isOriginalAndCurrentRecordEqual ? true : false,
    })
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
    const properties = map(sortProperties, (sortProperty) =>
      first(sortProperty.split(':'))
    )
    const sorts = map(sortProperties, (sortProperty) =>
      last(sortProperty.split(':'))
    )
    return orderBy(currentRecords, properties, sorts)
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
      getProperty(collectionRecord, 'collectionName')
    )
    const collectionRecordIndex = findIndex(collection, {
      hashId: getProperty(collectionRecord, 'hashId'),
    })

    if (gte(collectionRecordIndex, 0)) pullAt(collection, collectionRecordIndex)
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
    const requestHashesKeys = keysIn(this.requestHashes)
    const collectionRecordHashId = getProperty(collectionRecord, 'hashId')

    forEach(requestHashesKeys, (requestHashKey) => {
      const requestHash = getProperty(this.requestHashes, requestHashKey)
      const requestHashData = getProperty(requestHash, 'data')

      if (isArray(requestHashData)) {
        const requestHashRecordIndex = findIndex(requestHashData, {
          hashId: collectionRecordHashId,
        })
        if (gte(requestHashRecordIndex, 0))
          pullAt(getProperty(requestHash, 'data'), requestHashRecordIndex)
      }

      if (isPlainObject(requestHashData)) {
        if (
          isEqual(
            collectionRecordHashId,
            getProperty(requestHashData, 'hashId')
          )
        )
          setProperty(requestHash, 'data', null)
      }
    })
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
    const aliasesKeys = keysIn(this.aliases)
    const collectionRecordHashId = getProperty(collectionRecord, 'hashId')

    forEach(aliasesKeys, (aliasKey) => {
      const aliasCollection = getProperty(this.aliases, aliasKey)

      if (isArray(aliasCollection)) {
        const aliasCollectionRecordIndex = findIndex(aliasCollection, {
          hashId: collectionRecordHashId,
        })

        if (gte(aliasCollectionRecordIndex, 0))
          aliasCollection.splice(aliasCollectionRecordIndex, 1)
      }

      if (isPlainObject(aliasCollection)) {
        if (
          isEqual(
            collectionRecordHashId,
            getProperty(aliasCollection, 'hashId')
          )
        )
          setProperty(this.aliases, aliasKey, null)
      }
    })
  }

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
  unloadRecord(currentRecord) {
    this._unloadFromCollection(currentRecord)
    this._unloadFromAliases(currentRecord)
    this._unloadFromRequestHashes(currentRecord)
  }

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
  _saveRecord(currentRecord, collectionConfig = {}) {
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecord = find(
      getProperty(this.collections, collectionName),
      {
        hashId: getProperty(currentRecord, 'hashId'),
      }
    )
    const collectionRecordId = getProperty(collectionRecord, 'id')
    const isCollectionRecordIdValid = isNumber(collectionRecordId)

    return this._request({
      resourceMethod: isCollectionRecordIdValid ? 'put' : 'post',
      resourceName: collectionName,
      resourceId: isCollectionRecordIdValid ? collectionRecordId : null,
      resourceParams: {},
      resourcePayload: { data: collectionRecord },
      resourceFallback: {},
      resourceConfig: { ...collectionConfig, autoResolveOrigin: '_internal' },
    })
  }

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
  async _deleteRecord(currentRecord, collectionConfig = {}) {
    return this._request({
      resourceMethod: 'delete',
      resourceName: getProperty(currentRecord, 'collectionName'),
      resourceId: Number(getProperty(currentRecord, 'id')),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { ...collectionConfig, autoResolveOrigin: '_internal' },
    })
  }

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
  async _reloadRecord(currentRecord) {
    return this._request({
      resourceMethod: 'get',
      resourceName: getProperty(currentRecord, 'collectionName'),
      resourceId: Number(getProperty(currentRecord, 'id')),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {
        skipId: uuidv1(),
        autoResolveOrigin: '_internal',
      },
    })
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
    const collectionReferenceKey =
      getProperty(collectionConfig, 'referenceKey') || ''
    const collectionAsync = getProperty(collectionConfig, 'async') || false
    const collectionFilterBy = getProperty(collectionConfig, 'filterBy') || {}
    const collectionSortBy = getProperty(collectionConfig, 'sortBy') || []
    const recordsFromCurrentRecord =
      getProperty(currentRecord, collectionReferenceKey) || []
    const isRecordsFromCurrentRecordObject = isPlainObject(
      recordsFromCurrentRecord
    )
    const relatedRecords = isRecordsFromCurrentRecordObject
      ? [recordsFromCurrentRecord]
      : recordsFromCurrentRecord
    const collectionRecords = observable([])

    forEach(relatedRecords, (relatedRecord) => {
      const relatedRecordId = getProperty(relatedRecord, 'id')
      const collectionRecord = find(
        getProperty(this.collections, collectionName),
        {
          hashId: this._generateHashId({
            id: relatedRecordId,
            collectionName: collectionName,
          }),
        }
      )

      if (!isEmpty(collectionRecord)) {
        collectionRecords.push(collectionRecord)
      } else {
        if (isEqual(collectionAsync, true)) {
          const requestObject = {
            resourceMethod: 'get',
            resourceName: collectionName,
            resourceId: relatedRecordId,
            resourceParams: {},
            resourcePayload: null,
            resourceFallback: {},
            resourceConfig: {},
          }
          const responseObject = defaultRequestObjectResponse

          this._pushRequestHash(requestObject, responseObject)

          this._request(requestObject)
        }
      }
    })

    return isRecordsFromCurrentRecordObject
      ? first(collectionRecords)
      : this._sortRecordsBy(
          filter(collectionRecords, collectionFilterBy),
          collectionSortBy
        )
  }

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
  _injectCollectionActions(collectionRecord) {
    const actions = {
      get: this._getRecordProperty,
      set: this._setRecordProperty,
      setProperties: this._setRecordProperties,
      getARMContext: () => this,
      save: (collectionConfig) =>
        this._saveRecord(collectionRecord, collectionConfig),
      destroyRecord: (collectionConfig) =>
        this._deleteRecord(collectionRecord, collectionConfig),
      reload: () => this._reloadRecord(collectionRecord),
      getCollection: (collectionName, collectionConfig) =>
        this._getCollectionRecord(
          collectionName,
          collectionConfig,
          collectionRecord
        ),
    }
    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) =>
      setProperty(collectionRecord, actionKey, getProperty(actions, actionKey))
    )
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
  _injectCollectionReferenceKeys(
    collectionName,
    collectionRecord,
    collectionRecordHashId = null
  ) {
    const recordHashId = isNull(collectionRecordHashId)
      ? this._generateHashId({
          id: getProperty(collectionRecord, 'id'),
          collectionName: collectionName,
        })
      : collectionRecordHashId

    this._setProperties(collectionRecord, {
      collectionName: collectionName,
      hashId: recordHashId,
      isLoading: false,
      isError: false,
      isPristine: true,
      isDirty: false,
    })

    this._setProperties(collectionRecord, {
      originalRecord: omit(toJS(collectionRecord), keysToBeOmittedOnDeepCheck),
    })
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
    const collection = getProperty(this.collections, collectionName)

    if (isArray(collectionRecords)) {
      const collectionRecordsHashIds = map(collectionRecords, 'hashId')

      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordIndex = findIndex(collection, {
          hashId: getProperty(collectionRecord, 'hashId'),
        })

        this._injectCollectionActions(collectionRecord)

        if (lt(collectionRecordIndex, 0)) collection.push(collectionRecord)

        if (gte(collectionRecordIndex, 0))
          this._setProperties(
            getProperty(collection, collectionRecordIndex),
            collectionRecord
          )
      })

      return map(collectionRecordsHashIds, (collectionRecordHashId) =>
        find(collection, {
          hashId: collectionRecordHashId,
        })
      )
    }

    if (isPlainObject(collectionRecords)) {
      const collectionRecordHashId = getProperty(collectionRecords, 'hashId')
      const collectionRecordIndex = findIndex(collection, {
        hashId: collectionRecordHashId,
      })

      this._injectCollectionActions(collectionRecords)

      if (lt(collectionRecordIndex, 0)) collection.push(collectionRecords)

      if (gte(collectionRecordIndex, 0))
        this._setProperties(
          getProperty(collection, collectionRecordIndex),
          collectionRecords
        )

      return find(collection, {
        hashId: collectionRecordHashId,
      })
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
    const aliasesKeys = keysIn(this.aliases)

    collectionRecords = isArray(collectionRecords)
      ? collectionRecords
      : [collectionRecords]

    forEach(aliasesKeys, (aliasKey) => {
      const aliasCollection = getProperty(this.aliases, aliasKey)

      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordHashId = getProperty(collectionRecord, 'hashId')

        if (isArray(aliasCollection)) {
          const aliasCollectionRecordIndex = findIndex(aliasCollection, {
            hashId: collectionRecordHashId,
          })

          if (gte(aliasCollectionRecordIndex, 0))
            setProperty(
              aliasCollection,
              aliasCollectionRecordIndex,
              collectionRecord
            )
        }

        if (isPlainObject(aliasCollection)) {
          if (
            isEqual(
              collectionRecordHashId,
              getProperty(aliasCollection, 'hashId')
            )
          )
            setProperty(this.aliases, aliasKey, collectionRecord)
        }
      })
    })
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
    const requestHashesKeys = keysIn(this.requestHashes)

    collectionRecords = isArray(collectionRecords)
      ? collectionRecords
      : [collectionRecords]

    forEach(requestHashesKeys, (requestHashKey) => {
      const requestHash = getProperty(this.requestHashes, requestHashKey)
      const requestHashData = getProperty(requestHash, 'data')

      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordHashId = getProperty(collectionRecord, 'hashId')

        if (isArray(requestHashData)) {
          const requestHashRecordIndex = findIndex(requestHashData, {
            hashId: collectionRecordHashId,
          })

          if (gte(requestHashRecordIndex, 0))
            setProperty(
              requestHash,
              ['data', requestHashRecordIndex],
              collectionRecord
            )
        }

        if (isPlainObject(requestHashData)) {
          if (
            isEqual(
              collectionRecordHashId,
              getProperty(requestHashData, 'hashId')
            )
          )
            setProperty(requestHash, 'data', collectionRecord)
        }
      })
    })
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
    this._isCollectionExisting(collectionName)

    const updatedCollectionRecords = this._pushToCollection(
      collectionName,
      collectionRecords
    )

    this._pushToAliases(updatedCollectionRecords)
    this._pushToRequestHashes(updatedCollectionRecords)

    return updatedCollectionRecords
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
   * @param {string} collectionName - The name of the collection.
   * @param {Array|Object} collectionRecords - The records to be pushed.
   * @returns {Array|Object} The updated collection records.
   */
  pushPayload(collectionName, collectionRecords) {
    this._isCollectionExisting(collectionName)

    if (isArray(collectionRecords))
      forEach(collectionRecords, (collectionRecord) =>
        this._injectCollectionReferenceKeys(collectionName, collectionRecord)
      )

    if (isPlainObject(collectionRecords))
      this._injectCollectionReferenceKeys(collectionName, collectionRecords)

    this._pushPayload(collectionName, collectionRecords)
  }

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
  _pushRequestHash(requestObject, responseObject) {
    const requestHashKey = this._generateHashId(requestObject)

    if (
      !isNil(getProperty(this.requestHashes, requestHashKey)) &&
      getProperty(responseObject, 'isNew')
    ) {
      setProperty(this.requestHashes, [requestHashKey, 'isNew'], false)
    } else {
      setProperty(this.requestHashes, requestHashKey, responseObject)
    }

    return getProperty(this.requestHashes, requestHashKey)
  }

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
  setHost(host) {
    setProperty(this, 'host', host)
    this._initializeAxiosConfig()
  }

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
  setNamespace(namespace) {
    setProperty(this, 'namespace', namespace)
  }

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
  setHeadersCommon(key, value) {
    setProperty(axios, ['defaults', 'headers', 'common', key], value)
  }

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
  setPayloadIncludeReference(key) {
    setProperty(this, 'payloadIncludedReference', key)
  }

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
  setGlobal() {
    if (typeof window !== 'undefined') window.ARM = Object.freeze(this)
  }

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
  getCollection(collectionName) {
    return getProperty(this.collections, collectionName) || observable([])
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
    setProperty(this.collections, collectionName, [])
  }

  /**
   * Clears the contents of a specified collection and unloads related data.
   *
   * This method removes all records from the collection with the given
   * `collectionName` in the `collections` object of the `ApiResourceManager`.
   * It also unloads the records from aliases and request hashes.
   *
   * @param {string} collectionName - The name of the collection to clear.
   */
  clearCollection(collectionName) {
    const clonedCollectionRecords = cloneDeep(
      getProperty(this.collections, collectionName)
    )

    this._unloadCollection(collectionName)

    forEach(clonedCollectionRecords, (clonedCollectionRecord) => {
      this._unloadFromAliases(clonedCollectionRecord)
      this._unloadFromRequestHashes(clonedCollectionRecord)
    })
  }

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
  getAlias(aliasName, fallbackRecords) {
    if (isPlainObject(fallbackRecords))
      this._injectCollectionActions(fallbackRecords)

    return getProperty(this.aliases, aliasName) || observable(fallbackRecords)
  }

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
  createRecord(
    collectionName,
    collectionRecord = {},
    collectionRecordRandomId = true
  ) {
    const collection = getProperty(this.collections, collectionName)
    const collectionRecordId = collectionRecordRandomId ? uuidv1() : NIL_UUID
    const isCollectionRecordNotExisting = isNil(
      find(collection, {
        id: collectionRecordId,
      })
    )

    setProperty(collectionRecord, 'id', collectionRecordId)

    this._injectCollectionReferenceKeys(collectionName, collectionRecord)
    this._injectCollectionActions(collectionRecord)

    if (isCollectionRecordNotExisting) collection.push(collectionRecord)

    return find(collection, {
      id: collectionRecordId,
    })
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
    const hasAutoResolveConfig = !isNil(getProperty(config, 'autoResolve'))
    const isAutoResolve = hasAutoResolveConfig
      ? getProperty(config, 'autoResolve')
      : true

    if (isAutoResolve) {
      return requestHashObject
    } else {
      return requestXHR
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
   * @param {Object} [requestConfig.resourceConfig] - Optional configuration overrides for the request (e.g., alias, autoResolve, skip).
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
    resourceConfig,
  }) {
    // Initialize request options with the HTTP method and base resource URL
    const requestOptions = {
      method: resourceMethod,
      url: resourceName,
    }

    // Determine the HTTP method for conditional logic later
    const isResourceMethodGet = isEqual(resourceMethod, 'get')
    const isResourceMethodDelete = isEqual(resourceMethod, 'delete')
    const isResourceMethodPost = isEqual(resourceMethod, 'post')

    // Check if a valid resource ID is provided
    const isResourceIdValid = isNumber(resourceId) || isString(resourceId)

    // Check for the presence of query parameters, payload, alias, and config overrides
    const hasResourceParams = !isEmpty(resourceParams)
    const hasResourcePayload = !isEmpty(resourcePayload)
    const hasResourceAlias = !isNil(getProperty(resourceConfig, 'alias'))
    const hasResourceConfigOverride = !isNil(
      getProperty(resourceConfig, 'override')
    )

    // Extract the keys to be ignored from the payload
    const resourceIgnorePayload =
      getProperty(resourceConfig, 'ignorePayload') || []

    // Extract the payload record (if any)
    const resourcePayloadRecord = getProperty(resourcePayload, 'data') || null

    // Find the existing collection record by ID (if applicable)
    const collectionRecordById = isResourceIdValid
      ? find(getProperty(this.collections, resourceName), {
          id: resourceId,
        })
      : null

    // Check for auto-resolve configuration options
    const hasResourceAutoResolveOrigin = !isNil(
      getProperty(resourceConfig, 'autoResolveOrigin')
    )
    const hasResourceAutoResolve = !isNil(
      getProperty(resourceConfig, 'autoResolve')
    )

    // Determine whether to auto-resolve the request (defaults to true)
    const isAutoResolve = hasResourceAutoResolve
      ? getProperty(resourceConfig, 'autoResolve')
      : true

    // Process the request URL if a valid resource ID is provided
    if (isResourceIdValid)
      this._processRequestURL(resourceName, resourceId, requestOptions)

    // Process any configuration overrides
    if (hasResourceConfigOverride)
      this._processRequestOverride(resourceConfig, requestOptions)

    // Add query parameters to the request options
    if (hasResourceParams) setProperty(requestOptions, 'params', resourceParams)

    // Process the request payload (if any)
    if (hasResourcePayload)
      this._processRequestPayload(
        resourceIgnorePayload,
        resourcePayloadRecord,
        requestOptions
      )

    // Check for the 'skip' option in the configuration
    const hasSkipRequest = !isNil(getProperty(resourceConfig, 'skip'))
    const skipRequest = isEqual(getProperty(resourceConfig, 'skip'), true)

    // Generate a hash key for the request to track it in the requestHashes store
    const requestHashKey = this._generateHashId({ ...arguments[0] })
    const requestHash = getProperty(this.requestHashes, requestHashKey)

    // Check if this request already exists in the requestHashes store
    const isRequestHashExisting = !isNil(requestHash)
    const isRequestNew = getProperty(requestHash, 'isNew')

    // Handle GET requests with potential skipping and caching
    if (isResourceMethodGet) {
      if (hasSkipRequest && skipRequest) {
        // If the request is configured to be skipped and autoResolve is false, return the request hash
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash)
        // Otherwise, skip the request
        return
      }

      // If the request is not new and autoResolve is false, return the existing request hash
      if (!hasSkipRequest && isRequestHashExisting && !isRequestNew) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash)
        return
      }

      // If the request is configured to be skipped but is not new and autoResolve is false, return the existing request hash
      if (
        hasSkipRequest &&
        !skipRequest &&
        isRequestHashExisting &&
        !isRequestNew
      ) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash)
        return
      }
    }

    // Set isLoading to true for the payload record (if any)
    if (hasResourcePayload)
      setProperty(resourcePayloadRecord, 'isLoading', true)

    // Set isLoading to true for the collection record (if a valid ID is provided)
    if (isResourceIdValid) setProperty(collectionRecordById, 'isLoading', true)

    try {
      // Make the API request using axios
      const resourceRequest = await axios(requestOptions)

      // Extract the results, included data, and meta information from the response
      const resourceResults =
        getProperty(resourceRequest, ['data', 'data']) || resourceFallback
      const resourceIncludedResults =
        getProperty(resourceRequest, ['data', 'included']) || []
      const resourceMetaResults =
        getProperty(resourceRequest, ['data', 'meta']) || {}

      // Initialize variables to store updated collection records
      let updatedDataCollectionRecords = null
      let updatedIncludedCollectionRecords = []

      // Inject collection reference keys into the data results (if an array)
      if (isArray(resourceResults))
        forEach(resourceResults, (resourceResult) =>
          this._injectCollectionReferenceKeys(resourceName, resourceResult)
        )

      // Inject collection reference keys into the data results (if an object)
      if (isPlainObject(resourceResults))
        this._injectCollectionReferenceKeys(resourceName, resourceResults)

      // Process included results
      forEach(resourceIncludedResults, (resourceIncludedResult) => {
        // Inject collection reference keys into each included result
        this._injectCollectionReferenceKeys(
          getProperty(resourceIncludedResult, this.payloadIncludedReference),
          resourceIncludedResult
        )

        // Push the processed included result into the updatedIncludedCollectionRecords array
        updatedIncludedCollectionRecords.push(
          this._pushPayload(
            getProperty(resourceIncludedResult, 'collectionName'),
            resourceIncludedResult
          )
        )
      })

      // Push the data results into the appropriate collection and update related data
      updatedDataCollectionRecords = await this._pushPayload(
        resourceName,
        resourceResults
      )

      // Process the alias (if any)
      if (hasResourceAlias)
        this._processRequestAlias(resourceConfig, updatedDataCollectionRecords)

      // Unload the payload record if this was a POST request
      if (isResourceMethodPost) this.unloadRecord(resourcePayloadRecord)

      // Unload the updated data collection records if this was a DELETE request
      if (isResourceMethodDelete)
        this.unloadRecord(updatedDataCollectionRecords)

      // Push the request and its response to the requestHashes store
      this._pushRequestHash(arguments[0], {
        isLoading: false,
        isError: false,
        isNew: false,
        data: updatedDataCollectionRecords,
        error: null,
        included: updatedIncludedCollectionRecords,
        meta: resourceMetaResults,
      })

      // If autoResolveOrigin is true, resolve with the updated data collection records.
      if (hasResourceAutoResolveOrigin)
        return Promise.resolve(updatedDataCollectionRecords)

      // Otherwise, resolve with the request hash object.
      return Promise.resolve(requestHash)
    } catch (errors) {
      // Handle errors during the request.

      // Set isError and isLoading to true for the payload record (if any).
      if (hasResourcePayload)
        this._setProperties(resourcePayloadRecord, {
          isError: true,
          isLoading: false,
        })

      // Set isError and isLoading to true for the collection record (if a valid ID is provided).
      if (isResourceIdValid)
        this._setProperties(collectionRecordById, {
          isError: true,
          isLoading: false,
        })

      // Push the request and the error information to the requestHashes store.
      this._pushRequestHash(arguments[0], {
        isLoading: false,
        isError: true,
        isNew: false,
        data: resourceFallback,
        error: errors,
        included: [],
        meta: {},
      })

      // If autoResolveOrigin is true, reject with the error.
      if (hasResourceAutoResolveOrigin) return Promise.reject(errors)

      // Otherwise, reject with the request hash object.
      return Promise.reject(requestHash)
    }
  }

  /**
   * Processes the payload for a request, omitting specified keys and setting it in the request options.
   *
   * @param {string[]} resourceIgnorePayload - An array of keys to be ignored (omitted) from the payload.
   * @param {Object} resourcePayloadRecord - The record object containing the payload data.
   * @param {Object} requestOptions - The options object for the request, where the processed payload will be set.
   */
  _processRequestPayload(
    resourceIgnorePayload,
    resourcePayloadRecord,
    requestOptions
  ) {
    setProperty(requestOptions, 'data', {
      data: omit(resourcePayloadRecord, [
        ...resourceIgnorePayload,
        ...keysToBeOmittedOnRequestPayload,
      ]),
    })
  }

  /**
   * Processes the URL for a request, constructing it from the resource name and ID.
   *
   * @param {Object} requestOptions - The options object for the request, where the URL will be set.
   * @param {string} resourceName - The name of the resource being accessed.
   * @param {string|number} resourceId - The ID of the specific resource.
   */
  _processRequestURL(resourceName, resourceId, requestOptions) {
    setProperty(requestOptions, 'url', `${resourceName}/${resourceId}`)
  }

  /**
   * Processes an alias for a request, adding it to the aliases store.
   *
   * @param {Object} resourceConfig - The configuration object for the resource request, containing the alias information.
   * @param {Array|Object} collectionRecords - The records to be aliased. Can be an array or an object.
   */
  _processRequestAlias(resourceConfig, collectionRecords) {
    this._addAlias(getProperty(resourceConfig, 'alias'), collectionRecords)
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
    const override = getProperty(resourceConfig, 'override') || {}
    const overrideHost = !isNil(getProperty(override, 'host'))
      ? getProperty(override, 'host')
      : this.host
    const overrideNamespace = !isNil(getProperty(override, 'namespace'))
      ? getProperty(override, 'namespace')
      : this.namespace
    const overrideBaseURL = `${overrideHost}/${overrideNamespace}`

    const overrideURL = !isNil(getProperty(override, 'path'))
      ? getProperty(override, 'path')
      : getProperty(requestOptions, 'url')

    const overrideHeaders = !isNil(getProperty(override, 'headers'))
      ? getProperty(override, 'headers')
      : {}
    const commonHeaders = getProperty(axios, ['defaults', 'headers', 'common'])
    const overrideCommonHeaders = assign(commonHeaders, overrideHeaders)

    this._setProperties(requestOptions, {
      baseURL: overrideBaseURL,
      url: overrideURL,
      headers: overrideCommonHeaders,
    })
  }

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
  query(resource, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: null,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: config,
    }
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestArrayResponse
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
  }

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
  queryRecord(resource, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: null,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: config,
    }
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestObjectResponse
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
  }

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
  findAll(resource, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: null,
      resourceParams: null,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: config,
    }
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestArrayResponse
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
  }

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
  findRecord(resource, id, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: id,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: config,
    }
    const requestHashObject = this._pushRequestHash(
      requestObject,
      defaultRequestObjectResponse
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
  }

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
  peekAll(collectionName) {
    return getProperty(this.collections, collectionName)
  }

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
  peekRecord(collectionName, collectionRecordId) {
    return find(getProperty(this.collections, collectionName), {
      id: collectionRecordId,
    })
  }

  /**
   * Internal method to set a property on the root scope.
   * @private
   * @param {string} rootScopeProperty - The property name to set.
   * @param {*} rootScopeValue - The value to set.
   */
  _setRootScope(rootScopeProperty, rootScopeValue) {
    setProperty(this.rootScope, rootScopeProperty, rootScopeValue)
  }

  /**
   * Sets a property on the root scope.
   * @param {string} rootScopeProperty - The property name to set.
   * @param {*} rootScopeValue - The value to set.
   */
  setRootScope(rootScopeProperty, rootScopeValue) {
    this._setRootScope(rootScopeProperty, rootScopeValue)
  }

  /**
   * Gets a property from the root scope.
   * @param {string} rootScopeProperty - The property name to get.
   * @returns {*} The value of the property.
   */
  getRootScope(rootScopeProperty) {
    return getProperty(this.rootScope, rootScopeProperty)
  }

  /**
   * Makes an AJAX request using the axios library.
   *
   * @param {Object} [config={}] - Configuration object for the axios request.
   * @returns {Promise} A Promise that resolves with the Axios response or
   *                    rejects with an error.
   */
  ajax(config = {}) {
    return axios.request(config)
  }

  /**
   * Finds the first object in an array that matches the specified properties.
   *
   * @param {Array<Object>} objects - The array of objects to search.
   * @param {Object} [findProperties={}] - The properties to match.
   * @returns {Object|undefined} The found object, or undefined if not found.
   */
  findBy(objects, findProperties = {}) {
    return find(objects, findProperties)
  }

  /**
   * Finds the index of the first object in an array that matches the
   * specified properties.
   *
   * @param {Array<Object>} objects - The array of objects to search.
   * @param {Object} [findIndexProperties={}] - The properties to match.
   * @returns {number} The index of the found object, or -1 if not found.
   */
  findIndexBy(objects, findIndexProperties = {}) {
    return findIndex(objects, findIndexProperties)
  }

  /**
   * Filters an array of objects based on the specified properties.
   *
   * @param {Array<Object>} objects - The array of objects to filter.
   * @param {Object} [filterProperties={}] - The filter criteria.
   * @returns {Array<Object>} The filtered array of objects.
   */
  filterBy(objects, filterProperties = {}) {
    return filter(objects, filterProperties)
  }

  /**
   * Creates a new array of unique objects based on a specified property.
   *
   * @param {Array<Object>} objects - The array of objects to process.
   * @param {string} uniqByProperty - The property to use for uniqueness
   *                                 comparison.
   * @returns {Array<Object>} The array of unique objects.
   */
  uniqBy(objects, uniqByProperty) {
    return uniqBy(objects, uniqByProperty)
  }

  /**
   * Groups objects into arrays based on a specified property.
   *
   * @param {Array<Object>} objects - The array of objects to group.
   * @param {string} groupByProperty - The property to group by.
   * @returns {Object} An object where keys are group values and values
   *                   are arrays of objects.
   */
  groupBy(objects, groupByProperty) {
    return groupBy(objects, groupByProperty)
  }

  /**
   * Maps an array of objects to a new array of values, extracting a specific property from each object.
   * @param {Array<Object>} objects - The array of objects to map.
   * @param {string} mapByProperty - The property to extract from each object.
   * @returns {Array<*>} A new array containing the extracted values.
   */
  mapBy(objects, mapByProperty) {
    return map(objects, mapByProperty)
  }

  /**
   * Returns the first object in an array.
   *
   * @param {Array<Object>} [objects=[]] - The array of objects.
   * @returns {Object|undefined} The first object, or undefined if the
   *                             array is empty.
   */
  firstObject(objects = []) {
    return first(objects)
  }

  /**
   * Returns the last object in an array.
   *
   * @param {Array<Object>} [objects=[]] - The array of objects.
   * @returns {Object|undefined} The last object, or undefined if the
   *                             array is empty.
   */
  lastObject(objects = []) {
    return last(objects)
  }

  /**
   * Merges two arrays of objects into a single array, removing duplicates.
   *
   * @param {Array<Object>} [objects=[]] - The first array of objects.
   * @param {Array<Object>} [otherObjects=[]] - The second array of objects.
   * @returns {Array<Object>} The merged array of objects without duplicates.
   */
  mergeObjects(objects = [], otherObjects = []) {
    return uniqWith(concat(objects, otherObjects), isEqual)
  }

  /**
   * Splits an array of objects into chunks of a specified size.
   *
   * @param {Array<Object>} [objects=[]] - The array of objects to chunk.
   * @param {number} [chunkSize=1] - The size of each chunk.
   * @returns {Array<Array<Object>>} An array of chunks.
   */
  chunkObjects(objects = [], chunkSize = 1) {
    return chunk(objects, chunkSize)
  }

  /**
   * Sorts an array of objects based on specified properties and sort orders.
   *
   * @param {Array<Object>} objects - The array of objects to sort.
   * @param {Array<string>} sortProperties - An array of sort properties in
   *                                       the format of 'property:order'.
   * @returns {Array<Object>} The sorted array of objects.
   */
  sortBy(objects, sortProperties) {
    return this._sortRecordsBy(objects, sortProperties)
  }

  /**
   * Checks if a value is empty.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is empty, false otherwise.
   */
  isEmpty(value) {
    return isEmpty(value)
  }

  /**
   * Checks if a value is present (not empty).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is present, false otherwise.
   */
  isPresent(value) {
    return !isEmpty(value)
  }

  /**
   * Checks if two values are equal.
   *
   * @param {*} value - The first value.
   * @param {*} other - The second value.
   * @returns {boolean} True if the values are equal, false otherwise.
   */
  isEqual(value, other) {
    return isEqual(value, other)
  }

  /**
   * Checks if a value is a number.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a number, false otherwise.
   */
  isNumber(value) {
    return isNumber(value)
  }

  /**
   * Checks if a value is null or undefined.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is null or undefined, false otherwise.
   */
  isNil(value) {
    return isNil(value)
  }

  /**
   * Checks if a value is null.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is null, false otherwise.
   */
  isNull(value) {
    return isNull(value)
  }

  /**
   * Checks if a value is greater than or equal to another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is greater than or equal
   *                   to the second value, false otherwise.
   */
  isGte(value, other) {
    return gte(value, other)
  }

  /**
   * Checks if a value is greater than another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is greater than the second
   *                   value, false otherwise.
   */
  isGt(value, other) {
    return gt(value, other)
  }

  /**
   * Checks if a value is less than or equal to another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is less than or equal to
   *                   the second value, false otherwise.
   */
  isLte(value, other) {
    return lte(value, other)
  }

  /**
   * Checks if a value is less than another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is less than the second
   *                   value, false otherwise.
   */
  isLt(value, other) {
    return lt(value, other)
  }
}
