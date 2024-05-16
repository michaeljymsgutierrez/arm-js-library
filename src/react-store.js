import axios from 'axios'
import * as lodash from 'lodash'
import {
  makeObservable,
  extendObservable,
  makeAutoObservable,
  observable,
  override,
  computed,
  action,
  flow,
} from 'mobx'

export default class ReactStore {
  constructor(resourceKeys) {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.initializeResourceKeys(resourceKeys)
    this.initializeAxiosConfig()
    makeAutoObservable(this)
  }

  initializeAxiosConfig() {
    axios.defaults.baseURL = this.getBaseURL()
    axios.defaults.headers.common['Authorization'] =
      this.getAuthorizationToken()
    axios.defaults.headers.common['Content-Type'] = 'application/vnd.api+json'
    axios.defaults.headers.common['X-Client-Platform'] = 'Web'
  }

  initializeResourceKeys(resourceKeys) {
    resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = []
    })
  }

  setHost(host) {
    this.host = host
    this.initializeAxiosConfig()
  }

  setNamespace(namespace) {
    this.namespace = namespace
  }

  setHeadersCommon(key, value) {
    axios.defaults.headers.common[`${key}`] = value
  }

  getBaseURL() {
    return `${this.host}/${this.namespace}`
  }

  getAuthorizationToken() {
    return `Token ${window.localStorage.getItem('token')}`
  }

  addResourceKey(resourceName, resourceData = []) {
    this[resourceName] = resourceData
  }

  pushPayload(resourceName, resourceData) {
    let currentResourceCollection = this[resourceName]
    let updatedResourceCollection = lodash.sortBy(
      lodash.unionWith(currentResourceCollection, resourceData, lodash.isEqual),
      ['id']
    )
    this[resourceName] = updatedResourceCollection
  }

  alias(aliasName) {
    const _this = this
    return {
      query: function (resource, params) {
        _this.query(...arguments, aliasName)
      },
    }
  }

  async query(resource, params = {}, alias = null) {
    const request = await axios.get(resource, {
      params: params,
    })
    const results = request?.data?.data || []

    this.pushPayload(resource, results)
    if (alias) this[alias] = results
  }
}
