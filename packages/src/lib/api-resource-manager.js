/*
 * ARM JavaScript Library v1.0.5
 *
 * Date: 2024-05-09 2:19PM GMT+8
 */

import axios from 'axios'
import _ from 'lodash'
import * as mobx from 'mobx'
import { v1 as uuidv1 } from 'uuid'
import CryptoJS from 'crypto-js'

const { makeObservable, observable, action, toJS } = mobx

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
  isNil,
  isEmpty,
  isEqual,
  gte,
  lt,
  flatMap,
  map,
  entries,
  forEach,
  keysIn,
  omit,
} = _

const defaultRequestArrayResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  included: [],
  meta: {},
}

const defaultRequestObjectResponse = {
  isLoading: true,
  isError: false,
  isNew: true,
  data: {},
  included: [],
  meta: {},
}

const keysToBeOmittedOnDeepCheck = [
  'destroyRecord',
  'reload',
  'save',
  'set',
  'get',
  'setProperties',
  'isDirty',
  'isError',
  'isLoading',
  'isPristine',
]

const keysToBeOmittedOnRequestPayload = [
  'destroyRecord',
  'reload',
  'save',
  'set',
  'get',
  'setProperties',
  'isDirty',
  'isError',
  'isLoading',
  'isPristine',
  'hashId',
  'collectionName',
]

export default class ApiResourceManager {
  constructor(collections = []) {
    this.namespace = 'api/v1'
    this.host = window.location.origin
    this.collections = {}
    this.aliases = {}
    this.requestHashIds = {}
    this.payloadIncludedReference = 'type'

    this._initializeCollections(collections)
    this._initializeAxiosConfig()

    makeObservable(this, {
      collections: observable,
      aliases: observable,
      requestHashIds: observable,
      _pushPayloadToCollection: action,
      _pushRequestHash: action,
      _addCollection: action,
      _addAlias: action,
    })
  }

  _initializeAxiosConfig() {
    axios.defaults.baseURL = this._getBaseURL()
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

  _addCollection(collectionName, collectionRecords) {
    this.collections[collectionName] = collectionRecords
  }

  _addAlias(aliasName, aliasRecords) {
    const isAliasRecordsArray = isArray(aliasRecords)
    const isAliasRecordsObject = isPlainObject(aliasRecords)

    if (isAliasRecordsArray) this.aliases[aliasName] = aliasRecords || []

    if (isAliasRecordsObject) this.aliases[aliasName] = aliasRecords || {}
  }

  _generateHashId(object = { id: uuidv1() }) {
    const stringifyObject = JSON.stringify(object)
    return CryptoJS.MD5(stringifyObject).toString()
  }

  _getProperty(key) {
    return getProperty(this, key)
  }

  _setProperty(key, value) {
    setProperty(this, key, value)

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)

    if (isEqual(originalRecord, currentRecord)) {
      setProperty(this, 'isDirty', false)
      setProperty(this, 'isPristine', true)
    } else {
      setProperty(this, 'isDirty', true)
      setProperty(this, 'isPristine', false)
    }
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

    const originalRecord = omit(
      toJS(this.originalRecord),
      keysToBeOmittedOnDeepCheck
    )
    const currentRecord = omit(toJS(this), keysToBeOmittedOnDeepCheck)

    if (isEqual(originalRecord, currentRecord)) {
      setProperty(this, 'isDirty', false)
      setProperty(this, 'isPristine', true)
    } else {
      setProperty(this, 'isDirty', true)
      setProperty(this, 'isPristine', false)
    }
  }

