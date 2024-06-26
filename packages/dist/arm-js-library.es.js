import M from "axios";
import Z from "lodash";
import * as K from "mobx";
import { v1 as z } from "uuid";
import ss from "crypto-js";
const { makeObservable: es, observable: F, action: N, toJS: k } = K, {
  get: i,
  set: h,
  find: H,
  findIndex: P,
  isObject: ts,
  isArray: m,
  isPlainObject: y,
  isNumber: S,
  isNull: is,
  isNil: B,
  isEmpty: J,
  isEqual: _,
  gte: R,
  lt: U,
  flatMap: as,
  map: V,
  entries: rs,
  forEach: f,
  keysIn: x,
  omit: C
} = Z, G = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, Q = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, E = [
  "destroyRecord",
  "reload",
  "save",
  "set",
  "get",
  "setProperties",
  "isDirty",
  "isError",
  "isLoading",
  "isPristine"
], os = [
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
  "hashId",
  "collectionName"
];
class us {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = window.location.origin, this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), es(this, {
      collections: F,
      aliases: F,
      requestHashIds: F,
      _pushPayloadToCollection: N,
      _pushRequestHash: N,
      _addCollection: N,
      _addAlias: N
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
    M.defaults.baseURL = this._getBaseURL();
  }
  /*
   * Function for initializing collections from ARM instance.
   */
  _initializeCollections(s) {
    f(s, (e) => this._addCollection(e, []));
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
    const t = m(e), a = y(e);
    t && (this.aliases[s] = e || []), a && (this.aliases[s] = e || {});
  }
  /*
   * Function for generating collection data unique id.
   */
  _generateHashId(s = { id: z() }) {
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
    return i(this, s);
  }
  /*
   * Function for setting single property of observable collection
   * where it is being injected.
   */
  _setProperty(s, e) {
    h(this, s, e);
    const t = C(
      k(this.originalRecord),
      E
    ), a = C(k(this), E);
    _(t, a) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  /*
   * Function for setting multiple properties of observable collection
   * where it is being injected.
   */
  _setProperties(s) {
    function e(d, n = "") {
      return as(rs(d), ([u, o]) => {
        const c = n ? `${n}.${u}` : u;
        return ts(o) && !m(o) && o !== null ? e(o, c) : { key: c, value: o };
      });
    }
    const t = e(s);
    f(t, ({ key: d, value: n }) => h(this, d, n));
    const a = C(
      k(this.originalRecord),
      E
    ), r = C(k(this), E);
    _(a, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  /*
   * Function for temporary removing record from collection.
   * It will not permanently remove the record from the server.
   */
  unloadRecord(s) {
    const e = x(this.aliases), t = i(s, "collectionName"), a = P(this.collections[t], {
      hashId: i(s, "hashId")
    });
    R(a, 0) && this.collections[t].splice(a, 1), f(e, (r) => {
      const d = m(this.aliases[r]), n = y(this.aliases[r]);
      if (d) {
        const u = P(this.aliases[r], {
          hashId: i(s, "hashId")
        });
        R(u, 0) && this.aliases[r].splice(u, 1);
      }
      n && _(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = {});
    });
  }
  /*
   * Function for persisting collection record on the server,
   * where it is being injected.
   */
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = H(this.collections[e], {
      hashId: i(s, "hashId")
    }), a = S(i(t, "id")), r = a ? i(t, "id") : null, o = {
      resourceMethod: a ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(o);
  }
  /*
   * Function for permanently removing record from the server.
   */
  async _deleteRecord(s) {
    const e = H(
      this.collections[s.collectionName],
      {
        hashId: i(s, "hashId")
      }
    ), t = i(s, "id"), d = {
      resourceMethod: "delete",
      resourceName: i(e, "collectionName"),
      resourceId: t,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(d);
  }
  /*
   * Function for updating record from the server.
   */
  async _reloadRecord(s) {
    const e = i(s, "id"), r = {
      resourceMethod: "get",
      resourceName: i(s, "collectionName"),
      resourceId: e,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !0 }
    };
    return this._request(r);
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
    }, t = x(e);
    f(t, (a) => {
      s[a] = e[a];
    });
  }
  /*
   * Function for injecting reference keys such as:
   * collectionName - identifier for which collection the collection record belongs to
   * collectionRecordHashId - identifier for which collection record should be updated
   */
  _injectReferenceKeys(s, e, t = null) {
    const a = is(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: i(e, "collectionName")
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", a), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  /*
   * Function for pushing collection records obtained from API methods
   * to respective collections.
   */
  _pushPayloadToCollection(s, e) {
    const t = m(e), a = y(e), r = x(this.aliases), d = x(this.requestHashIds);
    let n = null;
    if (t) {
      const u = V(e, "hashId");
      f(e, (o) => {
        const c = P(
          this.collections[s],
          {
            hashId: i(o, "hashId")
          }
        );
        this._injectActions(o), U(c, 0) && this.collections[s].push(o), R(c, 0) && (this.collections[s][c] = o);
      }), n = V(
        u,
        (o) => H(this.collections[s], {
          hashId: o
        })
      ), f(r, (o) => {
        const c = m(this.aliases[o]), g = y(this.aliases[o]);
        c && f(n, (I) => {
          const p = P(this.aliases[o], {
            hashId: i(I, "hashId")
          });
          R(p, 0) && (this.aliases[o][p] = I);
        }), g && f(n, (I) => {
          _(
            i(I, "hashId"),
            i(this.aliases[o], "hashId")
          ) && (this.aliases[o] = I);
        });
      });
    }
    if (a) {
      const u = e.hashId, o = P(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      this._injectActions(e), U(o, 0) && this.collections[s].push(e), R(o, 0) && (this.collections[s][o] = e), n = H(this.collections[s], {
        hashId: u
      }), f(r, (c) => {
        const g = m(this.aliases[c]), I = y(this.aliases[c]);
        g && f([n], (p) => {
          const q = P(this.aliases[c], {
            hashId: i(p, "hashId")
          });
          R(q, 0) && (this.aliases[c][q] = p);
        }), I && _(
          i(n, "hashId"),
          i(this.aliases[c], "hashId")
        ) && (this.aliases[c] = n);
      }), f(d, (c) => {
        const g = i(
          this.requestHashIds[c],
          "data"
        ), I = m(g), p = y(g);
        I && f([n], (q) => {
          const w = P(
            i(this.requestHashIds[c], "data"),
            {
              hashId: i(q, "hashId")
            }
          );
          R(w, 0) && (this.requestHashIds[c][w] = q);
        }), p && _(
          i(n, "hashId"),
          i(this.requestHashIds[c], "data.hashId")
        ) && h(
          this.requestHashIds[c],
          "data",
          n
        );
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
    const t = this._generateHashId(s), a = !B(this.requestHashIds[t]), r = i(e, "isNew");
    return a && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
    M.defaults.headers.common[`${s}`] = e;
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
    return h(e, "id", z()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), H(this.collections[s], {
      hashId: i(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: a,
    resourcePayload: r,
    resourceFallback: d,
    resourceConfig: n
  }) {
    var T, $, v;
    const u = {
      method: s,
      url: e
    }, o = this._generateHashId({ ...arguments[0] }), c = i(n, "skip") || !1, g = _(s, "get"), I = _(s, "delete"), p = _(s, "post"), q = S(t), w = !J(a), D = !J(r), A = i(r, "data") || null;
    if (q && h(u, "url", `${e}/${t}`), w && h(u, "params", a), D) {
      const l = {
        data: C(A, os)
      };
      h(u, "data", l);
    }
    if (g && !c) {
      const l = this.requestHashIds[o], b = !B(l), L = i(l, "isNew");
      if (b && !L) return;
    }
    D && h(A, "isLoading", !0);
    try {
      const l = await M(u), b = ((T = l == null ? void 0 : l.data) == null ? void 0 : T.data) || d, L = (($ = l == null ? void 0 : l.data) == null ? void 0 : $.included) || [], W = ((v = l == null ? void 0 : l.data) == null ? void 0 : v.meta) || {}, X = y(b), Y = m(b);
      let O = null;
      return Y && f(
        b,
        (j) => this._injectReferenceKeys(e, j)
      ), X && this._injectReferenceKeys(e, b), f(L, (j) => {
        this._injectReferenceKeys(
          i(j, this.payloadIncludedReference),
          j
        ), this._pushPayloadToCollection(
          i(j, "collectionName"),
          j
        );
      }), O = await this._pushPayloadToCollection(
        e,
        b
      ), n.alias && this._addAlias(
        i(n, "alias"),
        O
      ), p && this.unloadRecord(A), I && this.unloadRecord(O), this.requestHashIds[o] = {
        isLoading: !1,
        isError: !1,
        isNew: !1,
        data: O,
        included: [],
        meta: W
      }, Promise.resolve(O);
    } catch (l) {
      return D && (h(A, "isError", !0), h(A, "isLoading", !1)), this.requestHashIds[o] = {
        isLoading: !1,
        isError: !0,
        isNew: !1,
        data: l,
        included: [],
        meta: {}
      }, Promise.reject(l);
    }
  }
  /*
   * Functions for retrieving collection of records from server
   */
  query(s, e = {}, t = {}) {
    const a = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, r = G, d = this._pushRequestHash(
      a,
      r
    );
    return this._request(a), d;
  }
  queryRecord(s, e = {}, t = {}) {
    const a = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: t
    }, r = Q, d = this._pushRequestHash(
      a,
      r
    );
    return this._request(a), d;
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
    }, a = G, r = this._pushRequestHash(
      t,
      a
    );
    return this._request(t), r;
  }
  findRecord(s, e, t = {}, a = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: a
    }, d = Q, n = this._pushRequestHash(
      r,
      d
    );
    return this._request(r), n;
  }
  /*
   * Functions for retrieving collection of records from local cache
   */
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return H(this.collections[s], {
      id: e
    });
  }
}
export {
  us as default
};
