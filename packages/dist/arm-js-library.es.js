import E from "axios";
import ns from "lodash";
import * as hs from "mobx";
import { v1 as z, NIL as cs } from "uuid";
import ds from "crypto-js";
const { makeObservable: ls, observable: S, action: F, toJS: L } = hs, {
  get: i,
  set: h,
  find: y,
  findIndex: q,
  isObject: us,
  isArray: p,
  isPlainObject: f,
  isNumber: U,
  isString: fs,
  isNull: ss,
  isNil: R,
  isEmpty: C,
  isEqual: I,
  gte: g,
  gt: Is,
  lte: ps,
  lt: G,
  flatMap: _s,
  map: k,
  entries: ys,
  forEach: u,
  filter: es,
  keysIn: w,
  omit: x,
  first: ts,
  last: qs,
  orderBy: Rs
} = ns, is = {
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
], gs = [
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
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), ls(this, {
      collections: S,
      aliases: S,
      requestHashIds: S,
      _pushPayload: F,
      _pushRequestHash: F,
      _addCollection: F,
      _addAlias: F
    });
  }
  _initializeAxiosConfig() {
    E.defaults.baseURL = this._getBaseURL();
  }
  _initializeCollections(s) {
    u(s, (e) => this._addCollection(e, []));
  }
  _getBaseURL() {
    return `${this.host}/${this.namespace}`;
  }
  _isCollectionExisting(s) {
    if (R(i(this.collections, s)))
      throw `Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`;
  }
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const t = p(e), o = f(e);
    t && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: z() }) {
    const e = JSON.stringify(s);
    return ds.MD5(e).toString();
  }
  _getProperty(s) {
    return i(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = x(
      L(this.originalRecord),
      B
    ), o = x(L(this), B);
    I(t, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return _s(ys(a), ([c, d]) => {
        const _ = n ? `${n}.${c}` : c;
        return us(d) && !p(d) && d !== null ? e(d, _) : { key: _, value: d };
      });
    }
    const t = e(s);
    u(t, ({ key: a, value: n }) => h(this, a, n));
    const o = x(
      L(this.originalRecord),
      B
    ), r = x(L(this), B);
    I(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _sortRecordsBy(s, e = []) {
    const t = k(
      e,
      (r) => ts(r.split(":"))
    ), o = k(
      e,
      (r) => qs(r.split(":"))
    );
    return Rs(s, t, o);
  }
  _unloadFromCollection(s) {
    const e = i(s, "collectionName"), t = q(this.collections[e], {
      hashId: i(s, "hashId")
    });
    g(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = w(this.requestHashIds);
    u(e, (t) => {
      const o = i(
        this.requestHashIds[t],
        "data"
      ), r = p(o), a = f(o);
      if (r) {
        const n = q(
          i(this.requestHashIds[t], "data"),
          {
            hashId: i(s, "hashId")
          }
        );
        g(n, 0) && this.requestHashIds[t].data.splice(
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
    const e = w(this.aliases);
    u(e, (t) => {
      const o = p(this.aliases[t]), r = f(this.aliases[t]);
      if (o) {
        const a = q(this.aliases[t], {
          hashId: i(s, "hashId")
        });
        g(a, 0) && this.aliases[t].splice(a, 1);
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
      resourceConfig: { skipId: z() }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const o = i(e, "referenceKey") || "", r = i(e, "async") || !1, a = i(e, "filterBy") || {}, n = i(e, "sortBy") || [], c = i(t, o) || [], d = f(
      c
    );
    return u(d ? [c] : c, (m) => {
      const D = this._generateHashId({
        id: i(m, "id"),
        collectionName: s
      }), b = y(this.collections[s], {
        hashId: D
      });
      if (!C(b))
        collectionRecords.push(b);
      else if (r) {
        const N = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: i(m, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, P = J;
        this._pushRequestHash(N, P), this._request(N);
      }
    }), d ? ts(collectionRecords) : this._sortRecordsBy(
      es(collectionRecords, a),
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
    u(t, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const o = ss(t) ? this._generateHashId({
      id: i(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isResolving", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = p(e), o = f(e);
    if (t) {
      const r = k(e, "hashId");
      return u(e, (a) => {
        const n = q(
          this.collections[s],
          {
            hashId: i(a, "hashId")
          }
        );
        this._injectActions(a), G(n, 0) && this.collections[s].push(a), g(n, 0) && (this.collections[s][n] = a);
      }), k(
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
      return this._injectActions(e), G(a, 0) && this.collections[s].push(e), g(a, 0) && (this.collections[s][a] = e), y(this.collections[s], {
        hashId: r
      });
    }
  }
  _pushToAliases(s) {
    const e = p(s), t = f(s), o = w(this.aliases);
    e && u(o, (r) => {
      const a = p(this.aliases[r]), n = f(this.aliases[r]);
      a && u(s, (c) => {
        const d = q(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        g(d, 0) && (this.aliases[r][d] = c);
      }), n && u(s, (c) => {
        I(
          i(c, "hashId"),
          i(this.aliases[r], "hashId")
        ) && (this.aliases[r] = c);
      });
    }), t && u(o, (r) => {
      const a = p(this.aliases[r]), n = f(this.aliases[r]);
      a && u([s], (c) => {
        const d = q(this.aliases[r], {
          hashId: i(c, "hashId")
        });
        g(d, 0) && (this.aliases[r][d] = c);
      }), n && I(
        i(s, "hashId"),
        i(this.aliases[r], "hashId")
      ) && (this.aliases[r] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = w(this.requestHashIds), t = p(s), o = f(s);
    let r = null;
    t && (r = s), o && (r = [s]), u(e, (a) => {
      const n = i(
        this.requestHashIds[a],
        "data"
      ), c = p(n), d = f(n);
      u(r, (_) => {
        if (c) {
          const m = q(
            i(this.requestHashIds[a], "data"),
            {
              hashId: i(_, "hashId")
            }
          );
          g(m, 0) && (this.requestHashIds[a].data[m] = _);
        }
        d && I(
          i(_, "hashId"),
          i(this.requestHashIds[a], "data.hashId")
        ) && h(
          this.requestHashIds[a],
          "data",
          _
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
    const t = this._generateHashId(s), o = !R(this.requestHashIds[t]), r = i(e, "isNew");
    return o && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    E.defaults.headers.common[`${s}`] = e;
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
    const o = t ? z() : cs, r = R(
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
    }, d = this._generateHashId({ ...arguments[0] }), _ = I(s, "get"), m = I(s, "delete"), D = I(s, "post"), b = U(t) || fs(t), N = !C(o), P = !C(r), rs = !R(
      i(n, "override")
    ), A = i(r, "data") || null, v = b ? y(this.collections[e], {
      id: t
    }) : null;
    if (rs) {
      const l = i(n, "override") || {};
      let H = R(i(l, "host")) ? this.host : i(l, "host"), $ = R(i(l, "namespace")) ? this.namespace : i(l, "namespace"), T = `${H}/${$}`;
      h(c, "baseURL", T);
    }
    if (b && h(c, "url", `${e}/${t}`), N && h(c, "params", o), P) {
      const l = {
        data: x(A, gs)
      };
      h(c, "data", l);
    }
    const M = !R(i(n, "skip")), V = I(i(n, "skip"), !0), Q = this.requestHashIds[d], W = !R(Q), X = i(Q, "isNew");
    if (!(_ && (M && V || !M && W && !X || M && !V && W && !X))) {
      P && h(A, "isLoading", !0), b && h(v, "isLoading", !0);
      try {
        const l = await E(c), H = ((Y = l == null ? void 0 : l.data) == null ? void 0 : Y.data) || a, $ = ((Z = l == null ? void 0 : l.data) == null ? void 0 : Z.included) || [], T = ((K = l == null ? void 0 : l.data) == null ? void 0 : K.meta) || {}, os = f(H), as = p(H);
        let O = null;
        return as && u(
          H,
          (j) => this._injectReferenceKeys(e, j)
        ), os && this._injectReferenceKeys(e, H), u($, (j) => {
          this._injectReferenceKeys(
            i(j, this.payloadIncludedReference),
            j
          ), this._pushPayload(
            i(j, "collectionName"),
            j
          );
        }), O = await this._pushPayload(
          e,
          H
        ), n.alias && this._addAlias(
          i(n, "alias"),
          O
        ), D && this.unloadRecord(A), m && this.unloadRecord(O), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: O,
          included: [],
          meta: T
        }, Promise.resolve(O);
      } catch (l) {
        return P && (h(A, "isError", !0), h(A, "isLoading", !1)), b && (h(v, "isError", !0), h(v, "isLoading", !1)), this.requestHashIds[d] = {
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
  ajax(s = {}) {
    return E.request(s);
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
    return es(s, e);
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
    return I(s, e);
  }
  isNumber(s) {
    return U(s);
  }
  isNil(s) {
    return R(s);
  }
  isNull(s) {
    return ss(s);
  }
  isGte(s, e) {
    return g(s, e);
  }
  isGt(s, e) {
    return Is(s, e);
  }
  isLte(s, e) {
    return ps(s, e);
  }
  isLt(s, e) {
    return G(s, e);
  }
}
export {
  As as default
};
