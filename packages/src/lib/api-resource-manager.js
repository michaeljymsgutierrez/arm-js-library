/*
 * ARM JavaScript Library v1.2.8
 *
 * Date: 2024-05-09 2:19PM GMT+8
 */

import axios from 'axios'
import _ from 'lodash'
import * as mobx from 'mobx'
import { v1 as uuidv1, NIL as NIL_UUID } from 'uuid'
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
  isString,
  isNull,
  isNil,
  isEmpty,
  isEqual,
  gte,
  gt,
  lte,
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
  'getCollection',
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
  'getCollection',
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
    this.host = typeof window !== 'undefined' ? window.location.origin : ''
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
      _pushPayload: action,
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

  _isCollectionExisting(collectionName) {
    if (isNil(getProperty(this.collections, collectionName)))
      throw `Collection ${collectionName} does not exist.\nFix: Try adding ${collectionName} on your ARM config initialization.`
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

  _unloadFromCollection(collectionRecord) {
    const collectionName = getProperty(collectionRecord, 'collectionName')
    const collectionRecordIndex = findIndex(this.collections[collectionName], {
      hashId: getProperty(collectionRecord, 'hashId'),
    })

    if (gte(collectionRecordIndex, 0))
      this.collections[collectionName].splice(collectionRecordIndex, 1)
  }

  _unloadFromRequestHashes(collectionRecord) {
    const requestHashIdsKeys = keysIn(this.requestHashIds)

    forEach(requestHashIdsKeys, (requestHashIdKey) => {
      const requestHashIdData = getProperty(
        this.requestHashIds[requestHashIdKey],
        'data'
      )
      const isRequestHashIdDataArray = isArray(requestHashIdData)
      const isRequestHashIdDataObject = isPlainObject(requestHashIdData)

      if (isRequestHashIdDataArray) {
        const requestHashIdRecordIndex = findIndex(
          getProperty(this.requestHashIds[requestHashIdKey], 'data'),
          {
            hashId: getProperty(collectionRecord, 'hashId'),
          }
        )
        if (gte(requestHashIdRecordIndex, 0))
          this.requestHashIds[requestHashIdKey]['data'].splice(
            requestHashIdRecordIndex,
            1
          )
      }

      if (isRequestHashIdDataObject) {
        if (
          isEqual(
            getProperty(collectionRecord, 'hashId'),
            getProperty(this.requestHashIds[requestHashIdKey], 'data.hashId')
          )
        )
          setProperty(this.requestHashIds[requestHashIdKey], 'data', {})
      }
    })
  }

  _unloadFromAliases(collectionRecord) {
    const aliasesKeys = keysIn(this.aliases)

    forEach(aliasesKeys, (aliasKey) => {
      const isAliasRecordsArray = isArray(this.aliases[aliasKey])
      const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

      if (isAliasRecordsArray) {
        const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
          hashId: getProperty(collectionRecord, 'hashId'),
        })

        if (gte(aliasRecordIndex, 0))
          this.aliases[aliasKey].splice(aliasRecordIndex, 1)
      }

      if (isAliasRecordsObject) {
        if (
          isEqual(
            getProperty(collectionRecord, 'hashId'),
            getProperty(this.aliases[aliasKey], 'hashId')
          )
        )
          this.aliases[aliasKey] = {}
      }
    })
  }

  unloadRecord(currentRecord) {
    this._unloadFromCollection(currentRecord)
    this._unloadFromRequestHashes(currentRecord)
    this._unloadFromAliases(currentRecord)
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
    const collectionName = getProperty(currentRecord, 'collectionName')
    const collectionRecord = find(this.collections[collectionName], {
      hashId: getProperty(currentRecord, 'hashId'),
    })
    const id = getProperty(currentRecord, 'id')
    const resource = getProperty(collectionRecord, 'collectionName')
    const method = 'delete'

    const requestObject = {
      resourceMethod: method,
      resourceName: resource,
      resourceId: Number(id),
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
      resourceId: Number(id),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: uuidv1() },
    }

    return this._request(requestObject)
  }

  _getCollectionRecord(collectionName, collectionConfig = {}, currentRecord) {
    const collectionReferenceKey =
      getProperty(collectionConfig, 'referenceKey') || ''
    const collectionAsync = getProperty(collectionConfig, 'async') || false
    const recordsFromCurrentRecord =
      getProperty(currentRecord, collectionReferenceKey) || []
    const isRecordsFromCurrentRecordObject = isPlainObject(
      recordsFromCurrentRecord
    )
    const relatedRecords = isRecordsFromCurrentRecordObject
      ? [recordsFromCurrentRecord]
      : recordsFromCurrentRecord
    const collectionRecords = observable([])

    forEach(relatedRecords, (relatedRecord) => {
      const relatedRecordHashId = this._generateHashId({
        id: getProperty(relatedRecord, 'id'),
        collectionName: collectionName,
      })

      const collectionRecord = find(this.collections[collectionName], {
        hashId: relatedRecordHashId,
      })

      if (!isEmpty(collectionRecord)) {
        collectionRecords.push(collectionRecord)
      } else {
        if (collectionAsync) {
          const requestObject = {
            resourceMethod: 'get',
            resourceName: collectionName,
            resourceId: getProperty(relatedRecord, 'id'),
            resourceParams: {},
            resourcePayload: null,
            resourceFallback: {},
            resourceConfig: {},
          }
          const responseObject = defaultRequestObjectResponse

          this._pushRequestHash(requestObject, responseObject)

          this._request(requestObject)
        }
      }
    })

    return collectionRecords
  }

  _injectActions(collectionRecord) {
    const actions = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(collectionRecord),
      destroyRecord: () => this._deleteRecord(collectionRecord),
      reload: () => this._reloadRecord(collectionRecord),
      getCollection: (collectionName, collectionConfig) =>
        this._getCollectionRecord(
          collectionName,
          collectionConfig,
          collectionRecord
        ),
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

  _pushToCollection(collectionName, collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)

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

      return map(collectionRecordsHashIds, (collectionRecordHashId) =>
        find(this.collections[collectionName], {
          hashId: collectionRecordHashId,
        })
      )
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

      return find(this.collections[collectionName], {
        hashId: collectionRecordHashId,
      })
    }
  }

  _pushToAliases(collectionRecords) {
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
    const aliasesKeys = keysIn(this.aliases)

    if (isCollectionRecordsArray) {
      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach(collectionRecords, (collectionRecord) => {
            const aliasRecordIndex = findIndex(this.aliases[aliasKey], {
              hashId: getProperty(collectionRecord, 'hashId'),
            })
            if (gte(aliasRecordIndex, 0))
              this.aliases[aliasKey][aliasRecordIndex] = collectionRecord
          })
        }

        if (isAliasRecordsObject) {
          forEach(collectionRecords, (collectionRecord) => {
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
      forEach(aliasesKeys, (aliasKey) => {
        const isAliasRecordsArray = isArray(this.aliases[aliasKey])
        const isAliasRecordsObject = isPlainObject(this.aliases[aliasKey])

        if (isAliasRecordsArray) {
          forEach([collectionRecords], (collectionRecord) => {
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
              getProperty(collectionRecords, 'hashId'),
              getProperty(this.aliases[aliasKey], 'hashId')
            )
          )
            this.aliases[aliasKey] = collectionRecords
        }
      })
    }
  }

  _pushToRequestHashes(collectionRecords) {
    const requestHashIdsKeys = keysIn(this.requestHashIds)
    const isCollectionRecordsArray = isArray(collectionRecords)
    const isCollectionRecordsObject = isPlainObject(collectionRecords)
    let newCollectionRecords = null

    if (isCollectionRecordsArray) newCollectionRecords = collectionRecords
    if (isCollectionRecordsObject) newCollectionRecords = [collectionRecords]

    forEach(requestHashIdsKeys, (requestHashIdKey) => {
      const requestHashIdData = getProperty(
        this.requestHashIds[requestHashIdKey],
        'data'
      )
      const isRequestHashIdDataArray = isArray(requestHashIdData)
      const isRequestHashIdDataObject = isPlainObject(requestHashIdData)

      forEach(newCollectionRecords, (collectionRecord) => {
        if (isRequestHashIdDataArray) {
          const requestHashIdRecordIndex = findIndex(
            getProperty(this.requestHashIds[requestHashIdKey], 'data'),
            {
              hashId: getProperty(collectionRecord, 'hashId'),
            }
          )
          if (gte(requestHashIdRecordIndex, 0))
            this.requestHashIds[requestHashIdKey]['data'][
              requestHashIdRecordIndex
            ] = collectionRecord
        }

        if (isRequestHashIdDataObject) {
          if (
            isEqual(
              getProperty(collectionRecord, 'hashId'),
              getProperty(this.requestHashIds[requestHashIdKey], 'data.hashId')
            )
          )
            setProperty(
              this.requestHashIds[requestHashIdKey],
              'data',
              collectionRecord
            )
        }
      })
    })
  }

  _pushPayload(collectionName, collectionRecords) {
    this._isCollectionExisting(collectionName)

    const updatedCollectionRecords = this._pushToCollection(
      collectionName,
      collectionRecords
    )

    this._pushToAliases(updatedCollectionRecords)
    this._pushToRequestHashes(updatedCollectionRecords)

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
    if (typeof window !== 'undefined') window.ARM = Object.freeze(this)
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

  createRecord(
    collectionName,
    collectionRecord = {},
    collectionRecordRandomId = true
  ) {
    const collectionRecordId = collectionRecordRandomId ? uuidv1() : NIL_UUID
    const isCollectionRecordNotExisting = isNil(
      find(this.collections[collectionName], {
        id: collectionRecordId,
      })
    )

    setProperty(collectionRecord, 'id', collectionRecordId)

    this._injectReferenceKeys(collectionName, collectionRecord)
    this._injectActions(collectionRecord)

    if (isCollectionRecordNotExisting)
      this.collections[collectionName].push(collectionRecord)

    return find(this.collections[collectionName], {
      id: collectionRecordId,
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
    const isResourceMethodGet = isEqual(resourceMethod, 'get')
    const isResourceMethodDelete = isEqual(resourceMethod, 'delete')
    // const isResourceMethodPut = isEqual(resourceMethod, 'put')
    const isResourceMethodPost = isEqual(resourceMethod, 'post')
    const isResourceIdValid = isNumber(resourceId) || isString(resourceId)
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

    const hasSkipRequest = !isNil(getProperty(resourceConfig, 'skip'))
    const skipRequest = isEqual(getProperty(resourceConfig, 'skip'), true)
    const requestHashObject = this.requestHashIds[requestHashId]
    const isRequestHashIdExisting = !isNil(requestHashObject)
    const isRequestNew = getProperty(requestHashObject, 'isNew')

    if (isResourceMethodGet) {
      if (hasSkipRequest && skipRequest) return
      if (!hasSkipRequest && isRequestHashIdExisting && !isRequestNew) return
      if (
        hasSkipRequest &&
        !skipRequest &&
        isRequestHashIdExisting &&
        !isRequestNew
      )
        return
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
        this._pushPayload(
          getProperty(resourceIncludedResult, 'collectionName'),
          resourceIncludedResult
        )
      })

      updatedCollectionRecords = await this._pushPayload(
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

  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(objects, properties = {}) {
    return find(objects, properties)
  }

  findIndexBy(objects, properties = {}) {
    return findIndex(objects, properties)
  }

  isEmpty(value) {
    return isEmpty(value)
  }

  isPresent(value) {
    return !isEmpty(value)
  }

  isEqual(value, other) {
    return isEqual(value, other)
  }

  isNumber(value) {
    return isNumber(value)
  }

  isNil(value) {
    return isNil(value)
  }

  isNull(value) {
    return isNull(value)
  }

  isGte(value, other) {
    return gte(value, other)
  }

  isGt(value, other) {
    return gt(value, other)
  }

  isLte(value, other) {
    return lte(value, other)
  }

  isLt(value, other) {
    return lt(value, other)
  }
}

/*
 * Notes:
 *  1. Implement ajax exposed ajax function.
 *  2. Prevent accessing internal functions from ARM instance.
 *  3. Prevent accessing records property using dot annotations.
 *  4. REST API support will be included on future release.
 */
