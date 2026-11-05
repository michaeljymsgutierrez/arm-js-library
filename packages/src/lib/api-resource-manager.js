/**
 * ARM JavaScript Library
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

import axios from 'axios'
import _ from 'lodash'
import * as mobx from 'mobx'
import { v1 as uuidv1, validate as uuidValidate, NIL as NIL_UUID } from 'uuid'
import md5 from 'md5'
import qs from 'qs'
import pkg from '../../package.json'

const { makeObservable, observable, action, runInAction, toJS } = mobx

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
 * Internal ARM-injected fields excluded from the `isDirty`/`isPristine`
 * equality check against `originalRecord`.
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
 * Internal ARM-injected fields stripped from a record before it's sent
 * as a request payload.
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

/**
 * Configuration options accepted by all request methods:
 * {@link ApiResourceManager#query}, {@link ApiResourceManager#queryRecord},
 * {@link ApiResourceManager#findAll}, and {@link ApiResourceManager#findRecord}.
 *
 * @typedef {Object} RequestConfig
 * @property {string}   [alias]              - Store the response data under this alias name.
 *   The resolved records are then accessible via {@link ApiResourceManager#getAlias} and
 *   the request hash via {@link ApiResourceManager#getRequestAlias}.
 * @property {boolean}  [autoResolve=true]   - When `true` (default), the method returns the
 *   reactive request hash object immediately (useful for binding directly in UI components).
 *   When `false`, returns the raw Axios Promise so you can `await` the result and handle
 *   loading/error state yourself.
 * @property {boolean}  [skip]               - When `true`, skip making the network request
 *   entirely. Useful for conditional fetching.
 * @property {string}   [skipId]             - A unique value (typically a UUID) that forces
 *   the request to bypass the internal cache and always re-fetch from the server. Each unique
 *   `skipId` value is treated as a new request.
 * @property {string[]} [ignorePayload]      - An array of attribute keys to omit from the
 *   request payload when saving a record via `record.save()`.
 * @property {Object}   [override]           - Override specific parts of the request URL or
 *   headers for this single request only.
 * @property {string}   [override.host]      - Override the base host URL (e.g. `'https://other-api.com'`).
 * @property {string}   [override.namespace] - Override the API namespace (e.g. `'api/v2'`).
 * @property {string}   [override.path]      - Override the full request path.
 * @property {Object}   [override.headers]   - Additional headers to merge into the request.
 */

