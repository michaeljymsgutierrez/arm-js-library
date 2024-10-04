## Constants

<dl>
<dt><a href="#keysToBeOmittedOnDeepCheck">keysToBeOmittedOnDeepCheck</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>An array of keys to be omitted during a deep check operation.
These keys typically represent internal properties or methods that
should not be considered when comparing the current state of a record
with its original state.</p>
</dd>
<dt><a href="#keysToBeOmittedOnRequestPayload">keysToBeOmittedOnRequestPayload</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>An array of keys to be omitted when constructing a request payload.
These keys typically represent internal object properties or methods
that should not be included in the data sent to the server.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#unloadRecord">unloadRecord(currentRecord)</a></dt>
<dd><p>Unloads a record from the collection, request hashes, and aliases.</p>
<p>This method removes a <code>currentRecord</code> from all relevant data stores
within the <code>ApiResourceManager</code>:</p>
<ul>
<li>The main collection where the record belongs.</li>
<li>Any request hashes where the record might be present.</li>
<li>Any aliases that refer to the record.</li>
</ul>
</dd>
<dt><a href="#setHost">setHost(host)</a></dt>
<dd><p>Sets the host URL for the client and initializes the Axios configuration.</p>
<p>This method sets the <code>host</code> property of the <code>ApiResourceManager</code> instance
to the provided <code>host</code> URL. It then calls the <code>_initializeAxiosConfig</code>
method to update the Axios configuration with the new host, ensuring
that subsequent API requests use the correct base URL.</p>
</dd>
<dt><a href="#setNamespace">setNamespace(namespace)</a></dt>
<dd><p>Sets the namespace for the client.</p>
<p>This method sets the <code>namespace</code> property of the <code>ApiResourceManager</code>
instance to the provided <code>namespace</code>. The namespace is typically used
as a path prefix in the base URL for API requests, allowing you to
version your API or organize it into different sections. For example,
a namespace of &quot;api/v2&quot; would result in a base URL like
&quot;<a href="https://example.com/api/v2">https://example.com/api/v2</a>&quot;.</p>
</dd>
<dt><a href="#setHeadersCommon">setHeadersCommon(key, value)</a></dt>
<dd><p>Sets a common header for all Axios requests.</p>
<p>This method sets a common header that will be included in all
Axios requests made by the <code>ApiResourceManager</code>. The <code>key</code> parameter
specifies the header name, and the <code>value</code> parameter specifies the
header value.</p>
</dd>
<dt><a href="#setPayloadIncludeReference">setPayloadIncludeReference(key)</a></dt>
<dd><p>Sets the reference key used for included data in request payloads.</p>
<p>This method sets the <code>payloadIncludedReference</code> property of the
<code>ApiResourceManager</code> instance. This property determines the key used
to identify the type of included data in API request payloads.
For example, if the payload includes related resources, this key
might be used to specify the type of each included resource.</p>
</dd>
<dt><a href="#setGlobal">setGlobal()</a></dt>
<dd><p>Makes the instance accessible globally in a browser environment.</p>
<p>This method attaches the <code>ApiResourceManager</code> instance to the <code>window</code>
object in a browser environment, making it globally accessible as
<code>window.ARM</code>. The instance is frozen using <code>Object.freeze()</code> to prevent
accidental modifications.</p>
<p>Caution: This method should be used with care as it modifies the
global scope and could potentially lead to naming conflicts.</p>
</dd>
<dt><a href="#getCollection">getCollection(collectionName)</a> ⇒ <code>Array</code></dt>
<dd><p>Retrieves a collection by its name.</p>
<p>This method retrieves the collection with the specified <code>collectionName</code>
from the <code>collections</code> object of the <code>ApiResourceManager</code>. If the
collection does not exist, it returns an empty observable array.</p>
</dd>
<dt><a href="#clearCollection">clearCollection(collectionName)</a></dt>
<dd><p>Clears the contents of a specified collection.</p>
<p>This method removes all records from the collection with the given
<code>collectionName</code> in the <code>collections</code> object of the
<code>ApiResourceManager</code>.</p>
</dd>
<dt><a href="#getAlias">getAlias(aliasName, [fallbackRecords])</a> ⇒ <code>Array</code> | <code>Object</code></dt>
<dd><p>Retrieves an alias by its name, with optional fallback records.</p>
<p>This method retrieves the alias with the specified <code>aliasName</code> from
the <code>aliases</code> object of the <code>ApiResourceManager</code>. If the alias does
not exist, it returns the provided <code>fallbackRecords</code> (if any).</p>
<p>If <code>fallbackRecords</code> is a plain object, the method injects collection
actions into it using <code>_injectCollectionActions</code> before returning it.</p>
</dd>
<dt><a href="#createRecord">createRecord(collectionName, [collectionRecord], [collectionRecordRandomId])</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a new record in a specified collection.</p>
<p>This method creates a new record in the collection with the given
<code>collectionName</code>. The <code>collectionRecord</code> parameter can be used to
provide initial data for the record. If <code>collectionRecordRandomId</code>
is true (default), a unique ID is generated for the record using
<code>uuidv1()</code>. Otherwise, a NIL UUID is used.</p>
<p>The method injects necessary reference keys and actions into the
record using <code>_injectCollectionReferenceKeys</code> and
<code>_injectCollectionActions</code>.</p>
</dd>
<dt><a href="#query">query(resource, [params], [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Queries a resource with specified parameters and configuration.</p>
<p>This method sends a GET request to the specified <code>resource</code> with the
given <code>params</code> (query parameters) and <code>config</code> (request configuration).
It uses the <code>_request</code> method to handle the API request and the
<code>_resolveRequest</code> method to determine how to resolve the request
(either with cached data or the raw Axios Promise).</p>
</dd>
<dt><a href="#queryRecord">queryRecord(resource, [params], [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Queries a single record from a specified resource.</p>
<p>This method sends a GET request to the specified <code>resource</code> to
retrieve a single record. The <code>params</code> (query parameters) and
<code>config</code> (request configuration) can be used to customize the
request. It uses the <code>_request</code> method to handle the API request
and the <code>_resolveRequest</code> method to determine how to resolve the
request (either with cached data or the raw Axios Promise).</p>
</dd>
<dt><a href="#findAll">findAll(resource, [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Fetches a collection of records from a specified resource.</p>
<p>This method sends a GET request to the specified <code>resource</code> to
retrieve all records. The <code>config</code> (request configuration) can be
used to customize the request. It uses the <code>_request</code> method to
handle the API request and the <code>_resolveRequest</code> method to determine
how to resolve the request (either with cached data or the raw
Axios Promise).</p>
</dd>
<dt><a href="#findRecord">findRecord(resource, id, [params], [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Finds a specific record by ID from a given resource.</p>
<p>This method sends a GET request to the specified <code>resource</code> to
retrieve a single record with the given <code>id</code>. The <code>params</code>
(query parameters) and <code>config</code> (request configuration) can be used
to customize the request. It uses the <code>_request</code> method to handle
the API request and the <code>_resolveRequest</code> method to determine how
to resolve the request (either with cached data or the raw Axios
Promise).</p>
</dd>
<dt><a href="#peekAll">peekAll(collectionName)</a> ⇒ <code>Array</code> | <code>undefined</code></dt>
<dd><p>Peeks at all records in a specified collection without triggering
a request.</p>
<p>This method retrieves all records from the collection with the
specified <code>collectionName</code> from the <code>collections</code> object of the
<code>ApiResourceManager</code>. It does not make an API request to fetch
the data; it only returns the locally stored records.</p>
</dd>
<dt><a href="#peekRecord">peekRecord(collectionName, collectionRecordId)</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Peeks at a specific record in a collection without triggering a request.</p>
<p>This method retrieves a specific record from the collection with the
given <code>collectionName</code> and <code>collectionRecordId</code> from the <code>collections</code>
object of the <code>ApiResourceManager</code>. It does not make an API request;
it only returns the locally stored record if found.</p>
</dd>
<dt><a href="#ajax">ajax([config])</a> ⇒ <code>Promise</code></dt>
<dd><p>Makes an AJAX request using the axios library.</p>
</dd>
<dt><a href="#findBy">findBy(objects, [findProperties])</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Finds the first object in an array that matches the specified properties.</p>
</dd>
<dt><a href="#findIndexBy">findIndexBy(objects, [findIndexProperties])</a> ⇒ <code>number</code></dt>
<dd><p>Finds the index of the first object in an array that matches the
specified properties.</p>
</dd>
<dt><a href="#filterBy">filterBy(objects, [filterProperties])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Filters an array of objects based on the specified properties.</p>
</dd>
<dt><a href="#uniqBy">uniqBy(objects, uniqByProperty)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Creates a new array of unique objects based on a specified property.</p>
</dd>
<dt><a href="#groupBy">groupBy(objects, groupByProperty)</a> ⇒ <code>Object</code></dt>
<dd><p>Groups objects into arrays based on a specified property.</p>
</dd>
<dt><a href="#firstObject">firstObject([objects])</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Returns the first object in an array.</p>
</dd>
<dt><a href="#lastObject">lastObject([objects])</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Returns the last object in an array.</p>
</dd>
<dt><a href="#mergeObjects">mergeObjects([objects], [otherObjects])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Merges two arrays of objects into a single array, removing duplicates.</p>
</dd>
<dt><a href="#chunkObjects">chunkObjects([objects], [chunkSize])</a> ⇒ <code>Array.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Splits an array of objects into chunks of a specified size.</p>
</dd>
<dt><a href="#sortBy">sortBy(objects, sortProperties)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Sorts an array of objects based on specified properties and sort orders.</p>
</dd>
<dt><a href="#isEmpty">isEmpty(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is empty.</p>
</dd>
<dt><a href="#isPresent">isPresent(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is present (not empty).</p>
</dd>
<dt><a href="#isEqual">isEqual(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if two values are equal.</p>
</dd>
<dt><a href="#isNumber">isNumber(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is a number.</p>
</dd>
<dt><a href="#isNil">isNil(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is null or undefined.</p>
</dd>
<dt><a href="#isNull">isNull(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is null.</p>
</dd>
<dt><a href="#isGte">isGte(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is greater than or equal to another value.</p>
</dd>
<dt><a href="#isGt">isGt(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is greater than another value.</p>
</dd>
<dt><a href="#isLte">isLte(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is less than or equal to another value.</p>
</dd>
<dt><a href="#isLt">isLt(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if a value is less than another value.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#DefaultRequestArrayResponse">DefaultRequestArrayResponse</a> : <code>Object</code></dt>
<dd><p>Default response object for array-based requests.</p>
</dd>
<dt><a href="#DefaultRequestObjectResponse">DefaultRequestObjectResponse</a> : <code>Object</code></dt>
<dd><p>Default response object for object-based requests.</p>
</dd>
</dl>

<a name="keysToBeOmittedOnDeepCheck"></a>

## keysToBeOmittedOnDeepCheck : <code>Array.&lt;string&gt;</code>
An array of keys to be omitted during a deep check operation.
These keys typically represent internal properties or methods that
should not be considered when comparing the current state of a record
with its original state.

**Kind**: global constant  
<a name="keysToBeOmittedOnRequestPayload"></a>

## keysToBeOmittedOnRequestPayload : <code>Array.&lt;string&gt;</code>
An array of keys to be omitted when constructing a request payload.
These keys typically represent internal object properties or methods
that should not be included in the data sent to the server.

**Kind**: global constant  
<a name="unloadRecord"></a>

## unloadRecord(currentRecord)
Unloads a record from the collection, request hashes, and aliases.

This method removes a `currentRecord` from all relevant data stores
within the `ApiResourceManager`:
 - The main collection where the record belongs.
 - Any request hashes where the record might be present.
 - Any aliases that refer to the record.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| currentRecord | <code>Object</code> | The record to be unloaded. |

<a name="setHost"></a>

## setHost(host)
Sets the host URL for the client and initializes the Axios configuration.

This method sets the `host` property of the `ApiResourceManager` instance
to the provided `host` URL. It then calls the `_initializeAxiosConfig`
method to update the Axios configuration with the new host, ensuring
that subsequent API requests use the correct base URL.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | The base URL of the API server. |

<a name="setNamespace"></a>

## setNamespace(namespace)
Sets the namespace for the client.

This method sets the `namespace` property of the `ApiResourceManager`
instance to the provided `namespace`. The namespace is typically used
as a path prefix in the base URL for API requests, allowing you to
version your API or organize it into different sections. For example,
a namespace of "api/v2" would result in a base URL like
"https://example.com/api/v2".

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | The namespace for API requests. |

<a name="setHeadersCommon"></a>

## setHeadersCommon(key, value)
Sets a common header for all Axios requests.

This method sets a common header that will be included in all
Axios requests made by the `ApiResourceManager`. The `key` parameter
specifies the header name, and the `value` parameter specifies the
header value.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The header key (e.g., 'Authorization', 'Content-Type'). |
| value | <code>string</code> \| <code>number</code> \| <code>boolean</code> | The header value. |

<a name="setPayloadIncludeReference"></a>

## setPayloadIncludeReference(key)
Sets the reference key used for included data in request payloads.

This method sets the `payloadIncludedReference` property of the
`ApiResourceManager` instance. This property determines the key used
to identify the type of included data in API request payloads.
For example, if the payload includes related resources, this key
might be used to specify the type of each included resource.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The new reference key for included data. |

<a name="setGlobal"></a>

## setGlobal()
Makes the instance accessible globally in a browser environment.

This method attaches the `ApiResourceManager` instance to the `window`
object in a browser environment, making it globally accessible as
`window.ARM`. The instance is frozen using `Object.freeze()` to prevent
accidental modifications.

Caution: This method should be used with care as it modifies the
global scope and could potentially lead to naming conflicts.

**Kind**: global function  
<a name="getCollection"></a>

## getCollection(collectionName) ⇒ <code>Array</code>
Retrieves a collection by its name.

This method retrieves the collection with the specified `collectionName`
from the `collections` object of the `ApiResourceManager`. If the
collection does not exist, it returns an empty observable array.

**Kind**: global function  
**Returns**: <code>Array</code> - The collection data as an observable array.  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to retrieve. |

<a name="clearCollection"></a>

## clearCollection(collectionName)
Clears the contents of a specified collection.

This method removes all records from the collection with the given
`collectionName` in the `collections` object of the
`ApiResourceManager`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to clear. |

<a name="getAlias"></a>

## getAlias(aliasName, [fallbackRecords]) ⇒ <code>Array</code> \| <code>Object</code>
Retrieves an alias by its name, with optional fallback records.

This method retrieves the alias with the specified `aliasName` from
the `aliases` object of the `ApiResourceManager`. If the alias does
not exist, it returns the provided `fallbackRecords` (if any).

If `fallbackRecords` is a plain object, the method injects collection
actions into it using `_injectCollectionActions` before returning it.

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Object</code> - The alias data or the fallback records.  

| Param | Type | Description |
| --- | --- | --- |
| aliasName | <code>string</code> | The name of the alias to retrieve. |
| [fallbackRecords] | <code>Array</code> \| <code>Object</code> | Optional fallback records                                           to return if the alias                                           is not found. |

<a name="createRecord"></a>

## createRecord(collectionName, [collectionRecord], [collectionRecordRandomId]) ⇒ <code>Object</code>
Creates a new record in a specified collection.

This method creates a new record in the collection with the given
`collectionName`. The `collectionRecord` parameter can be used to
provide initial data for the record. If `collectionRecordRandomId`
is true (default), a unique ID is generated for the record using
`uuidv1()`. Otherwise, a NIL UUID is used.

The method injects necessary reference keys and actions into the
record using `_injectCollectionReferenceKeys` and
`_injectCollectionActions`.

**Kind**: global function  
**Returns**: <code>Object</code> - The created record.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| collectionName | <code>string</code> |  | The name of the collection to create                                 the record in. |
| [collectionRecord] | <code>Object</code> | <code>{}</code> | Optional initial data for the                                        record. |
| [collectionRecordRandomId] | <code>boolean</code> | <code>true</code> | Whether to generate                                                    a random ID. |

<a name="query"></a>

## query(resource, [params], [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Queries a resource with specified parameters and configuration.

This method sends a GET request to the specified `resource` with the
given `params` (query parameters) and `config` (request configuration).
It uses the `_request` method to handle the API request and the
`_resolveRequest` method to determine how to resolve the request
(either with cached data or the raw Axios Promise).

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - The resolved value based on the `autoResolve`
                         configuration in `config`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The name of the API resource to query. |
| [params] | <code>Object</code> | <code>{}</code> | Optional query parameters for the request. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration for the request. |

<a name="queryRecord"></a>

## queryRecord(resource, [params], [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Queries a single record from a specified resource.

This method sends a GET request to the specified `resource` to
retrieve a single record. The `params` (query parameters) and
`config` (request configuration) can be used to customize the
request. It uses the `_request` method to handle the API request
and the `_resolveRequest` method to determine how to resolve the
request (either with cached data or the raw Axios Promise).

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - The resolved value based on the `autoResolve`
                         configuration in `config`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The name of the API resource to query. |
| [params] | <code>Object</code> | <code>{}</code> | Optional query parameters for the request. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration for the request. |

<a name="findAll"></a>

## findAll(resource, [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Fetches a collection of records from a specified resource.

This method sends a GET request to the specified `resource` to
retrieve all records. The `config` (request configuration) can be
used to customize the request. It uses the `_request` method to
handle the API request and the `_resolveRequest` method to determine
how to resolve the request (either with cached data or the raw
Axios Promise).

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - The resolved value based on the `autoResolve`
                         configuration in `config`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The name of the API resource to query. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration for the request. |

<a name="findRecord"></a>

## findRecord(resource, id, [params], [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Finds a specific record by ID from a given resource.

This method sends a GET request to the specified `resource` to
retrieve a single record with the given `id`. The `params`
(query parameters) and `config` (request configuration) can be used
to customize the request. It uses the `_request` method to handle
the API request and the `_resolveRequest` method to determine how
to resolve the request (either with cached data or the raw Axios
Promise).

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - The resolved value based on the `autoResolve`
                         configuration in `config`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The name of the API resource to query. |
| id | <code>number</code> \| <code>string</code> |  | The ID of the record to find. |
| [params] | <code>Object</code> | <code>{}</code> | Optional query parameters for the request. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration for the request. |

<a name="peekAll"></a>

## peekAll(collectionName) ⇒ <code>Array</code> \| <code>undefined</code>
Peeks at all records in a specified collection without triggering
a request.

This method retrieves all records from the collection with the
specified `collectionName` from the `collections` object of the
`ApiResourceManager`. It does not make an API request to fetch
the data; it only returns the locally stored records.

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>undefined</code> - The collection records, or undefined if
                          the collection is not found.  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to peek at. |

<a name="peekRecord"></a>

## peekRecord(collectionName, collectionRecordId) ⇒ <code>Object</code> \| <code>undefined</code>
Peeks at a specific record in a collection without triggering a request.

This method retrieves a specific record from the collection with the
given `collectionName` and `collectionRecordId` from the `collections`
object of the `ApiResourceManager`. It does not make an API request;
it only returns the locally stored record if found.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The found record, or undefined if not found
                            in the local collection.  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection. |
| collectionRecordId | <code>number</code> \| <code>string</code> | The ID of the record to find. |

<a name="ajax"></a>

## ajax([config]) ⇒ <code>Promise</code>
Makes an AJAX request using the axios library.

**Kind**: global function  
**Returns**: <code>Promise</code> - A Promise that resolves with the Axios response or
                   rejects with an error.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | Configuration object for the axios request. |

<a name="findBy"></a>

## findBy(objects, [findProperties]) ⇒ <code>Object</code> \| <code>undefined</code>
Finds the first object in an array that matches the specified properties.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The found object, or undefined if not found.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> |  | The array of objects to search. |
| [findProperties] | <code>Object</code> | <code>{}</code> | The properties to match. |

<a name="findIndexBy"></a>

## findIndexBy(objects, [findIndexProperties]) ⇒ <code>number</code>
Finds the index of the first object in an array that matches the
specified properties.

**Kind**: global function  
**Returns**: <code>number</code> - The index of the found object, or -1 if not found.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> |  | The array of objects to search. |
| [findIndexProperties] | <code>Object</code> | <code>{}</code> | The properties to match. |

<a name="filterBy"></a>

## filterBy(objects, [filterProperties]) ⇒ <code>Array.&lt;Object&gt;</code>
Filters an array of objects based on the specified properties.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - The filtered array of objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> |  | The array of objects to filter. |
| [filterProperties] | <code>Object</code> | <code>{}</code> | The filter criteria. |

<a name="uniqBy"></a>

## uniqBy(objects, uniqByProperty) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a new array of unique objects based on a specified property.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - The array of unique objects.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array of objects to process. |
| uniqByProperty | <code>string</code> | The property to use for uniqueness                                 comparison. |

<a name="groupBy"></a>

## groupBy(objects, groupByProperty) ⇒ <code>Object</code>
Groups objects into arrays based on a specified property.

**Kind**: global function  
**Returns**: <code>Object</code> - An object where keys are group values and values
                  are arrays of objects.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array of objects to group. |
| groupByProperty | <code>string</code> | The property to group by. |

<a name="firstObject"></a>

## firstObject([objects]) ⇒ <code>Object</code> \| <code>undefined</code>
Returns the first object in an array.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The first object, or undefined if the
                            array is empty.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The array of objects. |

<a name="lastObject"></a>

## lastObject([objects]) ⇒ <code>Object</code> \| <code>undefined</code>
Returns the last object in an array.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The last object, or undefined if the
                            array is empty.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The array of objects. |

<a name="mergeObjects"></a>

## mergeObjects([objects], [otherObjects]) ⇒ <code>Array.&lt;Object&gt;</code>
Merges two arrays of objects into a single array, removing duplicates.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - The merged array of objects without duplicates.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The first array of objects. |
| [otherObjects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The second array of objects. |

<a name="chunkObjects"></a>

## chunkObjects([objects], [chunkSize]) ⇒ <code>Array.&lt;Array.&lt;Object&gt;&gt;</code>
Splits an array of objects into chunks of a specified size.

**Kind**: global function  
**Returns**: <code>Array.&lt;Array.&lt;Object&gt;&gt;</code> - An array of chunks.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The array of objects to chunk. |
| [chunkSize] | <code>number</code> | <code>1</code> | The size of each chunk. |

<a name="sortBy"></a>

## sortBy(objects, sortProperties) ⇒ <code>Array.&lt;Object&gt;</code>
Sorts an array of objects based on specified properties and sort orders.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - The sorted array of objects.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array of objects to sort. |
| sortProperties | <code>Array.&lt;string&gt;</code> | An array of sort properties in                                       the format of 'property:order'. |

<a name="isEmpty"></a>

## isEmpty(value) ⇒ <code>boolean</code>
Checks if a value is empty.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the value is empty, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="isPresent"></a>

## isPresent(value) ⇒ <code>boolean</code>
Checks if a value is present (not empty).

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the value is present, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="isEqual"></a>

## isEqual(value, other) ⇒ <code>boolean</code>
Checks if two values are equal.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the values are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The first value. |
| other | <code>\*</code> | The second value. |

<a name="isNumber"></a>

## isNumber(value) ⇒ <code>boolean</code>
Checks if a value is a number.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the value is a number, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="isNil"></a>

## isNil(value) ⇒ <code>boolean</code>
Checks if a value is null or undefined.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the value is null or undefined, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="isNull"></a>

## isNull(value) ⇒ <code>boolean</code>
Checks if a value is null.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the value is null, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="isGte"></a>

## isGte(value, other) ⇒ <code>boolean</code>
Checks if a value is greater than or equal to another value.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the first value is greater than or equal
                  to the second value, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The first value. |
| other | <code>number</code> | The second value. |

<a name="isGt"></a>

## isGt(value, other) ⇒ <code>boolean</code>
Checks if a value is greater than another value.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the first value is greater than the second
                  value, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The first value. |
| other | <code>number</code> | The second value. |

<a name="isLte"></a>

## isLte(value, other) ⇒ <code>boolean</code>
Checks if a value is less than or equal to another value.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the first value is less than or equal to
                  the second value, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The first value. |
| other | <code>number</code> | The second value. |

<a name="isLt"></a>

## isLt(value, other) ⇒ <code>boolean</code>
Checks if a value is less than another value.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the first value is less than the second
                  value, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The first value. |
| other | <code>number</code> | The second value. |

<a name="DefaultRequestArrayResponse"></a>

## DefaultRequestArrayResponse : <code>Object</code>
Default response object for array-based requests.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isLoading | <code>boolean</code> | Indicates if the request is loading. |
| isError | <code>boolean</code> | Indicates if an error occurred during the request. |
| isNew | <code>boolean</code> | Indicates if the response is new. |
| data | <code>Array</code> | The main data array returned by the request. |
| included | <code>Array</code> | Additional included data related to the response. |
| meta | <code>Object</code> | Metadata about the response. |
| error | <code>Object</code> | Error information, if any (null if no error). |

<a name="DefaultRequestObjectResponse"></a>

## DefaultRequestObjectResponse : <code>Object</code>
Default response object for object-based requests.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isLoading | <code>boolean</code> | Indicates if the request is loading. |
| isError | <code>boolean</code> | Indicates if an error occurred during the request. |
| isNew | <code>boolean</code> | Indicates if the response is new. |
| data | <code>Object</code> | The main data object returned by the request. |
| included | <code>Array</code> | Additional included data related to the response. |
| meta | <code>Object</code> | Metadata about the response. |
| error | <code>Object</code> | Error information, if any (null if no error). |

