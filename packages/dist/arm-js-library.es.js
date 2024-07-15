import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T, NIL as rs } from "uuid";
import os from "crypto-js";
const { makeObservable: as, observable: C, action: w, toJS: N } = is, {
  get: o,
  set: h,
  find: q,
  findIndex: m,
  isObject: ns,
  isArray: p,
  isPlainObject: I,
  isNumber: Q,
  isNull: hs,
  isNil: k,
  isEmpty: $,
  isEqual: _,
  gte: g,
  lt: W,
  flatMap: cs,
  map: X,
  entries: ds,
  forEach: u,
  keysIn: F,
  omit: P
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
class qs {
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
    return os.MD5(e).toString();
  }
  _getProperty(s) {
    return o(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = P(
      N(this.originalRecord),
      x
    ), r = P(N(this), x);
    _(t, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return cs(ds(a), ([d, c]) => {
        const f = n ? `${n}.${d}` : d;
        return ns(c) && !p(c) && c !== null ? e(c, f) : { key: f, value: c };
      });
    }
    const t = e(s);
    u(t, ({ key: a, value: n }) => h(this, a, n));
    const r = P(
      N(this.originalRecord),
      x
    ), i = P(N(this), x);
    _(r, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _unloadFromCollection(s) {
    const e = o(s, "collectionName"), t = m(this.collections[e], {
      hashId: o(s, "hashId")
    });
    g(t, 0) && this.collections[e].splice(t, 1);
  }
  _unloadFromRequestHashes(s) {
    const e = F(this.requestHashIds);
    u(e, (t) => {
      const r = o(
        this.requestHashIds[t],
        "data"
      ), i = p(r), a = I(r);
      if (i) {
        const n = m(
          o(this.requestHashIds[t], "data"),
          {
            hashId: o(s, "hashId")
          }
        );
        g(n, 0) && this.requestHashIds[t].data.splice(
          n,
          1
        );
      }
      a && _(
        o(s, "hashId"),
        o(this.requestHashIds[t], "data.hashId")
      ) && h(this.requestHashIds[t], "data", {});
    });
  }
  unloadRecord(s) {
    this._unloadFromCollection(s), this._unloadFromRequestHashes(s);
  }
  _saveRecord(s) {
    const e = o(s, "collectionName"), t = q(this.collections[e], {
      hashId: o(s, "hashId")
    }), r = Q(o(t, "id")), i = r ? o(t, "id") : null, c = {
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
    const e = o(s, "collectionName"), t = q(this.collections[e], {
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
      resourceConfig: { skipId: T() }
    };
    return this._request(i);
  }
  _getCollectionRecord(s, e = {}, t) {
    const r = o(e, "referenceKey") || "", i = o(e, "async") || !1, a = o(t, r) || [], d = I(
      a
    ) ? [a] : a, c = C([]);
    return u(d, (f) => {
      const y = this._generateHashId({
        id: o(f, "id"),
        collectionName: s
      }), O = q(this.collections[s], {
        hashId: y
      });
      if (!$(O))
        c.push(O);
      else if (i) {
        const A = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: o(f, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, D = v;
        this._pushRequestHash(A, D), this._request(A);
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
    }, t = F(e);
    u(t, (r) => {
      s[r] = e[r];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const r = hs(t) ? this._generateHashId({
      id: o(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", r), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = p(e), r = I(e);
    if (t) {
      const i = X(e, "hashId");
      return u(e, (a) => {
        const n = m(
          this.collections[s],
          {
            hashId: o(a, "hashId")
          }
        );
        this._injectActions(a), W(n, 0) && this.collections[s].push(a), g(n, 0) && (this.collections[s][n] = a);
      }), X(
        i,
        (a) => q(this.collections[s], {
          hashId: a
        })
      );
    }
    if (r) {
      const i = e.hashId, a = m(
        this.collections[s],
        {
          hashId: o(e, "hashId")
        }
      );
      return this._injectActions(e), W(a, 0) && this.collections[s].push(e), g(a, 0) && (this.collections[s][a] = e), q(this.collections[s], {
        hashId: i
      });
    }
  }
  _pushToAliases(s) {
    const e = p(s), t = I(s), r = F(this.aliases);
    e && u(r, (i) => {
      const a = p(this.aliases[i]), n = I(this.aliases[i]);
      a && u(s, (d) => {
        const c = m(this.aliases[i], {
          hashId: o(d, "hashId")
        });
        g(c, 0) && (this.aliases[i][c] = d);
      }), n && u(s, (d) => {
        _(
          o(d, "hashId"),
          o(this.aliases[i], "hashId")
        ) && (this.aliases[i] = d);
      });
    }), t && u(r, (i) => {
      const a = p(this.aliases[i]), n = I(this.aliases[i]);
      a && u([s], (d) => {
        const c = m(this.aliases[i], {
          hashId: o(d, "hashId")
        });
        g(c, 0) && (this.aliases[i][c] = d);
      }), n && _(
        o(s, "hashId"),
        o(this.aliases[i], "hashId")
      ) && (this.aliases[i] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = F(this.requestHashIds), t = p(s), r = I(s);
    let i = null;
    t && (i = s), r && (i = [s]), u(e, (a) => {
      const n = o(
        this.requestHashIds[a],
        "data"
      ), d = p(n), c = I(n);
      u(i, (f) => {
        if (d) {
          const y = m(
            o(this.requestHashIds[a], "data"),
            {
              hashId: o(f, "hashId")
            }
          );
          g(y, 0) && (this.requestHashIds[a].data[y] = f);
        }
        c && _(
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
    const t = this._generateHashId(s), r = !k(this.requestHashIds[t]), i = o(e, "isNew");
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
    const r = t ? T() : rs, i = k(
      q(this.collections[s], {
        id: r
      })
    );
    return h(e, "id", r), this._injectReferenceKeys(s, e), this._injectActions(e), i && this.collections[s].push(e), q(this.collections[s], {
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
    var U, V, G;
    const d = {
      method: s,
      url: e
    }, c = this._generateHashId({ ...arguments[0] }), f = _(s, "get"), y = _(s, "delete"), O = _(s, "post"), A = Q(t), D = !$(r), E = !$(i), b = o(i, "data") || null;
    if (A && h(d, "url", `${e}/${t}`), D && h(d, "params", r), E) {
      const l = {
        data: P(b, us)
      };
      h(d, "data", l);
    }
    const L = !k(o(n, "skip")), z = _(o(n, "skip"), !0), S = this.requestHashIds[c], B = !k(S), J = o(S, "isNew");
    if (!(f && (L && z || !L && B && !J || L && !z && B && !J))) {
      E && h(b, "isLoading", !0);
      try {
        const l = await M(d), H = ((U = l == null ? void 0 : l.data) == null ? void 0 : U.data) || a, Z = ((V = l == null ? void 0 : l.data) == null ? void 0 : V.included) || [], K = ((G = l == null ? void 0 : l.data) == null ? void 0 : G.meta) || {}, ss = I(H), es = p(H);
        let j = null;
        return es && u(
          H,
          (R) => this._injectReferenceKeys(e, R)
        ), ss && this._injectReferenceKeys(e, H), u(Z, (R) => {
          this._injectReferenceKeys(
            o(R, this.payloadIncludedReference),
            R
          ), this._pushPayload(
            o(R, "collectionName"),
            R
          );
        }), j = await this._pushPayload(
          e,
          H
        ), n.alias && this._addAlias(
          o(n, "alias"),
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
    }, i = Y, a = this._pushRequestHash(
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
    }, i = v, a = this._pushRequestHash(
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
    }, a = v, n = this._pushRequestHash(
      i,
      a
    );
    return this._request(i), n;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return q(this.collections[s], {
      id: e
    });
  }
}
export {
  qs as default
};
