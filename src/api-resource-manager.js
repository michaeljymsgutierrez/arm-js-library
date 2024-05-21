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
    let currentCollection = this.collections[collectionName]
    let updatedCollection = lodash.sortBy(
      lodash.unionWith(currentCollection, collectionData, lodash.isEqual),
      ['id']
    )
    this.collections[collectionName] = updatedCollection

    return new Promise((resolve, reject) => {
      resolve(this.collections[collectionName])
    })
  }

  async query(resourceName, params = {}, config = {}) {
    const resourceRequest = await axios.get(resourceName, {
      params: params,
    })
    const resourceResults = resourceRequest?.data?.data || []

    this._pushPayloadToCollection(resourceName, resourceResults).then(
      (updatedCollection) => {
        if (config.alias)
          this.addAlias(config.alias, resourceResults, updatedCollection)
      }
    )
  }
}
