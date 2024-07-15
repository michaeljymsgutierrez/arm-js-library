import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T, NIL as rs } from "uuid";
import as from "crypto-js";
const { makeObservable: os, observable: w, action: N, toJS: k } = is, {
  get: a,
  set: h,
  find: m,
  findIndex: q,
  isObject: ns,
  isArray: p,
  isPlainObject: I,
  isNumber: Q,
  isNull: hs,
  isNil: F,
  isEmpty: $,
  isEqual: _,
  gte: g,
  lt: W,
  flatMap: cs,
  map: X,
  entries: ds,
  forEach: u,
  keysIn: P,
  omit: A
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
}, x = [
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
], us = [
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
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), os(this, {
      collections: w,
      aliases: w,
      requestHashIds: w,
      _pushPayload: N,
      _pushRequestHash: N,
      _addCollection: N,
      _addAlias: N
    });
  }
  _initializeAxiosConfig() {
    M.defaults.baseURL = this._getBaseURL();
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
  _addCollection(s, e) {
    this.collections[s] = e;
  }
  _addAlias(s, e) {
    const t = p(e), r = I(e);
    t && (this.aliases[s] = e || []), r && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: T() }) {
    const e = JSON.stringify(s);
    return as.MD5(e).toString();
  }
  _getProperty(s) {
    return a(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = A(
      k(this.originalRecord),
      x
    ), r = A(k(this), x);
    _(t, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(o, n = "") {
      return cs(ds(o), ([d, c]) => {
        const f = n ? `${n}.${d}` : d;
        return ns(c) && !p(c) && c !== null ? e(c, f) : { key: f, value: c };
      });
    }
    const t = e(s);
    u(t, ({ key: o, value: n }) => h(this, o, n));
    const r = A(
      k(this.originalRecord),
      x
    ), i = A(k(this), x);
    _(r, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _unloadFromCollection(s) {
    const e = a(s, "collectionName"), t = q(this.collections[e], {
      hashId: a(s, "hashId")
    });
    g(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = P(this.requestHashIds);
    u(e, (t) => {
      const r = a(
        this.requestHashIds[t],
        "data"
      ), i = p(r), o = I(r);
      if (i) {
        const n = q(
          a(this.requestHashIds[t], "data"),
          {
            hashId: a(s, "hashId")
          }
        );
        g(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      o && _(
        a(s, "hashId"),
        a(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  _unloadFromAliases(s) {
    const e = P(this.aliases);
    u(e, (t) => {
      const r = p(this.aliases[t]), i = I(this.aliases[t]);
      if (r) {
        const o = q(this.aliases[t], {
          hashId: a(s, "hashId")
        });
        g(o, 0) && this.aliases[t].splice(o, 1);
      }
      i && _(
        a(s, "hashId"),
        a(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s), this._unloadFromAliases(s);
  }
  _saveRecord(s) {
    const e = a(s, "collectionName"), t = m(this.collections[e], {
      hashId: a(s, "hashId")
    }), r = Q(a(t, "id")), i = r ? a(t, "id") : null, c = {
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
    const e = a(s, "collectionName"), t = m(this.collections[e], {
      hashId: a(s, "hashId")
    }), r = a(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: a(t, "collectionName"),
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = a(s, "id"), i = {
      resourceMethod: "get",
      resourceName: a(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: T() }
    };
    return this._request(i);
  }
  _getCollectionRecord(s, e = {}, t) {
    const r = a(e, "referenceKey") || "", i = a(e, "async") || !1, o = a(t, r) || [], d = I(
      o
    ) ? [o] : o, c = w([]);
    return u(d, (f) => {
      const y = this._generateHashId({
        id: a(f, "id"),
        collectionName: s
      }), O = m(this.collections[s], {
        hashId: y
      });
      if (!$(O))
        c.push(O);
      else if (i) {
        const C = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: a(f, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, D = v;
        this._pushRequestHash(C, D), this._request(C);
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
    }, t = P(e);
    u(t, (r) => {
      s[r] = e[r];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const r = hs(t) ? this._generateHashId({
      id: a(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", r), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = p(e), r = I(e);
    if (t) {
      const i = X(e, "hashId");
      return u(e, (o) => {
        const n = q(
          this.collections[s],
          {
            hashId: a(o, "hashId")
          }
        );
        this._injectActions(o), W(n, 0) && this.collections[s].push(o), g(n, 0) && (this.collections[s][n] = o);
      }), X(
        i,
        (o) => m(this.collections[s], {
          hashId: o
        })
      );
    }
    if (r) {
      const i = e.hashId, o = q(
        this.collections[s],
        {
          hashId: a(e, "hashId")
        }
      );
      return this._injectActions(e), W(o, 0) && this.collections[s].push(e), g(o, 0) && (this.collections[s][o] = e), m(this.collections[s], {
        hashId: i
      });
    }
  }
  _pushToAliases(s) {
    const e = p(s), t = I(s), r = P(this.aliases);
    e && u(r, (i) => {
      const o = p(this.aliases[i]), n = I(this.aliases[i]);
      o && u(s, (d) => {
        const c = q(this.aliases[i], {
          hashId: a(d, "hashId")
        });
        g(c, 0) && (this.aliases[i][c] = d);
      }), n && u(s, (d) => {
        _(
          a(d, "hashId"),
          a(this.aliases[i], "hashId")
        ) && (this.aliases[i] = d);
      });
    }), t && u(r, (i) => {
      const o = p(this.aliases[i]), n = I(this.aliases[i]);
      o && u([s], (d) => {
        const c = q(this.aliases[i], {
          hashId: a(d, "hashId")
        });
        g(c, 0) && (this.aliases[i][c] = d);
      }), n && _(
        a(s, "hashId"),
        a(this.aliases[i], "hashId")
      ) && (this.aliases[i] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = P(this.requestHashIds), t = p(s), r = I(s);
    let i = null;
    t && (i = s), r && (i = [s]), u(e, (o) => {
      const n = a(
        this.requestHashIds[o],
        "data"
      ), d = p(n), c = I(n);
      u(i, (f) => {
        if (d) {
          const y = q(
            a(this.requestHashIds[o], "data"),
            {
              hashId: a(f, "hashId")
            }
          );
          g(y, 0) && (this.requestHashIds[o].data[y] = f);
        }
        c && _(
          a(f, "hashId"),
          a(this.requestHashIds[o], "data.hashId")
        ) && h(
          this.requestHashIds[o],
          "data",
          f
        );
      });
    });
  }
  _pushPayload(s, e) {
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
    const t = this._generateHashId(s), r = !F(this.requestHashIds[t]), i = a(e, "isNew");
    return r && i ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
  createRecord(s, e = {}, t = !0) {
    const r = t ? T() : rs, i = F(
      m(this.collections[s], {
        id: r
      })
    );
    return h(e, "id", r), this._injectReferenceKeys(s, e), this._injectActions(e), i && this.collections[s].push(e), m(this.collections[s], {
      id: r
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: r,
    resourcePayload: i,
    resourceFallback: o,
    resourceConfig: n
  }) {
    var U, V, G;
    const d = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), f = _(s, "get"), y = _(s, "delete"), O = _(s, "post"), C = Q(t), D = !$(r), E = !$(i), b = a(i, "data") || null;
    if (C && h(d, "url", `${e}/${t}`), D && h(d, "params", r), E) {
      const l = {
        data: A(b, us)
      };
      h(d, "data", l);
    }
    const L = !F(a(n, "skip")), z = _(a(n, "skip"), !0), S = this.requestHashIds[c], B = !F(S), J = a(S, "isNew");
    if (!(f && (L && z || !L && B && !J || L && !z && B && !J))) {
      E && h(b, "isLoading", !0);
      try {
        const l = await M(d), H = ((U = l == null ? void 0 : l.data) == null ? void 0 : U.data) || o, Z = ((V = l == null ? void 0 : l.data) == null ? void 0 : V.included) || [], K = ((G = l == null ? void 0 : l.data) == null ? void 0 : G.meta) || {}, ss = I(H), es = p(H);
        let j = null;
        return es && u(
          H,
          (R) => this._injectReferenceKeys(e, R)
        ), ss && this._injectReferenceKeys(e, H), u(Z, (R) => {
          this._injectReferenceKeys(
            a(R, this.payloadIncludedReference),
            R
          ), this._pushPayload(
            a(R, "collectionName"),
            R
          );
        }), j = await this._pushPayload(
          e,
          H
        ), n.alias && this._addAlias(
          a(n, "alias"),
          j
        ), O && this.unloadRecord(b), y && this.unloadRecord(j), this.requestHashIds[c] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: j,
          included: [],
          meta: K
        }, Promise.resolve(j);
      } catch (l) {
        return E && (h(b, "isError", !0), h(b, "isLoading", !1)), this.requestHashIds[c] = {
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
    }, i = Y, o = this._pushRequestHash(
      r,
      i
    );
    return this._request(r), o;
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
    }, i = v, o = this._pushRequestHash(
      r,
      i
    );
    return this._request(r), o;
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
    }, r = Y, i = this._pushRequestHash(
      t,
      r
    );
    return this._request(t), i;
  }
  findRecord(s, e, t = {}, r = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: r
    }, o = v, n = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return m(this.collections[s], {
      id: e
    });
  }
}
export {
  ms as default
};