  unloadRecord(currentRecord) {
    const aliasesKeys = keysIn(this.aliases)
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecordIndex = findIndex(this.collections[collectionName], {
      hashId: getProperty(currentRecord, 'hashId'),
    })

    if (gte(collectionRecordIndex, 0))
      this.collections[collectionName].splice(collectionRecordIndex, 1)

    forEach(aliasesKeys, (aliasKey) => {
      const isAliasRecordsArray = isArray(this.aliases[aliasKey])
      const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

      if (isAliasRecordsArray) {
        const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
          hashId: getProperty(currentRecord, 'hashId'),
        })

        if (gte(aliasRecordIndex, 0))
          this.aliases[aliasKey].splice(aliasRecordIndex, 1)
      }

      if (isAliasRecordsObject) {
        if (
          isEqual(
            getProperty(currentRecord, 'hashId'),
            getProperty(this.aliases[aliasKey], 'hashId')
          )
        )
          this.aliases[aliasKey] = {}
      }
    })
  }

  _saveRecord(currentRecord) {
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecord = find(this.collections[collectionName], {
      hashId: getProperty(currentRecord, 'hashId'),
    })
    const isValidId = isNumber(getProperty(collectionRecord, 'id'))
    const id = isValidId ? getProperty(collectionRecord, 'id') : null
    const resource = collectionName
    const method = isValidId ? 'put' : 'post'
    const payload = { data: collectionRecord }

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: id,
      resourceParams: {},
      resourcePayload: payload,
      resourceFallback: {},
      resourceConfig: {},
    }

    return this._request(requestObject)
  }

  async _deleteRecord(currentRecord) {
    const collectionRecord = find(
      this.collections[currentRecord.collectionName],
      {
        hashId: getProperty(currentRecord, 'hashId'),
      }
    )
    const id = getProperty(currentRecord, 'id')
    const resource = getProperty(collectionRecord, 'collectionName')
    const method = 'delete'

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: id,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {},
    }

    return this._request(requestObject)
  }

  async _reloadRecord(currentRecord) {
    const id = getProperty(currentRecord, 'id')
    const resource = getProperty(currentRecord, 'collectionName')
    const method = 'get'

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: id,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: true },
    }

    return this._request(requestObject)
  }

  _injectActions(collectionRecord) {
    const actions = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(collectionRecord),
      destroyRecord: () => this._deleteRecord(collectionRecord),
      reload: () => this._reloadRecord(collectionRecord),
    }
    const actionKeys = keysIn(actions)

    forEach(actionKeys, (actionKey) => {
      collectionRecord[actionKey] = actions[actionKey]
    })
  }

  _injectReferenceKeys(
    collectionName,
    collectionRecord,
    collectionRecordHashId = null
  ) {
    const recordHashId = isNull(collectionRecordHashId)
      ? this._generateHashId({
          id: getProperty(collectionRecord, 'id'),
          collectionName: collectionName,
        })
      : collectionRecordHashId

    setProperty(collectionRecord, 'collectionName', collectionName)
    setProperty(collectionRecord, 'hashId', recordHashId)
    setProperty(collectionRecord, 'isLoading', false)
    setProperty(collectionRecord, 'isError', false)
    setProperty(collectionRecord, 'isPristine', true)
    setProperty(collectionRecord, 'isDirty', false)
  }

  _pushPayloadToCollection(collectionName, collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
    const aliasesKeys = keysIn(this.aliases)
    const requestHashIdsKeys = keysIn(this.requestHashIds)
    let updatedCollectionRecords = null

    if (isCollectionRecordsArray) {
      const collectionRecordsHashIds = map(collectionRecords, 'hashId')

      forEach(collectionRecords, (collectionRecord) => {
        const collectionRecordIndex = findIndex(
          this.collections[collectionName],
          {
            hashId: getProperty(collectionRecord, 'hashId'),
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

      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach(updatedCollectionRecords, (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: getProperty(collectionRecord, 'hashId'),
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          forEach(updatedCollectionRecords, (collectionRecord) => {
            if (
              isEqual(
                getProperty(collectionRecord, 'hashId'),
                getProperty(this.aliases[aliasKey], 'hashId')
              )
            )
              this.aliases[aliasKey] = collectionRecord
          })
        }
      })
    }

    if (isCollectionRecordsObject) {
      const collectionRecordHashId = collectionRecords.hashId
      const collectionRecordIndex = findIndex(
        this.collections[collectionName],
        {
          hashId: getProperty(collectionRecords, 'hashId'),
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

      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach([updatedCollectionRecords], (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: getProperty(collectionRecord, 'hashId'),
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          if (
            isEqual(
              getProperty(updatedCollectionRecords, 'hashId'),
              getProperty(this.aliases[aliasKey], 'hashId')
            )
          )
            this.aliases[aliasKey] = updatedCollectionRecords
        }
      })

      forEach(requestHashIdsKeys, (requestHashIdKey) => {
        const requestHashIdData = getProperty(
          this.requestHashIds[requestHashIdKey],
          'data'
        )
        const isRequestHashIdDataArray = isArray(requestHashIdData)
        const isRequestHashIdDataObject = isPlainObject(requestHashIdData)

        if (isRequestHashIdDataArray) {
          forEach([updatedCollectionRecords], (collectionRecord) => {
            const requestHashIdRecordIndex = findIndex(
              getProperty(this.requestHashIds[requestHashIdKey], 'data'),
              {
                hashId: getProperty(collectionRecord, 'hashId'),
              }
            )
            if (gte(requestHashIdRecordIndex, 0))
              this.requestHashIds[requestHashIdKey][requestHashIdRecordIndex] =
                collectionRecord
          })
        }

        if (isRequestHashIdDataObject) {
          if (
            isEqual(
              getProperty(updatedCollectionRecords, 'hashId'),
              getProperty(this.requestHashIds[requestHashIdKey], 'data.hashId')
            )
          )
            setProperty(
              this.requestHashIds[requestHashIdKey],
              'data',
              updatedCollectionRecords
            )
        }
      })
    }

    return updatedCollectionRecords
  }

  _pushRequestHash(
    requestObject = {},
    responseObject = {
      isLoading: true,
      isError: false,
      isNew: true,
      data: null,
    }
  ) {
    const requestHashId = this._generateHashId(requestObject)
    const isRequestHashExisting = !isNil(this.requestHashIds[requestHashId])
    const isResponseNew = getProperty(responseObject, 'isNew')

    if (isRequestHashExisting && isResponseNew) {
      setProperty(this.requestHashIds[requestHashId], 'isNew', false)
    } else {
      this.requestHashIds[requestHashId] = responseObject
    }

    return this.requestHashIds[requestHashId]
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

  setPayloadIncludeReference(key) {
    this.payloadIncludedReference = key
  }

  setGlobal() {
    if (window) window.ARM = Object.freeze(this)
  }

  getCollection(collectionName) {
    return this.collections[collectionName] || []
  }

  clearCollection(collectionName) {
    this.collections[collectionName] = []
  }

  getAlias(aliasName, fallbackRecords) {
    const isFallbacRecordsObject = isPlainObject(fallbackRecords)

    if (isFallbacRecordsObject) this._injectActions(fallbackRecords)

    return this.aliases[aliasName] || fallbackRecords
  }

  createRecord(collectionName, collectionRecord = {}) {
    setProperty(collectionRecord, 'id', uuidv1())

    this._injectReferenceKeys(collectionName, collectionRecord)
    this._injectActions(collectionRecord)
    this.collections[collectionName].push(collectionRecord)

    return find(this.collections[collectionName], {
      hashId: getProperty(collectionRecord, 'hashId'),
    })
  }

  async _request({
    resourceMethod,
    resourceName,
    resourceId,
    resourceParams,
    resourcePayload,
    resourceFallback,
    resourceConfig,
  }) {
    const requestOptions = {
      method: resourceMethod,
      url: resourceName,
    }
    const requestHashId = this._generateHashId({ ...arguments[0] })
    const requestSkip = getProperty(resourceConfig, 'skip') || false
    const isResourceMethodGet = isEqual(resourceMethod, 'get')
    const isResourceMethodDelete = isEqual(resourceMethod, 'delete')
    // const isResourceMethodPut = isEqual(resourceMethod, 'put')
    const isResourceMethodPost = isEqual(resourceMethod, 'post')
    const isResourceIdValid = isNumber(resourceId)
    const hasResourceParams = !isEmpty(resourceParams)
    const hasResourcePayload = !isEmpty(resourcePayload)
    const resourcePayloadRecord = getProperty(resourcePayload, 'data') || null

    if (isResourceIdValid)
      setProperty(requestOptions, 'url', `${resourceName}/${resourceId}`)
    if (hasResourceParams) setProperty(requestOptions, 'params', resourceParams)
    if (hasResourcePayload) {
      const payload = {
        data: omit(resourcePayloadRecord, keysToBeOmittedOnRequestPayload),
      }
      setProperty(requestOptions, 'data', payload)
    }

    if (isResourceMethodGet && !requestSkip) {
      const requestHashObject = this.requestHashIds[requestHashId]
      const isRequestHashIdExisting = !isNil(requestHashObject)
      const isRequestNew = getProperty(requestHashObject, 'isNew')
      if (isRequestHashIdExisting && !isRequestNew) return
    }

    if (hasResourcePayload)
      setProperty(resourcePayloadRecord, 'isLoading', true)

    try {
      const resourceRequest = await axios(requestOptions)
      const resourceResults = resourceRequest?.data?.data || resourceFallback
      const resourceIncludedResults = resourceRequest?.data?.included || []
      const resourceMetaResults = resourceRequest?.data?.meta || {}
      const isResourceResultsObject = isPlainObject(resourceResults)
      const isResourceResultsArray = isArray(resourceResults)
      let updatedCollectionRecords = null

      if (isResourceResultsArray)
        forEach(resourceResults, (resourceResult) =>
          this._injectReferenceKeys(resourceName, resourceResult)
        )

      if (isResourceResultsObject)
        this._injectReferenceKeys(resourceName, resourceResults)

      forEach(resourceIncludedResults, (resourceIncludedResult) => {
        this._injectReferenceKeys(
          getProperty(resourceIncludedResult, this.payloadIncludedReference),
          resourceIncludedResult
        )
        this._pushPayloadToCollection(
          getProperty(resourceIncludedResult, 'collectionName'),
          resourceIncludedResult
        )
      })

      updatedCollectionRecords = await this._pushPayloadToCollection(
        resourceName,
        resourceResults
      )

      if (resourceConfig.alias)
        this._addAlias(
          getProperty(resourceConfig, 'alias'),
          updatedCollectionRecords
        )

      if (isResourceMethodPost) this.unloadRecord(resourcePayloadRecord)
      if (isResourceMethodDelete) this.unloadRecord(updatedCollectionRecords)

      this.requestHashIds[requestHashId] = {
        isLoading: false,
        isError: false,
        isNew: false,
        data: updatedCollectionRecords,
        included: [],
        meta: resourceMetaResults,
      }

      return Promise.resolve(updatedCollectionRecords)
    } catch (error) {
      if (hasResourcePayload) {
        setProperty(resourcePayloadRecord, 'isError', true)
        setProperty(resourcePayloadRecord, 'isLoading', false)
      }

      this.requestHashIds[requestHashId] = {
        isLoading: false,
        isError: true,
        isNew: false,
        data: error,
        included: [],
        meta: {},
      }

      return Promise.reject(error)
    }
  }

  query(resource, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: null,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: config,
    }
    const responseObject = defaultRequestArrayResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )

    this._request(requestObject)

    return requestHashObject
  }

  queryRecord(resource, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: null,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: config,
    }
    const responseObject = defaultRequestObjectResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )
    this._request(requestObject)

    return requestHashObject
  }

  findAll(resource, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: null,
      resourceParams: null,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: config,
    }
    const responseObject = defaultRequestArrayResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )
    this._request(requestObject)

    return requestHashObject
  }

  findRecord(resource, id, params = {}, config = {}) {
    const requestObject = {
      resourceMethod: 'get',
      resourceName: resource,
      resourceId: id,
      resourceParams: params,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: config,
    }
    const responseObject = defaultRequestObjectResponse
    const requestHashObject = this._pushRequestHash(
      requestObject,
      responseObject
    )
    this._request(requestObject)

    return requestHashObject
  }

  peekAll(collectionName) {
    return this.collections[collectionName]
  }

  peekRecord(collectionName, collectionRecordId) {
    return find(this.collections[collectionName], {
      id: collectionRecordId,
    })
  }
}
