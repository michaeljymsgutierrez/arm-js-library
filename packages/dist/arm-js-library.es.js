import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T } from "uuid";
import rs from "crypto-js";
const { makeObservable: os, observable: N, action: k, toJS: x } = is, {
  get: t,
  set: h,
  find: b,
  findIndex: q,
  isObject: as,
  isArray: R,
  isPlainObject: y,
  isNumber: Q,
  isNull: ns,
  isNil: $,
  isEmpty: v,
  isEqual: _,
  gte: j,
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
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), os(this, {
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
    const i = R(e), r = y(e);
    i && (this.aliases[s] = e || []), r && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: T() }) {
    const e = JSON.stringify(s);
    return rs.MD5(e).toString();
  }
  _getProperty(s) {
    return t(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const i = w(
      x(this.originalRecord),
      L
    ), r = w(x(this), L);
    _(i, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, n = "") {
      return cs(hs(d), ([l, a]) => {
        const c = n ? `${n}.${l}` : l;
        return as(a) && !R(a) && a !== null ? e(a, c) : { key: c, value: a };
      });
    }
    const i = e(s);
    u(i, ({ key: d, value: n }) => h(this, d, n));
    const r = w(
      x(this.originalRecord),
      L
    ), o = w(x(this), L);
    _(r, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = E(this.aliases), i = t(s, "collectionName"), r = q(this.collections[i], {
      hashId: t(s, "hashId")
    });
    j(r, 0) && this.collections[i].splice(r, 1), u(e, (o) => {
      const d = R(this.aliases[o]), n = y(this.aliases[o]);
      if (d) {
        const l = q(this.aliases[o], {
          hashId: t(s, "hashId")
        });
        j(l, 0) && this.aliases[o].splice(l, 1);
      }
      n && _(
        t(s, "hashId"),
        t(this.aliases[o], "hashId")
      ) && (this.aliases[o] = {});
    });
  }
  _saveRecord(s) {
    const e = t(s, "collectionName"), i = b(this.collections[e], {
      hashId: t(s, "hashId")
    }), r = Q(t(i, "id")), o = r ? t(i, "id") : null, d = e, n = r ? "put" : "post", l = { data: i }, a = {
      resourceMethod: n,
      resourceName: d,
      resourceId: Number(o),
      resourceParams: {},
      resourcePayload: l,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(a);
  }
  async _deleteRecord(s) {
    const e = t(s, "collectionName"), i = b(this.collections[e], {
      hashId: t(s, "hashId")
    }), r = t(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: t(i, "collectionName"),
      resourceId: Number(r),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = t(s, "id"), o = {
      resourceMethod: "get",
      resourceName: t(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipTimestamp: T() }
    };
    return this._request(o);
  }
  _getCollectionRecord(s, e = {}, i) {
    const r = t(e, "referenceKey") || "", o = t(e, "async") || !1, d = t(i, r) || [], l = y(
      d
    ) ? [d] : d, a = N([]);
    return u(l, (c) => {
      const m = this._generateHashId({
        id: t(c, "id"),
        collectionName: s
      }), f = b(this.collections[s], {
        hashId: m
      });
      if (!v(f))
        a.push(f);
      else if (o) {
        const p = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: t(c, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, g = z;
        this._pushRequestHash(
          p,
          g
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
    const r = ns(i) ? this._generateHashId({
      id: t(e, "id"),
      collectionName: s
    }) : i;
    h(e, "collectionName", s), h(e, "hashId", r), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const i = R(e), r = y(e), o = E(this.aliases), d = E(this.requestHashIds);
    let n = null;
    if (i) {
      const l = X(e, "hashId");
      u(e, (a) => {
        const c = q(
          this.collections[s],
          {
            hashId: t(a, "hashId")
          }
        );
        this._injectActions(a), W(c, 0) && this.collections[s].push(a), j(c, 0) && (this.collections[s][c] = a);
      }), n = X(
        l,
        (a) => b(this.collections[s], {
          hashId: a
        })
      ), u(o, (a) => {
        const c = R(this.aliases[a]), m = y(this.aliases[a]);
        c && u(n, (f) => {
          const p = q(this.aliases[a], {
            hashId: t(f, "hashId")
          });
          j(p, 0) && (this.aliases[a][p] = f);
        }), m && u(n, (f) => {
          _(
            t(f, "hashId"),
            t(this.aliases[a], "hashId")
          ) && (this.aliases[a] = f);
        });
      });
    }
    if (r) {
      const l = e.hashId, a = q(
        this.collections[s],
        {
          hashId: t(e, "hashId")
        }
      );
      this._injectActions(e), W(a, 0) && this.collections[s].push(e), j(a, 0) && (this.collections[s][a] = e), n = b(this.collections[s], {
        hashId: l
      }), u(o, (c) => {
        const m = R(this.aliases[c]), f = y(this.aliases[c]);
        m && u([n], (p) => {
          const g = q(this.aliases[c], {
            hashId: t(p, "hashId")
          });
          j(g, 0) && (this.aliases[c][g] = p);
        }), f && _(
          t(n, "hashId"),
          t(this.aliases[c], "hashId")
        ) && (this.aliases[c] = n);
      }), u(d, (c) => {
        const m = t(
          this.requestHashIds[c],
          "data"
        ), f = R(m), p = y(m);
        f && u([n], (g) => {
          const P = q(
            t(this.requestHashIds[c], "data"),
            {
              hashId: t(g, "hashId")
            }
          );
          j(P, 0) && (this.requestHashIds[c].data[P] = g);
        }), p && _(
          t(n, "hashId"),
          t(this.requestHashIds[c], "data.hashId")
        ) && h(
          this.requestHashIds[c],
          "data",
          n
        );
      });
    }
    return n;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const i = this._generateHashId(s), r = !$(this.requestHashIds[i]), o = t(e, "isNew");
    return r && o ? h(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
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
    resourceParams: r,
    resourcePayload: o,
    resourceFallback: d,
    resourceConfig: n
  }) {
    var U, V, G;
    const l = {
      method: s,
      url: e
    }, a = this._generateHashId({ ...arguments[0] }), c = _(s, "get"), m = _(s, "delete"), f = _(s, "post"), p = Q(i), g = !v(r), P = !v(o), O = t(o, "data") || null;
    if (p && h(l, "url", `${e}/${i}`), g && h(l, "params", r), P) {
      const I = {
        data: w(O, ds)
      };
      h(l, "data", I);
    }
    const D = !$(t(n, "skip")), S = _(t(n, "skip"), !0), F = this.requestHashIds[a], B = !$(F), J = t(F, "isNew");
    if (_(
      t(F, "isLoading"),
      !0
    ), !(c && (D && S || !D && B && !J || D && !S && B && !J))) {
      P && h(O, "isLoading", !0);
      try {
        const I = await M(l), A = ((U = I == null ? void 0 : I.data) == null ? void 0 : U.data) || d, Z = ((V = I == null ? void 0 : I.data) == null ? void 0 : V.included) || [], K = ((G = I == null ? void 0 : I.data) == null ? void 0 : G.meta) || {}, ss = y(A), es = R(A);
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
        ), n.alias && this._addAlias(
          t(n, "alias"),
          C
        ), f && this.unloadRecord(O), m && this.unloadRecord(C), this.requestHashIds[a] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: C,
          included: [],
          meta: K
        }, Promise.resolve(C);
      } catch (I) {
        return P && (h(O, "isError", !0), h(O, "isLoading", !1)), this.requestHashIds[a] = {
          isLoading: !1,
          isError: !0,
          isNew: !1,
          data: I,
          included: [],
          meta: {}
        }, Promise.reject(I);
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
    }, o = Y, d = this._pushRequestHash(
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
    }, o = z, d = this._pushRequestHash(
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
    }, r = Y, o = this._pushRequestHash(
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
    }, d = z, n = this._pushRequestHash(
      o,
      d
    );
    return this._request(o), n;
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
