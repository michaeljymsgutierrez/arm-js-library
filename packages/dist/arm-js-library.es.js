import B from "axios";
import os from "lodash";
import * as as from "mobx";
import { v1 as z, NIL as ns } from "uuid";
import hs from "crypto-js";
const { makeObservable: cs, observable: k, action: x, toJS: E } = as, {
  get: r,
  set: h,
  find: g,
  findIndex: m,
  isObject: ds,
  isArray: _,
  isPlainObject: I,
  isNumber: S,
  isString: us,
  isNull: K,
  isNil: q,
  isEmpty: P,
  isEqual: p,
  gte: y,
  gt: ls,
  lte: fs,
  lt: U,
  flatMap: Is,
  map: F,
  entries: ps,
  forEach: l,
  filter: _s,
  keysIn: O,
  omit: C,
  first: ss,
  last: gs,
  orderBy: ms
} = os, es = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, G = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, L = [
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
], qs = [
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
class As {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), cs(this, {
      collections: k,
      aliases: k,
      requestHashIds: k,
      _pushPayload: x,
      _pushRequestHash: x,
      _addCollection: x,
      _addAlias: x
    });
  }
  _initializeAxiosConfig() {
    B.defaults.baseURL = this._getBaseURL();
  }
  _initializeCollections(s) {
    l(s, (e) => this._addCollection(e, []));
  }
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  _getAuthorizationToken() {
    return `Token ${window.localStorage.getItem("token")}`;
  }
  _isCollectionExisting(s) {
    if (q(r(this.collections, s)))
      throw `Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`;
  }
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const t = _(e), o = I(e);
    t && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: z() }) {
    const e = JSON.stringify(s);
    return hs.MD5(e).toString();
  }
  _getProperty(s) {
    return r(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = C(
      E(this.originalRecord),
      L
    ), o = C(E(this), L);
    p(t, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return Is(ps(a), ([d, c]) => {
        const f = n ? `${n}.${d}` : d;
        return ds(c) && !_(c) && c !== null ? e(c, f) : { key: f, value: c };
      });
    }
    const t = e(s);
    l(t, ({ key: a, value: n }) => h(this, a, n));
    const o = C(
      E(this.originalRecord),
      L
    ), i = C(E(this), L);
    p(o, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _unloadFromCollection(s) {
    const e = r(s, "collectionName"), t = m(this.collections[e], {
      hashId: r(s, "hashId")
    });
    y(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = O(this.requestHashIds);
    l(e, (t) => {
      const o = r(
        this.requestHashIds[t],
        "data"
      ), i = _(o), a = I(o);
      if (i) {
        const n = m(
          r(this.requestHashIds[t], "data"),
          {
            hashId: r(s, "hashId")
          }
        );
        y(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      a && p(
        r(s, "hashId"),
        r(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = O(this.aliases);
    l(e, (t) => {
      const o = _(this.aliases[t]), i = I(this.aliases[t]);
      if (o) {
        const a = m(this.aliases[t], {
          hashId: r(s, "hashId")
        });
        y(a, 0) && this.aliases[t].splice(a, 1);
      }
      i && p(
        r(s, "hashId"),
        r(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  _saveRecord(s) {
    const e = r(s, "collectionName"), t = g(this.collections[e], {
      hashId: r(s, "hashId")
    }), o = S(r(t, "id")), i = o ? r(t, "id") : null, c = {
      resourceMethod: o ? "put" : "post",
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
    const e = r(s, "collectionName"), t = g(this.collections[e], {
      hashId: r(s, "hashId")
    }), o = r(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: r(t, "collectionName"),
      resourceId: Number(o),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = r(s, "id"), i = {
      resourceMethod: "get",
      resourceName: r(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: z() }
    };
    return this._request(i);
  }
  _getCollectionRecord(s, e = {}, t) {
    const o = r(e, "referenceKey") || "", i = r(e, "async") || !1, a = r(t, o) || [], n = I(
      a
    ), d = n ? [a] : a, c = k([]);
    return l(d, (f) => {
      const b = this._generateHashId({
        id: r(f, "id"),
        collectionName: s
      }), w = g(this.collections[s], {
        hashId: b
      });
      if (!P(w))
        c.push(w);
      else if (i) {
        const N = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: r(f, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, D = G;
        this._pushRequestHash(N, D), this._request(N);
      }
    }), n ? ss(c) : c;
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: (o, i) => this._getCollectionRecord(
        o,
        i,
        s
      )
    }, t = O(e);
    l(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = K(t) ? this._generateHashId({
      id: r(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), o = I(e);
    if (t) {
      const i = F(e, "hashId");
      return l(e, (a) => {
        const n = m(
          this.collections[s],
          {
            hashId: r(a, "hashId")
          }
        );
        this._injectActions(a), U(n, 0) && this.collections[s].push(a), y(n, 0) && (this.collections[s][n] = a);
      }), F(
        i,
        (a) => g(this.collections[s], {
          hashId: a
        })
      );
    }
    if (o) {
      const i = e.hashId, a = m(
        this.collections[s],
        {
          hashId: r(e, "hashId")
        }
      );
      return this._injectActions(e), U(a, 0) && this.collections[s].push(e), y(a, 0) && (this.collections[s][a] = e), g(this.collections[s], {
        hashId: i
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = I(s), o = O(this.aliases);
    e && l(o, (i) => {
      const a = _(this.aliases[i]), n = I(this.aliases[i]);
      a && l(s, (d) => {
        const c = m(this.aliases[i], {
          hashId: r(d, "hashId")
        });
        y(c, 0) && (this.aliases[i][c] = d);
      }), n && l(s, (d) => {
        p(
          r(d, "hashId"),
          r(this.aliases[i], "hashId")
        ) && (this.aliases[i] = d);
      });
    }), t && l(o, (i) => {
      const a = _(this.aliases[i]), n = I(this.aliases[i]);
      a && l([s], (d) => {
        const c = m(this.aliases[i], {
          hashId: r(d, "hashId")
        });
        y(c, 0) && (this.aliases[i][c] = d);
      }), n && p(
        r(s, "hashId"),
        r(this.aliases[i], "hashId")
      ) && (this.aliases[i] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = O(this.requestHashIds), t = _(s), o = I(s);
    let i = null;
    t && (i = s), o && (i = [s]), l(e, (a) => {
      const n = r(
        this.requestHashIds[a],
        "data"
      ), d = _(n), c = I(n);
      l(i, (f) => {
        if (d) {
          const b = m(
            r(this.requestHashIds[a], "data"),
            {
              hashId: r(f, "hashId")
            }
          );
          y(b, 0) && (this.requestHashIds[a].data[b] = f);
        }
        c && p(
          r(f, "hashId"),
          r(this.requestHashIds[a], "data.hashId")
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
    const t = this._generateHashId(s), o = !q(this.requestHashIds[t]), i = r(e, "isNew");
    return o && i ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    B.defaults.headers.common[`${s}`] = e;
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
    const o = t ? z() : ns, i = q(
      g(this.collections[s], {
        id: o
      })
    );
    return h(e, "id", o), this._injectReferenceKeys(s, e), this._injectActions(e), i && this.collections[s].push(e), g(this.collections[s], {
      id: o
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: o,
    resourcePayload: i,
    resourceFallback: a,
    resourceConfig: n
  }) {
    var X, Y, Z;
    const d = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), f = p(s, "get"), b = p(s, "delete"), w = p(s, "post"), N = S(t) || us(t), D = !P(o), v = !P(i), ts = !q(
      r(n, "override")
    ), j = r(i, "data") || null;
    if (ts) {
      const u = r(n, "override") || {};
      let R = q(r(u, "host")) ? this.host : r(u, "host"), T = q(r(u, "namespace")) ? this.namespace : r(u, "namespace"), $ = `${R}/${T}`;
      h(d, "baseURL", $);
    }
    if (N && h(d, "url", `${e}/${t}`), D && h(d, "params", o), v) {
      const u = {
        data: C(j, qs)
      };
      h(d, "data", u);
    }
    const M = !q(r(n, "skip")), J = p(r(n, "skip"), !0), V = this.requestHashIds[c], Q = !q(V), W = r(V, "isNew");
    if (!(f && (M && J || !M && Q && !W || M && !J && Q && !W))) {
      v && h(j, "isLoading", !0);
      try {
        const u = await B(d), R = ((X = u == null ? void 0 : u.data) == null ? void 0 : X.data) || a, T = ((Y = u == null ? void 0 : u.data) == null ? void 0 : Y.included) || [], $ = ((Z = u == null ? void 0 : u.data) == null ? void 0 : Z.meta) || {}, is = I(R), rs = _(R);
        let A = null;
        return rs && l(
          R,
          (H) => this._injectReferenceKeys(e, H)
        ), is && this._injectReferenceKeys(e, R), l(T, (H) => {
          this._injectReferenceKeys(
            r(H, this.payloadIncludedReference),
            H
          ), this._pushPayload(
            r(H, "collectionName"),
            H
          );
        }), A = await this._pushPayload(
          e,
          R
        ), n.alias && this._addAlias(
          r(n, "alias"),
          A
        ), w && this.unloadRecord(j), b && this.unloadRecord(A), this.requestHashIds[c] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: A,
          included: [],
          meta: $
        }, Promise.resolve(A);
      } catch (u) {
        return v && (h(j, "isError", !0), h(j, "isLoading", !1)), this.requestHashIds[c] = {
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
    }, i = es, a = this._pushRequestHash(
      o,
      i
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
    }, i = G, a = this._pushRequestHash(
      o,
      i
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
    }, o = es, i = this._pushRequestHash(
      t,
      o
    );
    return this._request(t), i;
  }
  findRecord(s, e, t = {}, o = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: o
    }, a = G, n = this._pushRequestHash(
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
    return m(s, e);
  }
  filterBy(s, e = {}) {
    return _s(s, e);
  }
  sortBy(s, e = []) {
    const t = F(
      e,
      (i) => ss(i.split(":"))
    ), o = F(
      e,
      (i) => gs(i.split(":"))
    );
    return ms(s, t, o);
  }
  isEmpty(s) {
    return P(s);
  }
  isPresent(s) {
    return !P(s);
  }
  isEqual(s, e) {
    return p(s, e);
  }
  isNumber(s) {
    return S(s);
  }
  isNil(s) {
    return q(s);
  }
  isNull(s) {
    return K(s);
  }
  isGte(s, e) {
    return y(s, e);
  }
  isGt(s, e) {
    return ls(s, e);
  }
  isLte(s, e) {
    return fs(s, e);
  }
  isLt(s, e) {
    return U(s, e);
  }
}
export {
  As as default
};
