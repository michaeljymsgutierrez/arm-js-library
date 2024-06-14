import axios from 'axios'
import * as lodash from 'lodash'
import * as mobx from 'mobx'
import { v1 as uuidv1 } from 'uuid'
import CryptoJS from 'crypto-js'

const { makeObservable, observable, action } = mobx

const {
  get: getProperty,
  set: setProperty,
  find,
  findIndex,
  isObject,
  isArray,
  isPlainObject,
  isNumber,
  isNull,
  isNil,
  isEmpty,
  isEqual,
  gte,
  lt,
  flatMap,
  map,
  entries,
  forEach,
  keysIn,
} = lodash

const defaultRequestArrayResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  included: [],
  meta: {},
}

const defaultRequestObjectResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: {},
  included: [],
  meta: {},
}

export default class ApiResourceManager {
  constructor(collections = []) {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.collections = {}
    this.aliases = {}
    this.requestHashIds = {}
    this.payloadIncludedReference = 'type'

    this._initializeCollections(collections)
    this._initializeAxiosConfig()

    makeObservable(this, {
      collections: observable,
      aliases: observable,
      requestHashIds: observable,
      _pushPayloadToCollection: action,
      _pushRequestHash: action,
      _addCollection: action,
      _addAlias: action,
    })
  }

  /*
    Define internal functions here.
    Internal functions are functions that are being used inside ARM class
    and not being exposed on new ARM instance.
    These function will be set to protected later on when tried to use on new ARM instance.
  */

  /*
    Function for initializeing Axios Configurations.
  */
  _initializeAxiosConfig() {
    axios.defaults.baseURL = this._getBaseURL()
    // Decide what are request default configurations
    // axios.defaults.headers.common['Authorization'] =
    //   this._getAuthorizationToken()
  }

  /*
    Function for initializing collections from ARM instance.
  */
  _initializeCollections(collections) {
    forEach(collections, (collection) => this._addCollection(collection, []))
  }

  /*
    Function for getting baseURL from
    host and namespace defined.
  */
  _getBaseURL() {
    return `${this.host}/${this.namespace}`
  }

