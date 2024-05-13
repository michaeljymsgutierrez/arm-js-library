import axios from 'axios'
import { makeObservable, observable, computed, action, flow } from 'mobx'

export default class ReactStore {
  constructor() {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.initializeAxiosConfig()
    this.value = []

    makeObservable(this, {
      value: observable,
      updateValue: action,
      updatedValue: computed,
    })
  }

  initializeAxiosConfig() {
    axios.defaults.baseURL = this.getBaseURL()
    axios.defaults.headers.common['Authorization'] =
      this.getAuthorizationToken()
    axios.defaults.headers.common['Content-Type'] = 'application/vnd.api+json'
    axios.defaults.headers.common['X-Client-Platform'] = 'Web'
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

  async query(resource, params = {}) {
    const queryResults = await axios.get(resource, {
      params: params,
    })
    this.value = queryResults?.data?.data || []
  }

  get updatedValue() {
    return this.value
  }

  updateValue() {
    this.value = []
  }
}
