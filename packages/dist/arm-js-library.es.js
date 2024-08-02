import C from "axios";
import hs from "lodash";
import * as cs from "mobx";
import { v1 as J, NIL as ds } from "uuid";
import us from "crypto-js";
/**
 * ARM JavaScript Library
 *
 * Version: 1.4.3
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
const { makeObservable: ls, observable: E, action: F, toJS: L } = cs, {
  get: i,
  set: h,
  find: y,
  findIndex: q,
  isObject: fs,
  isArray: _,
  isPlainObject: I,
  isNumber: V,
  isString: Is,
  isNull: rs,
  isNil: m,
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
  forEach: l,
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
  groupBy: Os
} = hs, ns = {
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
], Ps = [
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
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), ls(this, {
      collections: E,
      aliases: E,
      requestHashIds: E,
      _pushPayload: F,
      _pushRequestHash: F,
      _addCollection: F,
      _addAlias: F
    });
  }
  /**
   * Initializes the Axios configuration with the base URL.
   *
   * @private
   */
  _initializeAxiosConfig() {
    C.defaults.baseURL = this._getBaseURL();
  }
  /**
   * Initializes a collection of collections with optional default values.
   *
   * @private
   * @param {string[]} collections - An array of collection names to initialize.
   */
  _initializeCollections(s) {
    l(s, (e) => this._addCollection(e, []));
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
    if (m(i(this.collections, s)))
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
    return us.MD5(e).toString();
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
    h(this, s, e);
    const t = B(
      L(this.originalRecord),
      D
    ), o = B(L(this), D);
    f(t, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return ms(qs(a), ([c, d]) => {
        const p = n ? `${n}.${c}` : c;
        return fs(d) && !_(d) && d !== null ? e(d, p) : { key: p, value: d };
      });
    }
    const t = e(s);
    l(t, ({ key: a, value: n }) => h(this, a, n));
    const o = B(
      L(this.originalRecord),
      D
    ), r = B(L(this), D);
    f(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
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
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = q(this.collections[e], {
      hashId: i(s, "hashId")
    });
    g(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = x(this.requestHashIds);
    l(e, (t) => {
      const o = i(
        this.requestHashIds[t],
        "data"
      ), r = _(o), a = I(o);
      if (r) {
        const n = q(
          i(this.requestHashIds[t], "data"),
          {
            hashId: i(s, "hashId")
          }
        );
        g(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      a && f(
        i(s, "hashId"),
        i(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = x(this.aliases);
    l(e, (t) => {
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
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = y(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = V(i(t, "id")), r = o ? i(t, "id") : null, d = {
      resourceMethod: o ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(d);
  }
  async _deleteRecord(s) {
    const e = i(s, "collectionName"), t = y(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = i(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: i(t, "collectionName"),
      resourceId: Number(o),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
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
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(e, "async") || !1, a = i(e, "filterBy") || {}, n = i(e, "sortBy") || [], c = i(t, o) || [], d = I(
      c
    ), p = d ? [c] : c, R = E([]);
    return l(p, (N) => {
      const j = this._generateHashId({
        id: i(N, "id"),
        collectionName: s
      }), k = y(this.collections[s], {
        hashId: j
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
    }), d ? Q(R) : this._sortRecordsBy(
      os(R, a),
      n
    );
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: (o, r) => this._getCollectionRecord(
        o,
        r,
        s
      )
    }, t = x(e);
    l(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = rs(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), o = I(e);
    if (t) {
      const r = v(e, "hashId");
      return l(e, (a) => {
        const n = q(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectActions(a), W(n, 0) && this.collections[s].push(a), g(n, 0) && (this.collections[s][n] = a);
      }), v(
        r,
        (a) => y(this.collections[s], {
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
      return this._injectActions(e), W(a, 0) && this.collections[s].push(e), g(a, 0) && (this.collections[s][a] = e), y(this.collections[s], {
        hashId: r
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = I(s), o = x(this.aliases);
    e && l(o, (r) => {
      const a = _(this.aliases[r]), n = I(this.aliases[r]);
      a && l(s, (c) => {
        const d = q(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        g(d, 0) && (this.aliases[r][d] = c);
      }), n && l(s, (c) => {
        f(
          i(c, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = c);
      });
    }), t && l(o, (r) => {
      const a = _(this.aliases[r]), n = I(this.aliases[r]);
      a && l([s], (c) => {
        const d = q(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        g(d, 0) && (this.aliases[r][d] = c);
      }), n && f(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = x(this.requestHashIds), t = _(s), o = I(s);
    let r = null;
    t && (r = s), o && (r = [s]), l(e, (a) => {
      const n = i(
        this.requestHashIds[a],
        "data"
      ), c = _(n), d = I(n);
      l(r, (p) => {
        if (c) {
          const R = q(
            i(this.requestHashIds[a], "data"),
            {
              hashId: i(p, "hashId")
            }
          );
          g(R, 0) && (this.requestHashIds[a].data[R] = p);
        }
        d && f(
          i(p, "hashId"),
          i(this.requestHashIds[a], "data.hashId")
        ) && h(
          this.requestHashIds[a],
          "data",
          p
        );
      });
    });
  }
  _pushPayload(s, e) {
    this._isCollectionExisting(s);
    const t = this._pushToCollection(
      s,
      e
    );
    return this._pushToAliases(t), this._pushToRequestHashes(t), t;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const t = this._generateHashId(s), o = !m(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    C.defaults.headers.common[`${s}`] = e;
  }
  setPayloadIncludeReference(s) {
    this.payloadIncludedReference = s;
  }
  setGlobal() {
    typeof window < "u" && (window.ARM = Object.freeze(this));
  }
  getCollection(s) {
    return this.collections[s] || [];
  }
  clearCollection(s) {
    this.collections[s] = [];
  }
  getAlias(s, e) {
    return I(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}, t = !0) {
    const o = t ? J() : ds, r = m(
      y(this.collections[s], {
        id: o
      })
    );
    return h(e, "id", o), this._injectReferenceKeys(s, e), this._injectActions(e), r && this.collections[s].push(e), y(this.collections[s], {
      id: o
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: o,
    resourcePayload: r,
    resourceFallback: a,
    resourceConfig: n
  }) {
    var es, ts, is;
    const c = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), p = f(s, "get"), R = f(s, "delete"), N = f(s, "post"), j = V(t) || Is(t), k = !w(o), O = !w(r), M = !m(
      i(n, "override")
    ), A = i(r, "data") || null, $ = j ? y(this.collections[e], {
      id: t
    }) : null;
    if (M) {
      const u = i(n, "override") || {}, b = m(i(u, "host")) ? this.host : i(u, "host"), z = m(i(u, "namespace")) ? this.namespace : i(u, "namespace"), S = `${b}/${z}`, U = m(i(u, "headers")) ? {} : i(u, "headers"), G = C.defaults.headers.common, H = ys(G, U);
      h(c, "baseURL", S), h(c, "headers", H);
    }
    if (j && h(c, "url", `${e}/${t}`), k && h(c, "params", o), O) {
      const u = {
        data: B(A, Ps)
      };
      h(c, "data", u);
    }
    const T = !m(i(n, "skip")), Y = f(i(n, "skip"), !0), Z = this.requestHashIds[d], K = !m(Z), ss = i(Z, "isNew");
    if (!(p && (T && Y || !T && K && !ss || T && !Y && K && !ss))) {
      O && h(A, "isLoading", !0), j && h($, "isLoading", !0);
      try {
        const u = await C(c), b = ((es = u == null ? void 0 : u.data) == null ? void 0 : es.data) || a, z = ((ts = u == null ? void 0 : u.data) == null ? void 0 : ts.included) || [], S = ((is = u == null ? void 0 : u.data) == null ? void 0 : is.meta) || {}, U = I(b), G = _(b);
        let H = null;
        return G && l(
          b,
          (P) => this._injectReferenceKeys(e, P)
        ), U && this._injectReferenceKeys(e, b), l(z, (P) => {
          this._injectReferenceKeys(
            i(P, this.payloadIncludedReference),
            P
          ), this._pushPayload(
            i(P, "collectionName"),
            P
          );
        }), H = await this._pushPayload(
          e,
          b
        ), n.alias && this._addAlias(
          i(n, "alias"),
          H
        ), N && this.unloadRecord(A), R && this.unloadRecord(H), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: H,
          included: [],
          meta: S
        }, Promise.resolve(H);
      } catch (u) {
        return O && (h(A, "isError", !0), h(A, "isLoading", !1)), j && (h($, "isError", !0), h($, "isLoading", !1)), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !0,
          isNew: !1,
          data: u,
          included: [],
          meta: {}
        }, Promise.reject(u);
      }
    }
  }
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
  findRecord(s, e, t = {}, o = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: o
    }, a = X, n = this._pushRequestHash(
      r,
      a
    );
    return this._request(r), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return y(this.collections[s], {
      id: e
    });
  }
  ajax(s = {}) {
    return C.request(s);
  }
  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(s, e = {}) {
    return y(s, e);
  }
  findIndexBy(s, e = {}) {
    return q(s, e);
  }
  filterBy(s, e = {}) {
    return os(s, e);
  }
  uniqBy(s, e) {
    return js(s, e);
  }
  groupBy(s, e) {
    return Os(s, e);
  }
  firstObject(s = []) {
    return Q(s);
  }
  lastObject(s = []) {
    return as(s);
  }
  mergeObjects(s = [], e = []) {
    return bs(gs(s, e), f);
  }
  chunkObjects(s = [], e = 1) {
    return Rs(s, e);
  }
  sortBy(s, e) {
    return this._sortRecordsBy(s, e);
  }
  isEmpty(s) {
    return w(s);
  }
  isPresent(s) {
    return !w(s);
  }
  isEqual(s, e) {
    return f(s, e);
  }
  isNumber(s) {
    return V(s);
  }
  isNil(s) {
    return m(s);
  }
  isNull(s) {
    return rs(s);
  }
  isGte(s, e) {
    return g(s, e);
  }
  isGt(s, e) {
    return ps(s, e);
  }
  isLte(s, e) {
    return _s(s, e);
  }
  isLt(s, e) {
    return W(s, e);
  }
}
export {
  Ns as default
};