/**
 * A record object returned from the collection after a fetch or local lookup.
 * ARM injects these methods at runtime onto every record pushed into a collection.
 *
 * @typedef {Object} CollectionRecord
 * @property {string|number} id            - The record's identifier (numeric or string).
 * @property {string}  type                - The resource type (matches the collection name).
 * @property {Object}  attributes          - The record's attribute payload from the API.
 * @property {Object}  [relationships]     - Optional JSON:API relationships block.
 * @property {string}  hashId              - Internal MD5-based unique key used by ARM.
 * @property {string}  collectionName      - The collection this record belongs to.
 * @property {boolean} isLoading           - `true` while a save/reload/destroy request is in flight.
 * @property {boolean} isError             - `true` if the last request for this record errored.
 * @property {boolean} isDirty             - `true` if the record has unsaved local changes.
 * @property {boolean} isPristine          - `true` if the record matches its last-saved state.
 * @property {Object}  originalRecord      - Snapshot of the record at the time it was last synced.
 * @property {function(string): *}                get             - Read a property by dot-notation key.
 * @property {function(string, *): void}           set             - Set a single property and update dirty state.
 * @property {function(Object): void}              setProperties   - Set multiple properties at once.
 * @property {function(): void}                    rollbackAttributes - Revert all changes back to `originalRecord`.
 * @property {function(RequestConfig=): Promise}   save            - Persist changes to the server (PUT) or create (POST).
 * @property {function(RequestConfig=): Promise}   reload          - Re-fetch this record from the server.
 * @property {function(RequestConfig=): Promise}   destroyRecord   - Delete this record from the server and unload it locally.
 * @property {function(string, Object=): CollectionRecord|CollectionRecord[]} getCollection - Retrieve related records from a local collection using this record's relationship data.
 */

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
     * A dictionary to store aliases for requests.
     * @type {Object}
     */
    this.requestAliases = {}

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

    this._initializeCollections(collections)
    this._initializeAxiosConfig()

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
      createRecord: action,
    })
  }

  /**
   * Sets Axios's default `baseURL` and `X-Powered-By` header so every
   * request made through this instance uses them automatically.
   *
   * @private
   */
  _initializeAxiosConfig() {
    setProperty(axios, ['defaults', 'baseURL'], this._getBaseURL())
    setProperty(
      axios,
      ['defaults', 'headers', 'common', 'X-Powered-By'],
      `ARM JS Library/${pkg.version}`,
    )
  }

  /**
   * Registers each named collection with an empty array.
   *
   * @private
   * @param {string[]} collections - An array of collection names to initialize.
   */
  _initializeCollections(collections) {
    forEach(collections, (collection) => this._addCollection(collection, []))
  }

  /**
   * Builds the Axios `baseURL` from the instance's `host` and `namespace`.
   *
   * @private
   * @returns {string} The base URL constructed from `host` and `namespace`.
   */
  _getBaseURL() {
    return `${this.host}/${this.namespace}`
  }

  /**
   * Guards against using a collection name that was never registered.
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
   * @private
   * @param {string} collectionName - The name of the collection to add.
   * @param {Array} collectionRecords - The initial records for the collection.
   */
  _addCollection(collectionName, collectionRecords) {
    setProperty(this.collections, collectionName, collectionRecords)
  }

  /**
   * Creates or updates an alias, pointing it at either an array of records
   * (a collection alias) or a single record object.
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
   * Maps a human-readable alias to the request hash it refers to, so
   * `getRequestAlias` can look it up later.
   *
   * @private
   * @param {string} aliasName - The name of the alias for the request.
   * @param {string} requestHashKey - The unique hash key identifying the request.
   */
  _addRequestAlias(aliasName, requestHashKey) {
    setProperty(this.requestAliases, aliasName, requestHashKey)
  }

  /**
   * MD5-hashes the stringified `object` to produce a stable cache key.
   * With no argument, generates a random one-off key instead (via a
   * fresh `uuidv1()`), useful for forcing a cache miss.
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
   * Flattens a (possibly nested) `keyValuePairs` object into dot-notation
   * paths and sets each one on `targetObject`.
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
      setProperty(targetObject, key, value),
    )
  }

  /**
   * Bound to every record as its `get()` method - reads a property off
   * `this` (the record) by dot-notation key.
   *
   * @private
   * @param {string} key - The key of the property to retrieve.
   * @returns {*} The value of the property.
   */
  _getRecordProperty(key) {
    return getProperty(this, key)
  }

  /**
   * Bound to every record as its `set()` method - writes `value` at `key`,
   * then re-derives `isDirty`/`isPristine` by deep-comparing against
   * `originalRecord`.
   *
   * @private
   * @param {string} key - The property key to set.
   * @param {*} value - The value to set for the property.
   */
  _setRecordProperty(key, value) {
    setProperty(this, key, value)

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck,
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)
    const isOriginalAndCurrentRecordEqual = isEqual(
      originalRecord,
      currentRecord,
    )

    this.getARMContext()._setProperties(this, {
      isDirty: isOriginalAndCurrentRecordEqual ? false : true,
      isPristine: isOriginalAndCurrentRecordEqual ? true : false,
    })
  }

  /**
   * Bound to every record as its `setProperties()` method - same as
   * `_setRecordProperty` but for several keys at once.
   *
   * @private
   * @param {Object} values - An object containing key-value pairs to set
   *                          on the record.
   */
  _setRecordProperties(values) {
    this.getARMContext()._setProperties(this, values)

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck,
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)
    const isOriginalAndCurrentRecordEqual = isEqual(
      originalRecord,
      currentRecord,
    )

    this.getARMContext()._setProperties(this, {
      isDirty: isOriginalAndCurrentRecordEqual ? false : true,
      isPristine: isOriginalAndCurrentRecordEqual ? true : false,
    })
  }

  /**
   * Sorts `currentRecords` by one or more `'property:order'` descriptors
   * (`order` is `'asc'` or `'desc'`). Backs the public `sortBy`.
   *
   * @private
   * @param {Array} currentRecords - The array of records to sort.
   * @param {Array<string>} [sortProperties=[]] - An array of sort properties.
   * @returns {Array} The sorted array of records.
   */
  _sortRecordsBy(currentRecords, sortProperties = []) {
    const properties = map(sortProperties, (sortProperty) =>
      first(sortProperty.split(':')),
    )
    const sorts = map(sortProperties, (sortProperty) =>
      last(sortProperty.split(':')),
    )
    return orderBy(currentRecords, properties, sorts)
  }

  /**
   * @private
   * @param {Object} collectionRecord - The record to be removed from
   *                                   the collection.
   */
  _unloadFromCollection(collectionRecord) {
    const collection = getProperty(
      this.collections,
      getProperty(collectionRecord, 'collectionName'),
    )
    const collectionRecordIndex = findIndex(collection, {
      hashId: getProperty(collectionRecord, 'hashId'),
    })

    if (gte(collectionRecordIndex, 0)) pullAt(collection, collectionRecordIndex)
  }

  /**
   * Scrubs `collectionRecord` out of every cached request hash that
   * references it (array-shaped `data` has it spliced out; object-shaped
   * `data` is nulled if it's the same record).
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
            getProperty(requestHashData, 'hashId'),
          )
        )
          setProperty(requestHash, 'data', null)
      }
    })
  }

  /**
   * Same cleanup as `_unloadFromRequestHashes`, but for `aliases`.
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
            getProperty(aliasCollection, 'hashId'),
          )
        )
          setProperty(this.aliases, aliasKey, null)
      }
    })
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
    this._unloadFromCollection(currentRecord)
    this._unloadFromAliases(currentRecord)
    this._unloadFromRequestHashes(currentRecord)
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
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecord = find(
      getProperty(this.collections, collectionName),
      {
        hashId: getProperty(currentRecord, 'hashId'),
      },
    )
    const collectionRecordId = getProperty(collectionRecord, 'id')
    const isCollectionRecordIdValid = isEqual(
      uuidValidate(collectionRecordId),
      false,
    )

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
      resourceMethod: 'delete',
      resourceName: getProperty(currentRecord, 'collectionName'),
      resourceId: getProperty(currentRecord, 'id'),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { ...collectionConfig, autoResolveOrigin: '_internal' },
    })
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
      resourceMethod: 'get',
      resourceName: getProperty(currentRecord, 'collectionName'),
      resourceId: getProperty(currentRecord, 'id'),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {
        ...collectionConfig,
        skipId: uuidv1(),
        autoResolveOrigin: '_internal',
      },
    })
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
      keysToBeOmittedOnDeepCheck,
    )

    this.getARMContext()._setProperties(this, {
      ...originalRecord,
      isDirty: false,
      isPristine: true,
    })
  }

  /**
   * Backs the public `getCollection` injected on every record. Resolves
   * `currentRecord`'s relationship data (read via `collectionConfig.referenceKey`)
   * against the local `collectionName` collection. Any related record not
   * already cached locally is fetched in the background when
   * `collectionConfig.async` is `true` - it simply won't appear in this
   * call's return value yet, since the fetch is deferred and not awaited.
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
      recordsFromCurrentRecord,
    )
    const resourceConfig = omit(collectionConfig, [
      'referenceKey',
      'async',
      'filterBy',
      'sortBy',
    ])
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
        },
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
            resourceConfig: resourceConfig,
          }
          const responseObject = defaultRequestObjectResponse

          defer(() => {
            this._pushRequestHash(requestObject, responseObject)
            this._request(requestObject)
          })
        }
      }
    })

    return isRecordsFromCurrentRecordObject
      ? first(collectionRecords)
      : this._sortRecordsBy(
          filter(collectionRecords, collectionFilterBy),
          collectionSortBy,
        )
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
    const armInstance = this
    const actions = {
      get: armInstance._getRecordProperty,
      set: armInstance._setRecordProperty,
      setProperties: armInstance._setRecordProperties,
      rollbackAttributes: armInstance._rollbackRecordAttributes,
      getARMContext: () => armInstance,
      save: function (collectionConfig) {
        return armInstance._saveRecord(this, collectionConfig)
      },
      destroyRecord: function (collectionConfig) {
        return armInstance._deleteRecord(this, collectionConfig)
      },
      reload: function (collectionConfig) {
        return armInstance._reloadRecord(this, collectionConfig)
      },
      getCollection: function (collectionName, collectionConfig) {
        return armInstance._getCollectionRecord(
          collectionName,
          collectionConfig,
          this,
        )
      },
    }

    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) =>
      setProperty(collectionRecord, actionKey, getProperty(actions, actionKey)),
    )
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
    const armInstance = this
    const actions = {
      reload: function () {
        return armInstance._reloadRequest(requestObject, requestHashKey)
      },
    }
    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) =>
      setProperty(responseObject, actionKey, actions[actionKey]),
    )
  }

  /**
   * Stamps a raw record with ARM's internal metadata before it enters a
   * collection: `collectionName`, `hashId`, the `isLoading`/`isError`/
   * `isPristine`/`isDirty` state flags, and an `originalRecord` snapshot
   * used later for dirty-tracking.
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
    collectionRecordHashId = null,
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
   * Upserts `collectionRecords` (array or single object) into `collectionName`
   * by matching on `hashId`: new records are pushed, existing ones are
   * merged in place. Also injects the record-level action methods
   * (`get`/`set`/`save`/etc.) via `_injectCollectionActions`.
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
            collectionRecord,
          )
      })

      return map(collectionRecordsHashIds, (collectionRecordHashId) =>
        find(collection, {
          hashId: collectionRecordHashId,
        }),
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
          collectionRecords,
        )

      return find(collection, {
        hashId: collectionRecordHashId,
      })
    }
  }

  /**
   * Propagates an updated record into every alias that currently points
   * at it, so aliases stay in sync after a `_pushToCollection` update.
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
              collectionRecord,
            )
        }

        if (isPlainObject(aliasCollection)) {
          if (
            isEqual(
              collectionRecordHashId,
              getProperty(aliasCollection, 'hashId'),
            )
          )
            setProperty(this.aliases, aliasKey, collectionRecord)
        }
      })
    })
  }

  /**
   * Same sync as `_pushToAliases`, but for cached request hashes.
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
              collectionRecord,
            )
        }

        if (isPlainObject(requestHashData)) {
          if (
            isEqual(
              collectionRecordHashId,
              getProperty(requestHashData, 'hashId'),
            )
          )
            setProperty(requestHash, 'data', collectionRecord)
        }
      })
    })
  }

  /**
   * Low-level entry point for getting records into ARM's state: pushes into
   * the collection, then fans the result out to any aliases and request
   * hashes that reference the same records. Does not stamp ARM metadata -
   * callers are expected to have already run `_injectCollectionReferenceKeys`
   * (see the public `pushPayload`, which does both).
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
      collectionRecords,
    )

    this._pushToAliases(updatedCollectionRecords)
    this._pushToRequestHashes(updatedCollectionRecords)

    return updatedCollectionRecords
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
    this._isCollectionExisting(collectionName)

    if (isArray(collectionRecords))
      forEach(collectionRecords, (collectionRecord) =>
        this._injectCollectionReferenceKeys(collectionName, collectionRecord),
      )

    if (isPlainObject(collectionRecords))
      this._injectCollectionReferenceKeys(collectionName, collectionRecords)

    this._pushPayload(collectionName, collectionRecords)
  }

  /**
   * Caches a request/response pair under a hash key derived from the
   * request, and injects the `reload()` action into the response object.
   * If an entry already exists under that key and the incoming response
   * is marked `isNew`, only its `isNew` flag is flipped to `false` rather
   * than overwriting the existing (already-resolved) entry.
   *
   * @private
   * @param {Object} requestObject - The source object used to generate the hash key.
   * @param {Object} responseObject - The data/state to be stored.
   * @returns {Object} The stored request hash entry.
   */
  _pushRequestHash(requestObject, responseObject) {
    const requestHashKey = this._generateHashId(requestObject)

    this._injectRequestHashActions(
      requestObject,
      responseObject,
      requestHashKey,
    )

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
   * Sets the API base host URL and updates the Axios `baseURL` immediately.
   *
   * @param {string} host - The base URL of the API server (no trailing slash).
   *
   * @example
   * ARM.setHost('https://api.example.com')
   */
  setHost(host) {
    setProperty(this, 'host', host)
    this._initializeAxiosConfig()
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
    setProperty(this, 'namespace', namespace)
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
    setProperty(axios, ['defaults', 'headers', 'common', key], value)
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
    setProperty(this, 'payloadIncludedReference', key)
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
    if (typeof window !== 'undefined') window.ARM = Object.freeze(this)
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
      getProperty(this.collections, collectionName),
    )

    this._unloadCollection(collectionName)

    forEach(clonedCollectionRecords, (clonedCollectionRecord) => {
      this._unloadFromAliases(clonedCollectionRecord)
      this._unloadFromRequestHashes(clonedCollectionRecord)
    })
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
      this._injectCollectionActions(fallbackRecords)

    return getProperty(this.aliases, aliasName) || observable(fallbackRecords)
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
    const requestHashKey = getProperty(this.requestAliases, aliasName)

    return getProperty(this.requestHashes, requestHashKey) || null
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
  createRecord(
    collectionName,
    collectionRecord = {},
    collectionRecordRandomId = true,
  ) {
    const collection = getProperty(this.collections, collectionName)
    const collectionRecordId = collectionRecordRandomId ? uuidv1() : NIL_UUID
    const isCollectionRecordNotExisting = isNil(
      find(collection, {
        id: collectionRecordId,
      }),
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
   * Backs the `reload()` action injected into every request hash by
   * `_injectRequestHashActions`. Forces a fresh `skipId` (bypassing the
   * cache) and re-runs the original request, toggling `isLoading` on the
   * cached entry around the call.
   *
   * @private
   * @param {Object} requestObject - The request object to reload.
   * @param {string} requestHashKey - The key of the request hash to update.
   * @returns {Promise<void>} A promise that resolves when the request is reloaded.
   */
  async _reloadRequest(requestObject, requestHashKey) {
    runInAction(() => {
      setProperty(this.requestHashes, [requestHashKey, 'isLoading'], true)
      setProperty(requestObject, 'resourceConfig.skipId', uuidv1())
      setProperty(requestObject, 'resourceConfig.autoResolve', false)
      setProperty(
        requestObject,
        'resourceConfig.autoResolveOrigin',
        '_internal',
      )
    })

    await this._request(requestObject)

    runInAction(() => {
      setProperty(this.requestHashes, [requestHashKey, 'isLoading'], false)
    })

    return getProperty(this.requestHashes, requestHashKey)
  }

  /**
   * Implements the `autoResolve` contract shared by `query`/`queryRecord`/
   * `findAll`/`findRecord`: returns the reactive `requestHashObject` by
   * default, or the raw `requestXHR` Promise when `config.autoResolve` is
   * explicitly `false`.
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
   * The single low-level request executor behind every public request
   * method (`query`, `queryRecord`, `findAll`, `findRecord`) and every
   * record action (`save`, `reload`, `destroyRecord`). Builds the Axios
   * call, applies caching/skip rules for GETs, pushes the result into
   * collections/aliases/request hashes, and resolves per `_resolveRequest`'s
   * `autoResolve` contract - except when `resourceConfig.autoResolveOrigin`
   * is set (used internally by the record actions), in which case it
   * always resolves with the record data directly instead.
   *
   * @private
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
    resourceConfig,
  }) {
    const requestOptions = {
      method: resourceMethod,
      url: resourceName,
      paramsSerializer: {
        serialize: function (params) {
          return qs.stringify(params, { arrayFormat: 'brackets' })
        },
      },
    }

    const isResourceMethodGet = isEqual(resourceMethod, 'get')
    const isResourceMethodDelete = isEqual(resourceMethod, 'delete')
    const isResourceMethodPost = isEqual(resourceMethod, 'post')

    const isResourceIdValid = isNumber(resourceId) || isString(resourceId)

    const hasResourceParams = !isEmpty(resourceParams)
    const hasResourcePayload = !isEmpty(resourcePayload)
    const hasResourceAlias = !isNil(getProperty(resourceConfig, 'alias'))
    const hasResourceConfigOverride = !isNil(
      getProperty(resourceConfig, 'override'),
    )

    const resourceIgnorePayload =
      getProperty(resourceConfig, 'ignorePayload') || []

    const resourcePayloadRecord = getProperty(resourcePayload, 'data') || null

    const collectionRecordById = isResourceIdValid
      ? find(getProperty(this.collections, resourceName), {
          id: resourceId,
        })
      : null

    const hasResourceAutoResolveOrigin = !isNil(
      getProperty(resourceConfig, 'autoResolveOrigin'),
    )
    const hasResourceAutoResolve = !isNil(
      getProperty(resourceConfig, 'autoResolve'),
    )

    const isAutoResolve = hasResourceAutoResolve
      ? getProperty(resourceConfig, 'autoResolve')
      : true

    if (isResourceIdValid)
      this._processRequestURL(resourceName, resourceId, requestOptions)

    if (hasResourceConfigOverride)
      this._processRequestOverride(resourceConfig, requestOptions)

    if (hasResourceParams) setProperty(requestOptions, 'params', resourceParams)

    if (hasResourcePayload)
      this._processRequestPayload(
        resourceIgnorePayload,
        resourcePayloadRecord,
        requestOptions,
      )

    const hasSkipRequest = !isNil(getProperty(resourceConfig, 'skip'))
    const skipRequest = isEqual(getProperty(resourceConfig, 'skip'), true)

    const requestHashKey = this._generateHashId({ ...arguments[0] })
    const requestHash = getProperty(this.requestHashes, requestHashKey)

    const isRequestHashExisting = !isNil(requestHash)
    const isRequestNew = getProperty(requestHash, 'isNew')

    // Caching/skip short-circuiting only ever applies to GETs - writes
    // (POST/PUT/DELETE) always go through. The three branches below cover,
    // respectively: an explicit skip, an already-resolved cache hit with no
    // skip configured, and an already-resolved cache hit with skip set to
    // something other than true. Each returns the cached request hash when
    // `autoResolve: false` was requested, otherwise returns nothing (the
    // reactive request hash object the caller already has is left as-is).
    if (isResourceMethodGet) {
      if (hasSkipRequest && skipRequest) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash)
        return
      }

      if (!hasSkipRequest && isRequestHashExisting && !isRequestNew) {
        if (hasResourceAutoResolve && !isAutoResolve)
          return Promise.resolve(requestHash)
        return
      }

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

    if (hasResourcePayload)
      setProperty(resourcePayloadRecord, 'isLoading', true)

    if (isResourceIdValid) setProperty(collectionRecordById, 'isLoading', true)

    try {
      const resourceRequest = await axios(requestOptions)

      const resourceResults =
        getProperty(resourceRequest, ['data', 'data']) || resourceFallback
      const resourceIncludedResults =
        getProperty(resourceRequest, ['data', 'included']) || []
      const resourceMetaResults =
        getProperty(resourceRequest, ['data', 'meta']) || {}

      let updatedDataCollectionRecords = null
      let updatedIncludedCollectionRecords = []

      if (isArray(resourceResults))
        forEach(resourceResults, (resourceResult) =>
          this._injectCollectionReferenceKeys(resourceName, resourceResult),
        )

      if (isPlainObject(resourceResults))
        this._injectCollectionReferenceKeys(resourceName, resourceResults)

      forEach(resourceIncludedResults, (resourceIncludedResult) => {
        this._injectCollectionReferenceKeys(
          getProperty(resourceIncludedResult, this.payloadIncludedReference),
          resourceIncludedResult,
        )

        updatedIncludedCollectionRecords.push(
          this._pushPayload(
            getProperty(resourceIncludedResult, 'collectionName'),
            resourceIncludedResult,
          ),
        )
      })

      updatedDataCollectionRecords = await this._pushPayload(
        resourceName,
        resourceResults,
      )

      if (hasResourceAlias)
        this._processRequestAlias(arguments[0], updatedDataCollectionRecords)

      // POST: the temporary local record (created via createRecord) is
      // replaced by the server's version once persisted.
      if (isResourceMethodPost) this.unloadRecord(resourcePayloadRecord)

      // DELETE: drop the record locally now that the server confirmed it.
      if (isResourceMethodDelete)
        this.unloadRecord(updatedDataCollectionRecords)

      this._pushRequestHash(arguments[0], {
        isLoading: false,
        isError: false,
        isNew: false,
        data: updatedDataCollectionRecords,
        error: null,
        included: updatedIncludedCollectionRecords,
        meta: resourceMetaResults,
      })

      if (hasResourceAutoResolveOrigin)
        return Promise.resolve(updatedDataCollectionRecords)

      return Promise.resolve(requestHash)
    } catch (errors) {
      if (hasResourcePayload)
        this._setProperties(resourcePayloadRecord, {
          isError: true,
          isLoading: false,
        })

      if (isResourceIdValid)
        this._setProperties(collectionRecordById, {
          isError: true,
          isLoading: false,
        })

      this._pushRequestHash(arguments[0], {
        isLoading: false,
        isError: true,
        isNew: false,
        data: resourceFallback,
        error: errors,
        included: [],
        meta: {},
      })

      if (hasResourceAutoResolveOrigin) return Promise.reject(errors)

      return Promise.reject(requestHash)
    }
  }

  /**
   * Strips internal ARM fields and any caller-specified `ignorePayload`
   * keys off `resourcePayloadRecord`, then sets the result as the request
   * body.
   *
   * @private
   * @param {string[]} resourceIgnorePayload - An array of keys to be ignored (omitted) from the payload.
   * @param {Object} resourcePayloadRecord - The record object containing the payload data.
   * @param {Object} requestOptions - The options object for the request, where the processed payload will be set.
   */
  _processRequestPayload(
    resourceIgnorePayload,
    resourcePayloadRecord,
    requestOptions,
  ) {
    setProperty(requestOptions, 'data', {
      data: omit(resourcePayloadRecord, [
        ...resourceIgnorePayload,
        ...keysToBeOmittedOnRequestPayload,
      ]),
    })
  }

  /**
   * Appends `resourceId` to the request URL (`{resourceName}/{resourceId}`).
   *
   * @private
   * @param {string} resourceName - The name of the resource being accessed.
   * @param {string|number} resourceId - The ID of the specific resource.
   * @param {Object} requestOptions - The options object for the request, where the URL will be set.
   */
  _processRequestURL(resourceName, resourceId, requestOptions) {
    setProperty(requestOptions, 'url', `${resourceName}/${resourceId}`)
  }

  /**
   * Points `resourceConfig.alias` at both the resolved records (via
   * `_addAlias`) and the request hash that produced them (via
   * `_addRequestAlias`).
   *
   * @private
   * @param {Object} requestObject - The full request object used to generate the hash ID
   * and containing the resource configuration.
   * @param {Array|Object} collectionRecords - The records to be aliased. Can be an array
   * or a single object.
   */
  _processRequestAlias(requestObject, collectionRecords) {
    const requestHashKey = this._generateHashId(requestObject)
    const requestAliasName = getProperty(requestObject, 'resourceConfig.alias')

    this._addAlias(requestAliasName, collectionRecords)
    this._addRequestAlias(requestAliasName, requestHashKey)
  }

  /**
   * Applies `resourceConfig.override` (host/namespace/path/headers) on top
   * of the instance defaults for this single request.
   *
   * @private
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
      defaultRequestArrayResponse,
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
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
      defaultRequestObjectResponse,
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
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
      defaultRequestArrayResponse,
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
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
      defaultRequestObjectResponse,
    )
    const requestXHR = this._request(requestObject)

    return this._resolveRequest(config, requestXHR, requestHashObject)
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
    return getProperty(this.collections, collectionName)
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
      id: collectionRecordId,
    })
  }

  /**
   * @private
   * @param {string} rootScopeProperty - Property name.
   * @param {*}      rootScopeValue    - Value to set.
   */
  _setRootScope(rootScopeProperty, rootScopeValue) {
    setProperty(this.rootScope, rootScopeProperty, rootScopeValue)
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
    this._setRootScope(rootScopeProperty, rootScopeValue)
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
    return getProperty(this.rootScope, rootScopeProperty)
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
    return axios.request(config)
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
    return find(objects, findProperties)
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
    return findIndex(objects, findIndexProperties)
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
    return filter(objects, filterProperties)
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
    return uniqBy(objects, uniqByProperty)
  }

  /**
   * Returns a new array with duplicate primitive values removed.
   *
   * @param {Array.<*>} values - The source array of primitive values.
   * @returns {Array.<*>} Array with duplicates removed.
   *
   * @example
   * ARM.uniq([1, 2, 2, 3]) // [1, 2, 3]
   */
  uniq(values) {
    return uniq(values)
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
    return groupBy(objects, groupByProperty)
  }

  /**
   * Extracts a single property from every object in an array.
   *
   * @param {Object[]} objects       - The array to map over.
   * @param {string}   mapByProperty - Dot-notation path to the property to extract.
   * @returns {Array.<*>} A new array of the extracted values.
   *
   * @example
   * const ids = ARM.mapBy(addresses, 'id')
   * const cities = ARM.mapBy(addresses, 'attributes.city')
   */
  mapBy(objects, mapByProperty) {
    return map(objects, mapByProperty)
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
    return first(objects)
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
    return last(objects)
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
    return uniqWith(concat(objects, otherObjects), isEqual)
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
    return chunk(objects, chunkSize)
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
    return this._sortRecordsBy(objects, sortProperties)
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
    return sum(objects)
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
    const total = sumBy(objects, sumByProperty)
    return isNumber(total) ? total : 0
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
    return isEmpty(value)
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
    return !isEmpty(value)
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
    return isEqual(value, other)
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
    return isNumber(value)
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
    return isNil(value)
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
    return isNull(value)
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
    return gte(value, other)
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
    return gt(value, other)
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
    return lte(value, other)
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
    return lt(value, other)
  }
}
