import L from "axios";
import es from "lodash";
import * as ts from "mobx";
import { v1 as S } from "uuid";
import is from "crypto-js";
const { makeObservable: os, observable: k, action: N, toJS: x } = ts, {
  get: t,
  set: h,
  find: R,
  findIndex: b,
  isObject: rs,
  isArray: y,
  isPlainObject: m,
  isNumber: B,
  isNull: as,
  isNil: M,
  isEmpty: F,
  isEqual: _,
  gte: P,
  lt: J,
  flatMap: ns,
  map: U,
  entries: cs,
  forEach: u,
  keysIn: E,
  omit: w
} = es, V = {
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
}, D = [
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
], hs = [
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
class ps {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), os(this, {
      collections: k,
      aliases: k,
      requestHashIds: k,
      _pushPayloadToCollection: N,
      _pushRequestHash: N,
      _addCollection: N,
      _addAlias: N
    });
  }
  _initializeAxiosConfig() {
    L.defaults.baseURL = this._getBaseURL();
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
    const i = y(e), o = m(e);
    i && (this.aliases[s] = e || []), o && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: S() }) {
    const e = JSON.stringify(s);
    return is.MD5(e).toString();
  }
  _getProperty(s) {
    return t(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const i = w(
      x(this.originalRecord),
      D
    ), o = w(x(this), D);
    _(i, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, a = "") {
      return ns(cs(d), ([l, n]) => {
        const c = a ? `${a}.${l}` : l;
        return rs(n) && !y(n) && n !== null ? e(n, c) : { key: c, value: n };
      });
    }
    const i = e(s);
    u(i, ({ key: d, value: a }) => h(this, d, a));
    const o = w(
      x(this.originalRecord),
      D
    ), r = w(x(this), D);
    _(o, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = E(this.aliases), i = t(s, "collectionName"), o = b(this.collections[i], {
      hashId: t(s, "hashId")
    });
    P(o, 0) && this.collections[i].splice(o, 1), u(e, (r) => {
      const d = y(this.aliases[r]), a = m(this.aliases[r]);
      if (d) {
        const l = b(this.aliases[r], {
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
    const e = t(s, "collectionName"), i = R(this.collections[e], {
      hashId: t(s, "hashId")
    }), o = B(t(i, "id")), r = o ? t(i, "id") : null, n = {
      resourceMethod: o ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: i },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _deleteRecord(s) {
    const e = t(s, "collectionName"), i = R(this.collections[e], {
      hashId: t(s, "hashId")
    }), o = t(s, "id"), a = {
      resourceMethod: "delete",
      resourceName: t(i, "collectionName"),
      resourceId: o,
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
      resourceId: e,
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !1 }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, i) {
    const o = t(e, "referenceKey") || "", r = t(e, "async") || !1, d = t(i, o) || [], a = k([]);
    return u(d, (l) => {
      const n = this._generateHashId({
        id: t(l, "id"),
        collectionName: s
      }), c = R(this.collections[s], {
        hashId: n
      });
      F(c) ? r && this._request({
        resourceMethod: "get",
        resourceName: s,
        resourceId: t(l, "id"),
        resourceParams: {},
        resourcePayload: null,
        resourceFallback: {},
        resourceConfig: { skip: !0 }
      }) : a.push(c);
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
    const o = as(i) ? this._generateHashId({
      id: t(e, "id"),
      collectionName: s
    }) : i;
    h(e, "collectionName", s), h(e, "hashId", o), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const i = y(e), o = m(e), r = E(this.aliases), d = E(this.requestHashIds);
    let a = null;
    if (i) {
      const l = U(e, "hashId");
      u(e, (n) => {
        const c = b(
          this.collections[s],
          {
            hashId: t(n, "hashId")
          }
        );
        this._injectActions(n), J(c, 0) && this.collections[s].push(n), P(c, 0) && (this.collections[s][c] = n);
      }), a = U(
        l,
        (n) => R(this.collections[s], {
          hashId: n
        })
      ), u(r, (n) => {
        const c = y(this.aliases[n]), g = m(this.aliases[n]);
        c && u(a, (I) => {
          const p = b(this.aliases[n], {
            hashId: t(I, "hashId")
          });
          P(p, 0) && (this.aliases[n][p] = I);
        }), g && u(a, (I) => {
          _(
            t(I, "hashId"),
            t(this.aliases[n], "hashId")
          ) && (this.aliases[n] = I);
        });
      });
    }
    if (o) {
      const l = e.hashId, n = b(
        this.collections[s],
        {
          hashId: t(e, "hashId")
        }
      );
      this._injectActions(e), J(n, 0) && this.collections[s].push(e), P(n, 0) && (this.collections[s][n] = e), a = R(this.collections[s], {
        hashId: l
      }), u(r, (c) => {
        const g = y(this.aliases[c]), I = m(this.aliases[c]);
        g && u([a], (p) => {
          const q = b(this.aliases[c], {
            hashId: t(p, "hashId")
          });
          P(q, 0) && (this.aliases[c][q] = p);
        }), I && _(
          t(a, "hashId"),
          t(this.aliases[c], "hashId")
        ) && (this.aliases[c] = a);
      }), u(d, (c) => {
        const g = t(
          this.requestHashIds[c],
          "data"
        ), I = y(g), p = m(g);
        I && u([a], (q) => {
          const j = b(
            t(this.requestHashIds[c], "data"),
            {
              hashId: t(q, "hashId")
            }
          );
          P(j, 0) && (this.requestHashIds[c].data[j] = q);
        }), p && _(
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
    const i = this._generateHashId(s), o = !M(this.requestHashIds[i]), r = t(e, "isNew");
    return o && r ? h(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
  }
  setHost(s) {
    this.host = s, this._initializeAxiosConfig();
  }
  setNamespace(s) {
    this.namespace = s;
  }
  setHeadersCommon(s, e) {
    L.defaults.headers.common[`${s}`] = e;
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
    return m(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}) {
    return h(e, "id", S()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), R(this.collections[s], {
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
    var $, v, z;
    const l = {
      method: s,
      url: e
    }, n = this._generateHashId({ ...arguments[0] }), c = _(s, "get"), g = _(s, "delete"), I = _(s, "post"), p = B(i), q = !F(o), j = !F(r), A = t(r, "data") || null;
    if (p && h(l, "url", `${e}/${i}`), q && h(l, "params", o), j) {
      const f = {
        data: w(A, hs)
      };
      h(l, "data", f);
    }
    const Q = M(t(a, "skip")) ? !0 : t(a, "skip"), T = this.requestHashIds[n], W = !M(T), X = t(T, "isNew");
    if (!(c && W && !X && Q)) {
      j && h(A, "isLoading", !0);
      try {
        const f = await L(l), O = (($ = f == null ? void 0 : f.data) == null ? void 0 : $.data) || d, Y = ((v = f == null ? void 0 : f.data) == null ? void 0 : v.included) || [], Z = ((z = f == null ? void 0 : f.data) == null ? void 0 : z.meta) || {}, K = m(O), ss = y(O);
        let C = null;
        return ss && u(
          O,
          (H) => this._injectReferenceKeys(e, H)
        ), K && this._injectReferenceKeys(e, O), u(Y, (H) => {
          this._injectReferenceKeys(
            t(H, this.payloadIncludedReference),
            H
          ), this._pushPayloadToCollection(
            t(H, "collectionName"),
            H
          );
        }), C = await this._pushPayloadToCollection(
          e,
          O
        ), a.alias && this._addAlias(
          t(a, "alias"),
          C
        ), I && this.unloadRecord(A), g && this.unloadRecord(C), this.requestHashIds[n] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: C,
          included: [],
          meta: Z
        }, Promise.resolve(C);
      } catch (f) {
        return j && (h(A, "isError", !0), h(A, "isLoading", !1)), this.requestHashIds[n] = {
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
    }, r = V, d = this._pushRequestHash(
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
    }, r = G, d = this._pushRequestHash(
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
    }, o = V, r = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), r;
  }
  findRecord(s, e, i = {}, o = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: e,
      resourceParams: i,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: o
    }, d = G, a = this._pushRequestHash(
      r,
      d
    );
    return this._request(r), a;
  }
  peekAll(s) {
    return this.collections[s];
  }
  peekRecord(s, e) {
    return R(this.collections[s], {
      id: e
    });
  }
}
export {
  ps as default
};
