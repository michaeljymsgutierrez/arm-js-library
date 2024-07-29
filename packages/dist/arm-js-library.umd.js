(function(f,A){typeof exports=="object"&&typeof module<"u"?module.exports=A(require("axios"),require("lodash"),require("mobx"),require("uuid"),require("crypto-js")):typeof define=="function"&&define.amd?define(["axios","lodash","mobx","uuid","crypto-js"],A):(f=typeof globalThis<"u"?globalThis:f||self,f["arm-js-library"]=A(f.axios,f._,f.mobx,f.uuid,f.CryptoJS))})(this,function(f,A,as,F,ns){"use strict";function hs(H){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(H){for(const e in H)if(e!=="default"){const t=Object.getOwnPropertyDescriptor(H,e);Object.defineProperty(s,e,t.get?t:{enumerable:!0,get:()=>H[e]})}}return s.default=H,Object.freeze(s)}const cs=hs(as),{makeObservable:ds,observable:E,action:D,toJS:L}=cs,{get:i,set:h,find:q,findIndex:m,isObject:us,isArray:_,isPlainObject:p,isNumber:$,isString:ls,isNull:W,isNil:R,isEmpty:C,isEqual:I,gte:b,gt:fs,lte:ps,lt:S,flatMap:Is,map:v,entries:_s,forEach:l,filter:X,keysIn:x,omit:w,first:Y,last:ys,orderBy:qs}=A,Z={isLoading:!0,isError:!1,isNew:!0,data:[],included:[],meta:{}},z={isLoading:!0,isError:!1,isNew:!0,data:{},included:[],meta:{}},B=["destroyRecord","getCollection","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine"],ms=["destroyRecord","getCollection","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine","hashId","collectionName"];class Rs{constructor(s=[]){this.namespace="api/v1",this.host=typeof window<"u"?window.location.origin:"",this.collections={},this.aliases={},this.requestHashIds={},this.payloadIncludedReference="type",this._initializeCollections(s),this._initializeAxiosConfig(),ds(this,{collections:E,aliases:E,requestHashIds:E,_pushPayload:D,_pushRequestHash:D,_addCollection:D,_addAlias:D})}_initializeAxiosConfig(){f.defaults.baseURL=this._getBaseURL()}_initializeCollections(s){l(s,e=>this._addCollection(e,[]))}_getBaseURL(){return`${this.host}/${this.namespace}`}_isCollectionExisting(s){if(R(i(this.collections,s)))throw`Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`}_addCollection(s,e){this.collections[s]=e}_addAlias(s,e){const t=_(e),o=p(e);t&&(this.aliases[s]=e||[]),o&&(this.aliases[s]=e||{})}_generateHashId(s={id:F.v1()}){const e=JSON.stringify(s);return ns.MD5(e).toString()}_getProperty(s){return i(this,s)}_setProperty(s,e){h(this,s,e);const t=w(L(this.originalRecord),B),o=w(L(this),B);I(t,o)?(h(this,"isDirty",!1),h(this,"isPristine",!0)):(h(this,"isDirty",!0),h(this,"isPristine",!1))}_setProperties(s){function e(a,n=""){return Is(_s(a),([c,d])=>{const y=n?`${n}.${c}`:c;return us(d)&&!_(d)&&d!==null?e(d,y):{key:y,value:d}})}const t=e(s);l(t,({key:a,value:n})=>h(this,a,n));const o=w(L(this.originalRecord),B),r=w(L(this),B);I(o,r)?(h(this,"isDirty",!1),h(this,"isPristine",!0)):(h(this,"isDirty",!0),h(this,"isPristine",!1))}_sortRecordsBy(s,e=[]){const t=v(e,r=>Y(r.split(":"))),o=v(e,r=>ys(r.split(":")));return qs(s,t,o)}_unloadFromCollection(s){const e=i(s,"collectionName"),t=m(this.collections[e],{hashId:i(s,"hashId")});b(t,0)&&this.collections[e].splice(t,1)}_unloadFromRequestHashes(s){const e=x(this.requestHashIds);l(e,t=>{const o=i(this.requestHashIds[t],"data"),r=_(o),a=p(o);if(r){const n=m(i(this.requestHashIds[t],"data"),{hashId:i(s,"hashId")});b(n,0)&&this.requestHashIds[t].data.splice(n,1)}a&&I(i(s,"hashId"),i(this.requestHashIds[t],"data.hashId"))&&h(this.requestHashIds[t],"data",{})})}_unloadFromAliases(s){const e=x(this.aliases);l(e,t=>{const o=_(this.aliases[t]),r=p(this.aliases[t]);if(o){const a=m(this.aliases[t],{hashId:i(s,"hashId")});b(a,0)&&this.aliases[t].splice(a,1)}r&&I(i(s,"hashId"),i(this.aliases[t],"hashId"))&&(this.aliases[t]={})})}unloadRecord(s){this._unloadFromCollection(s),this._unloadFromRequestHashes(s),this._unloadFromAliases(s)}_saveRecord(s){const e=i(s,"collectionName"),t=q(this.collections[e],{hashId:i(s,"hashId")}),o=$(i(t,"id")),r=o?i(t,"id"):null,d={resourceMethod:o?"put":"post",resourceName:e,resourceId:r,resourceParams:{},resourcePayload:{data:t},resourceFallback:{},resourceConfig:{}};return this._request(d)}async _deleteRecord(s){const e=i(s,"collectionName"),t=q(this.collections[e],{hashId:i(s,"hashId")}),o=i(s,"id"),n={resourceMethod:"delete",resourceName:i(t,"collectionName"),resourceId:Number(o),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}};return this._request(n)}async _reloadRecord(s){const e=i(s,"id"),r={resourceMethod:"get",resourceName:i(s,"collectionName"),resourceId:Number(e),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{skipId:F.v1()}};return this._request(r)}_getCollectionRecord(s,e={},t){const o=i(e,"referenceKey")||"",r=i(e,"async")||!1,a=i(e,"filterBy")||{},n=i(e,"sortBy")||[],c=i(t,o)||[],d=p(c),y=d?[c]:c,g=E([]);return l(y,M=>{const U=this._generateHashId({id:i(M,"id"),collectionName:s}),T=q(this.collections[s],{hashId:U});if(!C(T))g.push(T);else if(r){const O={resourceMethod:"get",resourceName:s,resourceId:i(M,"id"),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}},G=z;this._pushRequestHash(O,G),this._request(O)}}),d?Y(g):this._sortRecordsBy(X(g,a),n)}_injectActions(s){const e={get:this._getProperty,set:this._setProperty,setProperties:this._setProperties,save:()=>this._saveRecord(s),destroyRecord:()=>this._deleteRecord(s),reload:()=>this._reloadRecord(s),getCollection:(o,r)=>this._getCollectionRecord(o,r,s)},t=x(e);l(t,o=>{s[o]=e[o]})}_injectReferenceKeys(s,e,t=null){const o=W(t)?this._generateHashId({id:i(e,"id"),collectionName:s}):t;h(e,"collectionName",s),h(e,"hashId",o),h(e,"isLoading",!1),h(e,"isError",!1),h(e,"isPristine",!0),h(e,"isDirty",!1)}_pushToCollection(s,e){const t=_(e),o=p(e);if(t){const r=v(e,"hashId");return l(e,a=>{const n=m(this.collections[s],{hashId:i(a,"hashId")});this._injectActions(a),S(n,0)&&this.collections[s].push(a),b(n,0)&&(this.collections[s][n]=a)}),v(r,a=>q(this.collections[s],{hashId:a}))}if(o){const r=e.hashId,a=m(this.collections[s],{hashId:i(e,"hashId")});return this._injectActions(e),S(a,0)&&this.collections[s].push(e),b(a,0)&&(this.collections[s][a]=e),q(this.collections[s],{hashId:r})}}_pushToAliases(s){const e=_(s),t=p(s),o=x(this.aliases);e&&l(o,r=>{const a=_(this.aliases[r]),n=p(this.aliases[r]);a&&l(s,c=>{const d=m(this.aliases[r],{hashId:i(c,"hashId")});b(d,0)&&(this.aliases[r][d]=c)}),n&&l(s,c=>{I(i(c,"hashId"),i(this.aliases[r],"hashId"))&&(this.aliases[r]=c)})}),t&&l(o,r=>{const a=_(this.aliases[r]),n=p(this.aliases[r]);a&&l([s],c=>{const d=m(this.aliases[r],{hashId:i(c,"hashId")});b(d,0)&&(this.aliases[r][d]=c)}),n&&I(i(s,"hashId"),i(this.aliases[r],"hashId"))&&(this.aliases[r]=s)})}_pushToRequestHashes(s){const e=x(this.requestHashIds),t=_(s),o=p(s);let r=null;t&&(r=s),o&&(r=[s]),l(e,a=>{const n=i(this.requestHashIds[a],"data"),c=_(n),d=p(n);l(r,y=>{if(c){const g=m(i(this.requestHashIds[a],"data"),{hashId:i(y,"hashId")});b(g,0)&&(this.requestHashIds[a].data[g]=y)}d&&I(i(y,"hashId"),i(this.requestHashIds[a],"data.hashId"))&&h(this.requestHashIds[a],"data",y)})})}_pushPayload(s,e){this._isCollectionExisting(s);const t=this._pushToCollection(s,e);return this._pushToAliases(t),this._pushToRequestHashes(t),t}_pushRequestHash(s={},e={isLoading:!0,isError:!1,isNew:!0,data:null}){const t=this._generateHashId(s),o=!R(this.requestHashIds[t]),r=i(e,"isNew");return o&&r?h(this.requestHashIds[t],"isNew",!1):this.requestHashIds[t]=e,this.requestHashIds[t]}setHost(s){this.host=s,this._initializeAxiosConfig()}setNamespace(s){this.namespace=s}setHeadersCommon(s,e){f.defaults.headers.common[`${s}`]=e}setPayloadIncludeReference(s){this.payloadIncludedReference=s}setGlobal(){typeof window<"u"&&(window.ARM=Object.freeze(this))}getCollection(s){return this.collections[s]||[]}clearCollection(s){this.collections[s]=[]}getAlias(s,e){return p(e)&&this._injectActions(e),this.aliases[s]||e}createRecord(s,e={},t=!0){const o=t?F.v1():F.NIL,r=R(q(this.collections[s],{id:o}));return h(e,"id",o),this._injectReferenceKeys(s,e),this._injectActions(e),r&&this.collections[s].push(e),q(this.collections[s],{id:o})}async _request({resourceMethod:s,resourceName:e,resourceId:t,resourceParams:o,resourcePayload:r,resourceFallback:a,resourceConfig:n}){var is,rs,os;const c={method:s,url:e},d=this._generateHashId({...arguments[0]}),y=I(s,"get"),g=I(s,"delete"),M=I(s,"post"),U=$(t)||ls(t),T=!C(o),O=!C(r),G=!R(i(n,"override")),N=i(r,"data")||null;if(G){const u=i(n,"override")||{};let j=R(i(u,"host"))?this.host:i(u,"host"),V=R(i(u,"namespace"))?this.namespace:i(u,"namespace"),Q=`${j}/${V}`;h(c,"baseURL",Q)}if(U&&h(c,"url",`${e}/${t}`),T&&h(c,"params",o),O){const u={data:w(N,ms)};h(c,"data",u)}const J=!R(i(n,"skip")),K=I(i(n,"skip"),!0),ss=this.requestHashIds[d],es=!R(ss),ts=i(ss,"isNew");if(!(y&&(J&&K||!J&&es&&!ts||J&&!K&&es&&!ts))){O&&h(N,"isLoading",!0);try{const u=await f(c),j=((is=u==null?void 0:u.data)==null?void 0:is.data)||a,V=((rs=u==null?void 0:u.data)==null?void 0:rs.included)||[],Q=((os=u==null?void 0:u.data)==null?void 0:os.meta)||{},bs=p(j),gs=_(j);let k=null;return gs&&l(j,P=>this._injectReferenceKeys(e,P)),bs&&this._injectReferenceKeys(e,j),l(V,P=>{this._injectReferenceKeys(i(P,this.payloadIncludedReference),P),this._pushPayload(i(P,"collectionName"),P)}),k=await this._pushPayload(e,j),n.alias&&this._addAlias(i(n,"alias"),k),M&&this.unloadRecord(N),g&&this.unloadRecord(k),this.requestHashIds[d]={isLoading:!1,isError:!1,isNew:!1,data:k,included:[],meta:Q},Promise.resolve(k)}catch(u){return O&&(h(N,"isError",!0),h(N,"isLoading",!1)),this.requestHashIds[d]={isLoading:!1,isError:!0,isNew:!1,data:u,included:[],meta:{}},Promise.reject(u)}}}query(s,e={},t={}){const o={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:[],resourceConfig:t},r=Z,a=this._pushRequestHash(o,r);return this._request(o),a}queryRecord(s,e={},t={}){const o={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:{},resourceConfig:t},r=z,a=this._pushRequestHash(o,r);return this._request(o),a}findAll(s,e={}){const t={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:null,resourcePayload:null,resourceFallback:[],resourceConfig:e},o=Z,r=this._pushRequestHash(t,o);return this._request(t),r}findRecord(s,e,t={},o={}){const r={resourceMethod:"get",resourceName:s,resourceId:e,resourceParams:t,resourcePayload:null,resourceFallback:{},resourceConfig:o},a=z,n=this._pushRequestHash(r,a);return this._request(r),n}peekAll(s){return this.collections[s]}peekRecord(s,e){return q(this.collections[s],{id:e})}findBy(s,e={}){return q(s,e)}findIndexBy(s,e={}){return m(s,e)}filterBy(s,e={}){return X(s,e)}sortBy(s,e){return this._sortRecordsBy(s,e)}isEmpty(s){return C(s)}isPresent(s){return!C(s)}isEqual(s,e){return I(s,e)}isNumber(s){return $(s)}isNil(s){return R(s)}isNull(s){return W(s)}isGte(s,e){return b(s,e)}isGt(s,e){return fs(s,e)}isLte(s,e){return ps(s,e)}isLt(s,e){return S(s,e)}}return Rs});
