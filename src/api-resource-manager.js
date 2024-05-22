import axios from 'axios'
import * as lodash from 'lodash'
import CryptoJS from 'crypto-js'
import { makeObservable, observable, computed, action, toJS, set } from 'mobx'

const {
  find,
  findIndex,
  forEach,
  gt,
  lt,
  unionWith,
  isArray,
  isPlainObject,
  isEmpty,
  isEqual,
} = lodash

export default class ApiResourceManager {
  constructor(collections = []) {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.collections = {}
    this.aliases = {}

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
    axios.defaults.baseURL = this._getBaseURL()
    // axios.defaults.headers.common['Authorization'] =
    //   this._getAuthorizationToken()
    // axios.defaults.headers.common['Content-Type'] = 'application/vnd.api+json'
    // axios.defaults.headers.common['X-Client-Platform'] = 'Web'
  }

  _initializeCollections(collections) {
    collections.forEach((collection) => this._addCollection(collection, []))
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
    let isAliasedDataArray = isArray(aliasedData)
    let isAliasedDataObject = isPlainObject(aliasedData)
    let updatedAliasedData = null

    if (isAliasedDataArray) {
      updatedAliasedData = []
      aliasedData.forEach((data) =>
        updatedAliasedData.push(find(updatedCollection, data))
      )
    }

    if (isAliasedDataObject) {
      updatedAliasedData = {}
      updatedAliasedData = find(updatedCollection, aliasedData)
    }

    this.aliases[aliasName] = updatedAliasedData
  }

  _generateHashID(object) {
    const stringifyObject = JSON.stringify(object)
    return CryptoJS.MD5(stringifyObject).toString()
  }

  _pushPayloadToCollection(collectionName, collectionData) {
    const isCollectionDataArray = isArray(collectionData)
    const isCollectionDataObject = isPlainObject(collectionData)

    if (isCollectionDataArray) {
      forEach(collectionData, (collection) => {
        const collectionIndex = findIndex(this.collections[collectionName], {
          hashId: collection.hashId,
        })

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

      if (lt(collectionIndex, 0))
        this.collections[collectionName].push(collectionData)

      if (gt(collectionIndex, 0))
        this.collections[collectionName][collectionIndex] = collectionData
    }

    return new Promise((resolve, reject) => {
      resolve(this.collections[collectionName])
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

  getCollection(collectionName) {
    return this.collections[collectionName]
  }

  getAlias(aliasName) {
    return this.aliases[aliasName]
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

    forEach(queryResourceResults, (queryResourceResult) => {
      queryResourceResult.hashId = this._generateHashID(queryResourceResult)
    })

    this._pushPayloadToCollection(queryResourceName, queryResourceResults).then(
      (updatedCollection) => {
        if (queryConfig.alias)
          this._addAlias(
            queryConfig.alias,
            queryResourceResults,
            updatedCollection
          )
      }
    )
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

    queryRecordResourceResults.hashId = this._generateHashID(
      queryRecordResourceResults
    )

    this._pushPayloadToCollection(
      queryRecordResourceName,
      queryRecordResourceResults
    ).then((updatedCollection) => {
      if (queryRecordConfig.alias)
        this._addAlias(
          queryRecordConfig.alias,
          queryRecordResourceResults,
          updatedCollection
        )
    })
  }

  async findAll(findAllResourceName, findAllParams = {}, findAllConfig = {}) {}
}
