(function(f,x){typeof exports=="object"&&typeof module<"u"?module.exports=x(require("axios"),require("lodash"),require("mobx"),require("uuid"),require("crypto-js")):typeof define=="function"&&define.amd?define(["axios","lodash","mobx","uuid","crypto-js"],x):(f=typeof globalThis<"u"?globalThis:f||self,f["arm-js-library"]=x(f.axios,f._,f.mobx,f.uuid,f.CryptoJS))})(this,function(f,x,ds,E,us){"use strict";function ls(O){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(O){for(const e in O)if(e!=="default"){const t=Object.getOwnPropertyDescriptor(O,e);Object.defineProperty(s,e,t.get?t:{enumerable:!0,get:()=>O[e]})}}return s.default=O,Object.freeze(s)}const fs=ls(ds),{makeObservable:ps,observable:F,action:L,toJS:v}=fs,{get:i,set:c,find:q,findIndex:g,isObject:Is,isArray:y,isPlainObject:I,isNumber:S,isString:ys,isNull:K,isNil:m,isEmpty:w,isEqual:p,gte:b,gt:_s,lte:qs,lt:z,assign:ms,flatMap:gs,map:D,entries:bs,forEach:l,filter:ss,keysIn:N,concat:Rs,chunk:js,uniqWith:Hs,omit:k,first:U,last:es,orderBy:Os,uniqBy:Ps,groupBy:As}=x,ts={isLoading:!0,isError:!1,isNew:!0,data:[],included:[],meta:{}},G={isLoading:!0,isError:!1,isNew:!0,data:{},included:[],meta:{}},M=["destroyRecord","getCollection","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine"],Cs=["destroyRecord","getCollection","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine","hashId","collectionName"];class xs{constructor(s=[]){this.namespace="api/v1",this.host=typeof window<"u"?window.location.origin:"",this.collections={},this.aliases={},this.requestHashIds={},this.payloadIncludedReference="type",this._initializeCollections(s),this._initializeAxiosConfig(),ps(this,{collections:F,aliases:F,requestHashIds:F,_pushPayload:L,_pushRequestHash:L,_addCollection:L,_addAlias:L})}_initializeAxiosConfig(){f.defaults.baseURL=this._getBaseURL()}_initializeCollections(s){l(s,e=>this._addCollection(e,[]))}_getBaseURL(){return`${this.host}/${this.namespace}`}_isCollectionExisting(s){if(m(i(this.collections,s)))throw`Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`}_addCollection(s,e){this.collections[s]=e}_addAlias(s,e){const t=y(e),o=I(e);t&&(this.aliases[s]=e||[]),o&&(this.aliases[s]=e||{})}_generateHashId(s={id:E.v1()}){const e=JSON.stringify(s);return us.MD5(e).toString()}_getProperty(s){return i(this,s)}_setProperty(s,e){c(this,s,e);const t=k(v(this.originalRecord),M),o=k(v(this),M);p(t,o)?(c(this,"isDirty",!1),c(this,"isPristine",!0)):(c(this,"isDirty",!0),c(this,"isPristine",!1))}_setProperties(s){function e(a,n=""){return gs(bs(a),([h,d])=>{const _=n?`${n}.${h}`:h;return Is(d)&&!y(d)&&d!==null?e(d,_):{key:_,value:d}})}const t=e(s);l(t,({key:a,value:n})=>c(this,a,n));const o=k(v(this.originalRecord),M),r=k(v(this),M);p(o,r)?(c(this,"isDirty",!1),c(this,"isPristine",!0)):(c(this,"isDirty",!0),c(this,"isPristine",!1))}_sortRecordsBy(s,e=[]){const t=D(e,r=>U(r.split(":"))),o=D(e,r=>es(r.split(":")));return Os(s,t,o)}_unloadFromCollection(s){const e=i(s,"collectionName"),t=g(this.collections[e],{hashId:i(s,"hashId")});b(t,0)&&this.collections[e].splice(t,1)}_unloadFromRequestHashes(s){const e=N(this.requestHashIds);l(e,t=>{const o=i(this.requestHashIds[t],"data"),r=y(o),a=I(o);if(r){const n=g(i(this.requestHashIds[t],"data"),{hashId:i(s,"hashId")});b(n,0)&&this.requestHashIds[t].data.splice(n,1)}a&&p(i(s,"hashId"),i(this.requestHashIds[t],"data.hashId"))&&c(this.requestHashIds[t],"data",{})})}_unloadFromAliases(s){const e=N(this.aliases);l(e,t=>{const o=y(this.aliases[t]),r=I(this.aliases[t]);if(o){const a=g(this.aliases[t],{hashId:i(s,"hashId")});b(a,0)&&this.aliases[t].splice(a,1)}r&&p(i(s,"hashId"),i(this.aliases[t],"hashId"))&&(this.aliases[t]={})})}unloadRecord(s){this._unloadFromCollection(s),this._unloadFromRequestHashes(s),this._unloadFromAliases(s)}_saveRecord(s){const e=i(s,"collectionName"),t=q(this.collections[e],{hashId:i(s,"hashId")}),o=S(i(t,"id")),r=o?i(t,"id"):null,d={resourceMethod:o?"put":"post",resourceName:e,resourceId:r,resourceParams:{},resourcePayload:{data:t},resourceFallback:{},resourceConfig:{}};return this._request(d)}async _deleteRecord(s){const e=i(s,"collectionName"),t=q(this.collections[e],{hashId:i(s,"hashId")}),o=i(s,"id"),n={resourceMethod:"delete",resourceName:i(t,"collectionName"),resourceId:Number(o),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}};return this._request(n)}async _reloadRecord(s){const e=i(s,"id"),r={resourceMethod:"get",resourceName:i(s,"collectionName"),resourceId:Number(e),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{skipId:E.v1()}};return this._request(r)}_getCollectionRecord(s,e={},t){const o=i(e,"referenceKey")||"",r=i(e,"async")||!1,a=i(e,"filterBy")||{},n=i(e,"sortBy")||[],h=i(t,o)||[],d=I(h),_=d?[h]:h,R=F([]);return l(_,T=>{const P=this._generateHashId({id:i(T,"id"),collectionName:s}),$=q(this.collections[s],{hashId:P});if(!w($))R.push($);else if(r){const A={resourceMethod:"get",resourceName:s,resourceId:i(T,"id"),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}},J=G;this._pushRequestHash(A,J),this._request(A)}}),d?U(R):this._sortRecordsBy(ss(R,a),n)}_injectActions(s){const e={get:this._getProperty,set:this._setProperty,setProperties:this._setProperties,save:()=>this._saveRecord(s),destroyRecord:()=>this._deleteRecord(s),reload:()=>this._reloadRecord(s),getCollection:(o,r)=>this._getCollectionRecord(o,r,s)},t=N(e);l(t,o=>{s[o]=e[o]})}_injectReferenceKeys(s,e,t=null){const o=K(t)?this._generateHashId({id:i(e,"id"),collectionName:s}):t;c(e,"collectionName",s),c(e,"hashId",o),c(e,"isLoading",!1),c(e,"isError",!1),c(e,"isPristine",!0),c(e,"isDirty",!1)}_pushToCollection(s,e){const t=y(e),o=I(e);if(t){const r=D(e,"hashId");return l(e,a=>{const n=g(this.collections[s],{hashId:i(a,"hashId")});this._injectActions(a),z(n,0)&&this.collections[s].push(a),b(n,0)&&(this.collections[s][n]=a)}),D(r,a=>q(this.collections[s],{hashId:a}))}if(o){const r=e.hashId,a=g(this.collections[s],{hashId:i(e,"hashId")});return this._injectActions(e),z(a,0)&&this.collections[s].push(e),b(a,0)&&(this.collections[s][a]=e),q(this.collections[s],{hashId:r})}}_pushToAliases(s){const e=y(s),t=I(s),o=N(this.aliases);e&&l(o,r=>{const a=y(this.aliases[r]),n=I(this.aliases[r]);a&&l(s,h=>{const d=g(this.aliases[r],{hashId:i(h,"hashId")});b(d,0)&&(this.aliases[r][d]=h)}),n&&l(s,h=>{p(i(h,"hashId"),i(this.aliases[r],"hashId"))&&(this.aliases[r]=h)})}),t&&l(o,r=>{const a=y(this.aliases[r]),n=I(this.aliases[r]);a&&l([s],h=>{const d=g(this.aliases[r],{hashId:i(h,"hashId")});b(d,0)&&(this.aliases[r][d]=h)}),n&&p(i(s,"hashId"),i(this.aliases[r],"hashId"))&&(this.aliases[r]=s)})}_pushToRequestHashes(s){const e=N(this.requestHashIds),t=y(s),o=I(s);let r=null;t&&(r=s),o&&(r=[s]),l(e,a=>{const n=i(this.requestHashIds[a],"data"),h=y(n),d=I(n);l(r,_=>{if(h){const R=g(i(this.requestHashIds[a],"data"),{hashId:i(_,"hashId")});b(R,0)&&(this.requestHashIds[a].data[R]=_)}d&&p(i(_,"hashId"),i(this.requestHashIds[a],"data.hashId"))&&c(this.requestHashIds[a],"data",_)})})}_pushPayload(s,e){this._isCollectionExisting(s);const t=this._pushToCollection(s,e);return this._pushToAliases(t),this._pushToRequestHashes(t),t}_pushRequestHash(s={},e={isLoading:!0,isError:!1,isNew:!0,data:null}){const t=this._generateHashId(s),o=!m(this.requestHashIds[t]),r=i(e,"isNew");return o&&r?c(this.requestHashIds[t],"isNew",!1):this.requestHashIds[t]=e,this.requestHashIds[t]}setHost(s){this.host=s,this._initializeAxiosConfig()}setNamespace(s){this.namespace=s}setHeadersCommon(s,e){f.defaults.headers.common[`${s}`]=e}setPayloadIncludeReference(s){this.payloadIncludedReference=s}setGlobal(){typeof window<"u"&&(window.ARM=Object.freeze(this))}getCollection(s){return this.collections[s]||[]}clearCollection(s){this.collections[s]=[]}getAlias(s,e){return I(e)&&this._injectActions(e),this.aliases[s]||e}createRecord(s,e={},t=!0){const o=t?E.v1():E.NIL,r=m(q(this.collections[s],{id:o}));return c(e,"id",o),this._injectReferenceKeys(s,e),this._injectActions(e),r&&this.collections[s].push(e),q(this.collections[s],{id:o})}async _request({resourceMethod:s,resourceName:e,resourceId:t,resourceParams:o,resourcePayload:r,resourceFallback:a,resourceConfig:n}){var ns,cs,hs;const h={method:s,url:e},d=this._generateHashId({...arguments[0]}),_=p(s,"get"),R=p(s,"delete"),T=p(s,"post"),P=S(t)||ys(t),$=!w(o),A=!w(r),J=!m(i(n,"override")),B=i(r,"data")||null,V=P?q(this.collections[e],{id:t}):null;if(J){const u=i(n,"override")||{},j=m(i(u,"host"))?this.host:i(u,"host"),Q=m(i(u,"namespace"))?this.namespace:i(u,"namespace"),X=`${j}/${Q}`,Y=m(i(u,"headers"))?{}:i(u,"headers"),Z=f.defaults.headers.common,H=ms(Z,Y);c(h,"baseURL",X),c(h,"headers",H)}if(P&&c(h,"url",`${e}/${t}`),$&&c(h,"params",o),A){const u={data:k(B,Cs)};c(h,"data",u)}const W=!m(i(n,"skip")),is=p(i(n,"skip"),!0),rs=this.requestHashIds[d],os=!m(rs),as=i(rs,"isNew");if(!(_&&(W&&is||!W&&os&&!as||W&&!is&&os&&!as))){A&&c(B,"isLoading",!0),P&&c(V,"isLoading",!0);try{const u=await f(h),j=((ns=u==null?void 0:u.data)==null?void 0:ns.data)||a,Q=((cs=u==null?void 0:u.data)==null?void 0:cs.included)||[],X=((hs=u==null?void 0:u.data)==null?void 0:hs.meta)||{},Y=I(j),Z=y(j);let H=null;return Z&&l(j,C=>this._injectReferenceKeys(e,C)),Y&&this._injectReferenceKeys(e,j),l(Q,C=>{this._injectReferenceKeys(i(C,this.payloadIncludedReference),C),this._pushPayload(i(C,"collectionName"),C)}),H=await this._pushPayload(e,j),n.alias&&this._addAlias(i(n,"alias"),H),T&&this.unloadRecord(B),R&&this.unloadRecord(H),this.requestHashIds[d]={isLoading:!1,isError:!1,isNew:!1,data:H,included:[],meta:X},Promise.resolve(H)}catch(u){return A&&(c(B,"isError",!0),c(B,"isLoading",!1)),P&&(c(V,"isError",!0),c(V,"isLoading",!1)),this.requestHashIds[d]={isLoading:!1,isError:!0,isNew:!1,data:u,included:[],meta:{}},Promise.reject(u)}}}query(s,e={},t={}){const o={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:[],resourceConfig:t},r=ts,a=this._pushRequestHash(o,r);return this._request(o),a}queryRecord(s,e={},t={}){const o={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:{},resourceConfig:t},r=G,a=this._pushRequestHash(o,r);return this._request(o),a}findAll(s,e={}){const t={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:null,resourcePayload:null,resourceFallback:[],resourceConfig:e},o=ts,r=this._pushRequestHash(t,o);return this._request(t),r}findRecord(s,e,t={},o={}){const r={resourceMethod:"get",resourceName:s,resourceId:e,resourceParams:t,resourcePayload:null,resourceFallback:{},resourceConfig:o},a=G,n=this._pushRequestHash(r,a);return this._request(r),n}peekAll(s){return this.collections[s]}peekRecord(s,e){return q(this.collections[s],{id:e})}ajax(s={}){return f.request(s)}findBy(s,e={}){return q(s,e)}findIndexBy(s,e={}){return g(s,e)}filterBy(s,e={}){return ss(s,e)}uniqBy(s,e){return Ps(s,e)}groupBy(s,e){return As(s,e)}firstObject(s=[]){return U(s)}lastObject(s=[]){return es(s)}mergeObjects(s=[],e=[]){return Hs(Rs(s,e),p)}chunkObjects(s=[],e=1){return js(s,e)}sortBy(s,e){return this._sortRecordsBy(s,e)}isEmpty(s){return w(s)}isPresent(s){return!w(s)}isEqual(s,e){return p(s,e)}isNumber(s){return S(s)}isNil(s){return m(s)}isNull(s){return K(s)}isGte(s,e){return b(s,e)}isGt(s,e){return _s(s,e)}isLte(s,e){return qs(s,e)}isLt(s,e){return z(s,e)}}return xs});
