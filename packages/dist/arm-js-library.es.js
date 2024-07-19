import T from "axios";
import is from "lodash";
import * as rs from "mobx";
import { v1 as $, NIL as os } from "uuid";
import as from "crypto-js";
const { makeObservable: ns, observable: x, action: N, toJS: F } = rs, {
  get: o,
  set: h,
  find: g,
  findIndex: q,
  isObject: hs,
  isArray: _,
  isPlainObject: I,
  isNumber: z,
  isNull: X,
  isNil: b,
  isEmpty: A,
  isEqual: p,
  gte: m,
  gt: cs,
  lte: ds,
  lt: v,
  flatMap: us,
  map: Y,
  entries: ls,
  forEach: u,
  keysIn: O,
  omit: C
} = is, Z = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, B = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, E = [
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
], fs = [
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
class ms {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), ns(this, {
      collections: x,
      aliases: x,
      requestHashIds: x,
      _pushPayload: N,
      _pushRequestHash: N,
      _addCollection: N,
      _addAlias: N
    });
  }
  _initializeAxiosConfig() {
    T.defaults.baseURL = this._getBaseURL();
  }
  _initializeCollections(s) {
    u(s, (e) => this._addCollection(e, []));
  }
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem("token")}`;
  }
  _isCollectionExisting(s) {
    if (b(o(this.collections, s)))
      throw `Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`;
  }
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const t = _(e), r = I(e);
    t && (this.aliases[s] = e || []), r && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: $() }) {
    const e = JSON.stringify(s);
    return as.MD5(e).toString();
  }
  _getProperty(s) {
    return o(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = C(
      F(this.originalRecord),
      E
    ), r = C(F(this), E);
    p(t, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return us(ls(a), ([d, c]) => {
        const f = n ? `${n}.${d}` : d;
        return hs(c) && !_(c) && c !== null ? e(c, f) : { key: f, value: c };
      });
    }
    const t = e(s);
    u(t, ({ key: a, value: n }) => h(this, a, n));
    const r = C(
      F(this.originalRecord),
      E
    ), i = C(F(this), E);
    p(r, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _unloadFromCollection(s) {
    const e = o(s, "collectionName"), t = q(this.collections[e], {
      hashId: o(s, "hashId")
    });
    m(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = O(this.requestHashIds);
    u(e, (t) => {
      const r = o(
        this.requestHashIds[t],
        "data"
      ), i = _(r), a = I(r);
      if (i) {
        const n = q(
          o(this.requestHashIds[t], "data"),
          {
            hashId: o(s, "hashId")
          }
        );
        m(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      a && p(
        o(s, "hashId"),
        o(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = O(this.aliases);
    u(e, (t) => {
      const r = _(this.aliases[t]), i = I(this.aliases[t]);
      if (r) {
        const a = q(this.aliases[t], {
          hashId: o(s, "hashId")
        });
        m(a, 0) && this.aliases[t].splice(a, 1);
      }
      i && p(
        o(s, "hashId"),
        o(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  _saveRecord(s) {
    const e = o(s, "collectionName"), t = g(this.collections[e], {
      hashId: o(s, "hashId")
    }), r = z(o(t, "id")), i = r ? o(t, "id") : null, c = {
      resourceMethod: r ? "put" : "post",
      resourceName: e,
      resourceId: i,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(c);
  }
  async _deleteRecord(s) {
    const e = o(s, "collectionName"), t = g(this.collections[e], {
      hashId: o(s, "hashId")
    }), r = o(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: o(t, "collectionName"),
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = o(s, "id"), i = {
      resourceMethod: "get",
      resourceName: o(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: $() }
    };
    return this._request(i);
  }
  _getCollectionRecord(s, e = {}, t) {
    const r = o(e, "referenceKey") || "", i = o(e, "async") || !1, a = o(t, r) || [], d = I(
      a
    ) ? [a] : a, c = x([]);
    return u(d, (f) => {
      const y = this._generateHashId({
        id: o(f, "id"),
        collectionName: s
      }), w = g(this.collections[s], {
        hashId: y
      });
      if (!A(w))
        c.push(w);
      else if (i) {
        const k = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: o(f, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, D = B;
        this._pushRequestHash(k, D), this._request(k);
      }
    }), c;
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: (r, i) => this._getCollectionRecord(
        r,
        i,
        s
      )
    }, t = O(e);
    u(t, (r) => {
      s[r] = e[r];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const r = X(t) ? this._generateHashId({
      id: o(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", r), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), r = I(e);
    if (t) {
      const i = Y(e, "hashId");
      return u(e, (a) => {
        const n = q(
          this.collections[s],
          {
            hashId: o(a, "hashId")
          }
        );
        this._injectActions(a), v(n, 0) && this.collections[s].push(a), m(n, 0) && (this.collections[s][n] = a);
      }), Y(
        i,
        (a) => g(this.collections[s], {
          hashId: a
        })
      );
    }
    if (r) {
      const i = e.hashId, a = q(
        this.collections[s],
        {
          hashId: o(e, "hashId")
        }
      );
      return this._injectActions(e), v(a, 0) && this.collections[s].push(e), m(a, 0) && (this.collections[s][a] = e), g(this.collections[s], {
        hashId: i
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = I(s), r = O(this.aliases);
    e && u(r, (i) => {
      const a = _(this.aliases[i]), n = I(this.aliases[i]);
      a && u(s, (d) => {
        const c = q(this.aliases[i], {
          hashId: o(d, "hashId")
        });
        m(c, 0) && (this.aliases[i][c] = d);
      }), n && u(s, (d) => {
        p(
          o(d, "hashId"),
          o(this.aliases[i], "hashId")
        ) && (this.aliases[i] = d);
      });
    }), t && u(r, (i) => {
      const a = _(this.aliases[i]), n = I(this.aliases[i]);
      a && u([s], (d) => {
        const c = q(this.aliases[i], {
          hashId: o(d, "hashId")
        });
        m(c, 0) && (this.aliases[i][c] = d);
      }), n && p(
        o(s, "hashId"),
        o(this.aliases[i], "hashId")
      ) && (this.aliases[i] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = O(this.requestHashIds), t = _(s), r = I(s);
    let i = null;
    t && (i = s), r && (i = [s]), u(e, (a) => {
      const n = o(
        this.requestHashIds[a],
        "data"
      ), d = _(n), c = I(n);
      u(i, (f) => {
        if (d) {
          const y = q(
            o(this.requestHashIds[a], "data"),
            {
              hashId: o(f, "hashId")
            }
          );
          m(y, 0) && (this.requestHashIds[a].data[y] = f);
        }
        c && p(
          o(f, "hashId"),
          o(this.requestHashIds[a], "data.hashId")
        ) && h(
          this.requestHashIds[a],
          "data",
          f
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
    const t = this._generateHashId(s), r = !b(this.requestHashIds[t]), i = o(e, "isNew");
    return r && i ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    T.defaults.headers.common[`${s}`] = e;
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
    const r = t ? $() : os, i = b(
      g(this.collections[s], {
        id: r
      })
    );
    return h(e, "id", r), this._injectReferenceKeys(s, e), this._injectActions(e), i && this.collections[s].push(e), g(this.collections[s], {
      id: r
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: r,
    resourcePayload: i,
    resourceFallback: a,
    resourceConfig: n
  }) {
    var V, Q, W;
    const d = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), f = p(s, "get"), y = p(s, "delete"), w = p(s, "post"), k = z(t), D = !A(r), L = !A(i), H = o(i, "data") || null;
    if (k && h(d, "url", `${e}/${t}`), D && h(d, "params", r), L) {
      const l = {
        data: C(H, fs)
      };
      h(d, "data", l);
    }
    const M = !b(o(n, "skip")), S = p(o(n, "skip"), !0), G = this.requestHashIds[c], J = !b(G), U = o(G, "isNew");
    if (!(f && (M && S || !M && J && !U || M && !S && J && !U))) {
      L && h(H, "isLoading", !0);
      try {
        const l = await T(d), j = ((V = l == null ? void 0 : l.data) == null ? void 0 : V.data) || a, K = ((Q = l == null ? void 0 : l.data) == null ? void 0 : Q.included) || [], ss = ((W = l == null ? void 0 : l.data) == null ? void 0 : W.meta) || {}, es = I(j), ts = _(j);
        let P = null;
        return ts && u(
          j,
          (R) => this._injectReferenceKeys(e, R)
        ), es && this._injectReferenceKeys(e, j), u(K, (R) => {
          this._injectReferenceKeys(
            o(R, this.payloadIncludedReference),
            R
          ), this._pushPayload(
            o(R, "collectionName"),
            R
          );
        }), P = await this._pushPayload(
          e,
          j
        ), n.alias && this._addAlias(
          o(n, "alias"),
          P
        ), w && this.unloadRecord(H), y && this.unloadRecord(P), this.requestHashIds[c] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: P,
          included: [],
          meta: ss
        }, Promise.resolve(P);
      } catch (l) {
        return L && (h(H, "isError", !0), h(H, "isLoading", !1)), this.requestHashIds[c] = {
          isLoading: !1,
          isError: !0,
          isNew: !1,
          data: l,
          included: [],
          meta: {}
        }, Promise.reject(l);
      }
    }
  }
  query(s, e = {}, t = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, i = Z, a = this._pushRequestHash(
      r,
      i
    );
    return this._request(r), a;
  }
  queryRecord(s, e = {}, t = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: t
    }, i = B, a = this._pushRequestHash(
      r,
      i
    );
    return this._request(r), a;
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
    }, r = Z, i = this._pushRequestHash(
      t,
      r
    );
    return this._request(t), i;
  }
  findRecord(s, e, t = {}, r = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: r
    }, a = B, n = this._pushRequestHash(
      i,
      a
    );
    return this._request(i), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return g(this.collections[s], {
      id: e
    });
  }
  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(s, e = {}) {
    return g(s, e);
  }
  findIndexBy(s, e = {}) {
    return q(s, e);
  }
  isEmpty(s) {
    return A(s);
  }
  isPresent(s) {
    return !A(s);
  }
  isEqual(s, e) {
    return p(s, e);
  }
  isNumber(s) {
    return z(s);
  }
  isNil(s) {
    return b(s);
  }
  isNull(s) {
    return X(s);
  }
  isGte(s, e) {
    return m(s, e);
  }
  isGt(s, e) {
    return cs(s, e);
  }
  isLte(s, e) {
    return ds(s, e);
  }
  isLt(s, e) {
    return v(s, e);
  }
}
export {
  ms as default
};
