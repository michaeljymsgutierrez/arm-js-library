import E from "axios";
import Z from "lodash";
import * as K from "mobx";
import { v1 as $ } from "uuid";
import ss from "crypto-js";
const { makeObservable: es, observable: L, action: C, toJS: w } = K, {
  get: o,
  set: h,
  find: q,
  findIndex: P,
  isObject: ts,
  isArray: m,
  isPlainObject: y,
  isNumber: v,
  isNull: is,
  isNil: z,
  isEmpty: S,
  isEqual: I,
  gte: j,
  lt: B,
  flatMap: os,
  map: J,
  entries: rs,
  forEach: u,
  keysIn: M,
  omit: O
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
  "isPristine"
], as = [
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
      collections: L,
      aliases: L,
      requestHashIds: L,
      _pushPayloadToCollection: C,
      _pushRequestHash: C,
      _addCollection: C,
      _addAlias: C
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
    return o(this, s);
  }
  /*
   * Function for setting single property of observable collection
   * where it is being injected.
   */
  _setProperty(s, e) {
    h(this, s, e);
    const t = O(
      w(this.originalRecord),
      N
    ), i = O(w(this), N);
    I(t, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  /*
   * Function for setting multiple properties of observable collection
   * where it is being injected.
   */
  _setProperties(s) {
    function e(n, l = "") {
      return os(rs(n), ([a, c]) => {
        const p = l ? `${l}.${a}` : a;
        return ts(c) && !m(c) && c !== null ? e(c, p) : { key: p, value: c };
      });
    }
    const t = e(s);
    u(t, ({ key: n, value: l }) => h(this, n, l));
    const i = O(
      w(this.originalRecord),
      N
    ), r = O(w(this), N);
    I(i, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  /*
   * Function for temporary removing record from collection.
   * It will not permanently remove the record from the server.
   */
  unloadRecord(s) {
    const e = M(this.aliases), t = o(s, "collectionName"), i = P(this.collections[t], {
      hashId: o(s, "hashId")
    });
    j(i, 0) && this.collections[t].splice(i, 1), u(e, (r) => {
      const n = m(this.aliases[r]), l = y(this.aliases[r]);
      if (n) {
        const a = P(this.aliases[r], {
          hashId: o(s, "hashId")
        });
        j(a, 0) && this.aliases[r].splice(a, 1);
      }
      l && I(
        o(s, "hashId"),
        o(this.aliases[r], "hashId")
      ) && (this.aliases[r] = {});
    });
  }
  /*
   * Function for persisting collection record on the server,
   * where it is being injected.
   */
  _saveRecord(s) {
    const e = o(s, "collectionName"), t = q(this.collections[e], {
      hashId: o(s, "hashId")
    }), i = v(o(t, "id")), r = i ? o(t, "id") : null, c = {
      resourceMethod: i ? "put" : "post",
      resourceName: e,
      resourceId: r,
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
        hashId: o(s, "hashId")
      }
    ), t = o(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: o(e, "collectionName"),
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
    const e = o(s, "id"), r = {
      resourceMethod: "get",
      resourceName: o(s, "collectionName"),
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
      id: o(e, "id"),
      collectionName: o(e, "collectionName")
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", i), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  /*
   * Function for pushing collection records obtained from API methods
   * to respective collections.
   */
  _pushPayloadToCollection(s, e) {
    const t = m(e), i = y(e), r = M(this.aliases);
    let n = null;
    if (t) {
      const l = J(e, "hashId");
      u(e, (a) => {
        const c = P(
          this.collections[s],
          {
            hashId: o(a, "hashId")
          }
        );
        this._injectActions(a), B(c, 0) && this.collections[s].push(a), j(c, 0) && (this.collections[s][c] = a);
      }), n = J(
        l,
        (a) => q(this.collections[s], {
          hashId: a
        })
      ), u(r, (a) => {
        const c = m(this.aliases[a]), p = y(this.aliases[a]);
        c && u(n, (f) => {
          const _ = P(this.aliases[a], {
            hashId: o(f, "hashId")
          });
          j(_, 0) && (this.aliases[a][_] = f);
        }), p && u(n, (f) => {
          I(
            o(f, "hashId"),
            o(this.aliases[a], "hashId")
          ) && (this.aliases[a] = f);
        });
      });
    }
    if (i) {
      const l = e.hashId, a = P(
        this.collections[s],
        {
          hashId: o(e, "hashId")
        }
      );
      this._injectActions(e), B(a, 0) && this.collections[s].push(e), j(a, 0) && (this.collections[s][a] = e), n = q(this.collections[s], {
        hashId: l
      }), u(r, (c) => {
        const p = m(this.aliases[c]), f = y(this.aliases[c]);
        p && u([n], (_) => {
          const H = P(this.aliases[c], {
            hashId: o(_, "hashId")
          });
          j(H, 0) && (this.aliases[c][H] = _);
        }), f && I(
          o(n, "hashId"),
          o(this.aliases[c], "hashId")
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
    const t = this._generateHashId(s), i = !z(this.requestHashIds[t]), r = o(e, "isNew");
    return i && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
      hashId: o(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: i,
    resourcePayload: r,
    resourceFallback: n,
    resourceConfig: l
  }) {
    var D, F, T;
    const a = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), p = o(l, "skip") || !1, f = I(s, "get"), _ = I(s, "delete"), H = I(s, "post"), G = v(t), Q = !S(i), k = !S(r), R = o(r, "data") || null;
    if (G && h(a, "url", `${e}/${t}`), Q && h(a, "params", i), k) {
      const d = {
        data: O(R, as)
      };
      h(a, "data", d);
    }
    if (f && !p) {
      const d = this.requestHashIds[c], g = !z(d), x = o(d, "isNew");
      if (g && !x) return;
    }
    k && h(R, "isLoading", !0);
    try {
      const d = await E(a), g = ((D = d == null ? void 0 : d.data) == null ? void 0 : D.data) || n, x = ((F = d == null ? void 0 : d.data) == null ? void 0 : F.included) || [], W = ((T = d == null ? void 0 : d.data) == null ? void 0 : T.meta) || {}, X = y(g), Y = m(g);
      let A = null;
      return Y && u(
        g,
        (b) => this._injectReferenceKeys(e, b)
      ), X && this._injectReferenceKeys(e, g), u(x, (b) => {
        this._injectReferenceKeys(
          o(b, this.payloadIncludedReference),
          b
        ), this._pushPayloadToCollection(
          o(b, "collectionName"),
          b
        );
      }), A = await this._pushPayloadToCollection(
        e,
        g
      ), l.alias && this._addAlias(
        o(l, "alias"),
        A
      ), H && this.unloadRecord(R), _ && this.unloadRecord(A), this.requestHashIds[c] = {
        isLoading: !1,
        isError: !1,
        isNew: !1,
        data: A,
        included: [],
        meta: W
      }, Promise.resolve(A);
    } catch (d) {
      return k && (h(R, "isError", !0), h(R, "isLoading", !1)), this.requestHashIds[c] = {
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
    }, r = U, n = this._pushRequestHash(
      i,
      r
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
    }, r = V, n = this._pushRequestHash(
      i,
      r
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
    }, i = U, r = this._pushRequestHash(
      t,
      i
    );
    return this._request(t), r;
  }
  findRecord(s, e, t = {}, i = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, n = V, l = this._pushRequestHash(
      r,
      n
    );
    return this._request(r), l;
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
  us as default
};
