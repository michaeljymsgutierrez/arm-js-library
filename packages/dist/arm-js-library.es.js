import L from "axios";
import es from "lodash";
import * as ts from "mobx";
import { v1 as B } from "uuid";
import is from "crypto-js";
const { makeObservable: rs, observable: N, action: k, toJS: x } = ts, {
  get: t,
  set: h,
  find: b,
  findIndex: R,
  isObject: os,
  isArray: m,
  isPlainObject: y,
  isNumber: J,
  isNull: as,
  isNil: M,
  isEmpty: F,
  isEqual: _,
  gte: P,
  lt: U,
  flatMap: ns,
  map: V,
  entries: cs,
  forEach: u,
  keysIn: E,
  omit: w
} = es, G = {
  isLoading: !0,
  isError: !1,
  isNew: !0,
  data: [],
  included: [],
  meta: {}
}, Q = {
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
    const i = m(e), r = y(e);
    i && (this.aliases[s] = e || []), r && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: B() }) {
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
    ), r = w(x(this), D);
    _(i, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, a = "") {
      return ns(cs(d), ([l, n]) => {
        const c = a ? `${a}.${l}` : l;
        return os(n) && !m(n) && n !== null ? e(n, c) : { key: c, value: n };
      });
    }
    const i = e(s);
    u(i, ({ key: d, value: a }) => h(this, d, a));
    const r = w(
      x(this.originalRecord),
      D
    ), o = w(x(this), D);
    _(r, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = E(this.aliases), i = t(s, "collectionName"), r = R(this.collections[i], {
      hashId: t(s, "hashId")
    });
    P(r, 0) && this.collections[i].splice(r, 1), u(e, (o) => {
      const d = m(this.aliases[o]), a = y(this.aliases[o]);
      if (d) {
        const l = R(this.aliases[o], {
          hashId: t(s, "hashId")
        });
        P(l, 0) && this.aliases[o].splice(l, 1);
      }
      a && _(
        t(s, "hashId"),
        t(this.aliases[o], "hashId")
      ) && (this.aliases[o] = {});
    });
  }
  _saveRecord(s) {
    const e = t(s, "collectionName"), i = b(this.collections[e], {
      hashId: t(s, "hashId")
    }), r = J(t(i, "id")), o = r ? t(i, "id") : null, d = e, a = r ? "put" : "post", l = { data: i }, n = {
      resourceMethod: a,
      resourceName: d,
      resourceId: Number(o),
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
    }), r = t(s, "id"), a = {
      resourceMethod: "delete",
      resourceName: t(i, "collectionName"),
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(a);
  }
  async _reloadRecord(s) {
    const e = t(s, "id"), o = {
      resourceMethod: "get",
      resourceName: t(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skip: !1 }
    };
    return this._request(o);
  }
  _getCollectionRecord(s, e = {}, i) {
    const r = t(e, "referenceKey") || "", o = t(e, "async") || !1, d = t(i, r) || [], a = N([]);
    return u(d, (l) => {
      const n = this._generateHashId({
        id: t(l, "id"),
        collectionName: s
      }), c = b(this.collections[s], {
        hashId: n
      });
      F(c) ? o && this._request({
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
      getCollection: (r, o) => this._getCollectionRecord(
        r,
        o,
        s
      )
    }, i = E(e);
    u(i, (r) => {
      s[r] = e[r];
    });
  }
  _injectReferenceKeys(s, e, i = null) {
    const r = as(i) ? this._generateHashId({
      id: t(e, "id"),
      collectionName: s
    }) : i;
    h(e, "collectionName", s), h(e, "hashId", r), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const i = m(e), r = y(e), o = E(this.aliases), d = E(this.requestHashIds);
    let a = null;
    if (i) {
      const l = V(e, "hashId");
      u(e, (n) => {
        const c = R(
          this.collections[s],
          {
            hashId: t(n, "hashId")
          }
        );
        this._injectActions(n), U(c, 0) && this.collections[s].push(n), P(c, 0) && (this.collections[s][c] = n);
      }), a = V(
        l,
        (n) => b(this.collections[s], {
          hashId: n
        })
      ), u(o, (n) => {
        const c = m(this.aliases[n]), g = y(this.aliases[n]);
        c && u(a, (I) => {
          const p = R(this.aliases[n], {
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
    if (r) {
      const l = e.hashId, n = R(
        this.collections[s],
        {
          hashId: t(e, "hashId")
        }
      );
      this._injectActions(e), U(n, 0) && this.collections[s].push(e), P(n, 0) && (this.collections[s][n] = e), a = b(this.collections[s], {
        hashId: l
      }), u(o, (c) => {
        const g = m(this.aliases[c]), I = y(this.aliases[c]);
        g && u([a], (p) => {
          const q = R(this.aliases[c], {
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
        ), I = m(g), p = y(g);
        I && u([a], (q) => {
          const j = R(
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
    const i = this._generateHashId(s), r = !M(this.requestHashIds[i]), o = t(e, "isNew");
    return r && o ? h(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
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
    return y(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}) {
    return h(e, "id", B()), this._injectReferenceKeys(s, e), this._injectActions(e), this.collections[s].push(e), b(this.collections[s], {
      hashId: t(e, "hashId")
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: i,
    resourceParams: r,
    resourcePayload: o,
    resourceFallback: d,
    resourceConfig: a
  }) {
    var v, z, S;
    const l = {
      method: s,
      url: e
    }, n = this._generateHashId({ ...arguments[0] }), c = _(s, "get"), g = _(s, "delete"), I = _(s, "post"), p = J(i), q = !F(r), j = !F(o), A = t(o, "data") || null;
    if (p && h(l, "url", `${e}/${i}`), q && h(l, "params", r), j) {
      const f = {
        data: w(A, hs)
      };
      h(l, "data", f);
    }
    const T = M(t(a, "skip")) ? !0 : t(a, "skip"), $ = this.requestHashIds[n], W = !M($), X = t($, "isNew");
    if (!(c && (T || W && !X && T))) {
      j && h(A, "isLoading", !0);
      try {
        const f = await L(l), O = ((v = f == null ? void 0 : f.data) == null ? void 0 : v.data) || d, Y = ((z = f == null ? void 0 : f.data) == null ? void 0 : z.included) || [], Z = ((S = f == null ? void 0 : f.data) == null ? void 0 : S.meta) || {}, K = y(O), ss = m(O);
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
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: i
    }, o = G, d = this._pushRequestHash(
      r,
      o
    );
    return this._request(r), d;
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
    }, o = Q, d = this._pushRequestHash(
      r,
      o
    );
    return this._request(r), d;
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
    }, r = G, o = this._pushRequestHash(
      i,
      r
    );
    return this._request(i), o;
  }
  findRecord(s, e, i = {}, r = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: i,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: r
    }, d = Q, a = this._pushRequestHash(
      o,
      d
    );
    return this._request(o), a;
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
  ps as default
};
