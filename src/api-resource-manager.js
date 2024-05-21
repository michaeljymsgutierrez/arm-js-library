import axios from 'axios'
import * as lodash from 'lodash'
import { makeObservable, observable, computed, action, flow, toJS } from 'mobx'

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
      addCollection: action,
      addAlias: action,
    })
  }

  _initializeAxiosConfig() {
    axios.defaults.baseURL = this._getBaseURL()
    axios.defaults.headers.common['Authorization'] =
      this._getAuthorizationToken()
    axios.defaults.headers.common['Content-Type'] = 'application/vnd.api+json'
    axios.defaults.headers.common['X-Client-Platform'] = 'Web'
  }

  _initializeCollections(collections) {
    collections.forEach((collection) => this.addCollection(collection, []))
  }

  _getBaseURL() {
    return `${this.host}/${this.namespace}`
  }

  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem('token')}`
  }

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

  addCollection(collectionName, collectionData) {
    this.collections[collectionName] = collectionData
  }

  getCollection(collectionName) {
    return this.collections[collectionName]
  }

  addAlias(aliasName, aliasedData, updatedCollection) {
    let updatedAliasedData = []

    aliasedData.forEach((data) =>
      updatedAliasedData.push(lodash.find(updatedCollection, data))
    )
    this.aliases[aliasName] = updatedAliasedData
  }

  getAlias(aliasName) {
    return this.aliases[aliasName]
  }

  _pushPayloadToCollection(collectionName, collectionData) {
    // let currentCollection = this.collections[collectionName]
    // let updatedCollection = lodash.unionWith(
    //   currentCollection,
    //   collectionData,
    //   lodash.isEqual
    // )
    // this.collections[collectionName] = updatedCollection
    //
    // return new Promise((resolve, reject) => {
    //   resolve(this.collections[collectionName])
    // })
  }

  // TO DO: API ajax functions
  // 1. query - call endpoint that returns collection of data
  // 2. queryRecord - call endpoint that returns single data
  // 3. findAll - get data from local store first before, if data not then direct call endpoint that returns collection of data
  // 4. findRecord - get data from local store first before, if data not found then direct call endpoint that returns single data
  // 5. peekAll - get data from local store that returns collection of data
  // 6. peekRecod - get data from local store that returns single data

  async query(queryResourceName, queryParams = {}, queryConfig = {}) {
    const queryResourceRequest = await axios.get(queryResourceName, {
      params: queryParams,
    })
    const queryResourceResults = queryResourceRequest?.data?.data || []

    this._pushPayloadToCollection(queryResourceName, queryResourceResults).then(
      (updatedCollection) => {
        if (queryConfig.alias)
          this.addAlias(
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
    const queryReocrdResourceResults =
      queryRecordResourceRequest?.data?.data || {}

    this._pushPayloadToCollection(
      queryRecordResourceName,
      queryRecordResourceRequest
    )
  }
}
