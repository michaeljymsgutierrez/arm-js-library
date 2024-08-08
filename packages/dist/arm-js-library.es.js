import A from "axios";
import cs from "lodash";
import * as hs from "mobx";
import { v1 as J, NIL as ds } from "uuid";
import ls from "crypto-js";
/**
 * ARM JavaScript Library
 *
 * Version: 1.5.1
 * Date: 2024-05-09 2:19PM GMT+8
 *
 * @author Michael Jyms Gutierrez
 * @license MIT
 *
 * Axios library for making HTTP requests.
 * @see https://axios-http.com/docs/
 *
 * Lodash utility library.
 * @see https://lodash.com/docs/4.17.21
 *
 * MobX state management library.
 * @see https://mobx.js.org/
 *
 * UUID generation library.
 * @see https://www.npmjs.com/package/uuid
 *
 * CryptoJS library for cryptographic functions.
 * @see https://crypto-js.org/
 */
const { makeObservable: us, observable: L, action: E, toJS: F } = hs, {
  get: i,
  set: n,
  find: m,
  findIndex: q,
  isObject: fs,
  isArray: _,
  isPlainObject: I,
  isNumber: V,
  isString: Is,
  isNull: rs,
  isNil: y,
  isEmpty: w,
  isEqual: f,
  gte: g,
  gt: ps,
  lte: _s,
  lt: W,
  assign: ys,
  flatMap: ms,
  map: v,
  entries: qs,
  forEach: u,
  filter: os,
  keysIn: x,
  concat: gs,
  chunk: Rs,
  uniqWith: bs,
  omit: B,
  first: Q,
  last: as,
  orderBy: Hs,
  uniqBy: js,
  groupBy: Cs
} = cs, ns = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, X = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, D = [
  "destroyRecord",
  "getCollection",
  "reload",
  "save",
  "set",
  "get",
  "setProperties",
  "isDirty",
  "isError",
  "isLoading",
  "isPristine"
], Os = [
  "destroyRecord",
  "getCollection",
  "reload",
  "save",
  "set",
  "get",
  "setProperties",
  "isDirty",
  "isError",
  "isLoading",
  "isPristine",
  "hashId",
  "collectionName"
];
class Ns {
  /**
   * Creates a new instance of the class.
   *
   * @param {Object[]} collections - An optional array of collections to initialize. Defaults to an empty array.
   */
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), us(this, {
      collections: L,
      aliases: L,
      requestHashIds: L,
      _pushPayload: E,
      _pushRequestHash: E,
      _addCollection: E,
      _addAlias: E
    });
  }
  /**
   * Initializes the Axios configuration with the base URL.
   *
   * @private
   */
  _initializeAxiosConfig() {
    A.defaults.baseURL = this._getBaseURL();
  }
  /**
   * Initializes a collection of collections with optional default values.
   *
   * @private
   * @param {string[]} collections - An array of collection names to initialize.
   */
  _initializeCollections(s) {
    u(s, (e) => this._addCollection(e, []));
  }
  /**
   * Gets the base URL for API requests.
   *
   * @private
   * @returns {string} The base URL constructed from `host` and `namespace` properties.
   */
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  /**
   * Checks if a collection exists in the current instance.
   *
   * @private
   * @param {string} collectionName - The name of the collection to check.
   * @throws {Error} If the collection does not exist.
   */
  _isCollectionExisting(s) {
    if (y(i(this.collections, s)))
      throw `Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`;
  }
  /**
   * Adds a collection to the current instance.
   *
   * @private
   * @param {string} collectionName - The name of the collection to add.
   * @param {Array} collectionRecords - The records for the collection.
   */
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  /**
   * Adds an alias to the aliases object.
   *
   * @private
   * @param {string} aliasName - The name of the alias.
   * @param {Array|Object} aliasRecords - The records for the alias. Can be an array or an object.
   */
  _addAlias(s, e) {
    const t = _(e), o = I(e);
    t && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  /**
   * Generates a hash ID based on the provided object.
   *
   * @private
   * @param {Object} object - The object to generate the hash ID from. Defaults to an object with an `id` property generated using `uuidv1()`.
   * @returns {string} The generated hash ID.
   */
  _generateHashId(s = { id: J() }) {
    const e = JSON.stringify(s);
    return ls.MD5(e).toString();
  }
  /**
   * Gets a property from the current object.
   *
   * @private
   * @param {string} key - The key of the property to retrieve.
   * @returns {*} The value of the property, or undefined if not found.
   */
  _getProperty(s) {
    return i(this, s);
  }
  /**
   * Sets a property on the current object and updates `isDirty` and `isPristine` flags accordingly.
   *
   * @private
   * @param {string} key - The key of the property to set.
   * @param {*} value - The value to assign to the property.
   */
  _setProperty(s, e) {
    n(this, s, e);
    const t = B(
      F(this.originalRecord),
      D
    ), o = B(F(this), D);
    f(t, o) ? (n(this, "isDirty", !1), n(this, "isPristine", !0)) : (n(this, "isDirty", !0), n(this, "isPristine", !1));
  }
  /**
   * Sets multiple properties on the current object based on the provided object.
   * Recursively handles nested objects and updates `isDirty` and `isPristine` flags accordingly.
   *
   * @private
   * @param {Object} objectKeysValues - An object containing key-value pairs to be set.
   */
  _setProperties(s) {
    function e(a, c = "") {
      return ms(qs(a), ([h, l]) => {
        const p = c ? `${c}.${h}` : h;
        return fs(l) && !_(l) && l !== null ? e(l, p) : { key: p, value: l };
      });
    }
    const t = e(s);
    u(t, ({ key: a, value: c }) => n(this, a, c));
    const o = B(
      F(this.originalRecord),
      D
    ), r = B(F(this), D);
    f(o, r) ? (n(this, "isDirty", !1), n(this, "isPristine", !0)) : (n(this, "isDirty", !0), n(this, "isPristine", !1));
  }
  /**
   * Sorts an array of records based on specified properties and sort orders.
   *
   * @private
   * @param {Array} currentRecords - The array of records to sort.
   * @param {Array<string>} sortProperties - An array of sort properties in the format of 'property:order'.
   *  Valid orders are 'asc' (ascending) and 'desc' (descending).
   * @returns {Array} The sorted array of records.
   */
  _sortRecordsBy(s, e = []) {
    const t = v(
      e,
      (r) => Q(r.split(":"))
    ), o = v(
      e,
      (r) => as(r.split(":"))
    );
    return Hs(s, t, o);
  }
  /**
   * Removes a record from a specified collection based on its hash ID.
   *
   * @private
   * @param {Object} collectionRecord - The record to be removed from the collection.
   */
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = q(this.collections[e], {
      hashId: i(s, "hashId")
    });
    g(t, 0) && this.collections[e].splice(t, 1);
  }
  /**
   * Removes a record from all request hashes based on its hash ID.
   *
   * @private
   * @param {Object} collectionRecord - The record to be removed from request hashes.
   */
  _unloadFromRequestHashes(s) {
    const e = x(this.requestHashIds);
    u(e, (t) => {
      const o = i(
        this.requestHashIds[t],
        "data"
      ), r = _(o), a = I(o);
      if (r) {
        const c = q(
          i(this.requestHashIds[t], "data"),
          {
            hashId: i(s, "hashId")
          }
        );
        g(c, 0) && this.requestHashIds[t].data.splice(
          c,
          1
        );
      }
      a && f(
        i(s, "hashId"),
        i(this.requestHashIds[t], "data.hashId")
      ) && n(this.requestHashIds[t], "data", {});
    });
  }
  /**
   * Removes a record from all aliases based on its hash ID.
   *
   * @private
   * @param {Object} collectionRecord - The record to be removed from aliases.
   */
  _unloadFromAliases(s) {
    const e = x(this.aliases);
    u(e, (t) => {
      const o = _(this.aliases[t]), r = I(this.aliases[t]);
      if (o) {
        const a = q(this.aliases[t], {
          hashId: i(s, "hashId")
        });
        g(a, 0) && this.aliases[t].splice(a, 1);
      }
      r && f(
        i(s, "hashId"),
        i(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  /**
   * Unloads a record from the collection, request hashes, and aliases.
   *
   * @param {Object} currentRecord - The record to be unloaded.
   */
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  /**
   * Saves a record to the server.
   *
   * @private
   * @param {Object} currentRecord - The record to be saved.
   * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
   */
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = m(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = V(i(t, "id")), r = o ? i(t, "id") : null, l = {
      resourceMethod: o ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(l);
  }
  /**
   * Deletes a record from the server.
   *
   * @private
   * @async
   * @param {Object} currentRecord - The record to be deleted.
   * @param {Object} [collectionConfig] - Optional configuration for the deletion request.
   * @returns {Promise} A Promise that resolves when the deletion is successful or rejects with an error.
   */
  async _deleteRecord(s, e = {}) {
    const t = i(s, "collectionName"), o = m(this.collections[t], {
      hashId: i(s, "hashId")
    }), r = i(s, "id"), h = {
      resourceMethod: "delete",
      resourceName: i(o, "collectionName"),
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: e
    };
    return this._request(h);
  }
  /**
   * Reloads a record from the server.
   *
   * @private
   * @async
   * @param {Object} currentRecord - The record to be reloaded.
   * @returns {Promise} A Promise that resolves with the updated record or rejects with an error.
   */
  async _reloadRecord(s) {
    const e = i(s, "id"), r = {
      resourceMethod: "get",
      resourceName: i(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: J() }
    };
    return this._request(r);
  }
  /**
   * Retrieves records from a specified collection based on given criteria.
   *
   * @private
   * @param {string} collectionName - The name of the collection to retrieve records from.
   * @param {Object} collectionConfig - Optional configuration for the collection, including referenceKey, async, filterBy, and sortBy properties.
   * @param {Object|Array} currentRecord - The current record containing potential related records.
   * @returns {Object|Array} The retrieved records, either a single object or an array depending on the input.
   */
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(e, "async") || !1, a = i(e, "filterBy") || {}, c = i(e, "sortBy") || [], h = i(t, o) || [], l = I(
      h
    ), p = l ? [h] : h, R = L([]);
    return u(p, (N) => {
      const C = this._generateHashId({
        id: i(N, "id"),
        collectionName: s
      }), k = m(this.collections[s], {
        hashId: C
      });
      if (!w(k))
        R.push(k);
      else if (r) {
        const O = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: i(N, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, M = X;
        this._pushRequestHash(O, M), this._request(O);
      }
    }), l ? Q(R) : this._sortRecordsBy(
      os(R, a),
      c
    );
  }
  /**
   * Injects action methods into a collection record.
   *
   * @private
   * @param {Object} collectionRecord - The collection record to inject actions into.
   */
  _injectCollectionActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: (o) => this._deleteRecord(s, o),
      reload: () => this._reloadRecord(s),
      getCollection: (o, r) => this._getCollectionRecord(
        o,
        r,
        s
      )
    }, t = x(e);
    u(t, (o) => {
      s[o] = e[o];
    });
  }
  /**
   * Injects reference keys into a collection record.
   *
   * @private
   * @param {string} collectionName - The name of the collection.
   * @param {Object} collectionRecord - The collection record to inject keys into.
   * @param {string} collectionRecordHashId - Optional hash ID for the record.
   */
  _injectCollectionReferenceKeys(s, e, t = null) {
    const o = rs(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    n(e, "collectionName", s), n(e, "hashId", o), n(e, "isLoading", !1), n(e, "isError", !1), n(e, "isPristine", !0), n(e, "isDirty", !1);
  }
  /**
   * Pushes records to a specified collection.
   *
   * @private
   * @param {string} collectionName - The name of the collection to push records to.
   * @param {Array|Object} collectionRecords - The records to be pushed. Can be an array or an object.
   * @returns {Array|Object} The pushed records, either an array or an object depending on the input.
   */
  _pushToCollection(s, e) {
    const t = _(e), o = I(e);
    if (t) {
      const r = v(e, "hashId");
      return u(e, (a) => {
        const c = q(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectCollectionActions(a), W(c, 0) && this.collections[s].push(a), g(c, 0) && (this.collections[s][c] = a);
      }), v(
        r,
        (a) => m(this.collections[s], {
          hashId: a
        })
      );
    }
    if (o) {
      const r = e.hashId, a = q(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      return this._injectCollectionActions(e), W(a, 0) && this.collections[s].push(e), g(a, 0) && (this.collections[s][a] = e), m(this.collections[s], {
        hashId: r
      });
    }
  }
  /**
   * Pushes records to specified aliases.
   *
   * @private
   * @param {Array|Object} collectionRecords - The records to be pushed to aliases.
   */
  _pushToAliases(s) {
    const e = _(s), t = I(s), o = x(this.aliases);
    e && u(o, (r) => {
      const a = _(this.aliases[r]), c = I(this.aliases[r]);
      a && u(s, (h) => {
        const l = q(this.aliases[r], {
          hashId: i(h, "hashId")
        });
        g(l, 0) && (this.aliases[r][l] = h);
      }), c && u(s, (h) => {
        f(
          i(h, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = h);
      });
    }), t && u(o, (r) => {
      const a = _(this.aliases[r]), c = I(this.aliases[r]);
      a && u([s], (h) => {
        const l = q(this.aliases[r], {
          hashId: i(h, "hashId")
        });
        g(l, 0) && (this.aliases[r][l] = h);
      }), c && f(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  /**
   * Pushes records to specified request hashes.
   *
   * @private
   * @param {Array|Object} collectionRecords - The records to be pushed to request hashes.
   */
  _pushToRequestHashes(s) {
    const e = x(this.requestHashIds), t = _(s), o = I(s);
    let r = null;
    t && (r = s), o && (r = [s]), u(e, (a) => {
      const c = i(
        this.requestHashIds[a],
        "data"
      ), h = _(c), l = I(c);
      u(r, (p) => {
        if (h) {
          const R = q(
            i(this.requestHashIds[a], "data"),
            {
              hashId: i(p, "hashId")
            }
          );
          g(R, 0) && (this.requestHashIds[a].data[R] = p);
        }
        l && f(
          i(p, "hashId"),
          i(this.requestHashIds[a], "data.hashId")
        ) && n(
          this.requestHashIds[a],
          "data",
          p
        );
      });
    });
  }
  /**
   * Pushes records to a collection, aliases, and request hashes.
   *
   * @private
   * @param {string} collectionName - The name of the collection.
   * @param {Array|Object} collectionRecords - The records to be pushed.
   * @returns {Array|Object} The updated collection records.
   */
  _pushPayload(s, e) {
    this._isCollectionExisting(s);
    const t = this._pushToCollection(
      s,
      e
    );
    return this._pushToAliases(t), this._pushToRequestHashes(t), t;
  }
  /**
   * Pushes a request and its corresponding response to the request hash store.
   *
   * @private
   * @param {Object} requestObject - The request object.
   * @param {Object} responseObject - The initial response object.
   * @returns {Object} The updated or created request hash object.
   */
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const t = this._generateHashId(s), o = !y(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? n(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  /**
   * Sets the host URL for the client and initializes the Axios configuration.
   *
   * @param {string} host - The base URL of the API server.
   */
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  /**
   * Sets the namespace for the client.
   *
   * @param {string} namespace - The namespace for API requests.
   */
  setNamespace(s) {
    this.namespace = s;
  }
  /**
   * Sets a common header for all Axios requests.
   *
   * @param {string} key - The header key.
   * @param {string|number|boolean} value - The header value.
   */
  setHeadersCommon(s, e) {
    A.defaults.headers.common[`${s}`] = e;
  }
  /**
   * Sets the reference key used for included data in request payloads.
   *
   * @param {string} key - The new reference key.
   */
  setPayloadIncludeReference(s) {
    this.payloadIncludedReference = s;
  }
  /**
   * Makes the instance accessible globally in a browser environment.
   *
   * Attaches the instance to the `window` object as `window.ARM`.
   * **Caution:** This method should be used with care as it modifies the global scope.
   */
  setGlobal() {
    typeof window < "u" && (window.ARM = Object.freeze(this));
  }
  /**
   * Retrieves a collection by its name.
   *
   * @param {string} collectionName - The name of the collection to retrieve.
   * @returns {Array} The collection data, or an empty array if not found.
   */
  getCollection(s) {
    return this.collections[s] || [];
  }
  /**
   * Clears the contents of a specified collection.
   *
   * @param {string} collectionName - The name of the collection to clear.
   */
  clearCollection(s) {
    this.collections[s] = [];
  }
  /**
   * Retrieves an alias by its name, with optional fallback records.
   *
   * @param {string} aliasName - The name of the alias to retrieve.
   * @param {Object} fallbackRecords - Optional fallback records to return if the alias is not found.
   * @returns {Array|Object} The alias data or the fallback records.
   */
  getAlias(s, e) {
    return I(e) && this._injectCollectionActions(e), this.aliases[s] || e;
  }
  /**
   * Creates a new record in a specified collection.
   *
   * @param {string} collectionName - The name of the collection.
   * @param {Object} collectionRecord - Optional initial data for the record.
   * @param {boolean} collectionRecordRandomId - Whether to generate a random ID for the record. Defaults to true.
   * @returns {Object} The created record.
   */
  createRecord(s, e = {}, t = !0) {
    const o = t ? J() : ds, r = y(
      m(this.collections[s], {
        id: o
      })
    );
    return n(e, "id", o), this._injectCollectionReferenceKeys(s, e), this._injectCollectionActions(e), r && this.collections[s].push(e), m(this.collections[s], {
      id: o
    });
  }
  /**
   * Makes an API request based on the provided configuration.
   *
   * This method is private and should not be called directly.
   *
   * @param {Object} requestConfig - Configuration object for the request.
   * @param {string} requestConfig.resourceMethod - HTTP method for the request (e.g. 'get', 'post', 'delete').
   * @param {string} requestConfig.resourceName - API endpoint name.
   * @param {string} [requestConfig.resourceId] - Optional resource ID for GET/DELETE requests.
   * @param {Object} [requestConfig.resourceParams] - Optional query parameters for the request.
   * @param {Object} [requestConfig.resourcePayload] - Optional payload data for POST requests.
   * @param {*} [requestConfig.resourceFallback] - Optional value to return if the request fails and no fallback data is provided.
   * @param {Object} [requestConfig.resourceConfig] - Optional configuration overrides for the request.
   * @param {boolean} [requestConfig.resourceConfig.override] - Whether to override default client configuration.
   * @param {string} [requestConfig.resourceConfig.host] - Optional override for the base URL host.
   * @param {string} [requestConfig.resourceConfig.namespace] - Optional override for the API namespace.
   * @param {Object} [requestConfig.resourceConfig.headers] - Optional override for request headers.
   * @param {boolean} [requestConfig.resourceConfig.skip] - Whether to skip making the request (useful for data pre-population).
   * @returns {Promise<*>} Promise resolving to the API response data or rejecting with the error.
   */
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: o,
    resourcePayload: r,
    resourceFallback: a,
    resourceConfig: c
  }) {
    var es, ts, is;
    const h = {
      method: s,
      url: e
    }, l = this._generateHashId({ ...arguments[0] }), p = f(s, "get"), R = f(s, "delete"), N = f(s, "post"), C = V(t) || Is(t), k = !w(o), O = !w(r), M = !y(
      i(c, "override")
    ), P = i(r, "data") || null, $ = C ? m(this.collections[e], {
      id: t
    }) : null;
    if (C && n(h, "url", `${e}/${t}`), M) {
      const d = i(c, "override") || {}, H = y(i(d, "host")) ? this.host : i(d, "host"), z = y(i(d, "namespace")) ? this.namespace : i(d, "namespace"), S = `${H}/${z}`, U = y(i(d, "path")) ? i(h, "url") : i(d, "path"), G = y(i(d, "headers")) ? {} : i(d, "headers"), j = A.defaults.headers.common, b = ys(j, G);
      n(h, "baseURL", S), n(h, "url", U), n(h, "headers", b);
    }
    if (k && n(h, "params", o), O) {
      const d = {
        data: B(P, Os)
      };
      n(h, "data", d);
    }
    const T = !y(i(c, "skip")), Y = f(i(c, "skip"), !0), Z = this.requestHashIds[l], K = !y(Z), ss = i(Z, "isNew");
    if (!(p && (T && Y || !T && K && !ss || T && !Y && K && !ss))) {
      O && n(P, "isLoading", !0), C && n($, "isLoading", !0);
      try {
        const d = await A(h), H = ((es = d == null ? void 0 : d.data) == null ? void 0 : es.data) || a, z = ((ts = d == null ? void 0 : d.data) == null ? void 0 : ts.included) || [], S = ((is = d == null ? void 0 : d.data) == null ? void 0 : is.meta) || {}, U = I(H), G = _(H);
        let j = null;
        return G && u(
          H,
          (b) => this._injectCollectionReferenceKeys(e, b)
        ), U && this._injectCollectionReferenceKeys(e, H), u(z, (b) => {
          this._injectCollectionReferenceKeys(
            i(b, this.payloadIncludedReference),
            b
          ), this._pushPayload(
            i(b, "collectionName"),
            b
          );
        }), j = await this._pushPayload(
          e,
          H
        ), c.alias && this._addAlias(
          i(c, "alias"),
          j
        ), N && this.unloadRecord(P), R && this.unloadRecord(j), this.requestHashIds[l] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: j,
          included: [],
          meta: S
        }, Promise.resolve(j);
      } catch (d) {
        return O && (n(P, "isError", !0), n(P, "isLoading", !1)), C && (n($, "isError", !0), n($, "isLoading", !1)), this.requestHashIds[l] = {
          isLoading: !1,
          isError: !0,
          isNew: !1,
          data: d,
          included: [],
          meta: {}
        }, Promise.reject(d);
      }
    }
  }
  /**
   * Queries a resource with specified parameters and configuration.
   *
   * @param {string} resource - The resource to query.
   * @param {Object} params - Optional query parameters.
   * @param {Object} config - Optional configuration for the request.
   * @returns {Object} The request hash object.
   */
  query(s, e = {}, t = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, r = ns, a = this._pushRequestHash(
      o,
      r
    );
    return this._request(o), a;
  }
  /**
   * Queries a single record from a specified resource.
   * @param {string} resource - The name of the resource to query.
   * @param {Object} params - Optional query parameters for the request.
   * @param {Object} config - Optional configuration for the request.
   * @returns {Object} The request hash object containing the query status and results.
   */
  queryRecord(s, e = {}, t = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: t
    }, r = X, a = this._pushRequestHash(
      o,
      r
    );
    return this._request(o), a;
  }
  /**
   * Fetches a collection of records from a specified resource.
   *
   * @param {string} resource - The name of the resource to query.
   * @param {Object} config - Optional configuration for the request.
   * @returns {Object} The request hash object containing the query status and results.
   */
  findAll(s, e = {}) {
    const t = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: null,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: e
    }, o = ns, r = this._pushRequestHash(
      t,
      o
    );
    return this._request(t), r;
  }
  /**
   * Finds a specific record by ID from a given resource.
   *
   * @param {string} resource - The name of the resource to query.
   * @param {number|string} id - The ID of the record to find.
   * @param {Object} params - Optional query parameters for the request.
   * @param {Object} config - Optional configuration for the request.
   * @returns {Object} The request hash object containing the query status and results.
   */
  findRecord(s, e, t = {}, o = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: o
    }, a = X, c = this._pushRequestHash(
      r,
      a
    );
    return this._request(r), c;
  }
  /**
   * Peeks at all records in a specified collection without triggering a request.
   *
   * @param {string} collectionName - The name of the collection to peek at.
   * @returns {Array} The collection records, or an empty array if the collection is not found.
   */
  peekAll(s) {
    return this.collections[s];
  }
  /**
   * Peeks at a specific record in a collection without triggering a request.
   *
   * @param {string} collectionName - The name of the collection to peek at.
   * @param {number|string} collectionRecordId - The ID of the record to find.
   * @returns {Object|undefined} The found record, or undefined if not found.
   */
  peekRecord(s, e) {
    return m(this.collections[s], {
      id: e
    });
  }
  /**
   * Makes an AJAX request using the axios library.
   *
   * @param {Object} config - Configuration object for the axios request.
   * @returns {Promise} A Promise that resolves with the Axios response or rejects with an error.
   */
  ajax(s = {}) {
    return A.request(s);
  }
  /**
   * Finds the first object in an array that matches the specified properties.
   *
   * @param {Array<Object>} objects - The array of objects to search.
   * @param {Object} findProperties - The properties to match.
   * @returns {Object|undefined} The found object, or undefined if not found.
   */
  findBy(s, e = {}) {
    return m(s, e);
  }
  /**
   * Finds the index of the first object in an array that matches the specified properties.
   *
   * @param {Array<Object>} objects - The array of objects to search.
   * @param {Object} findIndexProperties - The properties to match.
   * @returns {number} The index of the found object, or -1 if not found.
   */
  findIndexBy(s, e = {}) {
    return q(s, e);
  }
  /**
   * Filters an array of objects based on the specified properties.
   *
   * @param {Array<Object>} objects - The array of objects to filter.
   * @param {Object} filterProperties - The filter criteria.
   * @returns {Array<Object>} The filtered array of objects.
   */
  filterBy(s, e = {}) {
    return os(s, e);
  }
  /**
   * Creates a new array of unique objects based on a specified property.
   *
   * @param {Array<Object>} objects - The array of objects to process.
   * @param {string} uniqByProperty - The property to use for uniqueness comparison.
   * @returns {Array<Object>} The array of unique objects.
   */
  uniqBy(s, e) {
    return js(s, e);
  }
  /**
   * Groups objects into arrays based on a specified property.
   *
   * @param {Array<Object>} objects - The array of objects to group.
   * @param {string} groupByProperty - The property to group by.
   * @returns {Object} An object where keys are group values and values are arrays of objects.
   */
  groupBy(s, e) {
    return Cs(s, e);
  }
  /**
   * Returns the first object in an array.
   *
   * @param {Array<Object>} objects - The array of objects.
   * @returns {Object|undefined} The first object, or undefined if the array is empty.
   */
  firstObject(s = []) {
    return Q(s);
  }
  /**
   * Returns the last object in an array.
   *
   * @param {Array<Object>} objects - The array of objects.
   * @returns {Object|undefined} The last object, or undefined if the array is empty.
   */
  lastObject(s = []) {
    return as(s);
  }
  /**
   * Merges two arrays of objects into a single array, removing duplicates.
   *
   * @param {Array<Object>} objects - The first array of objects.
   * @param {Array<Object>} otherObjects - The second array of objects.
   * @returns {Array<Object>} The merged array of objects without duplicates.
   */
  mergeObjects(s = [], e = []) {
    return bs(gs(s, e), f);
  }
  /**
   * Splits an array of objects into chunks of a specified size.
   *
   * @param {Array<Object>} objects - The array of objects to chunk.
   * @param {number} chunkSize - The size of each chunk.
   * @returns {Array<Array<Object>>} An array of chunks.
   */
  chunkObjects(s = [], e = 1) {
    return Rs(s, e);
  }
  /**
   * Sorts an array of objects based on specified properties and sort orders.
   *
   * @param {Array<Object>} objects - The array of objects to sort.
   * @param {Array<string>} sortProperties - An array of sort properties in the format of 'property:order'.
   * @returns {Array<Object>} The sorted array of objects.
   */
  sortBy(s, e) {
    return this._sortRecordsBy(s, e);
  }
  /**
   * Checks if a value is empty.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is empty, false otherwise.
   */
  isEmpty(s) {
    return w(s);
  }
  /**
   * Checks if a value is present (not empty).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is present, false otherwise.
   */
  isPresent(s) {
    return !w(s);
  }
  /**
   * Checks if two values are equal.
   *
   * @param {*} value - The first value.
   * @param {*} other - The second value.
   * @returns {boolean} True if the values are equal, false otherwise.
   */
  isEqual(s, e) {
    return f(s, e);
  }
  /**
   * Checks if a value is a number.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a number, false otherwise.
   */
  isNumber(s) {
    return V(s);
  }
  /**
   * Checks if a value is null or undefined.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is null or undefined, false otherwise.
   */
  isNil(s) {
    return y(s);
  }
  /**
   * Checks if a value is null.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is null, false otherwise.
   */
  isNull(s) {
    return rs(s);
  }
  /**
   * Checks if a value is greater than or equal to another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is greater than or equal to the second value, false otherwise.
   */
  isGte(s, e) {
    return g(s, e);
  }
  /**
   * Checks if a value is greater than another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is greater than the second value, false otherwise.
   */
  isGt(s, e) {
    return ps(s, e);
  }
  /**
   * Checks if a value is less than or equal to another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is less than or equal to the second value, false otherwise.
   */
  isLte(s, e) {
    return _s(s, e);
  }
  /**
   * Checks if a value is less than another value.
   *
   * @param {number} value - The first value.
   * @param {number} other - The second value.
   * @returns {boolean} True if the first value is less than the second value, false otherwise.
   */
  isLt(s, e) {
    return W(s, e);
  }
}
export {
  Ns as default
};
