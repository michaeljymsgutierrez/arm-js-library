/**
 * ARM JavaScript Library
 *
 * Version: 1.4.3
 * Date: 2024-05-09 2:19PM GMT+8
 *
 * @author Michael Jyms Gutierrez
 * @license MIT
 *
 * Axios library for making HTTP requests.
 * @see https://axios-http.com/docs/
 *
 * Lodash utility library.
 * @see https://lodash.com/docs/4.17.21
 *
 * MobX state management library.
 * @see https://mobx.js.org/
 *
 * UUID generation library.
 * @see https://www.npmjs.com/package/uuid
 *
 * CryptoJS library for cryptographic functions.
 * @see https://crypto-js.org/
 */

import axios from 'axios'
import _ from 'lodash'
import * as mobx from 'mobx'
import { v1 as uuidv1, NIL as NIL_UUID } from 'uuid'
import CryptoJS from 'crypto-js'

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
 */
const defaultRequestArrayResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  included: [],
  meta: {},
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
 */
const defaultRequestObjectResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: {},
  included: [],
  meta: {},
}

/**
 * An array of keys to be omitted during a deep check operation.
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
]

/**
 * An array of keys to be omitted when constructing a request payload.
 * These keys typically represent internal object properties or methods.
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
     * A dictionary to store request hash IDs.
     * @type {Object}
     */
    this.requestHashIds = {}

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
      requestHashIds: observable,
      _pushPayload: action,
      _pushRequestHash: action,
      _addCollection: action,
      _addAlias: action,
    })
  }

  /**
   * Initializes the Axios configuration with the base URL.
   *
   * @private
   */
  _initializeAxiosConfig() {
    axios.defaults.baseURL = this._getBaseURL()
  }

  /**
   * Initializes a collection of collections with optional default values.
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
   * @private
   * @returns {string} The base URL constructed from `host` and `namespace` properties.
   */
  _getBaseURL() {
    return `${this.host}/${this.namespace}`
  }

  /**
   * Checks if a collection exists in the current instance.
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
   * @private
   * @param {string} collectionName - The name of the collection to add.
   * @param {Array} collectionRecords - The records for the collection.
   */
  _addCollection(collectionName, collectionRecords) {
    this.collections[collectionName] = collectionRecords
  }

  /**
   * Adds an alias to the aliases object.
   *
   * @private
   * @param {string} aliasName - The name of the alias.
   * @param {Array|Object} aliasRecords - The records for the alias. Can be an array or an object.
   */
  _addAlias(aliasName, aliasRecords) {
    const isAliasRecordsArray = isArray(aliasRecords)
    const isAliasRecordsObject = isPlainObject(aliasRecords)

    if (isAliasRecordsArray) this.aliases[aliasName] = aliasRecords || []

    if (isAliasRecordsObject) this.aliases[aliasName] = aliasRecords || {}
  }

  /**
   * Generates a hash ID based on the provided object.
   *
   * @private
   * @param {Object} object - The object to generate the hash ID from. Defaults to an object with an `id` property generated using `uuidv1()`.
   * @returns {string} The generated hash ID.
   */
  _generateHashId(object = { id: uuidv1() }) {
    const stringifyObject = JSON.stringify(object)
    return CryptoJS.MD5(stringifyObject).toString()
  }

  /**
   * Gets a property from the current object.
   *
   * @private
   * @param {string} key - The key of the property to retrieve.
   * @returns {*} The value of the property, or undefined if not found.
   */
  _getProperty(key) {
    return getProperty(this, key)
  }

  /**
   * Sets a property on the current object and updates `isDirty` and `isPristine` flags accordingly.
   *
   * @private
   * @param {string} key - The key of the property to set.
   * @param {*} value - The value to assign to the property.
   */
  _setProperty(key, value) {
    setProperty(this, key, value)

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)

    if (isEqual(originalRecord, currentRecord)) {
      setProperty(this, 'isDirty', false)
      setProperty(this, 'isPristine', true)
    } else {
      setProperty(this, 'isDirty', true)
      setProperty(this, 'isPristine', false)
    }
  }

  /**
   * Sets multiple properties on the current object based on the provided object.
   * Recursively handles nested objects and updates `isDirty` and `isPristine` flags accordingly.
   *
   * @private
   * @param {Object} objectKeysValues - An object containing key-value pairs to be set.
   */
  _setProperties(objectKeysValues) {
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
    const keysAndValues = objectToArray(objectKeysValues)
    forEach(keysAndValues, ({ key, value }) => setProperty(this, key, value))

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)

    if (isEqual(originalRecord, currentRecord)) {
      setProperty(this, 'isDirty', false)
      setProperty(this, 'isPristine', true)
    } else {
      setProperty(this, 'isDirty', true)
      setProperty(this, 'isPristine', false)
    }
  }

  /**
   * Sorts an array of records based on specified properties and sort orders.
   *
   * @private
   * @param {Array} currentRecords - The array of records to sort.
   * @param {Array<string>} sortProperties - An array of sort properties in the format of 'property:order'.
   *  Valid orders are 'asc' (ascending) and 'desc' (descending).
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
   * @private
   * @param {Object} collectionRecord - The record to be removed from the collection.
   */
  _unloadFromCollection(collectionRecord) {
    const collectionName = getProperty(collectionRecord, 'collectionName')
    const collectionRecordIndex = findIndex(this.collections[collectionName], {
      hashId: getProperty(collectionRecord, 'hashId'),
    })

    if (gte(collectionRecordIndex, 0))
      this.collections[collectionName].splice(collectionRecordIndex, 1)
  }

  /**
   * Removes a record from all request hashes based on its hash ID.
   *
   * @private
   * @param {Object} collectionRecord - The record to be removed from request hashes.
   */
  _unloadFromRequestHashes(collectionRecord) {
    const requestHashIdsKeys = keysIn(this.requestHashIds)

    forEach(requestHashIdsKeys, (requestHashIdKey) => {
      const requestHashIdData = getProperty(
        this.requestHashIds[requestHashIdKey],
        'data'
      )
      const isRequestHashIdDataArray = isArray(requestHashIdData)
      const isRequestHashIdDataObject = isPlainObject(requestHashIdData)

      if (isRequestHashIdDataArray) {
        const requestHashIdRecordIndex = findIndex(
          getProperty(this.requestHashIds[requestHashIdKey], 'data'),
          {
            hashId: getProperty(collectionRecord, 'hashId'),
          }
        )
        if (gte(requestHashIdRecordIndex, 0))
          this.requestHashIds[requestHashIdKey]['data'].splice(
            requestHashIdRecordIndex,
            1
          )
      }

      if (isRequestHashIdDataObject) {
        if (
          isEqual(
            getProperty(collectionRecord, 'hashId'),
            getProperty(this.requestHashIds[requestHashIdKey], 'data.hashId')
          )
        )
          setProperty(this.requestHashIds[requestHashIdKey], 'data', {})
      }
    })
  }

  /**
   * Removes a record from all aliases based on its hash ID.
   *
   * @private
   * @param {Object} collectionRecord - The record to be removed from aliases.
   */
  _unloadFromAliases(collectionRecord) {
    const aliasesKeys = keysIn(this.aliases)

    forEach(aliasesKeys, (aliasKey) => {
      const isAliasRecordsArray = isArray(this.aliases[aliasKey])
      const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

      if (isAliasRecordsArray) {
        const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
          hashId: getProperty(collectionRecord, 'hashId'),
        })

        if (gte(aliasRecordIndex, 0))
          this.aliases[aliasKey].splice(aliasRecordIndex, 1)
      }

      if (isAliasRecordsObject) {
        if (
          isEqual(
            getProperty(collectionRecord, 'hashId'),
            getProperty(this.aliases[aliasKey], 'hashId')
          )
        )
          this.aliases[aliasKey] = {}
      }
    })
  }

  /**
   * Unloads a record from the collection, request hashes, and aliases.
   *
   * @param {Object} currentRecord - The record to be unloaded.
   */
  unloadRecord(currentRecord) {
    this._unloadFromCollection(currentRecord)
    this._unloadFromRequestHashes(currentRecord)
    this._unloadFromAliases(currentRecord)
  }

  /**
   * Saves a record to the server.
   *
   * @private
   * @param {Object} currentRecord - The record to be saved.
   * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
   */
  _saveRecord(currentRecord) {
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecord = find(this.collections[collectionName], {
      hashId: getProperty(currentRecord, 'hashId'),
    })
    const isValidId = isNumber(getProperty(collectionRecord, 'id'))
    const id = isValidId ? getProperty(collectionRecord, 'id') : null
    const resource = collectionName
    const method = isValidId ? 'put' : 'post'
    const payload = { data: collectionRecord }

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: id,
      resourceParams: {},
      resourcePayload: payload,
      resourceFallback: {},
      resourceConfig: {},
    }

    return this._request(requestObject)
  }

  /**
   * Deletes a record from the server.
   *
   * @private
   * @async
   * @param {Object} currentRecord - The record to be deleted.
   * @returns {Promise} A Promise that resolves when the deletion is successful or rejects with an error.
   */
  async _deleteRecord(currentRecord) {
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecord = find(this.collections[collectionName], {
      hashId: getProperty(currentRecord, 'hashId'),
    })
    const id = getProperty(currentRecord, 'id')
    const resource = getProperty(collectionRecord, 'collectionName')
    const method = 'delete'

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: Number(id),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {},
    }

    return this._request(requestObject)
  }

  /**
   * Reloads a record from the server.
   *
   * @private
   * @async
   * @param {Object} currentRecord - The record to be reloaded.
   * @returns {Promise} A Promise that resolves with the updated record or rejects with an error.
   */
  async _reloadRecord(currentRecord) {
    const id = getProperty(currentRecord, 'id')
    const resource = getProperty(currentRecord, 'collectionName')
    const method = 'get'

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: Number(id),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: uuidv1() },
    }

    return this._request(requestObject)
  }

  /**
   * Retrieves records from a specified collection based on given criteria.
   *
   * @private
   * @param {string} collectionName - The name of the collection to retrieve records from.
   * @param {Object} collectionConfig - Optional configuration for the collection, including referenceKey, async, filterBy, and sortBy properties.
   * @param {Object|Array} currentRecord - The current record containing potential related records.
   * @returns {Object|Array} The retrieved records, either a single object or an array depending on the input.
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
      const relatedRecordHashId = this._generateHashId({
        id: getProperty(relatedRecord, 'id'),
        collectionName: collectionName,
      })

      const collectionRecord = find(this.collections[collectionName], {
        hashId: relatedRecordHashId,
      })

      if (!isEmpty(collectionRecord)) {
        collectionRecords.push(collectionRecord)
      } else {
        if (collectionAsync) {
          const requestObject = {
            resourceMethod: 'get',
            resourceName: collectionName,
            resourceId: getProperty(relatedRecord, 'id'),
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
   * @private
   * @param {Object} collectionRecord - The collection record to inject actions into.
   */
  _injectActions(collectionRecord) {
    const actions = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(collectionRecord),
      destroyRecord: () => this._deleteRecord(collectionRecord),
      reload: () => this._reloadRecord(collectionRecord),
      getCollection: (collectionName, collectionConfig) =>
        this._getCollectionRecord(
          collectionName,
          collectionConfig,
          collectionRecord
        ),
    }
    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) => {
      collectionRecord[actionKey] = actions[actionKey]
    })
  }

  /**
   * Injects reference keys into a collection record.
   *
   * @private
   * @param {string} collectionName - The name of the collection.
   * @param {Object} collectionRecord - The collection record to inject keys into.
   * @param {string} collectionRecordHashId - Optional hash ID for the record.
   */
  _injectReferenceKeys(
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

    setProperty(collectionRecord, 'collectionName', collectionName)
    setProperty(collectionRecord, 'hashId', recordHashId)
    setProperty(collectionRecord, 'isLoading', false)
    setProperty(collectionRecord, 'isError', false)
    setProperty(collectionRecord, 'isPristine', true)
    setProperty(collectionRecord, 'isDirty', false)
  }

  /**
   * Pushes records to a specified collection.
   *
   * @private
   * @param {string} collectionName - The name of the collection to push records to.
   * @param {Array|Object} collectionRecords - The records to be pushed. Can be an array or an object.
   * @returns {Array|Object} The pushed records, either an array or an object depending on the input.
   */
  _pushToCollection(collectionName, collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)

    if (isCollectionRecordsArray) {
      const collectionRecordsHashIds = map(collectionRecords, 'hashId')

      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordIndex = findIndex(
          this.collections[collectionName],
          {
            hashId: getProperty(collectionRecord, 'hashId'),
          }
        )

        this._injectActions(collectionRecord)

        if (lt(collectionRecordIndex, 0))
          this.collections[collectionName].push(collectionRecord)

        if (gte(collectionRecordIndex, 0))
          this.collections[collectionName][collectionRecordIndex] =
            collectionRecord
      })

      return map(collectionRecordsHashIds, (collectionRecordHashId) =>
        find(this.collections[collectionName], {
          hashId: collectionRecordHashId,
        })
      )
    }

    if (isCollectionRecordsObject) {
      const collectionRecordHashId = collectionRecords.hashId
      const collectionRecordIndex = findIndex(
        this.collections[collectionName],
        {
          hashId: getProperty(collectionRecords, 'hashId'),
        }
      )

      this._injectActions(collectionRecords)

      if (lt(collectionRecordIndex, 0))
        this.collections[collectionName].push(collectionRecords)

      if (gte(collectionRecordIndex, 0))
        this.collections[collectionName][collectionRecordIndex] =
          collectionRecords

      return find(this.collections[collectionName], {
        hashId: collectionRecordHashId,
      })
    }
  }

  /**
   * Pushes records to specified aliases.
   *
   * @private
   * @param {Array|Object} collectionRecords - The records to be pushed to aliases.
   */
  _pushToAliases(collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
    const aliasesKeys = keysIn(this.aliases)

    if (isCollectionRecordsArray) {
      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach(collectionRecords, (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: getProperty(collectionRecord, 'hashId'),
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          forEach(collectionRecords, (collectionRecord) => {
            if (
              isEqual(
                getProperty(collectionRecord, 'hashId'),
                getProperty(this.aliases[aliasKey], 'hashId')
              )
            )
              this.aliases[aliasKey] = collectionRecord
          })
        }
      })
    }

    if (isCollectionRecordsObject) {
      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach([collectionRecords], (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: getProperty(collectionRecord, 'hashId'),
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          if (
            isEqual(
              getProperty(collectionRecords, 'hashId'),
              getProperty(this.aliases[aliasKey], 'hashId')
            )
          )
            this.aliases[aliasKey] = collectionRecords
        }
      })
    }
  }

  /**
   * Pushes records to specified request hashes.
   *
   * @private
   * @param {Array|Object} collectionRecords - The records to be pushed to request hashes.
   */
  _pushToRequestHashes(collectionRecords) {
    const requestHashIdsKeys = keysIn(this.requestHashIds)
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
    let newCollectionRecords = null

    if (isCollectionRecordsArray) newCollectionRecords = collectionRecords
    if (isCollectionRecordsObject) newCollectionRecords = [collectionRecords]

    forEach(requestHashIdsKeys, (requestHashIdKey) => {
      const requestHashIdData = getProperty(
        this.requestHashIds[requestHashIdKey],
        'data'
      )
      const isRequestHashIdDataArray = isArray(requestHashIdData)
      const isRequestHashIdDataObject = isPlainObject(requestHashIdData)

      forEach(newCollectionRecords, (collectionRecord) => {
        if (isRequestHashIdDataArray) {
          const requestHashIdRecordIndex = findIndex(
            getProperty(this.requestHashIds[requestHashIdKey], 'data'),
            {
              hashId: getProperty(collectionRecord, 'hashId'),
            }
          )
          if (gte(requestHashIdRecordIndex, 0))
            this.requestHashIds[requestHashIdKey]['data'][
              requestHashIdRecordIndex
            ] = collectionRecord
        }

        if (isRequestHashIdDataObject) {
          if (
            isEqual(
              getProperty(collectionRecord, 'hashId'),
              getProperty(this.requestHashIds[requestHashIdKey], 'data.hashId')
            )
          )
            setProperty(
              this.requestHashIds[requestHashIdKey],
              'data',
              collectionRecord
            )
        }
      })
    })
  }

  /**
   * Pushes records to a collection, aliases, and request hashes.
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
   * Pushes a request and its corresponding response to the request hash store.
   *
   * @private
   * @param {Object} requestObject - The request object.
   * @param {Object} responseObject - The initial response object.
   * @returns {Object} The updated or created request hash object.
   */
  _pushRequestHash(
    requestObject = {},
    responseObject = {
      isLoading: true,
      isError: false,
      isNew: true,
      data: null,
    }
  ) {
    const requestHashId = this._generateHashId(requestObject)
    const isRequestHashExisting = !isNil(this.requestHashIds[requestHashId])
    const isResponseNew = getProperty(responseObject, 'isNew')

    if (isRequestHashExisting && isResponseNew) {
      setProperty(this.requestHashIds[requestHashId], 'isNew', false)
    } else {
      this.requestHashIds[requestHashId] = responseObject
    }

    return this.requestHashIds[requestHashId]
  }

  /**
   * Sets the host URL for the client and initializes the Axios configuration.
   *
   * @param {string} host - The base URL of the API server.
   */
  setHost(host) {
    this.host = host
    this._initializeAxiosConfig()
  }

  /**
   * Sets the namespace for the client.
   *
   * @param {string} namespace - The namespace for API requests.
   */
  setNamespace(namespace) {
    this.namespace = namespace
  }

  /**
   * Sets a common header for all Axios requests.
   *
   * @param {string} key - The header key.
   * @param {string|number|boolean} value - The header value.
   */
  setHeadersCommon(key, value) {
    axios.defaults.headers.common[`${key}`] = value
  }

  /**
   * Sets the reference key used for included data in request payloads.
   *
   * @param {string} key - The new reference key.
   */
  setPayloadIncludeReference(key) {
    this.payloadIncludedReference = key
  }

  /**
   * Makes the instance accessible globally in a browser environment.
   *
   * Attaches the instance to the `window` object as `window.ARM`.
   * **Caution:** This method should be used with care as it modifies the global scope.
   */
  setGlobal() {
    if (typeof window !== 'undefined') window.ARM = Object.freeze(this)
  }

  /**
   * Retrieves a collection by its name.
   *
   * @param {string} collectionName - The name of the collection to retrieve.
   * @returns {Array} The collection data, or an empty array if not found.
   */
  getCollection(collectionName) {
    return this.collections[collectionName] || []
  }

  /**
   * Clears the contents of a specified collection.
   *
   * @param {string} collectionName - The name of the collection to clear.
   */
  clearCollection(collectionName) {
    this.collections[collectionName] = []
  }

  /**
   * Retrieves an alias by its name, with optional fallback records.
   *
   * @param {string} aliasName - The name of the alias to retrieve.
   * @param {Object} fallbackRecords - Optional fallback records to return if the alias is not found.
   * @returns {Array|Object} The alias data or the fallback records.
   */
  getAlias(aliasName, fallbackRecords) {
    const isFallbacRecordsObject = isPlainObject(fallbackRecords)

    if (isFallbacRecordsObject) this._injectActions(fallbackRecords)

    return this.aliases[aliasName] || fallbackRecords
  }

  createRecord(
    collectionName,
    collectionRecord = {},
    collectionRecordRandomId = true
  ) {
    const collectionRecordId = collectionRecordRandomId ? uuidv1() : NIL_UUID
    const isCollectionRecordNotExisting = isNil(
      find(this.collections[collectionName], {
        id: collectionRecordId,
      })
    )

    setProperty(collectionRecord, 'id', collectionRecordId)

    this._injectReferenceKeys(collectionName, collectionRecord)
    this._injectActions(collectionRecord)

    if (isCollectionRecordNotExisting)
      this.collections[collectionName].push(collectionRecord)

    return find(this.collections[collectionName], {
      id: collectionRecordId,
    })
  }

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
    }
    const requestHashId = this._generateHashId({ ...arguments[0] })
    const isResourceMethodGet = isEqual(resourceMethod, 'get')
    const isResourceMethodDelete = isEqual(resourceMethod, 'delete')
    const isResourceMethodPost = isEqual(resourceMethod, 'post')
    const isResourceIdValid = isNumber(resourceId) || isString(resourceId)
    const hasResourceParams = !isEmpty(resourceParams)
    const hasResourcePayload = !isEmpty(resourcePayload)
    const hasResourceConfigOverride = !isNil(
      getProperty(resourceConfig, 'override')
    )
    const resourcePayloadRecord = getProperty(resourcePayload, 'data') || null
    const collectionRecordById = isResourceIdValid
      ? find(this.collections[resourceName], {
          id: resourceId,
        })
      : null

    if (hasResourceConfigOverride) {
      const override = getProperty(resourceConfig, 'override') || {}
      const overrideHost = !isNil(getProperty(override, 'host'))
        ? getProperty(override, 'host')
        : this.host
      const overrideNamespace = !isNil(getProperty(override, 'namespace'))
        ? getProperty(override, 'namespace')
        : this.namespace
      const overrideBaseURL = `${overrideHost}/${overrideNamespace}`

      const overrideHeaders = !isNil(getProperty(override, 'headers'))
        ? getProperty(override, 'headers')
        : {}
      const commonHeaders = axios.defaults.headers.common
      const overrideCommonHeaders = assign(commonHeaders, overrideHeaders)

      setProperty(requestOptions, 'baseURL', overrideBaseURL)
      setProperty(requestOptions, 'headers', overrideCommonHeaders)
    }

    if (isResourceIdValid)
      setProperty(requestOptions, 'url', `${resourceName}/${resourceId}`)

    if (hasResourceParams) setProperty(requestOptions, 'params', resourceParams)
    if (hasResourcePayload) {
      const payload = {
        data: omit(resourcePayloadRecord, keysToBeOmittedOnRequestPayload),
      }
      setProperty(requestOptions, 'data', payload)
    }

    const hasSkipRequest = !isNil(getProperty(resourceConfig, 'skip'))
    const skipRequest = isEqual(getProperty(resourceConfig, 'skip'), true)
    const requestHashObject = this.requestHashIds[requestHashId]
    const isRequestHashIdExisting = !isNil(requestHashObject)
    const isRequestNew = getProperty(requestHashObject, 'isNew')

    if (isResourceMethodGet) {
      if (hasSkipRequest && skipRequest) return
      if (!hasSkipRequest && isRequestHashIdExisting && !isRequestNew) return
      if (
        hasSkipRequest &&
        !skipRequest &&
        isRequestHashIdExisting &&
        !isRequestNew
      )
        return
    }

    if (hasResourcePayload)
      setProperty(resourcePayloadRecord, 'isLoading', true)

    if (isResourceIdValid) setProperty(collectionRecordById, 'isLoading', true)

    try {
      const resourceRequest = await axios(requestOptions)
      const resourceResults = resourceRequest?.data?.data || resourceFallback
      const resourceIncludedResults = resourceRequest?.data?.included || []
      const resourceMetaResults = resourceRequest?.data?.meta || {}
      const isResourceResultsObject = isPlainObject(resourceResults)
      const isResourceResultsArray = isArray(resourceResults)
      let updatedCollectionRecords = null

      if (isResourceResultsArray)
        forEach(resourceResults, (resourceResult) =>
          this._injectReferenceKeys(resourceName, resourceResult)
        )

      if (isResourceResultsObject)
        this._injectReferenceKeys(resourceName, resourceResults)

      forEach(resourceIncludedResults, (resourceIncludedResult) => {
        this._injectReferenceKeys(
          getProperty(resourceIncludedResult, this.payloadIncludedReference),
          resourceIncludedResult
        )
        this._pushPayload(
          getProperty(resourceIncludedResult, 'collectionName'),
          resourceIncludedResult
        )
      })

      updatedCollectionRecords = await this._pushPayload(
        resourceName,
        resourceResults
      )

      if (resourceConfig.alias)
        this._addAlias(
          getProperty(resourceConfig, 'alias'),
          updatedCollectionRecords
        )

      if (isResourceMethodPost) this.unloadRecord(resourcePayloadRecord)
      if (isResourceMethodDelete) this.unloadRecord(updatedCollectionRecords)

      this.requestHashIds[requestHashId] = {
        isLoading: false,
        isError: false,
        isNew: false,
        data: updatedCollectionRecords,
        included: [],
        meta: resourceMetaResults,
      }

      return Promise.resolve(updatedCollectionRecords)
    } catch (error) {
      if (hasResourcePayload) {
        setProperty(resourcePayloadRecord, 'isError', true)
        setProperty(resourcePayloadRecord, 'isLoading', false)
      }

      if (isResourceIdValid) {
        setProperty(collectionRecordById, 'isError', true)
        setProperty(collectionRecordById, 'isLoading', false)
      }

      this.requestHashIds[requestHashId] = {
        isLoading: false,
        isError: true,
        isNew: false,
        data: error,
        included: [],
        meta: {},
      }

      return Promise.reject(error)
    }
  }

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
    const responseObject = defaultRequestArrayResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )

    this._request(requestObject)

    return requestHashObject
  }

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
    const responseObject = defaultRequestObjectResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )
    this._request(requestObject)

    return requestHashObject
  }

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
    const responseObject = defaultRequestArrayResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )
    this._request(requestObject)

    return requestHashObject
  }

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
    const responseObject = defaultRequestObjectResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )
    this._request(requestObject)

    return requestHashObject
  }

  peekAll(collectionName) {
    return this.collections[collectionName]
  }

  peekRecord(collectionName, collectionRecordId) {
    return find(this.collections[collectionName], {
      id: collectionRecordId,
    })
  }

  ajax(config = {}) {
    return axios.request(config)
  }

  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(objects, findProperties = {}) {
    return find(objects, findProperties)
  }

  findIndexBy(objects, findIndexProperties = {}) {
    return findIndex(objects, findIndexProperties)
  }

  filterBy(objects, filterProperties = {}) {
    return filter(objects, filterProperties)
  }

  uniqBy(objects, uniqByProperty) {
    return uniqBy(objects, uniqByProperty)
  }

  groupBy(objects, groupByProperty) {
    return groupBy(objects, groupByProperty)
  }

  firstObject(objects = []) {
    return first(objects)
  }

  lastObject(objects = []) {
    return last(objects)
  }

  mergeObjects(objects = [], otherObjects = []) {
    return uniqWith(concat(objects, otherObjects), isEqual)
  }

  chunkObjects(objects = [], chunkSize = 1) {
    return chunk(objects, chunkSize)
  }

  sortBy(objects, sortProperties) {
    return this._sortRecordsBy(objects, sortProperties)
  }

  isEmpty(value) {
    return isEmpty(value)
  }

  isPresent(value) {
    return !isEmpty(value)
  }

  isEqual(value, other) {
    return isEqual(value, other)
  }

  isNumber(value) {
    return isNumber(value)
  }

  isNil(value) {
    return isNil(value)
  }

  isNull(value) {
    return isNull(value)
  }

  isGte(value, other) {
    return gte(value, other)
  }

  isGt(value, other) {
    return gt(value, other)
  }

  isLte(value, other) {
    return lte(value, other)
  }

  isLt(value, other) {
    return lt(value, other)
  }
}
