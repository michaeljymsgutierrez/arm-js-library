(function(I,C){typeof exports=="object"&&typeof module<"u"?module.exports=C(require("axios"),require("lodash"),require("mobx"),require("uuid"),require("crypto-js")):typeof define=="function"&&define.amd?define(["axios","lodash","mobx","uuid","crypto-js"],C):(I=typeof globalThis<"u"?globalThis:I||self,I["arm-js-library"]=C(I.axios,I._,I.mobx,I.uuid,I.CryptoJS))})(this,function(I,C,Y,z,Z){"use strict";function K(H){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(H){for(const e in H)if(e!=="default"){const t=Object.getOwnPropertyDescriptor(H,e);Object.defineProperty(s,e,t.get?t:{enumerable:!0,get:()=>H[e]})}}return s.default=H,Object.freeze(s)}const ss=K(Y),{makeObservable:es,observable:T,action:x,toJS:D}=ss,{get:i,set:c,find:O,findIndex:b,isObject:ts,isArray:g,isPlainObject:m,isNumber:S,isNull:is,isNil:$,isEmpty:B,isEqual:_,gte:j,lt:J,flatMap:rs,map:U,entries:os,forEach:u,keysIn:E,omit:w}=C,V={isLoading:!0,isError:!1,isNew:!0,data:[],included:[],meta:{}},G={isLoading:!0,isError:!1,isNew:!0,data:{},included:[],meta:{}},L=["destroyRecord","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine"],as=["destroyRecord","reload","save","set","get","setProperties","isDirty","isError","isLoading","isPristine","hashId","collectionName"];class ns{constructor(s=[]){this.namespace="api/v1",this.host=window.location.origin,this.collections={},this.aliases={},this.requestHashIds={},this.payloadIncludedReference="type",this._initializeCollections(s),this._initializeAxiosConfig(),es(this,{collections:T,aliases:T,requestHashIds:T,_pushPayloadToCollection:x,_pushRequestHash:x,_addCollection:x,_addAlias:x})}_initializeAxiosConfig(){I.defaults.baseURL=this._getBaseURL()}_initializeCollections(s){u(s,e=>this._addCollection(e,[]))}_getBaseURL(){return`${this.host}/${this.namespace}`}_getAuthorizationToken(){return`Token ${window.localStorage.getItem("token")}`}_addCollection(s,e){this.collections[s]=e}_addAlias(s,e){const t=g(e),r=m(e);t&&(this.aliases[s]=e||[]),r&&(this.aliases[s]=e||{})}_generateHashId(s={id:z.v1()}){const e=JSON.stringify(s);return Z.MD5(e).toString()}_getProperty(s){return i(this,s)}_setProperty(s,e){c(this,s,e);const t=w(D(this.originalRecord),L),r=w(D(this),L);_(t,r)?(c(this,"isDirty",!1),c(this,"isPristine",!0)):(c(this,"isDirty",!0),c(this,"isPristine",!1))}_setProperties(s){function e(d,n=""){return rs(os(d),([f,a])=>{const h=n?`${n}.${f}`:f;return ts(a)&&!g(a)&&a!==null?e(a,h):{key:h,value:a}})}const t=e(s);u(t,({key:d,value:n})=>c(this,d,n));const r=w(D(this.originalRecord),L),o=w(D(this),L);_(r,o)?(c(this,"isDirty",!1),c(this,"isPristine",!0)):(c(this,"isDirty",!0),c(this,"isPristine",!1))}unloadRecord(s){const e=E(this.aliases),t=i(s,"collectionName"),r=b(this.collections[t],{hashId:i(s,"hashId")});j(r,0)&&this.collections[t].splice(r,1),u(e,o=>{const d=g(this.aliases[o]),n=m(this.aliases[o]);if(d){const f=b(this.aliases[o],{hashId:i(s,"hashId")});j(f,0)&&this.aliases[o].splice(f,1)}n&&_(i(s,"hashId"),i(this.aliases[o],"hashId"))&&(this.aliases[o]={})})}_saveRecord(s){const e=i(s,"collectionName"),t=O(this.collections[e],{hashId:i(s,"hashId")}),r=S(i(t,"id")),o=r?i(t,"id"):null,a={resourceMethod:r?"put":"post",resourceName:e,resourceId:o,resourceParams:{},resourcePayload:{data:t},resourceFallback:{},resourceConfig:{}};return this._request(a)}async _deleteRecord(s){const e=i(s,"collectionName"),t=O(this.collections[e],{hashId:i(s,"hashId")}),r=i(s,"id"),n={resourceMethod:"delete",resourceName:i(t,"collectionName"),resourceId:r,resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{}};return this._request(n)}async _reloadRecord(s){const e=i(s,"id"),o={resourceMethod:"get",resourceName:i(s,"collectionName"),resourceId:e,resourceParams:{},resourcePayload:null,resourceFallback:{},resourceConfig:{skip:!0}};return this._request(o)}_getCollectionRecord(s,e={},t){i(t,"collectionName");const r=i(e,"referenceKey")||"";i(e,"async");const o=i(t,r)||[];u(o,d=>{this._generateHashId({id:i(d,"id"),collectionName:s}),console.log({id:i(d,"id"),collectionName:s})})}_injectActions(s){const e={get:this._getProperty,set:this._setProperty,setProperties:this._setProperties,save:()=>this._saveRecord(s),destroyRecord:()=>this._deleteRecord(s),reload:()=>this._reloadRecord(s)},t=E(e);u(t,r=>{s[r]=e[r]})}_injectReferenceKeys(s,e,t=null){const r=is(t)?this._generateHashId({id:i(e,"id"),collectionName:s}):t;c(e,"collectionName",s),c(e,"hashId",r),c(e,"isLoading",!1),c(e,"isError",!1),c(e,"isPristine",!0),c(e,"isDirty",!1)}_pushPayloadToCollection(s,e){const t=g(e),r=m(e),o=E(this.aliases),d=E(this.requestHashIds);let n=null;if(t){const f=U(e,"hashId");u(e,a=>{const h=b(this.collections[s],{hashId:i(a,"hashId")});this._injectActions(a),J(h,0)&&this.collections[s].push(a),j(h,0)&&(this.collections[s][h]=a)}),n=U(f,a=>O(this.collections[s],{hashId:a})),u(o,a=>{const h=g(this.aliases[a]),q=m(this.aliases[a]);h&&u(n,p=>{const y=b(this.aliases[a],{hashId:i(p,"hashId")});j(y,0)&&(this.aliases[a][y]=p)}),q&&u(n,p=>{_(i(p,"hashId"),i(this.aliases[a],"hashId"))&&(this.aliases[a]=p)})})}if(r){const f=e.hashId,a=b(this.collections[s],{hashId:i(e,"hashId")});this._injectActions(e),J(a,0)&&this.collections[s].push(e),j(a,0)&&(this.collections[s][a]=e),n=O(this.collections[s],{hashId:f}),u(o,h=>{const q=g(this.aliases[h]),p=m(this.aliases[h]);q&&u([n],y=>{const P=b(this.aliases[h],{hashId:i(y,"hashId")});j(P,0)&&(this.aliases[h][P]=y)}),p&&_(i(n,"hashId"),i(this.aliases[h],"hashId"))&&(this.aliases[h]=n)}),u(d,h=>{const q=i(this.requestHashIds[h],"data"),p=g(q),y=m(q);p&&u([n],P=>{const M=b(i(this.requestHashIds[h],"data"),{hashId:i(P,"hashId")});j(M,0)&&(this.requestHashIds[h].data[M]=P)}),y&&_(i(n,"hashId"),i(this.requestHashIds[h],"data.hashId"))&&c(this.requestHashIds[h],"data",n)})}return n}_pushRequestHash(s={},e={isLoading:!0,isError:!1,isNew:!0,data:null}){const t=this._generateHashId(s),r=!$(this.requestHashIds[t]),o=i(e,"isNew");return r&&o?c(this.requestHashIds[t],"isNew",!1):this.requestHashIds[t]=e,this.requestHashIds[t]}setHost(s){this.host=s,this._initializeAxiosConfig()}setNamespace(s){this.namespace=s}setHeadersCommon(s,e){I.defaults.headers.common[`${s}`]=e}setPayloadIncludeReference(s){this.payloadIncludedReference=s}setGlobal(){window&&(window.ARM=Object.freeze(this))}getCollection(s){return this.collections[s]||[]}clearCollection(s){this.collections[s]=[]}getAlias(s,e){return m(e)&&this._injectActions(e),this.aliases[s]||e}createRecord(s,e={}){return c(e,"id",z.v1()),this._injectReferenceKeys(s,e),this._injectActions(e),this.collections[s].push(e),O(this.collections[s],{hashId:i(e,"hashId")})}async _request({resourceMethod:s,resourceName:e,resourceId:t,resourceParams:r,resourcePayload:o,resourceFallback:d,resourceConfig:n}){var Q,W,X;const f={method:s,url:e},a=this._generateHashId({...arguments[0]}),h=i(n,"skip")||!1,q=_(s,"get"),p=_(s,"delete"),y=_(s,"post"),P=S(t),M=!B(r),v=!B(o),N=i(o,"data")||null;if(P&&c(f,"url",`${e}/${t}`),M&&c(f,"params",r),v){const l={data:w(N,as)};c(f,"data",l)}if(q&&!h){const l=this.requestHashIds[a],R=!$(l),F=i(l,"isNew");if(R&&!F)return}v&&c(N,"isLoading",!0);try{const l=await I(f),R=((Q=l==null?void 0:l.data)==null?void 0:Q.data)||d,F=((W=l==null?void 0:l.data)==null?void 0:W.included)||[],cs=((X=l==null?void 0:l.data)==null?void 0:X.meta)||{},hs=m(R),ds=g(R);let k=null;return ds&&u(R,A=>this._injectReferenceKeys(e,A)),hs&&this._injectReferenceKeys(e,R),u(F,A=>{this._injectReferenceKeys(i(A,this.payloadIncludedReference),A),this._pushPayloadToCollection(i(A,"collectionName"),A)}),k=await this._pushPayloadToCollection(e,R),n.alias&&this._addAlias(i(n,"alias"),k),y&&this.unloadRecord(N),p&&this.unloadRecord(k),this.requestHashIds[a]={isLoading:!1,isError:!1,isNew:!1,data:k,included:[],meta:cs},Promise.resolve(k)}catch(l){return v&&(c(N,"isError",!0),c(N,"isLoading",!1)),this.requestHashIds[a]={isLoading:!1,isError:!0,isNew:!1,data:l,included:[],meta:{}},Promise.reject(l)}}query(s,e={},t={}){const r={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:[],resourceConfig:t},o=V,d=this._pushRequestHash(r,o);return this._request(r),d}queryRecord(s,e={},t={}){const r={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:e,resourcePayload:null,resourceFallback:{},resourceConfig:t},o=G,d=this._pushRequestHash(r,o);return this._request(r),d}findAll(s,e={}){const t={resourceMethod:"get",resourceName:s,resourceId:null,resourceParams:null,resourcePayload:null,resourceFallback:[],resourceConfig:e},r=V,o=this._pushRequestHash(t,r);return this._request(t),o}findRecord(s,e,t={},r={}){const o={resourceMethod:"get",resourceName:s,resourceId:e,resourceParams:t,resourcePayload:null,resourceFallback:{},resourceConfig:r},d=G,n=this._pushRequestHash(o,d);return this._request(o),n}peekAll(s){return this.collections[s]}peekRecord(s,e){return O(this.collections[s],{id:e})}}return ns});
