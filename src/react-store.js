import axios from 'axios'

export default class ReactStore {
  constructor() {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.initializeAxiosConfig()
  }

  initializeAxiosConfig() {
    axios.defaults.baseURL = this.getBaseURL()
    axios.defaults.headers.common['Authorization'] = this.getAuthorizationToken()
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

  query(resource, params = {}) {
    return axios.get(resource, {
      params: params
    })
  }
 }
