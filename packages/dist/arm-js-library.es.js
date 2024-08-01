import k from "axios";
import cs from "lodash";
import * as ds from "mobx";
import { v1 as U, NIL as us } from "uuid";
import ls from "crypto-js";
const { makeObservable: fs, observable: E, action: F, toJS: L } = ds, {
  get: i,
  set: h,
  find: y,
  findIndex: q,
  isObject: Is,
  isArray: _,
  isPlainObject: I,
  isNumber: G,
  isString: ps,
  isNull: ts,
  isNil: g,
  isEmpty: C,
  isEqual: f,
  gte: m,
  gt: _s,
  lte: ys,
  lt: J,
  flatMap: qs,
  map: D,
  entries: gs,
  forEach: l,
  filter: is,
  keysIn: w,
  concat: ms,
  chunk: Rs,
  uniqWith: bs,
  omit: x,
  first: V,
  last: rs,
  orderBy: Hs,
  uniqBy: os,
  groupBy: xs
} = cs, as = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, W = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, v = [
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
], js = [
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
class Bs {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), fs(this, {
      collections: E,
      aliases: E,
      requestHashIds: E,
      _pushPayload: F,
      _pushRequestHash: F,
      _addCollection: F,
      _addAlias: F
    });
  }
  _initializeAxiosConfig() {
    k.defaults.baseURL = this._getBaseURL();
  }
  _initializeCollections(s) {
    l(s, (e) => this._addCollection(e, []));
  }
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  _isCollectionExisting(s) {
    if (g(i(this.collections, s)))
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
  _generateHashId(s = { id: U() }) {
    const e = JSON.stringify(s);
    return ls.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = x(
      L(this.originalRecord),
      v
    ), o = x(L(this), v);
    f(t, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return qs(gs(a), ([c, d]) => {
        const p = n ? `${n}.${c}` : c;
        return Is(d) && !_(d) && d !== null ? e(d, p) : { key: p, value: d };
      });
    }
    const t = e(s);
    l(t, ({ key: a, value: n }) => h(this, a, n));
    const o = x(
      L(this.originalRecord),
      v
    ), r = x(L(this), v);
    f(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _sortRecordsBy(s, e = []) {
    const t = D(
      e,
      (r) => V(r.split(":"))
    ), o = D(
      e,
      (r) => rs(r.split(":"))
    );
    return Hs(s, t, o);
  }
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = q(this.collections[e], {
      hashId: i(s, "hashId")
    });
    m(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = w(this.requestHashIds);
    l(e, (t) => {
      const o = i(
        this.requestHashIds[t],
        "data"
      ), r = _(o), a = I(o);
      if (r) {
        const n = q(
          i(this.requestHashIds[t], "data"),
          {
            hashId: i(s, "hashId")
          }
        );
        m(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      a && f(
        i(s, "hashId"),
        i(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = w(this.aliases);
    l(e, (t) => {
      const o = _(this.aliases[t]), r = I(this.aliases[t]);
      if (o) {
        const a = q(this.aliases[t], {
          hashId: i(s, "hashId")
        });
        m(a, 0) && this.aliases[t].splice(a, 1);
      }
      r && f(
        i(s, "hashId"),
        i(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  _saveRecord(s) {
    const e = i(s, "collectionName"), t = y(this.collections[e], {
      hashId: i(s, "hashId")
    }), o = G(i(t, "id")), r = o ? i(t, "id") : null, d = {
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
    const e = i(s, "collectionName"), t = y(this.collections[e], {
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
      resourceConfig: { skipId: U() }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(e, "async") || !1, a = i(e, "filterBy") || {}, n = i(e, "sortBy") || [], c = i(t, o) || [], d = I(
      c
    ), p = d ? [c] : c, R = E([]);
    return l(p, (B) => {
      const H = this._generateHashId({
        id: i(B, "id"),
        collectionName: s
      }), N = y(this.collections[s], {
        hashId: H
      });
      if (!C(N))
        R.push(N);
      else if (r) {
        const j = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: i(B, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, M = W;
        this._pushRequestHash(j, M), this._request(j);
      }
    }), d ? V(R) : this._sortRecordsBy(
      is(R, a),
      n
    );
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
    }, t = w(e);
    l(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = ts(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), o = I(e);
    if (t) {
      const r = D(e, "hashId");
      return l(e, (a) => {
        const n = q(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectActions(a), J(n, 0) && this.collections[s].push(a), m(n, 0) && (this.collections[s][n] = a);
      }), D(
        r,
        (a) => y(this.collections[s], {
          hashId: a
        })
      );
    }
    if (o) {
      const r = e.hashId, a = q(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      return this._injectActions(e), J(a, 0) && this.collections[s].push(e), m(a, 0) && (this.collections[s][a] = e), y(this.collections[s], {
        hashId: r
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = I(s), o = w(this.aliases);
    e && l(o, (r) => {
      const a = _(this.aliases[r]), n = I(this.aliases[r]);
      a && l(s, (c) => {
        const d = q(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        m(d, 0) && (this.aliases[r][d] = c);
      }), n && l(s, (c) => {
        f(
          i(c, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = c);
      });
    }), t && l(o, (r) => {
      const a = _(this.aliases[r]), n = I(this.aliases[r]);
      a && l([s], (c) => {
        const d = q(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        m(d, 0) && (this.aliases[r][d] = c);
      }), n && f(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = w(this.requestHashIds), t = _(s), o = I(s);
    let r = null;
    t && (r = s), o && (r = [s]), l(e, (a) => {
      const n = i(
        this.requestHashIds[a],
        "data"
      ), c = _(n), d = I(n);
      l(r, (p) => {
        if (c) {
          const R = q(
            i(this.requestHashIds[a], "data"),
            {
              hashId: i(p, "hashId")
            }
          );
          m(R, 0) && (this.requestHashIds[a].data[R] = p);
        }
        d && f(
          i(p, "hashId"),
          i(this.requestHashIds[a], "data.hashId")
        ) && h(
          this.requestHashIds[a],
          "data",
          p
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
    const t = this._generateHashId(s), o = !g(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    k.defaults.headers.common[`${s}`] = e;
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
    const o = t ? U() : us, r = g(
      y(this.collections[s], {
        id: o
      })
    );
    return h(e, "id", o), this._injectReferenceKeys(s, e), this._injectActions(e), r && this.collections[s].push(e), y(this.collections[s], {
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
    var K, ss, es;
    const c = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), p = f(s, "get"), R = f(s, "delete"), B = f(s, "post"), H = G(t) || ps(t), N = !C(o), j = !C(r), M = !g(
      i(n, "override")
    ), P = i(r, "data") || null, $ = H ? y(this.collections[e], {
      id: t
    }) : null;
    if (M) {
      const u = i(n, "override") || {};
      let b = g(i(u, "host")) ? this.host : i(u, "host"), z = g(i(u, "namespace")) ? this.namespace : i(u, "namespace"), S = `${b}/${z}`;
      h(c, "baseURL", S);
    }
    if (H && h(c, "url", `${e}/${t}`), N && h(c, "params", o), j) {
      const u = {
        data: x(P, js)
      };
      h(c, "data", u);
    }
    const T = !g(i(n, "skip")), Q = f(i(n, "skip"), !0), X = this.requestHashIds[d], Y = !g(X), Z = i(X, "isNew");
    if (!(p && (T && Q || !T && Y && !Z || T && !Q && Y && !Z))) {
      j && h(P, "isLoading", !0), H && h($, "isLoading", !0);
      try {
        const u = await k(c), b = ((K = u == null ? void 0 : u.data) == null ? void 0 : K.data) || a, z = ((ss = u == null ? void 0 : u.data) == null ? void 0 : ss.included) || [], S = ((es = u == null ? void 0 : u.data) == null ? void 0 : es.meta) || {}, ns = I(b), hs = _(b);
        let A = null;
        return hs && l(
          b,
          (O) => this._injectReferenceKeys(e, O)
        ), ns && this._injectReferenceKeys(e, b), l(z, (O) => {
          this._injectReferenceKeys(
            i(O, this.payloadIncludedReference),
            O
          ), this._pushPayload(
            i(O, "collectionName"),
            O
          );
        }), A = await this._pushPayload(
          e,
          b
        ), n.alias && this._addAlias(
          i(n, "alias"),
          A
        ), B && this.unloadRecord(P), R && this.unloadRecord(A), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: A,
          included: [],
          meta: S
        }, Promise.resolve(A);
      } catch (u) {
        return j && (h(P, "isError", !0), h(P, "isLoading", !1)), H && (h($, "isError", !0), h($, "isLoading", !1)), this.requestHashIds[d] = {
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
    }, r = as, a = this._pushRequestHash(
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
    }, r = W, a = this._pushRequestHash(
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
    }, o = as, r = this._pushRequestHash(
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
    }, a = W, n = this._pushRequestHash(
      r,
      a
    );
    return this._request(r), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return y(this.collections[s], {
      id: e
    });
  }
  ajax(s = {}) {
    return k.request(s);
  }
  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(s, e = {}) {
    return y(s, e);
  }
  findIndexBy(s, e = {}) {
    return q(s, e);
  }
  filterBy(s, e = {}) {
    return is(s, e);
  }
  uniqBy(s, e) {
    return os(s, e);
  }
  groupBy(s, e) {
    return os(s, e);
  }
  firstObject(s = []) {
    return V(s);
  }
  lastObject(s = []) {
    return rs(s);
  }
  mergeObjects(s = [], e = []) {
    return bs(ms(s, e), f);
  }
  chunkObjects(s = [], e = 1) {
    return Rs(s, e);
  }
  sortBy(s, e) {
    return this._sortRecordsBy(s, e);
  }
  isEmpty(s) {
    return C(s);
  }
  isPresent(s) {
    return !C(s);
  }
  isEqual(s, e) {
    return f(s, e);
  }
  isNumber(s) {
    return G(s);
  }
  isNil(s) {
    return g(s);
  }
  isNull(s) {
    return ts(s);
  }
  isGte(s, e) {
    return m(s, e);
  }
  isGt(s, e) {
    return _s(s, e);
  }
  isLte(s, e) {
    return ys(s, e);
  }
  isLt(s, e) {
    return J(s, e);
  }
}
export {
  Bs as default
};
