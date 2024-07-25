import $ from "axios";
import rs from "lodash";
import * as as from "mobx";
import { v1 as z, NIL as os } from "uuid";
import ns from "crypto-js";
const { makeObservable: hs, observable: k, action: x, toJS: E } = as, {
  get: i,
  set: h,
  find: g,
  findIndex: m,
  isObject: cs,
  isArray: _,
  isPlainObject: I,
  isNumber: B,
  isString: ds,
  isNull: Z,
  isNil: q,
  isEmpty: A,
  isEqual: p,
  gte: y,
  gt: us,
  lte: ls,
  lt: S,
  flatMap: fs,
  map: K,
  entries: Is,
  forEach: l,
  keysIn: O,
  omit: C,
  first: ps
} = rs, ss = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, U = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, F = [
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
], _s = [
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
class bs {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), hs(this, {
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
    $.defaults.baseURL = this._getBaseURL();
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
    if (q(i(this.collections, s)))
      throw `Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`;
  }
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const t = _(e), a = I(e);
    t && (this.aliases[s] = e || []), a && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: z() }) {
    const e = JSON.stringify(s);
    return ns.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = C(
      E(this.originalRecord),
      F
    ), a = C(E(this), F);
    p(t, a) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(o, n = "") {
      return fs(Is(o), ([d, c]) => {
        const f = n ? `${n}.${d}` : d;
        return cs(c) && !_(c) && c !== null ? e(c, f) : { key: f, value: c };
      });
    }
    const t = e(s);
    l(t, ({ key: o, value: n }) => h(this, o, n));
    const a = C(
      E(this.originalRecord),
      F
    ), r = C(E(this), F);
    p(a, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = m(this.collections[e], {
      hashId: i(s, "hashId")
    });
    y(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = O(this.requestHashIds);
    l(e, (t) => {
      const a = i(
        this.requestHashIds[t],
        "data"
      ), r = _(a), o = I(a);
      if (r) {
        const n = m(
          i(this.requestHashIds[t], "data"),
          {
            hashId: i(s, "hashId")
          }
        );
        y(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      o && p(
        i(s, "hashId"),
        i(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = O(this.aliases);
    l(e, (t) => {
      const a = _(this.aliases[t]), r = I(this.aliases[t]);
      if (a) {
        const o = m(this.aliases[t], {
          hashId: i(s, "hashId")
        });
        y(o, 0) && this.aliases[t].splice(o, 1);
      }
      r && p(
        i(s, "hashId"),
        i(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = g(this.collections[e], {
      hashId: i(s, "hashId")
    }), a = B(i(t, "id")), r = a ? i(t, "id") : null, c = {
      resourceMethod: a ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(c);
  }
  async _deleteRecord(s) {
    const e = i(s, "collectionName"), t = g(this.collections[e], {
      hashId: i(s, "hashId")
    }), a = i(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: i(t, "collectionName"),
      resourceId: Number(a),
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
      resourceConfig: { skipId: z() }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const a = i(e, "referenceKey") || "", r = i(e, "async") || !1, o = i(t, a) || [], n = I(
      o
    ), d = n ? [o] : o, c = k([]);
    return l(d, (f) => {
      const b = this._generateHashId({
        id: i(f, "id"),
        collectionName: s
      }), w = g(this.collections[s], {
        hashId: b
      });
      if (!A(w))
        c.push(w);
      else if (r) {
        const N = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: i(f, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, L = U;
        this._pushRequestHash(N, L), this._request(N);
      }
    }), n ? ps(c) : c;
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: (a, r) => this._getCollectionRecord(
        a,
        r,
        s
      )
    }, t = O(e);
    l(t, (a) => {
      s[a] = e[a];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const a = Z(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", a), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), a = I(e);
    if (t) {
      const r = K(e, "hashId");
      return l(e, (o) => {
        const n = m(
          this.collections[s],
          {
            hashId: i(o, "hashId")
          }
        );
        this._injectActions(o), S(n, 0) && this.collections[s].push(o), y(n, 0) && (this.collections[s][n] = o);
      }), K(
        r,
        (o) => g(this.collections[s], {
          hashId: o
        })
      );
    }
    if (a) {
      const r = e.hashId, o = m(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      return this._injectActions(e), S(o, 0) && this.collections[s].push(e), y(o, 0) && (this.collections[s][o] = e), g(this.collections[s], {
        hashId: r
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = I(s), a = O(this.aliases);
    e && l(a, (r) => {
      const o = _(this.aliases[r]), n = I(this.aliases[r]);
      o && l(s, (d) => {
        const c = m(this.aliases[r], {
          hashId: i(d, "hashId")
        });
        y(c, 0) && (this.aliases[r][c] = d);
      }), n && l(s, (d) => {
        p(
          i(d, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = d);
      });
    }), t && l(a, (r) => {
      const o = _(this.aliases[r]), n = I(this.aliases[r]);
      o && l([s], (d) => {
        const c = m(this.aliases[r], {
          hashId: i(d, "hashId")
        });
        y(c, 0) && (this.aliases[r][c] = d);
      }), n && p(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = O(this.requestHashIds), t = _(s), a = I(s);
    let r = null;
    t && (r = s), a && (r = [s]), l(e, (o) => {
      const n = i(
        this.requestHashIds[o],
        "data"
      ), d = _(n), c = I(n);
      l(r, (f) => {
        if (d) {
          const b = m(
            i(this.requestHashIds[o], "data"),
            {
              hashId: i(f, "hashId")
            }
          );
          y(b, 0) && (this.requestHashIds[o].data[b] = f);
        }
        c && p(
          i(f, "hashId"),
          i(this.requestHashIds[o], "data.hashId")
        ) && h(
          this.requestHashIds[o],
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
    const t = this._generateHashId(s), a = !q(this.requestHashIds[t]), r = i(e, "isNew");
    return a && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    $.defaults.headers.common[`${s}`] = e;
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
    const a = t ? z() : os, r = q(
      g(this.collections[s], {
        id: a
      })
    );
    return h(e, "id", a), this._injectReferenceKeys(s, e), this._injectActions(e), r && this.collections[s].push(e), g(this.collections[s], {
      id: a
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: a,
    resourcePayload: r,
    resourceFallback: o,
    resourceConfig: n
  }) {
    var W, X, Y;
    const d = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), f = p(s, "get"), b = p(s, "delete"), w = p(s, "post"), N = B(t) || ds(t), L = !A(a), D = !A(r), es = !q(
      i(n, "override")
    ), j = i(r, "data") || null;
    if (es) {
      const u = i(n, "override") || {};
      let R = q(i(u, "host")) ? this.host : i(u, "host"), M = q(i(u, "namespace")) ? this.namespace : i(u, "namespace"), T = `${R}/${M}`;
      h(d, "baseURL", T);
    }
    if (N && h(d, "url", `${e}/${t}`), L && h(d, "params", a), D) {
      const u = {
        data: C(j, _s)
      };
      h(d, "data", u);
    }
    const v = !q(i(n, "skip")), G = p(i(n, "skip"), !0), J = this.requestHashIds[c], V = !q(J), Q = i(J, "isNew");
    if (!(f && (v && G || !v && V && !Q || v && !G && V && !Q))) {
      D && h(j, "isLoading", !0);
      try {
        const u = await $(d), R = ((W = u == null ? void 0 : u.data) == null ? void 0 : W.data) || o, M = ((X = u == null ? void 0 : u.data) == null ? void 0 : X.included) || [], T = ((Y = u == null ? void 0 : u.data) == null ? void 0 : Y.meta) || {}, ts = I(R), is = _(R);
        let P = null;
        return is && l(
          R,
          (H) => this._injectReferenceKeys(e, H)
        ), ts && this._injectReferenceKeys(e, R), l(M, (H) => {
          this._injectReferenceKeys(
            i(H, this.payloadIncludedReference),
            H
          ), this._pushPayload(
            i(H, "collectionName"),
            H
          );
        }), P = await this._pushPayload(
          e,
          R
        ), n.alias && this._addAlias(
          i(n, "alias"),
          P
        ), w && this.unloadRecord(j), b && this.unloadRecord(P), this.requestHashIds[c] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: P,
          included: [],
          meta: T
        }, Promise.resolve(P);
      } catch (u) {
        return D && (h(j, "isError", !0), h(j, "isLoading", !1)), this.requestHashIds[c] = {
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
    const a = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, r = ss, o = this._pushRequestHash(
      a,
      r
    );
    return this._request(a), o;
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
    }, r = U, o = this._pushRequestHash(
      a,
      r
    );
    return this._request(a), o;
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
    }, a = ss, r = this._pushRequestHash(
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
    }, o = U, n = this._pushRequestHash(
      r,
      o
    );
    return this._request(r), n;
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
    return B(s);
  }
  isNil(s) {
    return q(s);
  }
  isNull(s) {
    return Z(s);
  }
  isGte(s, e) {
    return y(s, e);
  }
  isGt(s, e) {
    return us(s, e);
  }
  isLte(s, e) {
    return ls(s, e);
  }
  isLt(s, e) {
    return S(s, e);
  }
}
export {
  bs as default
};
