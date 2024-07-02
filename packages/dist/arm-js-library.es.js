import M from "axios";
import Z from "lodash";
import * as K from "mobx";
import { v1 as z } from "uuid";
import ss from "crypto-js";
const { makeObservable: es, observable: F, action: N, toJS: k } = K, {
  get: t,
  set: c,
  find: H,
  findIndex: R,
  isObject: ts,
  isArray: m,
  isPlainObject: y,
  isNumber: S,
  isNull: is,
  isNil: B,
  isEmpty: J,
  isEqual: _,
  gte: P,
  lt: U,
  flatMap: as,
  map: V,
  entries: os,
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
      _pushPayloadToCollection: N,
      _pushRequestHash: N,
      _addCollection: N,
      _addAlias: N
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
    const i = m(e), a = y(e);
    i && (this.aliases[s] = e || []), a && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: z() }) {
    const e = JSON.stringify(s);
    return ss.MD5(e).toString();
  }
  _getProperty(s) {
    return t(this, s);
  }
  _setProperty(s, e) {
    c(this, s, e);
    const i = C(
      k(this.originalRecord),
      E
    ), a = C(k(this), E);
    _(i, a) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, n = "") {
      return as(os(d), ([u, r]) => {
        const h = n ? `${n}.${u}` : u;
        return ts(r) && !m(r) && r !== null ? e(r, h) : { key: h, value: r };
      });
    }
    const i = e(s);
    f(i, ({ key: d, value: n }) => c(this, d, n));
    const a = C(
      k(this.originalRecord),
      E
    ), o = C(k(this), E);
    _(a, o) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = x(this.aliases), i = t(s, "collectionName"), a = R(this.collections[i], {
      hashId: t(s, "hashId")
    });
    P(a, 0) && this.collections[i].splice(a, 1), f(e, (o) => {
      const d = m(this.aliases[o]), n = y(this.aliases[o]);
      if (d) {
        const u = R(this.aliases[o], {
          hashId: t(s, "hashId")
        });
        P(u, 0) && this.aliases[o].splice(u, 1);
      }
      n && _(
        t(s, "hashId"),
        t(this.aliases[o], "hashId")
      ) && (this.aliases[o] = {});
    });
  }
  _saveRecord(s) {
    const e = t(s, "collectionName"), i = H(this.collections[e], {
      hashId: t(s, "hashId")
    }), a = S(t(i, "id")), o = a ? t(i, "id") : null, r = {
      resourceMethod: a ? "put" : "post",
      resourceName: e,
      resourceId: o,
      resourceParams: {},
      resourcePayload: { data: i },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(r);
  }
  async _deleteRecord(s) {
    const e = t(s, "collectionName"), i = H(this.collections[e], {
      hashId: t(s, "hashId")
    }), a = t(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: t(i, "collectionName"),
      resourceId: a,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = t(s, "id"), o = {
      resourceMethod: "get",
      resourceName: t(s, "collectionName"),
      resourceId: e,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !0 }
    };
    return this._request(o);
  }
  _getCollectionRecord(s, e = {}, i) {
    t(
      i,
      "collectionName"
    );
    const a = t(e, "referenceKey") || "";
    t(e, "async");
    const o = t(i, a) || [];
    f(o, (d) => {
      this._generateHashId({
        id: t(d, "id"),
        collectionName: s
      }), console.log({
        id: t(d, "id"),
        collectionName: s
      });
    });
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: (a, o) => this._getCollectionRecord(
        a,
        o,
        s
      )
    }, i = x(e);
    f(i, (a) => {
      s[a] = e[a];
    });
  }
  _injectReferenceKeys(s, e, i = null) {
    const a = is(i) ? this._generateHashId({
      id: t(e, "id"),
      collectionName: s
    }) : i;
    c(e, "collectionName", s), c(e, "hashId", a), c(e, "isLoading", !1), c(e, "isError", !1), c(e, "isPristine", !0), c(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const i = m(e), a = y(e), o = x(this.aliases), d = x(this.requestHashIds);
    let n = null;
    if (i) {
      const u = V(e, "hashId");
      f(e, (r) => {
        const h = R(
          this.collections[s],
          {
            hashId: t(r, "hashId")
          }
        );
        this._injectActions(r), U(h, 0) && this.collections[s].push(r), P(h, 0) && (this.collections[s][h] = r);
      }), n = V(
        u,
        (r) => H(this.collections[s], {
          hashId: r
        })
      ), f(o, (r) => {
        const h = m(this.aliases[r]), g = y(this.aliases[r]);
        h && f(n, (I) => {
          const p = R(this.aliases[r], {
            hashId: t(I, "hashId")
          });
          P(p, 0) && (this.aliases[r][p] = I);
        }), g && f(n, (I) => {
          _(
            t(I, "hashId"),
            t(this.aliases[r], "hashId")
          ) && (this.aliases[r] = I);
        });
      });
    }
    if (a) {
      const u = e.hashId, r = R(
        this.collections[s],
        {
          hashId: t(e, "hashId")
        }
      );
      this._injectActions(e), U(r, 0) && this.collections[s].push(e), P(r, 0) && (this.collections[s][r] = e), n = H(this.collections[s], {
        hashId: u
      }), f(o, (h) => {
        const g = m(this.aliases[h]), I = y(this.aliases[h]);
        g && f([n], (p) => {
          const q = R(this.aliases[h], {
            hashId: t(p, "hashId")
          });
          P(q, 0) && (this.aliases[h][q] = p);
        }), I && _(
          t(n, "hashId"),
          t(this.aliases[h], "hashId")
        ) && (this.aliases[h] = n);
      }), f(d, (h) => {
        const g = t(
          this.requestHashIds[h],
          "data"
        ), I = m(g), p = y(g);
        I && f([n], (q) => {
          const w = R(
            t(this.requestHashIds[h], "data"),
            {
              hashId: t(q, "hashId")
            }
          );
          P(w, 0) && (this.requestHashIds[h][w] = q);
        }), p && _(
          t(n, "hashId"),
          t(this.requestHashIds[h], "data.hashId")
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
    const i = this._generateHashId(s), a = !B(this.requestHashIds[i]), o = t(e, "isNew");
    return a && o ? c(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
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
    return c(e, "id", z()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), H(this.collections[s], {
      hashId: t(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: i,
    resourceParams: a,
    resourcePayload: o,
    resourceFallback: d,
    resourceConfig: n
  }) {
    var T, $, v;
    const u = {
      method: s,
      url: e
    }, r = this._generateHashId({ ...arguments[0] }), h = t(n, "skip") || !1, g = _(s, "get"), I = _(s, "delete"), p = _(s, "post"), q = S(i), w = !J(a), D = !J(o), A = t(o, "data") || null;
    if (q && c(u, "url", `${e}/${i}`), w && c(u, "params", a), D) {
      const l = {
        data: C(A, rs)
      };
      c(u, "data", l);
    }
    if (g && !h) {
      const l = this.requestHashIds[r], b = !B(l), L = t(l, "isNew");
      if (b && !L) return;
    }
    D && c(A, "isLoading", !0);
    try {
      const l = await M(u), b = ((T = l == null ? void 0 : l.data) == null ? void 0 : T.data) || d, L = (($ = l == null ? void 0 : l.data) == null ? void 0 : $.included) || [], W = ((v = l == null ? void 0 : l.data) == null ? void 0 : v.meta) || {}, X = y(b), Y = m(b);
      let O = null;
      return Y && f(
        b,
        (j) => this._injectReferenceKeys(e, j)
      ), X && this._injectReferenceKeys(e, b), f(L, (j) => {
        this._injectReferenceKeys(
          t(j, this.payloadIncludedReference),
          j
        ), this._pushPayloadToCollection(
          t(j, "collectionName"),
          j
        );
      }), O = await this._pushPayloadToCollection(
        e,
        b
      ), n.alias && this._addAlias(
        t(n, "alias"),
        O
      ), p && this.unloadRecord(A), I && this.unloadRecord(O), this.requestHashIds[r] = {
        isLoading: !1,
        isError: !1,
        isNew: !1,
        data: O,
        included: [],
        meta: W
      }, Promise.resolve(O);
    } catch (l) {
      return D && (c(A, "isError", !0), c(A, "isLoading", !1)), this.requestHashIds[r] = {
        isLoading: !1,
        isError: !0,
        isNew: !1,
        data: l,
        included: [],
        meta: {}
      }, Promise.reject(l);
    }
  }
  query(s, e = {}, i = {}) {
    const a = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: i
    }, o = G, d = this._pushRequestHash(
      a,
      o
    );
    return this._request(a), d;
  }
  queryRecord(s, e = {}, i = {}) {
    const a = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, o = Q, d = this._pushRequestHash(
      a,
      o
    );
    return this._request(a), d;
  }
  findAll(s, e = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: null,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: e
    }, a = G, o = this._pushRequestHash(
      i,
      a
    );
    return this._request(i), o;
  }
  findRecord(s, e, i = {}, a = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: i,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: a
    }, d = Q, n = this._pushRequestHash(
      o,
      d
    );
    return this._request(o), n;
  }
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
