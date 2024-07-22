import $ from "axios";
import rs from "lodash";
import * as os from "mobx";
import { v1 as z, NIL as as } from "uuid";
import ns from "crypto-js";
const { makeObservable: hs, observable: k, action: x, toJS: F } = os, {
  get: i,
  set: h,
  find: m,
  findIndex: g,
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
  omit: C
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
], ps = [
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
class Rs {
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
    const t = _(e), o = I(e);
    t && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
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
      F(this.originalRecord),
      E
    ), o = C(F(this), E);
    p(t, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return fs(Is(a), ([c, d]) => {
        const f = n ? `${n}.${c}` : c;
        return cs(d) && !_(d) && d !== null ? e(d, f) : { key: f, value: d };
      });
    }
    const t = e(s);
    l(t, ({ key: a, value: n }) => h(this, a, n));
    const o = C(
      F(this.originalRecord),
      E
    ), r = C(F(this), E);
    p(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = g(this.collections[e], {
      hashId: i(s, "hashId")
    });
    y(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = O(this.requestHashIds);
    l(e, (t) => {
      const o = i(
        this.requestHashIds[t],
        "data"
      ), r = _(o), a = I(o);
      if (r) {
        const n = g(
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
      a && p(
        i(s, "hashId"),
        i(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = O(this.aliases);
    l(e, (t) => {
      const o = _(this.aliases[t]), r = I(this.aliases[t]);
      if (o) {
        const a = g(this.aliases[t], {
          hashId: i(s, "hashId")
        });
        y(a, 0) && this.aliases[t].splice(a, 1);
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
    const e = i(s, "collectionName"), t = m(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = B(i(t, "id")), r = o ? i(t, "id") : null, d = {
      resourceMethod: o ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(d);
  }
  async _deleteRecord(s) {
    const e = i(s, "collectionName"), t = m(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = i(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: i(t, "collectionName"),
      resourceId: Number(o),
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
    const o = i(e, "referenceKey") || "", r = i(e, "async") || !1, a = i(t, o) || [], c = I(
      a
    ) ? [a] : a, d = k([]);
    return l(c, (f) => {
      const b = this._generateHashId({
        id: i(f, "id"),
        collectionName: s
      }), w = m(this.collections[s], {
        hashId: b
      });
      if (!A(w))
        d.push(w);
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
    }, t = O(e);
    l(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = Z(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), o = I(e);
    if (t) {
      const r = K(e, "hashId");
      return l(e, (a) => {
        const n = g(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectActions(a), S(n, 0) && this.collections[s].push(a), y(n, 0) && (this.collections[s][n] = a);
      }), K(
        r,
        (a) => m(this.collections[s], {
          hashId: a
        })
      );
    }
    if (o) {
      const r = e.hashId, a = g(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      return this._injectActions(e), S(a, 0) && this.collections[s].push(e), y(a, 0) && (this.collections[s][a] = e), m(this.collections[s], {
        hashId: r
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = I(s), o = O(this.aliases);
    e && l(o, (r) => {
      const a = _(this.aliases[r]), n = I(this.aliases[r]);
      a && l(s, (c) => {
        const d = g(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        y(d, 0) && (this.aliases[r][d] = c);
      }), n && l(s, (c) => {
        p(
          i(c, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = c);
      });
    }), t && l(o, (r) => {
      const a = _(this.aliases[r]), n = I(this.aliases[r]);
      a && l([s], (c) => {
        const d = g(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        y(d, 0) && (this.aliases[r][d] = c);
      }), n && p(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = O(this.requestHashIds), t = _(s), o = I(s);
    let r = null;
    t && (r = s), o && (r = [s]), l(e, (a) => {
      const n = i(
        this.requestHashIds[a],
        "data"
      ), c = _(n), d = I(n);
      l(r, (f) => {
        if (c) {
          const b = g(
            i(this.requestHashIds[a], "data"),
            {
              hashId: i(f, "hashId")
            }
          );
          y(b, 0) && (this.requestHashIds[a].data[b] = f);
        }
        d && p(
          i(f, "hashId"),
          i(this.requestHashIds[a], "data.hashId")
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
    const t = this._generateHashId(s), o = !q(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
    const o = t ? z() : as, r = q(
      m(this.collections[s], {
        id: o
      })
    );
    return h(e, "id", o), this._injectReferenceKeys(s, e), this._injectActions(e), r && this.collections[s].push(e), m(this.collections[s], {
      id: o
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: o,
    resourcePayload: r,
    resourceFallback: a,
    resourceConfig: n
  }) {
    var W, X, Y;
    const c = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), f = p(s, "get"), b = p(s, "delete"), w = p(s, "post"), N = B(t) || ds(t), L = !A(o), D = !A(r), es = !q(
      i(n, "override")
    ), j = i(r, "data") || null;
    if (es) {
      const u = i(n, "override") || {};
      let R = q(i(u, "host")) ? this.host : i(u, "host"), M = q(i(u, "namespace")) ? this.namespace : i(u, "namespace"), T = `${R}/${M}`;
      h(c, "baseURL", T);
    }
    if (N && h(c, "url", `${e}/${t}`), L && h(c, "params", o), D) {
      const u = {
        data: C(j, ps)
      };
      h(c, "data", u);
    }
    const v = !q(i(n, "skip")), G = p(i(n, "skip"), !0), J = this.requestHashIds[d], V = !q(J), Q = i(J, "isNew");
    if (!(f && (v && G || !v && V && !Q || v && !G && V && !Q))) {
      D && h(j, "isLoading", !0);
      try {
        const u = await $(c), R = ((W = u == null ? void 0 : u.data) == null ? void 0 : W.data) || a, M = ((X = u == null ? void 0 : u.data) == null ? void 0 : X.included) || [], T = ((Y = u == null ? void 0 : u.data) == null ? void 0 : Y.meta) || {}, ts = I(R), is = _(R);
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
        ), w && this.unloadRecord(j), b && this.unloadRecord(P), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: P,
          included: [],
          meta: T
        }, Promise.resolve(P);
      } catch (u) {
        return D && (h(j, "isError", !0), h(j, "isLoading", !1)), this.requestHashIds[d] = {
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
    }, r = ss, a = this._pushRequestHash(
      o,
      r
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
    }, r = U, a = this._pushRequestHash(
      o,
      r
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
    }, o = ss, r = this._pushRequestHash(
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
    }, a = U, n = this._pushRequestHash(
      r,
      a
    );
    return this._request(r), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return m(this.collections[s], {
      id: e
    });
  }
  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(s, e = {}) {
    return m(s, e);
  }
  findIndexBy(s, e = {}) {
    return g(s, e);
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
  Rs as default
};
