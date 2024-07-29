import z from "axios";
import as from "lodash";
import * as ns from "mobx";
import { v1 as S, NIL as hs } from "uuid";
import cs from "crypto-js";
const { makeObservable: ds, observable: F, action: k, toJS: E } = ns, {
  get: i,
  set: h,
  find: y,
  findIndex: m,
  isObject: us,
  isArray: _,
  isPlainObject: f,
  isNumber: U,
  isString: ls,
  isNull: ss,
  isNil: q,
  isEmpty: O,
  isEqual: I,
  gte: R,
  gt: fs,
  lte: Is,
  lt: G,
  flatMap: ps,
  map: L,
  entries: _s,
  forEach: l,
  filter: es,
  keysIn: C,
  omit: w,
  first: ts,
  last: ys,
  orderBy: ms
} = as, is = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, J = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: {},
  included: [],
  meta: {}
}, B = [
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
class Ps {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), ds(this, {
      collections: F,
      aliases: F,
      requestHashIds: F,
      _pushPayload: k,
      _pushRequestHash: k,
      _addCollection: k,
      _addAlias: k
    });
  }
  _initializeAxiosConfig() {
    z.defaults.baseURL = this._getBaseURL();
  }
  _initializeCollections(s) {
    l(s, (e) => this._addCollection(e, []));
  }
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
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
    const t = _(e), o = f(e);
    t && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: S() }) {
    const e = JSON.stringify(s);
    return cs.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = w(
      E(this.originalRecord),
      B
    ), o = w(E(this), B);
    I(t, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return ps(_s(a), ([c, d]) => {
        const p = n ? `${n}.${c}` : c;
        return us(d) && !_(d) && d !== null ? e(d, p) : { key: p, value: d };
      });
    }
    const t = e(s);
    l(t, ({ key: a, value: n }) => h(this, a, n));
    const o = w(
      E(this.originalRecord),
      B
    ), r = w(E(this), B);
    I(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _sortRecordsBy(s, e = []) {
    const t = L(
      e,
      (r) => ts(r.split(":"))
    ), o = L(
      e,
      (r) => ys(r.split(":"))
    );
    return ms(s, t, o);
  }
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = m(this.collections[e], {
      hashId: i(s, "hashId")
    });
    R(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = C(this.requestHashIds);
    l(e, (t) => {
      const o = i(
        this.requestHashIds[t],
        "data"
      ), r = _(o), a = f(o);
      if (r) {
        const n = m(
          i(this.requestHashIds[t], "data"),
          {
            hashId: i(s, "hashId")
          }
        );
        R(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      a && I(
        i(s, "hashId"),
        i(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = C(this.aliases);
    l(e, (t) => {
      const o = _(this.aliases[t]), r = f(this.aliases[t]);
      if (o) {
        const a = m(this.aliases[t], {
          hashId: i(s, "hashId")
        });
        R(a, 0) && this.aliases[t].splice(a, 1);
      }
      r && I(
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
    }), o = U(i(t, "id")), r = o ? i(t, "id") : null, d = {
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
      resourceConfig: { skipId: S() }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(e, "async") || !1, a = i(e, "filterBy") || {}, n = i(e, "sortBy") || [], c = i(t, o) || [], d = f(
      c
    ), p = d ? [c] : c, g = F([]);
    return l(p, (N) => {
      const D = this._generateHashId({
        id: i(N, "id"),
        collectionName: s
      }), x = y(this.collections[s], {
        hashId: D
      });
      if (!O(x))
        g.push(x);
      else if (r) {
        const H = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: i(N, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, v = J;
        this._pushRequestHash(H, v), this._request(H);
      }
    }), d ? ts(g) : this._sortRecordsBy(
      es(g, a),
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
    }, t = C(e);
    l(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = ss(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = _(e), o = f(e);
    if (t) {
      const r = L(e, "hashId");
      return l(e, (a) => {
        const n = m(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectActions(a), G(n, 0) && this.collections[s].push(a), R(n, 0) && (this.collections[s][n] = a);
      }), L(
        r,
        (a) => y(this.collections[s], {
          hashId: a
        })
      );
    }
    if (o) {
      const r = e.hashId, a = m(
        this.collections[s],
        {
          hashId: i(e, "hashId")
        }
      );
      return this._injectActions(e), G(a, 0) && this.collections[s].push(e), R(a, 0) && (this.collections[s][a] = e), y(this.collections[s], {
        hashId: r
      });
    }
  }
  _pushToAliases(s) {
    const e = _(s), t = f(s), o = C(this.aliases);
    e && l(o, (r) => {
      const a = _(this.aliases[r]), n = f(this.aliases[r]);
      a && l(s, (c) => {
        const d = m(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        R(d, 0) && (this.aliases[r][d] = c);
      }), n && l(s, (c) => {
        I(
          i(c, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = c);
      });
    }), t && l(o, (r) => {
      const a = _(this.aliases[r]), n = f(this.aliases[r]);
      a && l([s], (c) => {
        const d = m(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        R(d, 0) && (this.aliases[r][d] = c);
      }), n && I(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = C(this.requestHashIds), t = _(s), o = f(s);
    let r = null;
    t && (r = s), o && (r = [s]), l(e, (a) => {
      const n = i(
        this.requestHashIds[a],
        "data"
      ), c = _(n), d = f(n);
      l(r, (p) => {
        if (c) {
          const g = m(
            i(this.requestHashIds[a], "data"),
            {
              hashId: i(p, "hashId")
            }
          );
          R(g, 0) && (this.requestHashIds[a].data[g] = p);
        }
        d && I(
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
    z.defaults.headers.common[`${s}`] = e;
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
    return f(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}, t = !0) {
    const o = t ? S() : hs, r = q(
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
    var Y, Z, K;
    const c = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), p = I(s, "get"), g = I(s, "delete"), N = I(s, "post"), D = U(t) || ls(t), x = !O(o), H = !O(r), v = !q(
      i(n, "override")
    ), P = i(r, "data") || null;
    if (v) {
      const u = i(n, "override") || {};
      let b = q(i(u, "host")) ? this.host : i(u, "host"), $ = q(i(u, "namespace")) ? this.namespace : i(u, "namespace"), T = `${b}/${$}`;
      h(c, "baseURL", T);
    }
    if (D && h(c, "url", `${e}/${t}`), x && h(c, "params", o), H) {
      const u = {
        data: w(P, qs)
      };
      h(c, "data", u);
    }
    const M = !q(i(n, "skip")), V = I(i(n, "skip"), !0), Q = this.requestHashIds[d], W = !q(Q), X = i(Q, "isNew");
    if (!(p && (M && V || !M && W && !X || M && !V && W && !X))) {
      H && h(P, "isLoading", !0);
      try {
        const u = await z(c), b = ((Y = u == null ? void 0 : u.data) == null ? void 0 : Y.data) || a, $ = ((Z = u == null ? void 0 : u.data) == null ? void 0 : Z.included) || [], T = ((K = u == null ? void 0 : u.data) == null ? void 0 : K.meta) || {}, rs = f(b), os = _(b);
        let A = null;
        return os && l(
          b,
          (j) => this._injectReferenceKeys(e, j)
        ), rs && this._injectReferenceKeys(e, b), l($, (j) => {
          this._injectReferenceKeys(
            i(j, this.payloadIncludedReference),
            j
          ), this._pushPayload(
            i(j, "collectionName"),
            j
          );
        }), A = await this._pushPayload(
          e,
          b
        ), n.alias && this._addAlias(
          i(n, "alias"),
          A
        ), N && this.unloadRecord(P), g && this.unloadRecord(A), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: A,
          included: [],
          meta: T
        }, Promise.resolve(A);
      } catch (u) {
        return H && (h(P, "isError", !0), h(P, "isLoading", !1)), this.requestHashIds[d] = {
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
    }, r = is, a = this._pushRequestHash(
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
    }, r = J, a = this._pushRequestHash(
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
    }, o = is, r = this._pushRequestHash(
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
    }, a = J, n = this._pushRequestHash(
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
  /*
   * Exposed abstract utility functions from Lodash
   */
  findBy(s, e = {}) {
    return y(s, e);
  }
  findIndexBy(s, e = {}) {
    return m(s, e);
  }
  filterBy(s, e = {}) {
    return es(s, e);
  }
  sortBy(s, e) {
    return this._sortRecordsBy(s, e);
  }
  isEmpty(s) {
    return O(s);
  }
  isPresent(s) {
    return !O(s);
  }
  isEqual(s, e) {
    return I(s, e);
  }
  isNumber(s) {
    return U(s);
  }
  isNil(s) {
    return q(s);
  }
  isNull(s) {
    return ss(s);
  }
  isGte(s, e) {
    return R(s, e);
  }
  isGt(s, e) {
    return fs(s, e);
  }
  isLte(s, e) {
    return Is(s, e);
  }
  isLt(s, e) {
    return G(s, e);
  }
}
export {
  Ps as default
};
