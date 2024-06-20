import E from "axios";
import Z from "lodash";
import * as K from "mobx";
import { v1 as $ } from "uuid";
import ss from "crypto-js";
const { makeObservable: es, observable: L, action: H, toJS: C } = K, {
  get: r,
  set: h,
  find: q,
  findIndex: j,
  isObject: ts,
  isArray: m,
  isPlainObject: y,
  isNumber: z,
  isNull: is,
  isNil: v,
  isEmpty: S,
  isEqual: p,
  gte: P,
  lt: B,
  flatMap: rs,
  map: J,
  entries: os,
  forEach: u,
  keysIn: M,
  omit: w
} = Z, U = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, V = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, N = [
  "destroyRecord",
  "reload",
  "save",
  "set",
  "get",
  "setProperties",
  "isDirty",
  "isError",
  "isLoading",
  "isPristine",
  "originalRecord"
];
class ds {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = window.location.origin, this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), es(this, {
      collections: L,
      aliases: L,
      requestHashIds: L,
      _pushPayloadToCollection: H,
      _pushRequestHash: H,
      _addCollection: H,
      _addAlias: H
    });
  }
  /*
   * Define internal functions here.
   * Internal functions are functions that are being used inside ARM class
   * and not being exposed on new ARM instance.
   * These function will be set to protected later on when tried to use on new ARM instance.
   */
  /*
   * Function for initializeing Axios Configurations.
   */
  _initializeAxiosConfig() {
    E.defaults.baseURL = this._getBaseURL();
  }
  /*
   * Function for initializing collections from ARM instance.
   */
  _initializeCollections(s) {
    u(s, (e) => this._addCollection(e, []));
  }
  /*
   * Function for getting baseURL from
   * host and namespace defined.
   */
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  /*
   * Function for getting token,
   * by default it is being fetched on saved local storage
   * key 'token'.
   */
  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem("token")}`;
  }
  /*
   * Function for adding new collection and collection records.
   */
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  /*
   * Function for aliasing data defined on API methods.
   */
  _addAlias(s, e) {
    const t = m(e), i = y(e);
    t && (this.aliases[s] = e || []), i && (this.aliases[s] = e || {});
  }
  /*
   * Function for generating collection data unique id.
   */
  _generateHashId(s = { id: $() }) {
    const e = JSON.stringify(s);
    return ss.MD5(e).toString();
  }
  /*
   * Functions for property management.
   * Property management are set of function for setting and getting
   * values from observable collection.
   * This functions are injectables.
   */
  /*
   * Function for getting single property of observable collection
   * where it is being injected.
   */
  _getProperty(s) {
    return r(this, s);
  }
  /*
   * Function for setting single property of observable collection
   * where it is being injected.
   */
  _setProperty(s, e) {
    h(this, s, e);
    const t = w(
      C(this.originalRecord),
      N
    ), i = w(C(this), N);
    p(t, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  /*
   * Function for setting multiple properties of observable collection
   * where it is being injected.
   */
  _setProperties(s) {
    function e(n, l = "") {
      return rs(os(n), ([a, c]) => {
        const I = l ? `${l}.${a}` : a;
        return ts(c) && !m(c) && c !== null ? e(c, I) : { key: I, value: c };
      });
    }
    const t = e(s);
    u(t, ({ key: n, value: l }) => h(this, n, l));
    const i = w(
      C(this.originalRecord),
      N
    ), o = w(C(this), N);
    p(i, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  /*
   * Function for temporary removing record from collection.
   * It will not permanently remove the record from the server.
   */
  unloadRecord(s) {
    const e = M(this.aliases), t = r(s, "collectionName"), i = j(this.collections[t], {
      hashId: r(s, "hashId")
    });
    P(i, 0) && this.collections[t].splice(i, 1), u(e, (o) => {
      const n = m(this.aliases[o]), l = y(this.aliases[o]);
      if (n) {
        const a = j(this.aliases[o], {
          hashId: r(s, "hashId")
        });
        P(a, 0) && this.aliases[o].splice(a, 1);
      }
      l && p(
        r(s, "hashId"),
        r(this.aliases[o], "hashId")
      ) && (this.aliases[o] = {});
    });
  }
  /*
   * Function for persisting collection record on the server,
   * where it is being injected.
   */
  _saveRecord(s) {
    const e = r(s, "collectionName"), t = q(this.collections[e], {
      hashId: r(s, "hashId")
    }), i = z(r(t, "id")), o = i ? r(t, "id") : null, c = {
      resourceMethod: i ? "put" : "post",
      resourceName: e,
      resourceId: o,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(c);
  }
  /*
   * Function for permanently removing record from the server.
   */
  async _deleteRecord(s) {
    const e = q(
      this.collections[s.collectionName],
      {
        hashId: r(s, "hashId")
      }
    ), t = r(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: r(e, "collectionName"),
      resourceId: t,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  /*
   * Function for updating record from the server.
   */
  async _reloadRecord(s) {
    const e = r(s, "id"), o = {
      resourceMethod: "get",
      resourceName: r(s, "collectionName"),
      resourceId: e,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !0 }
    };
    return this._request(o);
  }
  /*
   * Function for injecting actions
   * on collection record.
   */
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s)
    }, t = M(e);
    u(t, (i) => {
      s[i] = e[i];
    });
  }
  /*
   * Function for injecting reference keys such as:
   * collectionName - identifier for which collection the collection record belongs to
   * collectionRecordHashId - identifier for which collection record should be updated
   */
  _injectReferenceKeys(s, e, t = null) {
    const i = is(t) ? this._generateHashId({
      id: r(e, "id"),
      collectionName: r(e, "collectionName")
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", i), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  /*
   * Function for pushing collection records obtained from API methods
   * to respective collections.
   */
  _pushPayloadToCollection(s, e) {
    const t = m(e), i = y(e), o = M(this.aliases);
    let n = null;
    if (t) {
      const l = J(e, "hashId");
      u(e, (a) => {
        const c = j(
          this.collections[s],
          {
            hashId: r(a, "hashId")
          }
        );
        this._injectActions(a), B(c, 0) && this.collections[s].push(a), P(c, 0) && (this.collections[s][c] = a);
      }), n = J(
        l,
        (a) => q(this.collections[s], {
          hashId: a
        })
      ), u(o, (a) => {
        const c = m(this.aliases[a]), I = y(this.aliases[a]);
        c && u(n, (f) => {
          const _ = j(this.aliases[a], {
            hashId: r(f, "hashId")
          });
          P(_, 0) && (this.aliases[a][_] = f);
        }), I && u(n, (f) => {
          p(
            r(f, "hashId"),
            r(this.aliases[a], "hashId")
          ) && (this.aliases[a] = f);
        });
      });
    }
    if (i) {
      const l = e.hashId, a = j(
        this.collections[s],
        {
          hashId: r(e, "hashId")
        }
      );
      this._injectActions(e), B(a, 0) && this.collections[s].push(e), P(a, 0) && (this.collections[s][a] = e), n = q(this.collections[s], {
        hashId: l
      }), u(o, (c) => {
        const I = m(this.aliases[c]), f = y(this.aliases[c]);
        I && u([n], (_) => {
          const A = j(this.aliases[c], {
            hashId: r(_, "hashId")
          });
          P(A, 0) && (this.aliases[c][A] = _);
        }), f && p(
          r(n, "hashId"),
          r(this.aliases[c], "hashId")
        ) && (this.aliases[c] = n);
      });
    }
    return n;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const t = this._generateHashId(s), i = !v(this.requestHashIds[t]), o = r(e, "isNew");
    return i && o ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  /*
   * Define internal/external functions here.
   * These functions are functions that are being used inside ARM class and new ARM instance.
   */
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    E.defaults.headers.common[`${s}`] = e;
  }
  setPayloadIncludeReference(s) {
    this.payloadIncludedReference = s;
  }
  setGlobal() {
    window && (window.ARM = Object.freeze(this));
  }
  getCollection(s) {
    return this.collections[s] || [];
  }
  clearCollection(s) {
    this.collections[s] = [];
  }
  getAlias(s, e) {
    return y(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}) {
    return h(e, "id", $()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), q(this.collections[s], {
      hashId: r(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: i,
    resourcePayload: o,
    resourceFallback: n,
    resourceConfig: l
  }) {
    var D, F, T;
    const a = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), I = r(l, "skip") || !1, f = p(s, "get"), _ = p(s, "delete"), A = p(s, "post"), G = z(t), Q = !S(i), k = !S(o), O = r(o, "data") || null;
    if (G && h(a, "url", `${e}/${t}`), Q && h(a, "params", i), k && h(a, "data", o), f && !I) {
      const d = this.requestHashIds[c], g = !v(d), x = r(d, "isNew");
      if (g && !x) return;
    }
    k && h(O, "isLoading", !0);
    try {
      const d = await E(a), g = ((D = d == null ? void 0 : d.data) == null ? void 0 : D.data) || n, x = ((F = d == null ? void 0 : d.data) == null ? void 0 : F.included) || [], W = ((T = d == null ? void 0 : d.data) == null ? void 0 : T.meta) || {}, X = y(g), Y = m(g);
      let R = null;
      return Y && u(
        g,
        (b) => this._injectReferenceKeys(e, b)
      ), X && this._injectReferenceKeys(e, g), u(x, (b) => {
        this._injectReferenceKeys(
          r(b, this.payloadIncludedReference),
          b
        ), this._pushPayloadToCollection(
          r(b, "collectionName"),
          b
        );
      }), R = await this._pushPayloadToCollection(
        e,
        g
      ), l.alias && this._addAlias(
        r(l, "alias"),
        R
      ), A && this.unloadRecord(O), _ && this.unloadRecord(R), this.requestHashIds[c] = {
        isLoading: !1,
        isError: !1,
        isNew: !1,
        data: R,
        included: [],
        meta: W
      }, Promise.resolve(R);
    } catch (d) {
      return k && (h(O, "isError", !0), h(O, "isLoading", !1)), this.requestHashIds[c] = {
        isLoading: !1,
        isError: !0,
        isNew: !1,
        data: d,
        included: [],
        meta: {}
      }, Promise.reject(d);
    }
  }
  /*
   * Functions for retrieving collection of records from server
   */
  query(s, e = {}, t = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, o = U, n = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), n;
  }
  queryRecord(s, e = {}, t = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: t
    }, o = V, n = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), n;
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
    }, i = U, o = this._pushRequestHash(
      t,
      i
    );
    return this._request(t), o;
  }
  findRecord(s, e, t = {}, i = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, n = V, l = this._pushRequestHash(
      o,
      n
    );
    return this._request(o), l;
  }
  /*
   * Functions for retrieving collection of records from local cache
   */
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return q(this.collections[s], {
      id: e
    });
  }
}
export {
  ds as default
};
