import F from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T } from "uuid";
import os from "crypto-js";
const { makeObservable: rs, observable: N, action: k, toJS: x } = is, {
  get: t,
  set: h,
  find: b,
  findIndex: R,
  isObject: as,
  isArray: m,
  isPlainObject: y,
  isNumber: Q,
  isNull: ns,
  isNil: $,
  isEmpty: v,
  isEqual: _,
  gte: P,
  lt: W,
  flatMap: cs,
  map: X,
  entries: hs,
  forEach: u,
  keysIn: E,
  omit: w
} = ts, Y = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, z = {
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
], ds = [
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
class _s {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), rs(this, {
      collections: N,
      aliases: N,
      requestHashIds: N,
      _pushPayloadToCollection: k,
      _pushRequestHash: k,
      _addCollection: k,
      _addAlias: k
    });
  }
  _initializeAxiosConfig() {
    F.defaults.baseURL = this._getBaseURL();
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
    const i = m(e), o = y(e);
    i && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: T() }) {
    const e = JSON.stringify(s);
    return os.MD5(e).toString();
  }
  _getProperty(s) {
    return t(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const i = w(
      x(this.originalRecord),
      L
    ), o = w(x(this), L);
    _(i, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, a = "") {
      return cs(hs(d), ([l, n]) => {
        const c = a ? `${a}.${l}` : l;
        return as(n) && !m(n) && n !== null ? e(n, c) : { key: c, value: n };
      });
    }
    const i = e(s);
    u(i, ({ key: d, value: a }) => h(this, d, a));
    const o = w(
      x(this.originalRecord),
      L
    ), r = w(x(this), L);
    _(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = E(this.aliases), i = t(s, "collectionName"), o = R(this.collections[i], {
      hashId: t(s, "hashId")
    });
    P(o, 0) && this.collections[i].splice(o, 1), u(e, (r) => {
      const d = m(this.aliases[r]), a = y(this.aliases[r]);
      if (d) {
        const l = R(this.aliases[r], {
          hashId: t(s, "hashId")
        });
        P(l, 0) && this.aliases[r].splice(l, 1);
      }
      a && _(
        t(s, "hashId"),
        t(this.aliases[r], "hashId")
      ) && (this.aliases[r] = {});
    });
  }
  _saveRecord(s) {
    const e = t(s, "collectionName"), i = b(this.collections[e], {
      hashId: t(s, "hashId")
    }), o = Q(t(i, "id")), r = o ? t(i, "id") : null, d = e, a = o ? "put" : "post", l = { data: i }, n = {
      resourceMethod: a,
      resourceName: d,
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: l,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _deleteRecord(s) {
    const e = t(s, "collectionName"), i = b(this.collections[e], {
      hashId: t(s, "hashId")
    }), o = t(s, "id"), a = {
      resourceMethod: "delete",
      resourceName: t(i, "collectionName"),
      resourceId: Number(o),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(a);
  }
  async _reloadRecord(s) {
    const e = t(s, "id"), r = {
      resourceMethod: "get",
      resourceName: t(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipTimestamp: T() }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, i) {
    const o = t(e, "referenceKey") || "", r = t(e, "async") || !1, d = t(i, o) || [], a = N([]);
    return u(d, (l) => {
      const n = this._generateHashId({
        id: t(l, "id"),
        collectionName: s
      }), c = b(this.collections[s], {
        hashId: n
      });
      if (!v(c))
        a.push(c);
      else if (r) {
        const p = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: t(l, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, I = z;
        this._pushRequestHash(
          p,
          I
        ), this._request(p);
      }
    }), a;
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
    }, i = E(e);
    u(i, (o) => {
      s[o] = e[o];
    });
  }
  _injectReferenceKeys(s, e, i = null) {
    const o = ns(i) ? this._generateHashId({
      id: t(e, "id"),
      collectionName: s
    }) : i;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const i = m(e), o = y(e), r = E(this.aliases), d = E(this.requestHashIds);
    let a = null;
    if (i) {
      const l = X(e, "hashId");
      u(e, (n) => {
        const c = R(
          this.collections[s],
          {
            hashId: t(n, "hashId")
          }
        );
        this._injectActions(n), W(c, 0) && this.collections[s].push(n), P(c, 0) && (this.collections[s][c] = n);
      }), a = X(
        l,
        (n) => b(this.collections[s], {
          hashId: n
        })
      ), u(r, (n) => {
        const c = m(this.aliases[n]), p = y(this.aliases[n]);
        c && u(a, (I) => {
          const g = R(this.aliases[n], {
            hashId: t(I, "hashId")
          });
          P(g, 0) && (this.aliases[n][g] = I);
        }), p && u(a, (I) => {
          _(
            t(I, "hashId"),
            t(this.aliases[n], "hashId")
          ) && (this.aliases[n] = I);
        });
      });
    }
    if (o) {
      const l = e.hashId, n = R(
        this.collections[s],
        {
          hashId: t(e, "hashId")
        }
      );
      this._injectActions(e), W(n, 0) && this.collections[s].push(e), P(n, 0) && (this.collections[s][n] = e), a = b(this.collections[s], {
        hashId: l
      }), u(r, (c) => {
        const p = m(this.aliases[c]), I = y(this.aliases[c]);
        p && u([a], (g) => {
          const q = R(this.aliases[c], {
            hashId: t(g, "hashId")
          });
          P(q, 0) && (this.aliases[c][q] = g);
        }), I && _(
          t(a, "hashId"),
          t(this.aliases[c], "hashId")
        ) && (this.aliases[c] = a);
      }), u(d, (c) => {
        const p = t(
          this.requestHashIds[c],
          "data"
        ), I = m(p), g = y(p);
        I && u([a], (q) => {
          const j = R(
            t(this.requestHashIds[c], "data"),
            {
              hashId: t(q, "hashId")
            }
          );
          P(j, 0) && (this.requestHashIds[c].data[j] = q);
        }), g && _(
          t(a, "hashId"),
          t(this.requestHashIds[c], "data.hashId")
        ) && h(
          this.requestHashIds[c],
          "data",
          a
        );
      });
    }
    return a;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const i = this._generateHashId(s), o = !$(this.requestHashIds[i]), r = t(e, "isNew");
    return o && r ? h(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    F.defaults.headers.common[`${s}`] = e;
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
    return y(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}) {
    return h(e, "id", T()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), b(this.collections[s], {
      hashId: t(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: i,
    resourceParams: o,
    resourcePayload: r,
    resourceFallback: d,
    resourceConfig: a
  }) {
    var U, V, G;
    const l = {
      method: s,
      url: e
    }, n = this._generateHashId({ ...arguments[0] }), c = _(s, "get"), p = _(s, "delete"), I = _(s, "post"), g = Q(i), q = !v(o), j = !v(r), O = t(r, "data") || null;
    if (g && h(l, "url", `${e}/${i}`), q && h(l, "params", o), j) {
      const f = {
        data: w(O, ds)
      };
      h(l, "data", f);
    }
    const D = !$(t(a, "skip")), S = _(t(a, "skip"), !0), M = this.requestHashIds[n], B = !$(M), J = t(M, "isNew");
    if (_(
      t(M, "isLoading"),
      !0
    ), !(c && (D && S || !D && B && !J || D && !S && B && !J))) {
      j && h(O, "isLoading", !0);
      try {
        const f = await F(l), A = ((U = f == null ? void 0 : f.data) == null ? void 0 : U.data) || d, Z = ((V = f == null ? void 0 : f.data) == null ? void 0 : V.included) || [], K = ((G = f == null ? void 0 : f.data) == null ? void 0 : G.meta) || {}, ss = y(A), es = m(A);
        let C = null;
        return es && u(
          A,
          (H) => this._injectReferenceKeys(e, H)
        ), ss && this._injectReferenceKeys(e, A), u(Z, (H) => {
          this._injectReferenceKeys(
            t(H, this.payloadIncludedReference),
            H
          ), this._pushPayloadToCollection(
            t(H, "collectionName"),
            H
          );
        }), C = await this._pushPayloadToCollection(
          e,
          A
        ), a.alias && this._addAlias(
          t(a, "alias"),
          C
        ), I && this.unloadRecord(O), p && this.unloadRecord(C), this.requestHashIds[n] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: C,
          included: [],
          meta: K
        }, Promise.resolve(C);
      } catch (f) {
        return j && (h(O, "isError", !0), h(O, "isLoading", !1)), this.requestHashIds[n] = {
          isLoading: !1,
          isError: !0,
          isNew: !1,
          data: f,
          included: [],
          meta: {}
        }, Promise.reject(f);
      }
    }
  }
  query(s, e = {}, i = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: i
    }, r = Y, d = this._pushRequestHash(
      o,
      r
    );
    return this._request(o), d;
  }
  queryRecord(s, e = {}, i = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, r = z, d = this._pushRequestHash(
      o,
      r
    );
    return this._request(o), d;
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
    }, o = Y, r = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), r;
  }
  findRecord(s, e, i = {}, o = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: i,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: o
    }, d = z, a = this._pushRequestHash(
      r,
      d
    );
    return this._request(r), a;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return b(this.collections[s], {
      id: e
    });
  }
}
export {
  _s as default
};
