import M from "axios";
import ts from "lodash";
import * as is from "mobx";
import { v1 as $, NIL as rs } from "uuid";
import os from "crypto-js";
const { makeObservable: as, observable: N, action: k, toJS: x } = is, {
  get: r,
  set: n,
  find: y,
  findIndex: b,
  isObject: ns,
  isArray: q,
  isPlainObject: R,
  isNumber: Q,
  isNull: cs,
  isNil: E,
  isEmpty: v,
  isEqual: _,
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
}, z = {
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
      _pushPayload: k,
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
    const i = q(e), t = R(e);
    i && (this.aliases[s] = e || []), t && (this.aliases[s] = e || {});
  }
  _generateHashId(s = { id: $() }) {
    const e = JSON.stringify(s);
    return os.MD5(e).toString();
  }
  _getProperty(s) {
    return r(this, s);
  }
  _setProperty(s, e) {
    n(this, s, e);
    const i = w(
      x(this.originalRecord),
      D
    ), t = w(x(this), D);
    _(i, t) ? (n(this, "isDirty", !1), n(this, "isPristine", !0)) : (n(this, "isDirty", !0), n(this, "isPristine", !1));
  }
  _setProperties(s) {
    function e(d, a = "") {
      return hs(ds(d), ([c, l]) => {
        const h = a ? `${a}.${c}` : c;
        return ns(l) && !q(l) && l !== null ? e(l, h) : { key: h, value: l };
      });
    }
    const i = e(s);
    u(i, ({ key: d, value: a }) => n(this, d, a));
    const t = w(
      x(this.originalRecord),
      D
    ), o = w(x(this), D);
    _(t, o) ? (n(this, "isDirty", !1), n(this, "isPristine", !0)) : (n(this, "isDirty", !0), n(this, "isPristine", !1));
  }
  unloadRecord(s) {
    const e = L(this.aliases), i = r(s, "collectionName"), t = b(this.collections[i], {
      hashId: r(s, "hashId")
    });
    j(t, 0) && this.collections[i].splice(t, 1), u(e, (o) => {
      const d = q(this.aliases[o]), a = R(this.aliases[o]);
      if (d) {
        const c = b(this.aliases[o], {
          hashId: r(s, "hashId")
        });
        j(c, 0) && this.aliases[o].splice(c, 1);
      }
      a && _(
        r(s, "hashId"),
        r(this.aliases[o], "hashId")
      ) && (this.aliases[o] = {});
    });
  }
  _saveRecord(s) {
    const e = r(s, "collectionName"), i = y(this.collections[e], {
      hashId: r(s, "hashId")
    }), t = Q(r(i, "id")), o = t ? r(i, "id") : null, l = {
      resourceMethod: t ? "put" : "post",
      resourceName: e,
      resourceId: o,
      resourceParams: {},
      resourcePayload: { data: i },
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(l);
  }
  async _deleteRecord(s) {
    const e = r(s, "collectionName"), i = y(this.collections[e], {
      hashId: r(s, "hashId")
    }), t = r(s, "id"), a = {
      resourceMethod: "delete",
      resourceName: r(i, "collectionName"),
      resourceId: Number(t),
      resourceParams: {},
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: {}
    };
    return this._request(a);
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
  _getCollectionRecord(s, e = {}, i) {
    const t = r(e, "referenceKey") || "", o = r(e, "async") || !1, d = r(i, t) || [], c = R(
      d
    ) ? [d] : d, l = N([]);
    return u(c, (h) => {
      const f = this._generateHashId({
        id: r(h, "id"),
        collectionName: s
      }), p = y(this.collections[s], {
        hashId: f
      });
      if (!v(p))
        l.push(p);
      else if (o) {
        const g = {
          resourceMethod: "get",
          resourceName: s,
          resourceId: r(h, "id"),
          resourceParams: {},
          resourcePayload: null,
          resourceFallback: {},
          resourceConfig: {}
        }, m = z;
        this._pushRequestHash(g, m), this._request(g);
      }
    }), l;
  }
  _injectActions(s) {
    const e = {
      get: this._getProperty,
      set: this._setProperty,
      setProperties: this._setProperties,
      save: () => this._saveRecord(s),
      destroyRecord: () => this._deleteRecord(s),
      reload: () => this._reloadRecord(s),
      getCollection: (t, o) => this._getCollectionRecord(
        t,
        o,
        s
      )
    }, i = L(e);
    u(i, (t) => {
      s[t] = e[t];
    });
  }
  _injectReferenceKeys(s, e, i = null) {
    const t = cs(i) ? this._generateHashId({
      id: r(e, "id"),
      collectionName: s
    }) : i;
    n(e, "collectionName", s), n(e, "hashId", t), n(e, "isLoading", !1), n(e, "isError", !1), n(e, "isPristine", !0), n(e, "isDirty", !1);
  }
  _pushToCollection(s, e) {
    const i = X(e, "hashId");
    return u(e, (t) => {
      const o = b(
        this.collections[s],
        {
          hashId: r(t, "hashId")
        }
      );
      this._injectActions(t), W(o, 0) && this.collections[s].push(t), j(o, 0) && (this.collections[s][o] = t);
    }), X(
      i,
      (t) => y(this.collections[s], {
        hashId: t
      })
    );
  }
  _pushPayload(s, e) {
    const i = q(e), t = R(e), o = L(this.aliases), d = L(this.requestHashIds);
    let a = null;
    if (i && (a = this._pushToCollection(
      s,
      e
    ), u(o, (c) => {
      const l = q(this.aliases[c]), h = R(this.aliases[c]);
      l && u(a, (f) => {
        const p = b(this.aliases[c], {
          hashId: r(f, "hashId")
        });
        j(p, 0) && (this.aliases[c][p] = f);
      }), h && u(a, (f) => {
        _(
          r(f, "hashId"),
          r(this.aliases[c], "hashId")
        ) && (this.aliases[c] = f);
      });
    })), t) {
      const c = e.hashId, l = b(
        this.collections[s],
        {
          hashId: r(e, "hashId")
        }
      );
      this._injectActions(e), W(l, 0) && this.collections[s].push(e), j(l, 0) && (this.collections[s][l] = e), a = y(this.collections[s], {
        hashId: c
      }), u(o, (h) => {
        const f = q(this.aliases[h]), p = R(this.aliases[h]);
        f && u([a], (g) => {
          const m = b(this.aliases[h], {
            hashId: r(g, "hashId")
          });
          j(m, 0) && (this.aliases[h][m] = g);
        }), p && _(
          r(a, "hashId"),
          r(this.aliases[h], "hashId")
        ) && (this.aliases[h] = a);
      }), u(d, (h) => {
        const f = r(
          this.requestHashIds[h],
          "data"
        ), p = q(f), g = R(f);
        p && u([a], (m) => {
          const P = b(
            r(this.requestHashIds[h], "data"),
            {
              hashId: r(m, "hashId")
            }
          );
          j(P, 0) && (this.requestHashIds[h].data[P] = m);
        }), g && _(
          r(a, "hashId"),
          r(this.requestHashIds[h], "data.hashId")
        ) && n(
          this.requestHashIds[h],
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
    const i = this._generateHashId(s), t = !E(this.requestHashIds[i]), o = r(e, "isNew");
    return t && o ? n(this.requestHashIds[i], "isNew", !1) : this.requestHashIds[i] = e, this.requestHashIds[i];
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
  createRecord(s, e = {}, i = !0) {
    const t = i ? $() : rs, o = E(
      y(this.collections[s], {
        id: t
      })
    );
    return n(e, "id", t), this._injectReferenceKeys(s, e), this._injectActions(e), o && this.collections[s].push(e), y(this.collections[s], {
      id: t
    });
  }
  async _request({
    resourceMethod: s,
    resourceName: e,
    resourceId: i,
    resourceParams: t,
    resourcePayload: o,
    resourceFallback: d,
    resourceConfig: a
  }) {
    var U, V, G;
    const c = {
      method: s,
      url: e
    }, l = this._generateHashId({ ...arguments[0] }), h = _(s, "get"), f = _(s, "delete"), p = _(s, "post"), g = Q(i), m = !v(t), P = !v(o), O = r(o, "data") || null;
    if (g && n(c, "url", `${e}/${i}`), m && n(c, "params", t), P) {
      const I = {
        data: w(O, ls)
      };
      n(c, "data", I);
    }
    const F = !E(r(a, "skip")), T = _(r(a, "skip"), !0), S = this.requestHashIds[l], B = !E(S), J = r(S, "isNew");
    if (!(h && (F && T || !F && B && !J || F && !T && B && !J))) {
      P && n(O, "isLoading", !0);
      try {
        const I = await M(c), A = ((U = I == null ? void 0 : I.data) == null ? void 0 : U.data) || d, Z = ((V = I == null ? void 0 : I.data) == null ? void 0 : V.included) || [], K = ((G = I == null ? void 0 : I.data) == null ? void 0 : G.meta) || {}, ss = R(A), es = q(A);
        let C = null;
        return es && u(
          A,
          (H) => this._injectReferenceKeys(e, H)
        ), ss && this._injectReferenceKeys(e, A), u(Z, (H) => {
          this._injectReferenceKeys(
            r(H, this.payloadIncludedReference),
            H
          ), this._pushPayload(
            r(H, "collectionName"),
            H
          );
        }), C = await this._pushPayload(
          e,
          A
        ), a.alias && this._addAlias(
          r(a, "alias"),
          C
        ), p && this.unloadRecord(O), f && this.unloadRecord(C), this.requestHashIds[l] = {
          isLoading: !1,
          isError: !1,
          isNew: !1,
          data: C,
          included: [],
          meta: K
        }, Promise.resolve(C);
      } catch (I) {
        return P && (n(O, "isError", !0), n(O, "isLoading", !1)), this.requestHashIds[l] = {
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
    const t = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: [],
      resourceConfig: i
    }, o = Y, d = this._pushRequestHash(
      t,
      o
    );
    return this._request(t), d;
  }
  queryRecord(s, e = {}, i = {}) {
    const t = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: null,
      resourceParams: e,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: i
    }, o = z, d = this._pushRequestHash(
      t,
      o
    );
    return this._request(t), d;
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
    }, t = Y, o = this._pushRequestHash(
      i,
      t
    );
    return this._request(i), o;
  }
  findRecord(s, e, i = {}, t = {}) {
    const o = {
      resourceMethod: "get",
      resourceName: s,
      resourceId: Number(e),
      resourceParams: i,
      resourcePayload: null,
      resourceFallback: {},
      resourceConfig: t
    }, d = z, a = this._pushRequestHash(
      o,
      d
    );
    return this._request(o), a;
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
