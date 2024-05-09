import axios from 'axios'

export default class ReactStore {
  constructor() {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.initializeAxiosConfig()
  }

  initializeAxiosConfig() {
    axios.defaults.baseURL = this.getBaseURL()
    axios.defaults.headers.common['Authorization'] = ''
    axios.defaults.headers.common['Accept'] = 'application/vnd.api+json'
    axios.defaults.headers.common['X-Client-Platform'] = 'Web'
  }

  setHost(host) {
    this.host = host
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

  query(resource, params = {}) {
    console.log(resource, params);
  }
}
