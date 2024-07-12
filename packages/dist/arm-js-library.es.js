import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as T, NIL as rs } from "uuid";
import os from "crypto-js";
const { makeObservable: as, observable: w, action: N, toJS: k } = is, {
  get: o,
  set: h,
  find: g,
  findIndex: q,
  isObject: ns,
  isArray: I,
  isPlainObject: f,
  isNumber: Q,
  isNull: cs,
  isNil: x,
  isEmpty: $,
  isEqual: _,
  gte: m,
  lt: W,
  flatMap: hs,
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
class gs {
  constructor(s = []) {
    this.namespace = "api/v1", this.host = typeof window < "u" ? window.location.origin : "", this.collections = {}, this.aliases = {}, this.requestHashIds = {}, this.payloadIncludedReference = "type", this._initializeCollections(s), this._initializeAxiosConfig(), as(this, {
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
    const r = I(e), i = f(e);
    r && (this.aliases[s] = e || []), i && (this.aliases[s] = e || {});
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
    const r = A(
      k(this.originalRecord),
      D
    ), i = A(k(this), D);
    _(r, i) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(a, n = "") {
      return hs(ds(a), ([c, d]) => {
        const p = n ? `${n}.${c}` : c;
        return ns(d) && !I(d) && d !== null ? e(d, p) : { key: p, value: d };
      });
    }
    const r = e(s);
    u(r, ({ key: a, value: n }) => h(this, a, n));
    const i = A(
      k(this.originalRecord),
      D
    ), t = A(k(this), D);
    _(i, t) ? (h(this, "isDirty", !1), h(this, "isPristine", !0)) : (h(this, "isDirty", !0), h(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = P(this.aliases), r = o(s, "collectionName"), i = q(this.collections[r], {
      hashId: o(s, "hashId")
    });
    m(i, 0) && this.collections[r].splice(i, 1), u(e, (t) => {
      const a = I(this.aliases[t]), n = f(this.aliases[t]);
      if (a) {
        const c = q(this.aliases[t], {
          hashId: o(s, "hashId")
        });
        m(c, 0) && this.aliases[t].splice(c, 1);
      }
      n && _(
        o(s, "hashId"),
        o(this.aliases[t], "hashId")
      ) && (this.aliases[t] = {});
    });
  }
  _saveRecord(s) {
    const e = o(s, "collectionName"), r = g(this.collections[e], {
      hashId: o(s, "hashId")
    }), i = Q(o(r, "id")), t = i ? o(r, "id") : null, d = {
      resourceMethod: i ? "put" : "post",
      resourceName: e,
      resourceId: t,
      resourceParams: {},
      resourcePayload: { data: r },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(d);
  }
  async _deleteRecord(s) {
    const e = o(s, "collectionName"), r = g(this.collections[e], {
      hashId: o(s, "hashId")
    }), i = o(s, "id"), n = {
      resourceMethod: "delete",
      resourceName: o(r, "collectionName"),
      resourceId: Number(i),
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
  _getCollectionRecord(s, e = {}, r) {
    const i = o(e, "referenceKey") || "", t = o(e, "async") || !1, a = o(r, i) || [], c = f(
      a
    ) ? [a] : a, d = w([]);
    return u(c, (p) => {
      const y = this._generateHashId({
        id: o(p, "id"),
        collectionName: s
      }), O = g(this.collections[s], {
        hashId: y
      });
      if (!$(O))
        d.push(O);
      else if (t) {
        const C = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: o(p, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, E = v;
        this._pushRequestHash(C, E), this._request(C);
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
      getCollection: (i, t) => this._getCollectionRecord(
        i,
        t,
        s
      )
    }, r = P(e);
    u(r, (i) => {
      s[i] = e[i];
    });
  }
  _injectReferenceKeys(s, e, r = null) {
    const i = cs(r) ? this._generateHashId({
      id: o(e, "id"),
      collectionName: s
    }) : r;
    h(e, "collectionName", s), h(e, "hashId", i), h(e, "isLoading", !1), h(e, "isError", !1), h(e, "isPristine", !0), h(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const r = I(e), i = f(e);
    if (r) {
      const t = X(e, "hashId");
      return u(e, (a) => {
        const n = q(
          this.collections[s],
          {
            hashId: o(a, "hashId")
          }
        );
        this._injectActions(a), W(n, 0) && this.collections[s].push(a), m(n, 0) && (this.collections[s][n] = a);
      }), X(
        t,
        (a) => g(this.collections[s], {
          hashId: a
        })
      );
    }
    if (i) {
      const t = e.hashId, a = q(
        this.collections[s],
        {
          hashId: o(e, "hashId")
        }
      );
      return this._injectActions(e), W(a, 0) && this.collections[s].push(e), m(a, 0) && (this.collections[s][a] = e), g(this.collections[s], {
        hashId: t
      });
    }
  }
  _pushToAliases(s) {
    const e = I(s), r = f(s), i = P(this.aliases);
    e && u(i, (t) => {
      const a = I(this.aliases[t]), n = f(this.aliases[t]);
      a && u(s, (c) => {
        const d = q(this.aliases[t], {
          hashId: o(c, "hashId")
        });
        m(d, 0) && (this.aliases[t][d] = c);
      }), n && u(s, (c) => {
        _(
          o(c, "hashId"),
          o(this.aliases[t], "hashId")
        ) && (this.aliases[t] = c);
      });
    }), r && u(i, (t) => {
      const a = I(this.aliases[t]), n = f(this.aliases[t]);
      a && u([s], (c) => {
        const d = q(this.aliases[t], {
          hashId: o(c, "hashId")
        });
        m(d, 0) && (this.aliases[t][d] = c);
      }), n && _(
        o(s, "hashId"),
        o(this.aliases[t], "hashId")
      ) && (this.aliases[t] = s);
    });
  }
  _pushToRequestHashes(s) {
    const e = P(this.requestHashIds), r = I(s);
    f(s), u(e, (i) => {
      const t = o(
        this.requestHashIds[i],
        "data"
      ), a = I(t);
      f(t), a && r && u(s, (n) => {
        const c = q(
          o(this.requestHashIds[i], "data"),
          {
            hashId: o(n, "hashId")
          }
        );
        m(c, 0) && (this.requestHashIds[i].data[c] = n);
      });
    });
  }
  _pushPayload(s, e) {
    I(e);
    const r = f(e), i = P(this.requestHashIds), t = this._pushToCollection(
      s,
      e
    );
    return this._pushToAliases(t), r && u(i, (a) => {
      const n = o(
        this.requestHashIds[a],
        "data"
      ), c = I(n), d = f(n);
      c && u([t], (p) => {
        const y = q(
          o(this.requestHashIds[a], "data"),
          {
            hashId: o(p, "hashId")
          }
        );
        m(y, 0) && (this.requestHashIds[a].data[y] = p);
      }), d && _(
        o(t, "hashId"),
        o(this.requestHashIds[a], "data.hashId")
      ) && h(
        this.requestHashIds[a],
        "data",
        t
      );
    }), t;
  }
  _pushRequestHash(s = {}, e = {
    isLoading: !0,
    isError: !1,
    isNew: !0,
    data: null
  }) {
    const r = this._generateHashId(s), i = !x(this.requestHashIds[r]), t = o(e, "isNew");
    return i && t ? h(this.requestHashIds[r], "isNew", !1) : this.requestHashIds[r] = e, this.requestHashIds[r];
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
    return f(e) && this._injectActions(e), this.aliases[s] || e;
  }
  createRecord(s, e = {}, r = !0) {
    const i = r ? T() : rs, t = x(
      g(this.collections[s], {
        id: i
      })
    );
    return h(e, "id", i), this._injectReferenceKeys(s, e), this._injectActions(e), t && this.collections[s].push(e), g(this.collections[s], {
      id: i
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: r,
    resourceParams: i,
    resourcePayload: t,
    resourceFallback: a,
    resourceConfig: n
  }) {
    var U, V, G;
    const c = {
      method: s,
      url: e
    }, d = this._generateHashId({ ...arguments[0] }), p = _(s, "get"), y = _(s, "delete"), O = _(s, "post"), C = Q(r), E = !$(i), L = !$(t), R = o(t, "data") || null;
    if (C && h(c, "url", `${e}/${r}`), E && h(c, "params", i), L) {
      const l = {
        data: A(R, us)
      };
      h(c, "data", l);
    }
    const F = !x(o(n, "skip")), z = _(o(n, "skip"), !0), S = this.requestHashIds[d], B = !x(S), J = o(S, "isNew");
    if (!(p && (F && z || !F && B && !J || F && !z && B && !J))) {
      L && h(R, "isLoading", !0);
      try {
        const l = await M(c), H = ((U = l == null ? void 0 : l.data) == null ? void 0 : U.data) || a, Z = ((V = l == null ? void 0 : l.data) == null ? void 0 : V.included) || [], K = ((G = l == null ? void 0 : l.data) == null ? void 0 : G.meta) || {}, ss = f(H), es = I(H);
        let j = null;
        return es && u(
          H,
          (b) => this._injectReferenceKeys(e, b)
        ), ss && this._injectReferenceKeys(e, H), u(Z, (b) => {
          this._injectReferenceKeys(
            o(b, this.payloadIncludedReference),
            b
          ), this._pushPayload(
            o(b, "collectionName"),
            b
          );
        }), j = await this._pushPayload(
          e,
          H
        ), n.alias && this._addAlias(
          o(n, "alias"),
          j
        ), O && this.unloadRecord(R), y && this.unloadRecord(j), this.requestHashIds[d] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: j,
          included: [],
          meta: K
        }, Promise.resolve(j);
      } catch (l) {
        return L && (h(R, "isError", !0), h(R, "isLoading", !1)), this.requestHashIds[d] = {
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
  query(s, e = {}, r = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: r
    }, t = Y, a = this._pushRequestHash(
      i,
      t
    );
    return this._request(i), a;
  }
  queryRecord(s, e = {}, r = {}) {
    const i = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: r
    }, t = v, a = this._pushRequestHash(
      i,
      t
    );
    return this._request(i), a;
  }
  findAll(s, e = {}) {
    const r = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: null,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: e
    }, i = Y, t = this._pushRequestHash(
      r,
      i
    );
    return this._request(r), t;
  }
  findRecord(s, e, r = {}, i = {}) {
    const t = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: r,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
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
