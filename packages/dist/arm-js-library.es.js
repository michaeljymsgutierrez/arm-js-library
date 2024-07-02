import M from "axios";
import Z from "lodash";
import * as K from "mobx";
import { v1 as S } from "uuid";
import ss from "crypto-js";
const { makeObservable: es, observable: F, action: k, toJS: N } = K, {
  get: i,
  set: c,
  find: b,
  findIndex: P,
  isObject: ts,
  isArray: m,
  isPlainObject: y,
  isNumber: B,
  isNull: is,
  isNil: J,
  isEmpty: T,
  isEqual: _,
  gte: j,
  lt: U,
  flatMap: os,
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
      collections: F,
      aliases: F,
      requestHashIds: F,
      _pushPayloadToCollection: k,
      _pushRequestHash: k,
      _addCollection: k,
      _addAlias: k
    });
  }
  _initializeAxiosConfig() {
    M.defaults.baseURL = this._getBaseURL();
  }
  _initializeCollections(s) {
    f(s, (e) => this._addCollection(e, []));
  }
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem("token")}`;
  }
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const t = m(e), o = y(e);
    t && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: S() }) {
    const e = JSON.stringify(s);
    return ss.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    c(this, s, e);
    const t = C(
      N(this.originalRecord),
      E
    ), o = C(N(this), E);
    _(t, o) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, n = "") {
      return os(rs(d), ([l, a]) => {
        const h = n ? `${n}.${l}` : l;
        return ts(a) && !m(a) && a !== null ? e(a, h) : { key: h, value: a };
      });
    }
    const t = e(s);
    f(t, ({ key: d, value: n }) => c(this, d, n));
    const o = C(
      N(this.originalRecord),
      E
    ), r = C(N(this), E);
    _(o, r) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = x(this.aliases), t = i(s, "collectionName"), o = P(this.collections[t], {
      hashId: i(s, "hashId")
    });
    j(o, 0) && this.collections[t].splice(o, 1), f(e, (r) => {
      const d = m(this.aliases[r]), n = y(this.aliases[r]);
      if (d) {
        const l = P(this.aliases[r], {
          hashId: i(s, "hashId")
        });
        j(l, 0) && this.aliases[r].splice(l, 1);
      }
      n && _(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = {});
    });
  }
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = b(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = B(i(t, "id")), r = o ? i(t, "id") : null, a = {
      resourceMethod: o ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(a);
  }
  async _deleteRecord(s) {
    const e = i(s, "collectionName"), t = b(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = i(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: i(t, "collectionName"),
      resourceId: o,
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
      resourceId: e,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !0 }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(t, o) || [], d = [];
    return f(r, (n) => {
      const l = this._generateHashId({
        id: i(n, "id"),
        collectionName: s
      }), a = b(this.collections[s], {
        hashId: l
      });
      T(a) || d.push(a);
    }), d;
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
    f(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = is(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    c(e, "collectionName", s), c(e, "hashId", o), c(e, "isLoading", !1), c(e, "isError", !1), c(e, "isPristine", !0), c(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const t = m(e), o = y(e), r = x(this.aliases), d = x(this.requestHashIds);
    let n = null;
    if (t) {
      const l = V(e, "hashId");
      f(e, (a) => {
        const h = P(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectActions(a), U(h, 0) && this.collections[s].push(a), j(h, 0) && (this.collections[s][h] = a);
      }), n = V(
        l,
        (a) => b(this.collections[s], {
          hashId: a
        })
      ), f(r, (a) => {
        const h = m(this.aliases[a]), g = y(this.aliases[a]);
        h && f(n, (I) => {
          const p = P(this.aliases[a], {
            hashId: i(I, "hashId")
          });
          j(p, 0) && (this.aliases[a][p] = I);
        }), g && f(n, (I) => {
          _(
            i(I, "hashId"),
            i(this.aliases[a], "hashId")
          ) && (this.aliases[a] = I);
        });
      });
    }
    if (o) {
      const l = e.hashId, a = P(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      this._injectActions(e), U(a, 0) && this.collections[s].push(e), j(a, 0) && (this.collections[s][a] = e), n = b(this.collections[s], {
        hashId: l
      }), f(r, (h) => {
        const g = m(this.aliases[h]), I = y(this.aliases[h]);
        g && f([n], (p) => {
          const q = P(this.aliases[h], {
            hashId: i(p, "hashId")
          });
          j(q, 0) && (this.aliases[h][q] = p);
        }), I && _(
          i(n, "hashId"),
          i(this.aliases[h], "hashId")
        ) && (this.aliases[h] = n);
      }), f(d, (h) => {
        const g = i(
          this.requestHashIds[h],
          "data"
        ), I = m(g), p = y(g);
        I && f([n], (q) => {
          const w = P(
            i(this.requestHashIds[h], "data"),
            {
              hashId: i(q, "hashId")
            }
          );
          j(w, 0) && (this.requestHashIds[h].data[w] = q);
        }), p && _(
          i(n, "hashId"),
          i(this.requestHashIds[h], "data.hashId")
        ) && c(
          this.requestHashIds[h],
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
    const t = this._generateHashId(s), o = !J(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? c(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
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
    return c(e, "id", S()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), b(this.collections[s], {
      hashId: i(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: o,
    resourcePayload: r,
    resourceFallback: d,
    resourceConfig: n
  }) {
    var $, v, z;
    const l = {
      method: s,
      url: e
    }, a = this._generateHashId({ ...arguments[0] }), h = i(n, "skip") || !1, g = _(s, "get"), I = _(s, "delete"), p = _(s, "post"), q = B(t), w = !T(o), D = !T(r), A = i(r, "data") || null;
    if (q && c(l, "url", `${e}/${t}`), w && c(l, "params", o), D) {
      const u = {
        data: C(A, as)
      };
      c(l, "data", u);
    }
    if (g && !h) {
      const u = this.requestHashIds[a], R = !J(u), L = i(u, "isNew");
      if (R && !L) return;
    }
    D && c(A, "isLoading", !0);
    try {
      const u = await M(l), R = (($ = u == null ? void 0 : u.data) == null ? void 0 : $.data) || d, L = ((v = u == null ? void 0 : u.data) == null ? void 0 : v.included) || [], W = ((z = u == null ? void 0 : u.data) == null ? void 0 : z.meta) || {}, X = y(R), Y = m(R);
      let O = null;
      return Y && f(
        R,
        (H) => this._injectReferenceKeys(e, H)
      ), X && this._injectReferenceKeys(e, R), f(L, (H) => {
        this._injectReferenceKeys(
          i(H, this.payloadIncludedReference),
          H
        ), this._pushPayloadToCollection(
          i(H, "collectionName"),
          H
        );
      }), O = await this._pushPayloadToCollection(
        e,
        R
      ), n.alias && this._addAlias(
        i(n, "alias"),
        O
      ), p && this.unloadRecord(A), I && this.unloadRecord(O), this.requestHashIds[a] = {
        isLoading: !1,
        isError: !1,
        isNew: !1,
        data: O,
        included: [],
        meta: W
      }, Promise.resolve(O);
    } catch (u) {
      return D && (c(A, "isError", !0), c(A, "isLoading", !1)), this.requestHashIds[a] = {
        isLoading: !1,
        isError: !0,
        isNew: !1,
        data: u,
        included: [],
        meta: {}
      }, Promise.reject(u);
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
    }, r = G, d = this._pushRequestHash(
      o,
      r
    );
    return this._request(o), d;
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
    }, r = Q, d = this._pushRequestHash(
      o,
      r
    );
    return this._request(o), d;
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
    }, o = G, r = this._pushRequestHash(
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
    }, d = Q, n = this._pushRequestHash(
      r,
      d
    );
    return this._request(r), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return b(this.collections[s], {
      id: e
    });
  }
}
export {
  us as default
};
