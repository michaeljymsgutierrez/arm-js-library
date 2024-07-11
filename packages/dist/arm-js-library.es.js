import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as $, NIL as rs } from "uuid";
import os from "crypto-js";
const { makeObservable: as, observable: C, action: w, toJS: N } = is, {
  get: r,
  set: h,
  find: y,
  findIndex: b,
  isObject: ns,
  isArray: m,
  isPlainObject: _,
  isNumber: Q,
  isNull: cs,
  isNil: k,
  isEmpty: v,
  isEqual: g,
  gte: q,
  lt: W,
  flatMap: hs,
  map: X,
  entries: ds,
  forEach: l,
  keysIn: x,
  omit: A
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
    const t = m(e), i = _(e);
    t && (this.aliases[s] = e || []), i && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: $() }) {
    const e = JSON.stringify(s);
    return os.MD5(e).toString();
  }
  _getProperty(s) {
    return r(this, s);
  }
  _setProperty(s, e) {
    h(this, s, e);
    const t = A(
      N(this.originalRecord),
      E
    ), i = A(N(this), E);
    g(t, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(n, c = "") {
      return hs(ds(n), ([a, d]) => {
        const I = c ? `${c}.${a}` : a;
        return ns(d) && !m(d) && d !== null ? e(d, I) : { key: I, value: d };
      });
    }
    const t = e(s);
    l(t, ({ key: n, value: c }) => h(this, n, c));
    const i = A(
      N(this.originalRecord),
      E
    ), o = A(N(this), E);
    g(i, o) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = x(this.aliases), t = r(s, "collectionName"), i = b(this.collections[t], {
      hashId: r(s, "hashId")
    });
    q(i, 0) && this.collections[t].splice(i, 1), l(e, (o) => {
      const n = m(this.aliases[o]), c = _(this.aliases[o]);
      if (n) {
        const a = b(this.aliases[o], {
          hashId: r(s, "hashId")
        });
        q(a, 0) && this.aliases[o].splice(a, 1);
      }
      c && g(
        r(s, "hashId"),
        r(this.aliases[o], "hashId")
      ) && (this.aliases[o] = {});
    });
  }
  _saveRecord(s) {
    const e = r(s, "collectionName"), t = y(this.collections[e], {
      hashId: r(s, "hashId")
    }), i = Q(r(t, "id")), o = i ? r(t, "id") : null, d = {
      resourceMethod: i ? "put" : "post",
      resourceName: e,
      resourceId: o,
      resourceParams: {},
      resourcePayload: { data: t },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(d);
  }
  async _deleteRecord(s) {
    const e = r(s, "collectionName"), t = y(this.collections[e], {
      hashId: r(s, "hashId")
    }), i = r(s, "id"), c = {
      resourceMethod: "delete",
      resourceName: r(t, "collectionName"),
      resourceId: Number(i),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(c);
  }
  async _reloadRecord(s) {
    const e = r(s, "id"), o = {
      resourceMethod: "get",
      resourceName: r(s, "collectionName"),
      resourceId: Number(e),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: { skipId: $() }
    };
    return this._request(o);
  }
  _getCollectionRecord(s, e = {}, t) {
    const i = r(e, "referenceKey") || "", o = r(e, "async") || !1, n = r(t, i) || [], a = _(
      n
    ) ? [n] : n, d = C([]);
    return l(a, (I) => {
      const u = this._generateHashId({
        id: r(I, "id"),
        collectionName: s
      }), p = y(this.collections[s], {
        hashId: u
      });
      if (!v(p))
        d.push(p);
      else if (o) {
        const R = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: r(I, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, L = z;
        this._pushRequestHash(R, L), this._request(R);
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
      getCollection: (i, o) => this._getCollectionRecord(
        i,
        o,
        s
      )
    }, t = x(e);
    l(t, (i) => {
      s[i] = e[i];
    });
  }
  _injectReferenceKeys(s, e, t = null) {
    const i = cs(t) ? this._generateHashId({
      id: r(e, "id"),
      collectionName: s
    }) : t;
    h(e, "collectionName", s), h(e, "hashId", i), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const t = m(e), i = _(e);
    if (t) {
      const o = X(e, "hashId");
      return l(e, (n) => {
        const c = b(
          this.collections[s],
          {
            hashId: r(n, "hashId")
          }
        );
        this._injectActions(n), W(c, 0) && this.collections[s].push(n), q(c, 0) && (this.collections[s][c] = n);
      }), X(
        o,
        (n) => y(this.collections[s], {
          hashId: n
        })
      );
    }
    if (i) {
      const o = e.hashId, n = b(
        this.collections[s],
        {
          hashId: r(e, "hashId")
        }
      );
      return this._injectActions(e), W(n, 0) && this.collections[s].push(e), q(n, 0) && (this.collections[s][n] = e), y(this.collections[s], {
        hashId: o
      });
    }
  }
  _pushPayload(s, e) {
    const t = m(e), i = _(e), o = x(this.aliases), n = x(this.requestHashIds);
    let c = this._pushToCollection(
      s,
      e
    );
    return t && l(o, (a) => {
      const d = m(this.aliases[a]), I = _(this.aliases[a]);
      d && l(c, (u) => {
        const p = b(this.aliases[a], {
          hashId: r(u, "hashId")
        });
        q(p, 0) && (this.aliases[a][p] = u);
      }), I && l(c, (u) => {
        g(
          r(u, "hashId"),
          r(this.aliases[a], "hashId")
        ) && (this.aliases[a] = u);
      });
    }), i && (l(o, (a) => {
      const d = m(this.aliases[a]), I = _(this.aliases[a]);
      d && l([c], (u) => {
        const p = b(this.aliases[a], {
          hashId: r(u, "hashId")
        });
        q(p, 0) && (this.aliases[a][p] = u);
      }), I && g(
        r(c, "hashId"),
        r(this.aliases[a], "hashId")
      ) && (this.aliases[a] = c);
    }), l(n, (a) => {
      const d = r(
        this.requestHashIds[a],
        "data"
      ), I = m(d), u = _(d);
      I && l([c], (p) => {
        const R = b(
          r(this.requestHashIds[a], "data"),
          {
            hashId: r(p, "hashId")
          }
        );
        q(R, 0) && (this.requestHashIds[a].data[R] = p);
      }), u && g(
        r(c, "hashId"),
        r(this.requestHashIds[a], "data.hashId")
      ) && h(
        this.requestHashIds[a],
        "data",
        c
      );
    })), c;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const t = this._generateHashId(s), i = !k(this.requestHashIds[t]), o = r(e, "isNew");
    return i && o ? h(this.requestHashIds[t], "isNew", !1) : this.requestHashIds[t] = e, this.requestHashIds[t];
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
    return _(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}, t = !0) {
    const i = t ? $() : rs, o = k(
      y(this.collections[s], {
        id: i
      })
    );
    return h(e, "id", i), this._injectReferenceKeys(s, e), this._injectActions(e), o && this.collections[s].push(e), y(this.collections[s], {
      id: i
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: t,
    resourceParams: i,
    resourcePayload: o,
    resourceFallback: n,
    resourceConfig: c
  }) {
    var U, V, G;
    const a = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), I = g(s, "get"), u = g(s, "delete"), p = g(s, "post"), R = Q(t), L = !v(i), D = !v(o), P = r(o, "data") || null;
    if (R && h(a, "url", `${e}/${t}`), L && h(a, "params", i), D) {
      const f = {
        data: A(P, ls)
      };
      h(a, "data", f);
    }
    const F = !k(r(c, "skip")), T = g(r(c, "skip"), !0), S = this.requestHashIds[d], B = !k(S), J = r(S, "isNew");
    if (!(I && (F && T || !F && B && !J || F && !T && B && !J))) {
      D && h(P, "isLoading", !0);
      try {
        const f = await M(a), H = ((U = f == null ? void 0 : f.data) == null ? void 0 : U.data) || n, Z = ((V = f == null ? void 0 : f.data) == null ? void 0 : V.included) || [], K = ((G = f == null ? void 0 : f.data) == null ? void 0 : G.meta) || {}, ss = _(H), es = m(H);
        let O = null;
        return es && l(
          H,
          (j) => this._injectReferenceKeys(e, j)
        ), ss && this._injectReferenceKeys(e, H), l(Z, (j) => {
          this._injectReferenceKeys(
            r(j, this.payloadIncludedReference),
            j
          ), this._pushPayload(
            r(j, "collectionName"),
            j
          );
        }), O = await this._pushPayload(
          e,
          H
        ), c.alias && this._addAlias(
          r(c, "alias"),
          O
        ), p && this.unloadRecord(P), u && this.unloadRecord(O), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: O,
          included: [],
          meta: K
        }, Promise.resolve(O);
      } catch (f) {
        return D && (h(P, "isError", !0), h(P, "isLoading", !1)), this.requestHashIds[d] = {
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
  query(s, e = {}, t = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: t
    }, o = Y, n = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), n;
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
    }, o = z, n = this._pushRequestHash(
      i,
      o
    );
    return this._request(i), n;
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
    }, i = Y, o = this._pushRequestHash(
      t,
      i
    );
    return this._request(t), o;
  }
  findRecord(s, e, t = {}, i = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: t,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, n = z, c = this._pushRequestHash(
      o,
      n
    );
    return this._request(o), c;
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