  /*
    Function for getting token,
    by default it is being fetched on saved local storage
    key 'token'.
  */
  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem('token')}`
  }

  /*
    Function for adding new collection and collection records.
  */
  _addCollection(collectionName, collectionRecords) {
    this.collections[collectionName] = collectionRecords
  }

  /*
    Function for aliasing data defined on API methods.
  */
  _addAlias(aliasName, aliasRecords) {
    const isAliasRecordsArray = isArray(aliasRecords)
    const isAliasRecordsObject = isPlainObject(aliasRecords)

    if (isAliasRecordsArray) this.aliases[aliasName] = aliasRecords || []

    if (isAliasRecordsObject) this.aliases[aliasName] = aliasRecords || {}
  }

  /*
    Function for generating collection data unique id.
  */
  _generateHashId(object = { id: uuidv1() }) {
    const stringifyObject = JSON.stringify(object)
    return CryptoJS.MD5(stringifyObject).toString()
  }

  /*
    Functions for property management.
    Property management are set of function for setting and getting
    values from observable collection.
    This functions are injectables.
  */

  /*
    Function for getting single property of observable collection
    where it is being injected.
  */
  _getProperty(key) {
    return getProperty(this, key)
  }

  /*
    Function for setting single property of observable collection
    where it is being injected.
  */
  _setProperty(key, value) {
    setProperty(this, key, value)
  }

  /*
    Function for setting multiple properties of observable collection
    where it is being injected.
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
  }

  unloadRecord(currentRecord) {
    const aliasesKeys = keysIn(this.aliases)
    const collectionRecordIndex = findIndex(
      this.collections[currentRecord.collectionName],
      {
        hashId: currentRecord.hashId,
      }
    )

    if (gte(collectionRecordIndex, 0))
      this.collections[currentRecord.collectionName].splice(
        collectionRecordIndex,
        1
      )

    forEach(aliasesKeys, (aliasKey) => {
      const isAliasRecordsArray = isArray(this.aliases[aliasKey])
      const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

      if (isAliasRecordsArray) {
        const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
          hashId: currentRecord.hashId,
        })

        if (gte(aliasRecordIndex, 0))
          this.aliases[aliasKey].splice(aliasRecordIndex, 1)
      }

      if (isAliasRecordsObject) {
        if (
          isEqual(
            getProperty(currentRecord, 'hashId'),
            getProperty(this.aliases[aliasKey], 'hashId')
          )
        )
          this.aliases[aliasKey] = {}
      }
    })
  }

  /*
    Function for persisting collection record on the server,
    where it is being injected.
  */
  _saveRecord(currentRecord) {
    const collectionRecord = find(
      this.collections[currentRecord.collectionName],
      {
        hashId: currentRecord.hashId,
      }
    )
    const isValidId = isNumber(collectionRecord.id)
    const id = isValidId ? collectionRecord.id : null
    const resource = collectionRecord.collectionName
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

  async _deleteRecord(currentRecord) {
    const collectionRecord = find(
      this.collections[currentRecord.collectionName],
      {
        hashId: currentRecord.hashId,
      }
    )
    const id = collectionRecord.id
    const resource = collectionRecord.collectionName
    const method = 'delete'

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: id,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {},
    }

    return this._request(requestObject)
  }

  /*
    Function for injecting actions
    on collection record.
  */
  _injectActions(collectionRecord) {
    const actions = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(collectionRecord),
      destroyRecord: () => this._deleteRecord(collectionRecord),
    }
    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) => {
      collectionRecord[actionKey] = actions[actionKey]
    })
  }

  /*
    Function for injecting reference keys such as:
    collectionName - identifier for which collection the collection record belongs to
    collectionRecordHashId - identifier for which collection record should be updated
  */
  _injectReferenceKeys(
    collectionName,
    collectionRecord,
    collectionRecordHashId = null
  ) {
    collectionRecord.isLoading = false
    collectionRecord.isError = false
    collectionRecord.isPristine = true
    collectionRecord.isDirty = false
    collectionRecord.collectionName = collectionName
    collectionRecord.hashId = isNull(collectionRecordHashId)
      ? this._generateHashId({
          id: collectionRecord.id,
          collectionName: collectionRecord.collectionName,
        })
      : collectionRecordHashId
  }

  /*
    Function for pushing collection records obtained from API methods
    to respective collections.
  */
  _pushPayloadToCollection(collectionName, collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
    const aliasesKeys = keysIn(this.aliases)
    let updatedCollectionRecords = null

    if (isCollectionRecordsArray) {
      const collectionRecordsHashIds = map(collectionRecords, 'hashId')

      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordIndex = findIndex(
          this.collections[collectionName],
          {
            hashId: collectionRecord.hashId,
          }
        )

        this._injectActions(collectionRecord)

        if (lt(collectionRecordIndex, 0))
          this.collections[collectionName].push(collectionRecord)

        if (gte(collectionRecordIndex, 0))
          this.collections[collectionName][collectionRecordIndex] =
            collectionRecord
      })

      updatedCollectionRecords = map(
        collectionRecordsHashIds,
        (collectionRecordHashId) =>
          find(this.collections[collectionName], {
            hashId: collectionRecordHashId,
          })
      )

      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach(updatedCollectionRecords, (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: collectionRecord.hashId,
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          forEach(updatedCollectionRecords, (collectionRecord) => {
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
      const collectionRecordHashId = collectionRecords.hashId
      const collectionRecordIndex = findIndex(
        this.collections[collectionName],
        {
          hashId: collectionRecords.hashId,
        }
      )

      this._injectActions(collectionRecords)

      if (lt(collectionRecordIndex, 0))
        this.collections[collectionName].push(collectionRecords)

      if (gte(collectionRecordIndex, 0))
        this.collections[collectionName][collectionRecordIndex] =
          collectionRecords

      updatedCollectionRecords = find(this.collections[collectionName], {
        hashId: collectionRecordHashId,
      })

      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach([updatedCollectionRecords], (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: collectionRecord.hashId,
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          if (
            isEqual(
              getProperty(updatedCollectionRecords, 'hashId'),
              getProperty(this.aliases[aliasKey], 'hashId')
            )
          )
            this.aliases[aliasKey] = updatedCollectionRecords
        }
      })
    }

    return updatedCollectionRecords
  }

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

    if (isRequestHashExisting && responseObject.isNew) {
      setProperty(this.requestHashIds[requestHashId], 'isNew', false)
    } else {
      this.requestHashIds[requestHashId] = responseObject
    }

    return this.requestHashIds[requestHashId]
  }

  /*
    Define internal/external functions here.
    These functions are functions that are being used inside ARM class and new ARM instance.
  */

  setHost(host) {
    this.host = host
    this._initializeAxiosConfig()
  }

  setNamespace(namespace) {
    this.namespace = namespace
  }

  setHeadersCommon(key, value) {
    axios.defaults.headers.common[`${key}`] = value
  }

  setPayloadIncludeReference(key) {
    this.payloadIncludedReference = key
  }

  setGlobal() {
    if (window) window.ARM = Object.freeze(this)
    if (global) global.ARM = Object.freeze(this)
  }

  getCollection(collectionName) {
    return this.collections[collectionName] || []
  }

  clearCollection(collectionName) {
    this.collections[collectionName] = []
  }

  getAlias(aliasName, fallbackRecords) {
    const isFallbacRecordsObject = isPlainObject(fallbackRecords)

    if (isFallbacRecordsObject) this._injectActions(fallbackRecords)

    return this.aliases[aliasName] || fallbackRecords
  }

  createRecord(collectionName, collectionRecord = {}) {
    collectionRecord.id = uuidv1()

    this._injectReferenceKeys(collectionName, collectionRecord)
    this._injectActions(collectionRecord)
    this.collections[collectionName].push(collectionRecord)

    return find(this.collections[collectionName], {
      hashId: collectionRecord.hashId,
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
    // const isResourceMethodPut = isEqual(resourceMethod, 'put')
    // const isResourceMethodPost = isEqual(resourceMethod, 'post')
    const isResourceIdValid = isNumber(resourceId)
    const hasResourceParams = !isEmpty(resourceParams)
    const hasResourcePayload = !isEmpty(resourcePayload)
    const resourcePayloadRecord = getProperty(resourcePayload, 'data') || null
    const resourcePayloadHashId =
      getProperty(resourcePayload, 'data.hashId') || null

    if (isResourceIdValid) requestOptions.url = `${resourceName}/${resourceId}`
    if (hasResourceParams) requestOptions.params = resourceParams
    if (hasResourcePayload) requestOptions.data = resourcePayload

    /*
      Will terminate identical GET request for optimization
    */
    if (isResourceMethodGet) {
      const requestHashObject = this.requestHashIds[requestHashId]
      const isRequestHashIdExisting = !isNil(requestHashObject)
      if (isRequestHashIdExisting && requestHashObject.isNew === false) return
    }

    if (hasResourcePayload)
      setProperty(resourcePayloadRecord, 'isLoading', true)

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
        this._injectReferenceKeys(
          resourceName,
          resourceResults,
          resourcePayloadHashId
        )

      forEach(resourceIncludedResults, (resourceIncludedResult) => {
        this._injectReferenceKeys(
          getProperty(resourceIncludedResult, this.payloadIncludedReference),
          resourceIncludedResult
        )
        this._pushPayloadToCollection(
          resourceIncludedResult.collectionName,
          resourceIncludedResult
        )
      })

      updatedCollectionRecords = await this._pushPayloadToCollection(
        resourceName,
        resourceResults
      )

      if (resourceConfig.alias)
        this._addAlias(resourceConfig.alias, updatedCollectionRecords)

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

  /*
    Functions for retrieving collection of records from server
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

  /*
    Functions for retrieving collection of records from local cache
  */
  peekAll(collectionName) {
    return this.collections[collectionName]
  }

  peekRecord(collectionName, collectionRecordId) {
    return find(this.collections[collectionName], {
      id: collectionRecordId,
    })
  }
}

/*
  Notes:
  TO DO: API ajax functions
  Add properties: isLoading, isError, data, included, meta - Done
  1. query - Done
    - response payload is a collection of records
    - support query params
    - always request to server
  2. queryRecord - Done
    - response payload is a single record
    - support query params
    - always request to server
  3. findAll - Done
    - response payload is a collection of records
    - not support query params
    - always request to server
  4. findRecord - Done
    - response payload is a single record
    - support query params (by default query by id)
    - always request to server
  5. peekAll - Done
    - get all records from local cache
    - will not request to server
  6. peekRecord - Done
    - get single record from local cache (by default get by id)
    - will not request to server

  TO DO: Records new properties
  1. isPristine - check if record is not modified
  2. isDirty - check if record is modified
  3. isLoading - check if record is doing ajax - Done
  4. isError - check if record encountered an error
  5. rollBackAttributes - rollback record to is initial state
  6. reload - get latest record from server by id
  7. get by relationship like mapping

  TO DO: Alias and Ajax Functions (need to think more)
  1. Removed async await - Done
  2. Immediately return data (isLoading, isError, data) for aliased/non-aliased request - Done
*/
