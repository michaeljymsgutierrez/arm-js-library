import F from "axios";
import K from "lodash";
import * as ss from "mobx";
import { v1 as B } from "uuid";
import es from "crypto-js";
const { makeObservable: ts, observable: k, action: N, toJS: x } = ss, {
  get: i,
  set: c,
  find: b,
  findIndex: P,
  isObject: is,
  isArray: m,
  isPlainObject: y,
  isNumber: J,
  isNull: os,
  isNil: T,
  isEmpty: $,
  isEqual: _,
  gte: j,
  lt: U,
  flatMap: rs,
  map: V,
  entries: as,
  forEach: f,
  keysIn: E,
  omit: C
} = K, G = {
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
], ns = [
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
class fs {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = window.location.origin, this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), ts(this, {
      collections: k,
      aliases: k,
      requestHashIds: k,
      _pushPayloadToCollection: N,
      _pushRequestHash: N,
      _addCollection: N,
      _addAlias: N
    });
  }
  _initializeAxiosConfig() {
    F.defaults.baseURL = this._getBaseURL();
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
  _generateHashId(s = { id: B() }) {
    const e = JSON.stringify(s);
    return es.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    c(this, s, e);
    const t = C(
      x(this.originalRecord),
      D
    ), o = C(x(this), D);
    _(t, o) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, n = "") {
      return rs(as(d), ([l, a]) => {
        const h = n ? `${n}.${l}` : l;
        return is(a) && !m(a) && a !== null ? e(a, h) : { key: h, value: a };
      });
    }
    const t = e(s);
    f(t, ({ key: d, value: n }) => c(this, d, n));
    const o = C(
      x(this.originalRecord),
      D
    ), r = C(x(this), D);
    _(o, r) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = E(this.aliases), t = i(s, "collectionName"), o = P(this.collections[t], {
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
    }), o = J(i(t, "id")), r = o ? i(t, "id") : null, a = {
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
      resourceConfig: { skip: !1 }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(t, o) || [], d = k([]);
    return f(r, (n) => {
      const l = this._generateHashId({
        id: i(n, "id"),
        collectionName: s
      }), a = b(this.collections[s], {
        hashId: l
      });
      $(a) || d.push(a);
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
    }, t = E(e);
    f(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = os(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    c(e, "collectionName", s), c(e, "hashId", o), c(e, "isLoading", !1), c(e, "isError", !1), c(e, "isPristine", !0), c(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const t = m(e), o = y(e), r = E(this.aliases), d = E(this.requestHashIds);
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
        const h = m(this.aliases[a]), p = y(this.aliases[a]);
        h && f(n, (I) => {
          const g = P(this.aliases[a], {
            hashId: i(I, "hashId")
          });
          j(g, 0) && (this.aliases[a][g] = I);
        }), p && f(n, (I) => {
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
        const p = m(this.aliases[h]), I = y(this.aliases[h]);
        p && f([n], (g) => {
          const q = P(this.aliases[h], {
            hashId: i(g, "hashId")
          });
          j(q, 0) && (this.aliases[h][q] = g);
        }), I && _(
          i(n, "hashId"),
          i(this.aliases[h], "hashId")
        ) && (this.aliases[h] = n);
      }), f(d, (h) => {
        const p = i(
          this.requestHashIds[h],
          "data"
        ), I = m(p), g = y(p);
        I && f([n], (q) => {
          const w = P(
            i(this.requestHashIds[h], "data"),
            {
              hashId: i(q, "hashId")
            }
          );
          j(w, 0) && (this.requestHashIds[h].data[w] = q);
        }), g && _(
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
    const t = this._generateHashId(s), o = !T(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? c(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    F.defaults.headers.common[`${s}`] = e;
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
    return c(e, "id", B()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), b(this.collections[s], {
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
    var v, z, S;
    const l = {
      method: s,
      url: e
    }, a = this._generateHashId({ ...arguments[0] }), h = i(n, "skip"), p = !T(h), I = _(s, "get"), g = _(s, "delete"), q = _(s, "post"), w = J(t), W = !$(o), L = !$(r), A = i(r, "data") || null;
    if (w && c(l, "url", `${e}/${t}`), W && c(l, "params", o), L) {
      const u = {
        data: C(A, ns)
      };
      c(l, "data", u);
    }
    if (I && !p) {
      const u = this.requestHashIds[a], R = !T(u), M = i(u, "isNew");
      if (R && !M) return;
    }
    if (!(p && h)) {
      L && c(A, "isLoading", !0);
      try {
        const u = await F(l), R = ((v = u == null ? void 0 : u.data) == null ? void 0 : v.data) || d, M = ((z = u == null ? void 0 : u.data) == null ? void 0 : z.included) || [], X = ((S = u == null ? void 0 : u.data) == null ? void 0 : S.meta) || {}, Y = y(R), Z = m(R);
        let O = null;
        return Z && f(
          R,
          (H) => this._injectReferenceKeys(e, H)
        ), Y && this._injectReferenceKeys(e, R), f(M, (H) => {
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
        ), q && this.unloadRecord(A), g && this.unloadRecord(O), this.requestHashIds[a] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: O,
          included: [],
          meta: X
        }, Promise.resolve(O);
      } catch (u) {
        return L && (c(A, "isError", !0), c(A, "isLoading", !1)), this.requestHashIds[a] = {
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
  fs as default
};
