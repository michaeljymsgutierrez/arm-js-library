(function(f,C){typeof exports=="object"&&typeof module<"u"?module.exports=C(require("axios"),require("lodash"),require("mobx"),require("uuid"),require("crypto-js")):typeof define=="function"&&define.amd?define(["axios","lodash","mobx","uuid","crypto-js"],C):(f=typeof globalThis<"u"?globalThis:f||self,f["arm-js-library"]=C(f.axios,f._,f.mobx,f.uuid,f.CryptoJS))})(this,function(f,C,cs,F,hs){"use strict";function ds(H){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(H){for(const e in H)if(e!=="default"){const t=Object.getOwnPropertyDescriptor(H,e);Object.defineProperty(s,e,t.get?t:{enumerable:!0,get:()=>H[e]})}}return s.default=H,Object.freeze(s)}const us=ds(cs),{makeObservable:ls,observable:L,action:B,toJS:D}=us,{get:i,set:c,find:q,findIndex:m,isObject:fs,isArray:_,isPlainObject:I,isNumber:S,isString:ps,isNull:Y,isNil:b,isEmpty:x,isEqual:p,gte:g,gt:Is,lte:_s,lt:z,flatMap:ys,map:v,entries:qs,forEach:l,filter:Z,keysIn:w,concat:ms,chunk:bs,uniqWith:gs,omit:N,first:U,last:K,orderBy:Rs}=C,ss={isLoading:!0,isError:!1,isNew:!0,data:[],included:[],meta:{}},G={isLoading:!0,isError:!1,isNew:!0,data:{},included:[],meta:{}},M=["destroyRecord","getCollection","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine"],js=["destroyRecord","getCollection","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine","hashId","collectionName"];class Hs{constructor(s=[]){this.namespace="api/v1",this.host=typeof window<"u"?window.location.origin:"",this.collections={},this.aliases={},this.requestHashIds={},this.payloadIncludedReference="type",this._initializeCollections(s),this._initializeAxiosConfig(),ls(this,{collections:L,aliases:L,requestHashIds:L,_pushPayload:B,_pushRequestHash:B,_addCollection:B,_addAlias:B})}_initializeAxiosConfig(){f.defaults.baseURL=this._getBaseURL()}_initializeCollections(s){l(s,e=>this._addCollection(e,[]))}_getBaseURL(){return`${this.host}/${this.namespace}`}_isCollectionExisting(s){if(b(i(this.collections,s)))throw`Collection ${s} does not exist.
Fix: Try adding ${s} on your ARM config initialization.`}_addCollection(s,e){this.collections[s]=e}_addAlias(s,e){const t=_(e),o=I(e);t&&(this.aliases[s]=e||[]),o&&(this.aliases[s]=e||{})}_generateHashId(s={id:F.v1()}){const e=JSON.stringify(s);return hs.MD5(e).toString()}_getProperty(s){return i(this,s)}_setProperty(s,e){c(this,s,e);const t=N(D(this.originalRecord),M),o=N(D(this),M);p(t,o)?(c(this,"isDirty",!1),c(this,"isPristine",!0)):(c(this,"isDirty",!0),c(this,"isPristine",!1))}_setProperties(s){function e(a,n=""){return ys(qs(a),([h,d])=>{const y=n?`${n}.${h}`:h;return fs(d)&&!_(d)&&d!==null?e(d,y):{key:y,value:d}})}const t=e(s);l(t,({key:a,value:n})=>c(this,a,n));const o=N(D(this.originalRecord),M),r=N(D(this),M);p(o,r)?(c(this,"isDirty",!1),c(this,"isPristine",!0)):(c(this,"isDirty",!0),c(this,"isPristine",!1))}_sortRecordsBy(s,e=[]){const t=v(e,r=>U(r.split(":"))),o=v(e,r=>K(r.split(":")));return Rs(s,t,o)}_unloadFromCollection(s){const e=i(s,"collectionName"),t=m(this.collections[e],{hashId:i(s,"hashId")});g(t,0)&&this.collections[e].splice(t,1)}_unloadFromRequestHashes(s){const e=w(this.requestHashIds);l(e,t=>{const o=i(this.requestHashIds[t],"data"),r=_(o),a=I(o);if(r){const n=m(i(this.requestHashIds[t],"data"),{hashId:i(s,"hashId")});g(n,0)&&this.requestHashIds[t].data.splice(n,1)}a&&p(i(s,"hashId"),i(this.requestHashIds[t],"data.hashId"))&&c(this.requestHashIds[t],"data",{})})}_unloadFromAliases(s){const e=w(this.aliases);l(e,t=>{const o=_(this.aliases[t]),r=I(this.aliases[t]);if(o){const a=m(this.aliases[t],{hashId:i(s,"hashId")});g(a,0)&&this.aliases[t].splice(a,1)}r&&p(i(s,"hashId"),i(this.aliases[t],"hashId"))&&(this.aliases[t]={})})}unloadRecord(s){this._unloadFromCollection(s),this._unloadFromRequestHashes(s),this._unloadFromAliases(s)}_saveRecord(s){const e=i(s,"collectionName"),t=q(this.collections[e],{hashId:i(s,"hashId")}),o=S(i(t,"id")),r=o?i(t,"id"):null,d={resourceMethod:o?"put":"post",resourceName:e,resourceId:r,resourceParams:{},resourcePayload:{data:t},resourceFallback:{},resourceConfig:{}};return this._request(d)}async _deleteRecord(s){const e=i(s,"collectionName"),t=q(this.collections[e],{hashId:i(s,"hashId")}),o=i(s,"id"),n={resourceMethod:"delete",resourceName:i(t,"collectionName"),resourceId:Number(o),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}};return this._request(n)}async _reloadRecord(s){const e=i(s,"id"),r={resourceMethod:"get",resourceName:i(s,"collectionName"),resourceId:Number(e),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{skipId:F.v1()}};return this._request(r)}_getCollectionRecord(s,e={},t){const o=i(e,"referenceKey")||"",r=i(e,"async")||!1,a=i(e,"filterBy")||{},n=i(e,"sortBy")||[],h=i(t,o)||[],d=I(h),y=d?[h]:h,R=L([]);return l(y,T=>{const O=this._generateHashId({id:i(T,"id"),collectionName:s}),$=q(this.collections[s],{hashId:O});if(!x($))R.push($);else if(r){const P={resourceMethod:"get",resourceName:s,resourceId:i(T,"id"),resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}},J=G;this._pushRequestHash(P,J),this._request(P)}}),d?U(R):this._sortRecordsBy(Z(R,a),n)}_injectActions(s){const e={get:this._getProperty,set:this._setProperty,setProperties:this._setProperties,save:()=>this._saveRecord(s),destroyRecord:()=>this._deleteRecord(s),reload:()=>this._reloadRecord(s),getCollection:(o,r)=>this._getCollectionRecord(o,r,s)},t=w(e);l(t,o=>{s[o]=e[o]})}_injectReferenceKeys(s,e,t=null){const o=Y(t)?this._generateHashId({id:i(e,"id"),collectionName:s}):t;c(e,"collectionName",s),c(e,"hashId",o),c(e,"isLoading",!1),c(e,"isError",!1),c(e,"isPristine",!0),c(e,"isDirty",!1)}_pushToCollection(s,e){const t=_(e),o=I(e);if(t){const r=v(e,"hashId");return l(e,a=>{const n=m(this.collections[s],{hashId:i(a,"hashId")});this._injectActions(a),z(n,0)&&this.collections[s].push(a),g(n,0)&&(this.collections[s][n]=a)}),v(r,a=>q(this.collections[s],{hashId:a}))}if(o){const r=e.hashId,a=m(this.collections[s],{hashId:i(e,"hashId")});return this._injectActions(e),z(a,0)&&this.collections[s].push(e),g(a,0)&&(this.collections[s][a]=e),q(this.collections[s],{hashId:r})}}_pushToAliases(s){const e=_(s),t=I(s),o=w(this.aliases);e&&l(o,r=>{const a=_(this.aliases[r]),n=I(this.aliases[r]);a&&l(s,h=>{const d=m(this.aliases[r],{hashId:i(h,"hashId")});g(d,0)&&(this.aliases[r][d]=h)}),n&&l(s,h=>{p(i(h,"hashId"),i(this.aliases[r],"hashId"))&&(this.aliases[r]=h)})}),t&&l(o,r=>{const a=_(this.aliases[r]),n=I(this.aliases[r]);a&&l([s],h=>{const d=m(this.aliases[r],{hashId:i(h,"hashId")});g(d,0)&&(this.aliases[r][d]=h)}),n&&p(i(s,"hashId"),i(this.aliases[r],"hashId"))&&(this.aliases[r]=s)})}_pushToRequestHashes(s){const e=w(this.requestHashIds),t=_(s),o=I(s);let r=null;t&&(r=s),o&&(r=[s]),l(e,a=>{const n=i(this.requestHashIds[a],"data"),h=_(n),d=I(n);l(r,y=>{if(h){const R=m(i(this.requestHashIds[a],"data"),{hashId:i(y,"hashId")});g(R,0)&&(this.requestHashIds[a].data[R]=y)}d&&p(i(y,"hashId"),i(this.requestHashIds[a],"data.hashId"))&&c(this.requestHashIds[a],"data",y)})})}_pushPayload(s,e){this._isCollectionExisting(s);const t=this._pushToCollection(s,e);return this._pushToAliases(t),this._pushToRequestHashes(t),t}_pushRequestHash(s={},e={isLoading:!0,isError:!1,isNew:!0,data:null}){const t=this._generateHashId(s),o=!b(this.requestHashIds[t]),r=i(e,"isNew");return o&&r?c(this.requestHashIds[t],"isNew",!1):this.requestHashIds[t]=e,this.requestHashIds[t]}setHost(s){this.host=s,this._initializeAxiosConfig()}setNamespace(s){this.namespace=s}setHeadersCommon(s,e){f.defaults.headers.common[`${s}`]=e}setPayloadIncludeReference(s){this.payloadIncludedReference=s}setGlobal(){typeof window<"u"&&(window.ARM=Object.freeze(this))}getCollection(s){return this.collections[s]||[]}clearCollection(s){this.collections[s]=[]}getAlias(s,e){return I(e)&&this._injectActions(e),this.aliases[s]||e}createRecord(s,e={},t=!0){const o=t?F.v1():F.NIL,r=b(q(this.collections[s],{id:o}));return c(e,"id",o),this._injectReferenceKeys(s,e),this._injectActions(e),r&&this.collections[s].push(e),q(this.collections[s],{id:o})}async _request({resourceMethod:s,resourceName:e,resourceId:t,resourceParams:o,resourcePayload:r,resourceFallback:a,resourceConfig:n}){var os,as,ns;const h={method:s,url:e},d=this._generateHashId({...arguments[0]}),y=p(s,"get"),R=p(s,"delete"),T=p(s,"post"),O=S(t)||ps(t),$=!x(o),P=!x(r),J=!b(i(n,"override")),k=i(r,"data")||null,V=O?q(this.collections[e],{id:t}):null;if(J){const u=i(n,"override")||{};let j=b(i(u,"host"))?this.host:i(u,"host"),Q=b(i(u,"namespace"))?this.namespace:i(u,"namespace"),X=`${j}/${Q}`;c(h,"baseURL",X)}if(O&&c(h,"url",`${e}/${t}`),$&&c(h,"params",o),P){const u={data:N(k,js)};c(h,"data",u)}const W=!b(i(n,"skip")),es=p(i(n,"skip"),!0),ts=this.requestHashIds[d],is=!b(ts),rs=i(ts,"isNew");if(!(y&&(W&&es||!W&&is&&!rs||W&&!es&&is&&!rs))){P&&c(k,"isLoading",!0),O&&c(V,"isLoading",!0);try{const u=await f(h),j=((os=u==null?void 0:u.data)==null?void 0:os.data)||a,Q=((as=u==null?void 0:u.data)==null?void 0:as.included)||[],X=((ns=u==null?void 0:u.data)==null?void 0:ns.meta)||{},Os=I(j),Ps=_(j);let E=null;return Ps&&l(j,A=>this._injectReferenceKeys(e,A)),Os&&this._injectReferenceKeys(e,j),l(Q,A=>{this._injectReferenceKeys(i(A,this.payloadIncludedReference),A),this._pushPayload(i(A,"collectionName"),A)}),E=await this._pushPayload(e,j),n.alias&&this._addAlias(i(n,"alias"),E),T&&this.unloadRecord(k),R&&this.unloadRecord(E),this.requestHashIds[d]={isLoading:!1,isError:!1,isNew:!1,data:E,included:[],meta:X},Promise.resolve(E)}catch(u){return P&&(c(k,"isError",!0),c(k,"isLoading",!1)),O&&(c(V,"isError",!0),c(V,"isLoading",!1)),this.requestHashIds[d]={isLoading:!1,isError:!0,isNew:!1,data:u,included:[],meta:{}},Promise.reject(u)}}}query(s,e={},t={}){const o={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:[],resourceConfig:t},r=ss,a=this._pushRequestHash(o,r);return this._request(o),a}queryRecord(s,e={},t={}){const o={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:{},resourceConfig:t},r=G,a=this._pushRequestHash(o,r);return this._request(o),a}findAll(s,e={}){const t={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:null,resourcePayload:null,resourceFallback:[],resourceConfig:e},o=ss,r=this._pushRequestHash(t,o);return this._request(t),r}findRecord(s,e,t={},o={}){const r={resourceMethod:"get",resourceName:s,resourceId:e,resourceParams:t,resourcePayload:null,resourceFallback:{},resourceConfig:o},a=G,n=this._pushRequestHash(r,a);return this._request(r),n}peekAll(s){return this.collections[s]}peekRecord(s,e){return q(this.collections[s],{id:e})}ajax(s={}){return f.request(s)}findBy(s,e={}){return q(s,e)}findIndexBy(s,e={}){return m(s,e)}filterBy(s,e={}){return Z(s,e)}firstObject(s=[]){return U(s)}lastObject(s=[]){return K(s)}mergeObjects(s=[],e=[]){return gs(ms(s,e),p)}chunkObjects(s=[],e=1){return bs(s,e)}sortBy(s,e){return this._sortRecordsBy(s,e)}isEmpty(s){return x(s)}isPresent(s){return!x(s)}isEqual(s,e){return p(s,e)}isNumber(s){return S(s)}isNil(s){return b(s)}isNull(s){return Y(s)}isGte(s,e){return g(s,e)}isGt(s,e){return Is(s,e)}isLte(s,e){return _s(s,e)}isLt(s,e){return z(s,e)}}return Hs});
