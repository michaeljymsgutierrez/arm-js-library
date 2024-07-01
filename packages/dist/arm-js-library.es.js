import M from "axios";
import Z from "lodash";
import * as K from "mobx";
import { v1 as z } from "uuid";
import ss from "crypto-js";
const { makeObservable: es, observable: F, action: w, toJS: k } = K, {
  get: i,
  set: c,
  find: P,
  findIndex: R,
  isObject: ts,
  isArray: m,
  isPlainObject: y,
  isNumber: S,
  isNull: is,
  isNil: B,
  isEmpty: J,
  isEqual: _,
  gte: j,
  lt: U,
  flatMap: os,
  map: V,
  entries: as,
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
], rs = [
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
      _pushPayloadToCollection: w,
      _pushRequestHash: w,
      _addCollection: w,
      _addAlias: w
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
  _generateHashId(s = { id: z() }) {
    const e = JSON.stringify(s);
    return ss.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    c(this, s, e);
    const t = C(
      k(this.originalRecord),
      E
    ), o = C(k(this), E);
    _(t, o) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(l, n = "") {
      return os(as(l), ([u, r]) => {
        const h = n ? `${n}.${u}` : u;
        return ts(r) && !m(r) && r !== null ? e(r, h) : { key: h, value: r };
      });
    }
    const t = e(s);
    f(t, ({ key: l, value: n }) => c(this, l, n));
    const o = C(
      k(this.originalRecord),
      E
    ), a = C(k(this), E);
    _(o, a) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = x(this.aliases), t = i(s, "collectionName"), o = R(this.collections[t], {
      hashId: i(s, "hashId")
    });
    j(o, 0) && this.collections[t].splice(o, 1), f(e, (a) => {
      const l = m(this.aliases[a]), n = y(this.aliases[a]);
      if (l) {
        const u = R(this.aliases[a], {
          hashId: i(s, "hashId")
        });
        j(u, 0) && this.aliases[a].splice(u, 1);
      }
      n && _(
        i(s, "hashId"),
        i(this.aliases[a], "hashId")
      ) && (this.aliases[a] = {});
    });
  }
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = P(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = S(i(t, "id")), a = o ? i(t, "id") : null, r = {
      resourceMethod: o ? "put" : "post",
      resourceName: e,
      resourceId: a,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(r);
  }
  async _deleteRecord(s) {
    const e = i(s, "collectionName"), t = P(this.collections[e], {
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
    const e = i(s, "id"), a = {
      resourceMethod: "get",
      resourceName: i(s, "collectionName"),
      resourceId: e,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !0 }
    };
    return this._request(a);
  }
  _getCollectionRecord(s) {
    const e = i(s, "collectionName"), t = P(this.collections[e], {
      hashId: i(s, "hashId")
    });
    console.log(t);
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: () => this._getCollectionRecord(s)
    }, t = x(e);
    f(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = is(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: i(e, "collectionName")
    }) : t;
    c(e, "collectionName", s), c(e, "hashId", o), c(e, "isLoading", !1), c(e, "isError", !1), c(e, "isPristine", !0), c(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const t = m(e), o = y(e), a = x(this.aliases), l = x(this.requestHashIds);
    let n = null;
    if (t) {
      const u = V(e, "hashId");
      f(e, (r) => {
        const h = R(
          this.collections[s],
          {
            hashId: i(r, "hashId")
          }
        );
        this._injectActions(r), U(h, 0) && this.collections[s].push(r), j(h, 0) && (this.collections[s][h] = r);
      }), n = V(
        u,
        (r) => P(this.collections[s], {
          hashId: r
        })
      ), f(a, (r) => {
        const h = m(this.aliases[r]), g = y(this.aliases[r]);
        h && f(n, (I) => {
          const p = R(this.aliases[r], {
            hashId: i(I, "hashId")
          });
          j(p, 0) && (this.aliases[r][p] = I);
        }), g && f(n, (I) => {
          _(
            i(I, "hashId"),
            i(this.aliases[r], "hashId")
          ) && (this.aliases[r] = I);
        });
      });
    }
    if (o) {
      const u = e.hashId, r = R(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      this._injectActions(e), U(r, 0) && this.collections[s].push(e), j(r, 0) && (this.collections[s][r] = e), n = P(this.collections[s], {
        hashId: u
      }), f(a, (h) => {
        const g = m(this.aliases[h]), I = y(this.aliases[h]);
        g && f([n], (p) => {
          const q = R(this.aliases[h], {
            hashId: i(p, "hashId")
          });
          j(q, 0) && (this.aliases[h][q] = p);
        }), I && _(
          i(n, "hashId"),
          i(this.aliases[h], "hashId")
        ) && (this.aliases[h] = n);
      }), f(l, (h) => {
        const g = i(
          this.requestHashIds[h],
          "data"
        ), I = m(g), p = y(g);
        I && f([n], (q) => {
          const N = R(
            i(this.requestHashIds[h], "data"),
            {
              hashId: i(q, "hashId")
            }
          );
          j(N, 0) && (this.requestHashIds[h][N] = q);
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
    const t = this._generateHashId(s), o = !B(this.requestHashIds[t]), a = i(e, "isNew");
    return o && a ? c(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
    return c(e, "id", z()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), P(this.collections[s], {
      hashId: i(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: o,
    resourcePayload: a,
    resourceFallback: l,
    resourceConfig: n
  }) {
    var T, $, v;
    const u = {
      method: s,
      url: e
    }, r = this._generateHashId({ ...arguments[0] }), h = i(n, "skip") || !1, g = _(s, "get"), I = _(s, "delete"), p = _(s, "post"), q = S(t), N = !J(o), D = !J(a), A = i(a, "data") || null;
    if (q && c(u, "url", `${e}/${t}`), N && c(u, "params", o), D) {
      const d = {
        data: C(A, rs)
      };
      c(u, "data", d);
    }
    if (g && !h) {
      const d = this.requestHashIds[r], b = !B(d), L = i(d, "isNew");
      if (b && !L) return;
    }
    D && c(A, "isLoading", !0);
    try {
      const d = await M(u), b = ((T = d == null ? void 0 : d.data) == null ? void 0 : T.data) || l, L = (($ = d == null ? void 0 : d.data) == null ? void 0 : $.included) || [], W = ((v = d == null ? void 0 : d.data) == null ? void 0 : v.meta) || {}, X = y(b), Y = m(b);
      let O = null;
      return Y && f(
        b,
        (H) => this._injectReferenceKeys(e, H)
      ), X && this._injectReferenceKeys(e, b), f(L, (H) => {
        this._injectReferenceKeys(
          i(H, this.payloadIncludedReference),
          H
        ), this._pushPayloadToCollection(
          i(H, "collectionName"),
          H
        );
      }), O = await this._pushPayloadToCollection(
        e,
        b
      ), n.alias && this._addAlias(
        i(n, "alias"),
        O
      ), p && this.unloadRecord(A), I && this.unloadRecord(O), this.requestHashIds[r] = {
        isLoading: !1,
        isError: !1,
        isNew: !1,
        data: O,
        included: [],
        meta: W
      }, Promise.resolve(O);
    } catch (d) {
      return D && (c(A, "isError", !0), c(A, "isLoading", !1)), this.requestHashIds[r] = {
        isLoading: !1,
        isError: !0,
        isNew: !1,
        data: d,
        included: [],
        meta: {}
      }, Promise.reject(d);
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
    }, a = G, l = this._pushRequestHash(
      o,
      a
    );
    return this._request(o), l;
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
    }, a = Q, l = this._pushRequestHash(
      o,
      a
    );
    return this._request(o), l;
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
    }, o = G, a = this._pushRequestHash(
      t,
      o
    );
    return this._request(t), a;
  }
  findRecord(s, e, t = {}, o = {}) {
    const a = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: o
    }, l = Q, n = this._pushRequestHash(
      a,
      l
    );
    return this._request(a), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return P(this.collections[s], {
      id: e
    });
  }
}
export {
  us as default
};
