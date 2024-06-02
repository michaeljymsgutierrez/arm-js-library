import axios from 'axios'
import * as lodash from 'lodash'
import * as mobx from 'mobx'
import { v4 as uuidv4 } from 'uuid'
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
  gte,
  lt,
  flatMap,
  map,
  entries,
  forEach,
  keysIn,
} = lodash

export default class ApiResourceManager {
  constructor(collections = []) {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.collections = {}
    this.aliases = {}
    this.payloadIncludedReference = 'type'

    this._initializeCollections(collections)
    this._initializeAxiosConfig()

    makeObservable(this, {
      collections: observable,
      aliases: observable,
      _pushPayloadToCollection: action,
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
    Function for adding new collection and collection data.
  */
  _addCollection(collectionName, collectionData) {
    this.collections[collectionName] = collectionData
  }

  /*
    Function for aliasing data defined on API methods.
  */
  _addAlias(aliasName, updatedCollectionData) {
    const isUpdatedCollectionDataArray = isArray(updatedCollectionData)
    const isUpdatedCollectionDataObject = isPlainObject(updatedCollectionData)

    if (isUpdatedCollectionDataArray)
      this.aliases[aliasName] = updatedCollectionData || []

    if (isUpdatedCollectionDataObject) {
      this.aliases[aliasName] = updatedCollectionData || {}
    }
  }

  /*
    Function for generating collection data unique id.
  */
  _generateHashId(object) {
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

  unloadRecord(record) {
    const aliasesKeys = keysIn(this.aliases)
    const collectionIndex = findIndex(this.collections[record.collectionName], {
      hashId: record.hashId,
    })

    if (gte(collectionIndex, 0))
      this.collections[record.collectionName].splice(collectionIndex, 1)

    forEach(aliasesKeys, (aliasKey) => {
      const aliasCollectionIndex = findIndex(this.aliases[aliasKey], {
        hashId: record.hashId,
      })

      if (gte(aliasCollectionIndex, 0))
        this.aliases[aliasKey].splice(collectionIndex, 1)
    })
  }

  /*
    Function for persisting collection on the server,
    where it is being injected.
  */
  async _saveRecord(record) {
    const collection = find(this.collections[record.collectionName], {
      hashId: record.hashId,
    })
    const isValidId = isNumber(collection.id)
    const currentHashId = collection.hashId
    const resourceId = collection.id
    const resourceName = collection.collectionName
    const resourceURL = isValidId
      ? `${resourceName}/${resourceId}`
      : this.collectionName
    const resourceMethod = isValidId ? 'put' : 'post'
    const resourceData = { data: record }
    const saveRecordResourceRequest = await axios({
      method: resourceMethod,
      url: resourceURL,
      data: resourceData,
    })
    const saveRecordResourceResults =
      saveRecordResourceRequest?.data?.data || {}
    const saveRecordResourceIncludedResults =
      saveRecordResourceResults?.data?.included || []
    let updatedCollectionData = []

    this._injectReferenceKeys(
      resourceName,
      saveRecordResourceResults,
      currentHashId
    )

    forEach(
      saveRecordResourceIncludedResults,
      (saveRecordResourceIncludedResult) => {
        this._injectReferenceKeys(
          getProperty(
            saveRecordResourceIncludedResult,
            this.payloadIncludedReference
          ),
          saveRecordResourceIncludedResult
        )
        this._pushPayloadToCollection(
          saveRecordResourceIncludedResult.collectionName,
          saveRecordResourceIncludedResult
        )
      }
    )

    updatedCollectionData = await this._pushPayloadToCollection(
      resourceName,
      saveRecordResourceResults
    )

    return updatedCollectionData
  }

  async _deleteRecord(record) {

  }

  /*
    Function for injecting actions
    on collection record.
  */
  _injectActions(collectionRecord) {
    const actions = {
      get: this._getProperty,
      set: this._setProperty,
      save: () => this._saveRecord(collectionRecord),
      setProperties: this._setProperties,
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
    collectionRecord.collectionName = collectionName
    collectionRecord.hashId = isNull(collectionRecordHashId)
      ? this._generateHashId(collectionRecord)
      : collectionRecordHashId
  }

  /*
    Function for pushing collection records obtained from API methods
    to respective collections.
  */
  _pushPayloadToCollection(collectionName, collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
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
    }

    return new Promise((resolve, reject) => {
      resolve(updatedCollectionRecords)
    })
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

  getAlias(aliasName, fallbackData) {
    const isFallbackDataObject = isPlainObject(fallbackData)

    if (isFallbackDataObject) this._injectActions(fallbackData)

    return this.aliases[aliasName] || fallbackData
  }

  createRecord(collectionName, collectionRecord = {}) {
    collectionRecord.id = uuidv4()

    this._injectReferenceKeys(collectionName, collectionRecord)
    this._injectActions(collectionRecord)
    this.collections[collectionName].push(collectionRecord)

    return find(this.collections[collectionName], {
      hashId: collectionRecord.hashId
    })
  }

  /*
    TO DO: API ajax functions
    1. query - call endpoint that returns collection of data
    2. queryRecord - call endpoint that returns single data
    3. findAll - get data from local store first before, if data not then direct call endpoint that returns collection of data
    4. findRecord - get data from local store first before, if data not found then direct call endpoint that returns single data
    5. peekAll - get data from local store that returns collection of data
    6. peekRecord - get data from local store that returns single data
  */

  async query(queryResourceName, queryParams = {}, queryConfig = {}) {
    const queryResourceRequest = await axios.get(queryResourceName, {
      params: queryParams,
    })
    const queryResourceResults = queryResourceRequest?.data?.data || []
    const queryResourceIncludedResults =
      queryResourceRequest?.data?.included || []
    let updatedCollectionRecords = []

    forEach(queryResourceResults, (queryResourceResult) =>
      this._injectReferenceKeys(queryResourceName, queryResourceResult)
    )

    forEach(queryResourceIncludedResults, (queryResourceIncludedResult) => {
      this._injectReferenceKeys(
        getProperty(queryResourceIncludedResult, this.payloadIncludedReference),
        queryResourceIncludedResult
      )
      this._pushPayloadToCollection(
        queryResourceIncludedResult.collectionName,
        queryResourceIncludedResult
      )
    })

    updatedCollectionRecords = await this._pushPayloadToCollection(
      queryResourceName,
      queryResourceResults
    )

    if (queryConfig.alias)
      this._addAlias(queryConfig.alias, updatedCollectionRecords)

    return updatedCollectionRecords
  }

  async queryRecord(
    queryRecordResourceName,
    queryRecordResourceId,
    queryRecordParams = {},
    queryRecordConfig = {}
  ) {
    const queryRecordResourceRequest = await axios.get(
      `${queryRecordResourceName}/${queryRecordResourceId}`,
      {
        params: queryRecordParams,
      }
    )
    const queryRecordResourceResults =
      queryRecordResourceRequest?.data?.data || {}
    const queryRecordResourceIncludedResults =
      queryRecordResourceResults?.data?.included || []
    let updatedCollectionRecords = []

    this._injectReferenceKeys(
      queryRecordResourceName,
      queryRecordResourceResults
    )

    forEach(
      queryRecordResourceIncludedResults,
      (queryRecordResourceIncludedResult) => {
        this._injectReferenceKeys(
          getProperty(
            queryRecordResourceIncludedResult,
            this.payloadIncludedReference
          ),
          queryRecordResourceIncludedResult
        )
        this._pushPayloadToCollection(
          queryRecordResourceIncludedResult.collectionName,
          queryRecordResourceIncludedResult
        )
      }
    )

    updatedCollectionRecords = await this._pushPayloadToCollection(
      queryRecordResourceName,
      queryRecordResourceResults
    )

    if (queryRecordConfig.alias)
      this._addAlias(queryRecordConfig.alias, updatedCollectionRecords)

    return updatedCollectionRecords
  }

  async findAll(findAllResourceName, findAllParams = {}, findAllConfig = {}) {}
}
