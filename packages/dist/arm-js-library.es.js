import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T, NIL as os } from "uuid";
import rs from "crypto-js";
const { makeObservable: as, observable: N, action: k, toJS: x } = is, {
  get: o,
  set: h,
  find: y,
  findIndex: b,
  isObject: ns,
  isArray: q,
  isPlainObject: R,
  isNumber: Q,
  isNull: cs,
  isNil: E,
  isEmpty: $,
  isEqual: g,
  gte: j,
  lt: W,
  flatMap: hs,
  map: X,
  entries: ds,
  forEach: u,
  keysIn: L,
  omit: w
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
    const t = q(e), i = R(e);
    t && (this.aliases[s] = e || []), i && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: T() }) {
    const e = JSON.stringify(s);
    return rs.MD5(e).toString();
  }
  _getProperty(s) {
    return o(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = w(
      x(this.originalRecord),
      D
    ), i = w(x(this), D);
    g(t, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, n = "") {
      return hs(ds(d), ([l, a]) => {
        const c = n ? `${n}.${l}` : l;
        return ns(a) && !q(a) && a !== null ? e(a, c) : { key: c, value: a };
      });
    }
    const t = e(s);
    u(t, ({ key: d, value: n }) => h(this, d, n));
    const i = w(
      x(this.originalRecord),
      D
    ), r = w(x(this), D);
    g(i, r) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = L(this.aliases), t = o(s, "collectionName"), i = b(this.collections[t], {
      hashId: o(s, "hashId")
    });
    j(i, 0) && this.collections[t].splice(i, 1), u(e, (r) => {
      const d = q(this.aliases[r]), n = R(this.aliases[r]);
      if (d) {
        const l = b(this.aliases[r], {
          hashId: o(s, "hashId")
        });
        j(l, 0) && this.aliases[r].splice(l, 1);
      }
      n && g(
        o(s, "hashId"),
        o(this.aliases[r], "hashId")
      ) && (this.aliases[r] = {});
    });
  }
  _saveRecord(s) {
    const e = o(s, "collectionName"), t = y(this.collections[e], {
      hashId: o(s, "hashId")
    }), i = Q(o(t, "id")), r = i ? o(t, "id") : null, a = {
      resourceMethod: i ? "put" : "post",
      resourceName: e,
      resourceId: r,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(a);
  }
  async _deleteRecord(s) {
    const e = o(s, "collectionName"), t = y(this.collections[e], {
      hashId: o(s, "hashId")
    }), i = o(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: o(t, "collectionName"),
      resourceId: Number(i),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(n);
  }
  async _reloadRecord(s) {
    const e = o(s, "id"), r = {
      resourceMethod: "get",
      resourceName: o(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipTimestamp: T() }
    };
    return this._request(r);
  }
  _getCollectionRecord(s, e = {}, t) {
    const i = o(e, "referenceKey") || "", r = o(e, "async") || !1, d = o(t, i) || [], l = R(
      d
    ) ? [d] : d, a = N([]);
    return u(l, (c) => {
      const _ = this._generateHashId({
        id: o(c, "id"),
        collectionName: s
      }), f = y(this.collections[s], {
        hashId: _
      });
      if (!$(f))
        a.push(f);
      else if (r) {
        const p = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: o(c, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, m = v;
        this._pushRequestHash(p, m), this._request(p);
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
      getCollection: (i, r) => this._getCollectionRecord(
        i,
        r,
        s
      )
    }, t = L(e);
    u(t, (i) => {
      s[i] = e[i];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const i = cs(t) ? this._generateHashId({
      id: o(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", i), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushPayloadToCollection(s, e) {
    const t = q(e), i = R(e), r = L(this.aliases), d = L(this.requestHashIds);
    let n = null;
    if (t) {
      const l = X(e, "hashId");
      u(e, (a) => {
        const c = b(
          this.collections[s],
          {
            hashId: o(a, "hashId")
          }
        );
        this._injectActions(a), W(c, 0) && this.collections[s].push(a), j(c, 0) && (this.collections[s][c] = a);
      }), n = X(
        l,
        (a) => y(this.collections[s], {
          hashId: a
        })
      ), u(r, (a) => {
        const c = q(this.aliases[a]), _ = R(this.aliases[a]);
        c && u(n, (f) => {
          const p = b(this.aliases[a], {
            hashId: o(f, "hashId")
          });
          j(p, 0) && (this.aliases[a][p] = f);
        }), _ && u(n, (f) => {
          g(
            o(f, "hashId"),
            o(this.aliases[a], "hashId")
          ) && (this.aliases[a] = f);
        });
      });
    }
    if (i) {
      const l = e.hashId, a = b(
        this.collections[s],
        {
          hashId: o(e, "hashId")
        }
      );
      this._injectActions(e), W(a, 0) && this.collections[s].push(e), j(a, 0) && (this.collections[s][a] = e), n = y(this.collections[s], {
        hashId: l
      }), u(r, (c) => {
        const _ = q(this.aliases[c]), f = R(this.aliases[c]);
        _ && u([n], (p) => {
          const m = b(this.aliases[c], {
            hashId: o(p, "hashId")
          });
          j(m, 0) && (this.aliases[c][m] = p);
        }), f && g(
          o(n, "hashId"),
          o(this.aliases[c], "hashId")
        ) && (this.aliases[c] = n);
      }), u(d, (c) => {
        const _ = o(
          this.requestHashIds[c],
          "data"
        ), f = q(_), p = R(_);
        f && u([n], (m) => {
          const P = b(
            o(this.requestHashIds[c], "data"),
            {
              hashId: o(m, "hashId")
            }
          );
          j(P, 0) && (this.requestHashIds[c].data[P] = m);
        }), p && g(
          o(n, "hashId"),
          o(this.requestHashIds[c], "data.hashId")
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
    const t = this._generateHashId(s), i = !E(this.requestHashIds[t]), r = o(e, "isNew");
    return i && r ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
    return R(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}, t = !0) {
    const i = t ? T() : os, r = E(
      y(this.collections[s], {
        id: i
      })
    );
    return h(e, "id", i), this._injectReferenceKeys(s, e), this._injectActions(e), r && this.collections[s].push(e), y(this.collections[s], {
      id: i
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: i,
    resourcePayload: r,
    resourceFallback: d,
    resourceConfig: n
  }) {
    var U, V, G;
    const l = {
      method: s,
      url: e
    }, a = this._generateHashId({ ...arguments[0] }), c = g(s, "get"), _ = g(s, "delete"), f = g(s, "post"), p = Q(t), m = !$(i), P = !$(r), O = o(r, "data") || null;
    if (p && h(l, "url", `${e}/${t}`), m && h(l, "params", i), P) {
      const I = {
        data: w(O, ls)
      };
      h(l, "data", I);
    }
    const F = !E(o(n, "skip")), z = g(o(n, "skip"), !0), S = this.requestHashIds[a], B = !E(S), J = o(S, "isNew");
    if (!(c && (F && z || !F && B && !J || F && !z && B && !J))) {
      P && h(O, "isLoading", !0);
      try {
        const I = await M(l), A = ((U = I == null ? void 0 : I.data) == null ? void 0 : U.data) || d, Z = ((V = I == null ? void 0 : I.data) == null ? void 0 : V.included) || [], K = ((G = I == null ? void 0 : I.data) == null ? void 0 : G.meta) || {}, ss = R(A), es = q(A);
        let C = null;
        return es && u(
          A,
          (H) => this._injectReferenceKeys(e, H)
        ), ss && this._injectReferenceKeys(e, A), u(Z, (H) => {
          this._injectReferenceKeys(
            o(H, this.payloadIncludedReference),
            H
          ), this._pushPayloadToCollection(
            o(H, "collectionName"),
            H
          );
        }), C = await this._pushPayloadToCollection(
          e,
          A
        ), n.alias && this._addAlias(
          o(n, "alias"),
          C
        ), f && this.unloadRecord(O), _ && this.unloadRecord(C), this.requestHashIds[a] = {
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
  query(s, e = {}, t = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, r = Y, d = this._pushRequestHash(
      i,
      r
    );
    return this._request(i), d;
  }
  queryRecord(s, e = {}, t = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: t
    }, r = v, d = this._pushRequestHash(
      i,
      r
    );
    return this._request(i), d;
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
    }, i = Y, r = this._pushRequestHash(
      t,
      i
    );
    return this._request(t), r;
  }
  findRecord(s, e, t = {}, i = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, d = v, n = this._pushRequestHash(
      r,
      d
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
}
export {
  gs as default
};
