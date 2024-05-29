import axios from 'axios'
import * as lodash from 'lodash'
import * as mobx from 'mobx'
import CryptoJS from 'crypto-js'

const {
  makeObservable,
  observable,
  action,
  //computed,
  //toJS
} = mobx

const {
  get: getProperty,
  set: setProperty,
  keysIn,
  find,
  findIndex,
  forEach,
  isObject,
  isArray,
  isPlainObject,
  isNumber,
  // isEmpty,
  // isEqual,
  gt,
  lt,
  flatMap,
  entries,
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

  _initializeAxiosConfig() {
    // Decide what are request default configurations
    axios.defaults.baseURL = this._getBaseURL()
    // axios.defaults.headers.common['Authorization'] =
    //   this._getAuthorizationToken()
  }

  _initializeCollections(collections) {
    forEach(collections, (collection) => this._addCollection(collection, []))
  }

  _getBaseURL() {
    return `${this.host}/${this.namespace}`
  }

  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem('token')}`
  }

  _addCollection(collectionName, collectionData) {
    this.collections[collectionName] = collectionData
  }

  _addAlias(aliasName, aliasedData, updatedCollection) {
    const isAliasedDataArray = isArray(aliasedData)
    const isAliasedDataObject = isPlainObject(aliasedData)

    if (isAliasedDataArray) {
      this.aliases[aliasName] = []

      forEach(aliasedData, (data) => {
        const collection = find(updatedCollection, {
          hashId: data.hashId,
        })

        this.aliases[aliasName].push(collection)
      })
    }

    if (isAliasedDataObject) {
      this.aliases[aliasName] = {}

      const collection = find(updatedCollection, {
        hashId: aliasedData.hashId,
      })

      this.aliases[aliasName] = collection
    }
  }

  _generateHashId(object) {
    const stringifyObject = JSON.stringify(object)
    return CryptoJS.MD5(stringifyObject).toString()
  }

  _getProperty(key) {
    return getProperty(this, key)
  }

  _setProperty(key, value) {
    setProperty(this, key, value)
  }

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

  /*
    Function for injecting
    getter and setter on observable collection
  */
  _injectActions(collection) {
    const actions = {
      get: this._getProperty,
      set: this._setProperty,
      save: this._saveRecord,
      setProperties: this._setProperties,
    }
    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) => {
      collection[actionKey] = actions[actionKey]
    })
  }

  /*
    Function for injecting reference keys such as:
    collectionName - identifier for which the collection data belongs to
    hashId - identifier for which collection data should be updated
  */
  _injectReferenceKeys(collectionName, collectionData) {
    collectionData.collectionName = collectionName
    collectionData.hashId = this._generateHashId(collectionData)
  }

  _pushPayloadToCollection(collectionName, collectionData) {
    const isCollectionDataArray = isArray(collectionData)
    const isCollectionDataObject = isPlainObject(collectionData)

    if (isCollectionDataArray) {
      forEach(collectionData, (collection) => {
        const collectionIndex = findIndex(this.collections[collectionName], {
          hashId: collection.hashId,
        })

        this._injectActions(collection)

        if (lt(collectionIndex, 0))
          this.collections[collectionName].push(collection)

        if (gt(collectionIndex, 0))
          this.collections[collectionName][collectionIndex] = collection
      })
    }

    if (isCollectionDataObject) {
      const collectionIndex = findIndex(this.collections[collectionName], {
        hashId: collectionData.hashId,
      })

      this._injectActions(collectionData)

      if (lt(collectionIndex, 0))
        this.collections[collectionName].push(collectionData)

      if (gt(collectionIndex, 0))
        this.collections[collectionName][collectionIndex] = collectionData
    }

    return new Promise((resolve, reject) => {
      resolve(this.collections[collectionName])
    })
  }

  async _saveRecord() {
    const isValidId = isNumber(this.id)
    const currentHashId = this.hashId
    const resourceURL = isValidId ? `${this.collectionName}/${this.id}` : this.collectionName
    const resourceMethod = isValidId ? 'patch' : 'post'
    const resourceData = { data: this }
    const saveRecordResourceRequest = await axios({
      method: resourceMethod,
      url: resourceURL,
      data: resourceData
    })
    const saveRecordResourceResults =
      saveRecordResourceRequest?.data?.data || {}
    const saveRecordResourceIncludedResults =
      saveRecordResourceResults?.data?.included || []
    let updatedCollection = []
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
    let updatedCollection = []

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

    updatedCollection = await this._pushPayloadToCollection(
      queryResourceName,
      queryResourceResults
    )

    if (queryConfig.alias)
      this._addAlias(queryConfig.alias, queryResourceResults, updatedCollection)
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
    let updatedCollection = []

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

    updatedCollection = await this._pushPayloadToCollection(
      queryRecordResourceName,
      queryRecordResourceResults
    )

    if (queryRecordConfig.alias)
      this._addAlias(
        queryRecordConfig.alias,
        queryRecordResourceResults,
        updatedCollection
      )
  }

  async findAll(findAllResourceName, findAllParams = {}, findAllConfig = {}) {}
}
