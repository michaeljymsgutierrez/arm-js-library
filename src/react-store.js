import axios from 'axios'
import { makeObservable, makeAutoObservable, observable, computed, action, flow } from 'mobx'

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
    resourceKeys.forEach(resourceKey => {
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

  async query(resource, params = {}) {
    const request = await axios.get(resource, {
      params: params,
    })
    const results = request?.data?.data || []
    this[resource] = results
  }
}
