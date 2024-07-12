import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T, NIL as rs } from "uuid";
import os from "crypto-js";
const { makeObservable: as, observable: C, action: w, toJS: N } = is, {
  get: o,
  set: c,
  find: g,
  findIndex: m,
  isObject: ns,
  isArray: p,
  isPlainObject: I,
  isNumber: Q,
  isNull: cs,
  isNil: k,
  isEmpty: $,
  isEqual: _,
  gte: y,
  lt: W,
  flatMap: hs,
  map: X,
  entries: ds,
  forEach: l,
  keysIn: x,
  omit: H
} = ts, Y = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, v = {
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
], ls = [
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
class gs {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), as(this, {
      collections: C,
      aliases: C,
      requestHashIds: C,
      _pushPayload: w,
      _pushRequestHash: w,
      _addCollection: w,
      _addAlias: w
    });
  }
  _initializeAxiosConfig() {
    M.defaults.baseURL = this._getBaseURL();
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
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const i = p(e), r = I(e);
    i && (this.aliases[s] = e || []), r && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: T() }) {
    const e = JSON.stringify(s);
    return os.MD5(e).toString();
  }
  _getProperty(s) {
    return o(this, s);
  }
  _setProperty(s, e) {
    c(this, s, e);
    const i = H(
      N(this.originalRecord),
      E
    ), r = H(N(this), E);
    _(i, r) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return hs(ds(a), ([h, d]) => {
        const f = n ? `${n}.${h}` : h;
        return ns(d) && !p(d) && d !== null ? e(d, f) : { key: f, value: d };
      });
    }
    const i = e(s);
    l(i, ({ key: a, value: n }) => c(this, a, n));
    const r = H(
      N(this.originalRecord),
      E
    ), t = H(N(this), E);
    _(r, t) ? (c(this, "isDirty", !1), c(this, "isPristine", !0)) : (c(this, "isDirty", !0), c(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = x(this.aliases), i = o(s, "collectionName"), r = m(this.collections[i], {
      hashId: o(s, "hashId")
    });
    y(r, 0) && this.collections[i].splice(r, 1), l(e, (t) => {
      const a = p(this.aliases[t]), n = I(this.aliases[t]);
      if (a) {
        const h = m(this.aliases[t], {
          hashId: o(s, "hashId")
        });
        y(h, 0) && this.aliases[t].splice(h, 1);
      }
      n && _(
        o(s, "hashId"),
        o(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  _saveRecord(s) {
    const e = o(s, "collectionName"), i = g(this.collections[e], {
      hashId: o(s, "hashId")
    }), r = Q(o(i, "id")), t = r ? o(i, "id") : null, d = {
      resourceMethod: r ? "put" : "post",
      resourceName: e,
      resourceId: t,
      resourceParams: {},
      resourcePayload: { data: i },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(d);
  }
  async _deleteRecord(s) {
    const e = o(s, "collectionName"), i = g(this.collections[e], {
      hashId: o(s, "hashId")
    }), r = o(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: o(i, "collectionName"),
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = o(s, "id"), t = {
      resourceMethod: "get",
      resourceName: o(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: T() }
    };
    return this._request(t);
  }
  _getCollectionRecord(s, e = {}, i) {
    const r = o(e, "referenceKey") || "", t = o(e, "async") || !1, a = o(i, r) || [], h = I(
      a
    ) ? [a] : a, d = C([]);
    return l(h, (f) => {
      const q = this._generateHashId({
        id: o(f, "id"),
        collectionName: s
      }), O = g(this.collections[s], {
        hashId: q
      });
      if (!$(O))
        d.push(O);
      else if (t) {
        const A = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: o(f, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, L = v;
        this._pushRequestHash(A, L), this._request(A);
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
      getCollection: (r, t) => this._getCollectionRecord(
        r,
        t,
        s
      )
    }, i = x(e);
    l(i, (r) => {
      s[r] = e[r];
    });
  }
  _injectReferenceKeys(s, e, i = null) {
    const r = cs(i) ? this._generateHashId({
      id: o(e, "id"),
      collectionName: s
    }) : i;
    c(e, "collectionName", s), c(e, "hashId", r), c(e, "isLoading", !1), c(e, "isError", !1), c(e, "isPristine", !0), c(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const i = p(e), r = I(e);
    if (i) {
      const t = X(e, "hashId");
      return l(e, (a) => {
        const n = m(
          this.collections[s],
          {
            hashId: o(a, "hashId")
          }
        );
        this._injectActions(a), W(n, 0) && this.collections[s].push(a), y(n, 0) && (this.collections[s][n] = a);
      }), X(
        t,
        (a) => g(this.collections[s], {
          hashId: a
        })
      );
    }
    if (r) {
      const t = e.hashId, a = m(
        this.collections[s],
        {
          hashId: o(e, "hashId")
        }
      );
      return this._injectActions(e), W(a, 0) && this.collections[s].push(e), y(a, 0) && (this.collections[s][a] = e), g(this.collections[s], {
        hashId: t
      });
    }
  }
  _pushToAliases(s) {
    const e = p(s), i = I(s), r = x(this.aliases);
    e && l(r, (t) => {
      const a = p(this.aliases[t]), n = I(this.aliases[t]);
      a && l(s, (h) => {
        const d = m(this.aliases[t], {
          hashId: o(h, "hashId")
        });
        y(d, 0) && (this.aliases[t][d] = h);
      }), n && l(s, (h) => {
        _(
          o(h, "hashId"),
          o(this.aliases[t], "hashId")
        ) && (this.aliases[t] = h);
      });
    }), i && l(r, (t) => {
      const a = p(this.aliases[t]), n = I(this.aliases[t]);
      a && l([s], (h) => {
        const d = m(this.aliases[t], {
          hashId: o(h, "hashId")
        });
        y(d, 0) && (this.aliases[t][d] = h);
      }), n && _(
        o(s, "hashId"),
        o(this.aliases[t], "hashId")
      ) && (this.aliases[t] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = x(this.requestHashIds), i = p(s), r = I(s);
    let t = null;
    i && (t = s), r && (t = [s]), l(e, (a) => {
      const n = o(
        this.requestHashIds[a],
        "data"
      ), h = p(n), d = I(n);
      l(t, (f) => {
        if (h) {
          const q = m(
            o(this.requestHashIds[a], "data"),
            {
              hashId: o(f, "hashId")
            }
          );
          y(q, 0) && (this.requestHashIds[a].data[q] = f);
        }
        d && _(
          o(f, "hashId"),
          o(this.requestHashIds[a], "data.hashId")
        ) && c(
          this.requestHashIds[a],
          "data",
          f
        );
      });
    });
  }
  _pushPayload(s, e) {
    const i = this._pushToCollection(
      s,
      e
    );
    return this._pushToAliases(i), this._pushToRequestHashes(i), i;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const i = this._generateHashId(s), r = !k(this.requestHashIds[i]), t = o(e, "isNew");
    return r && t ? c(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
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
  createRecord(s, e = {}, i = !0) {
    const r = i ? T() : rs, t = k(
      g(this.collections[s], {
        id: r
      })
    );
    return c(e, "id", r), this._injectReferenceKeys(s, e), this._injectActions(e), t && this.collections[s].push(e), g(this.collections[s], {
      id: r
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: i,
    resourceParams: r,
    resourcePayload: t,
    resourceFallback: a,
    resourceConfig: n
  }) {
    var U, V, G;
    const h = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), f = _(s, "get"), q = _(s, "delete"), O = _(s, "post"), A = Q(i), L = !$(r), D = !$(t), R = o(t, "data") || null;
    if (A && c(h, "url", `${e}/${i}`), L && c(h, "params", r), D) {
      const u = {
        data: H(R, ls)
      };
      c(h, "data", u);
    }
    const F = !k(o(n, "skip")), z = _(o(n, "skip"), !0), S = this.requestHashIds[d], B = !k(S), J = o(S, "isNew");
    if (!(f && (F && z || !F && B && !J || F && !z && B && !J))) {
      D && c(R, "isLoading", !0);
      try {
        const u = await M(h), j = ((U = u == null ? void 0 : u.data) == null ? void 0 : U.data) || a, Z = ((V = u == null ? void 0 : u.data) == null ? void 0 : V.included) || [], K = ((G = u == null ? void 0 : u.data) == null ? void 0 : G.meta) || {}, ss = I(j), es = p(j);
        let P = null;
        return es && l(
          j,
          (b) => this._injectReferenceKeys(e, b)
        ), ss && this._injectReferenceKeys(e, j), l(Z, (b) => {
          this._injectReferenceKeys(
            o(b, this.payloadIncludedReference),
            b
          ), this._pushPayload(
            o(b, "collectionName"),
            b
          );
        }), P = await this._pushPayload(
          e,
          j
        ), n.alias && this._addAlias(
          o(n, "alias"),
          P
        ), O && this.unloadRecord(R), q && this.unloadRecord(P), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: P,
          included: [],
          meta: K
        }, Promise.resolve(P);
      } catch (u) {
        return D && (c(R, "isError", !0), c(R, "isLoading", !1)), this.requestHashIds[d] = {
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
  query(s, e = {}, i = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: i
    }, t = Y, a = this._pushRequestHash(
      r,
      t
    );
    return this._request(r), a;
  }
  queryRecord(s, e = {}, i = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, t = v, a = this._pushRequestHash(
      r,
      t
    );
    return this._request(r), a;
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
    }, r = Y, t = this._pushRequestHash(
      i,
      r
    );
    return this._request(i), t;
  }
  findRecord(s, e, i = {}, r = {}) {
    const t = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: i,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: r
    }, a = v, n = this._pushRequestHash(
      t,
      a
    );
    return this._request(t), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return g(this.collections[s], {
      id: e
    });
  }
}
export {
  gs as default
};
