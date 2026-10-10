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
<dt><a href="#_initializeAxiosConfig">_initializeAxiosConfig()</a> ℗</dt>
<dd><p>Initializes the Axios configuration with the base URL.</p>
<p>Sets the <code>baseURL</code> property in the Axios defaults to the value
returned by the <code>_getBaseURL()</code> method. This ensures that all
Axios requests use the correct base URL for the API.</p>
</dd>
<dt><a href="#_initializeCollections">_initializeCollections(collections)</a> ℗</dt>
<dd><p>Initializes a collection of collections with optional default values.</p>
<p>Iterates through the provided array of <code>collections</code> and calls the
<code>_addCollection</code> method for each collection name, initializing it
with an empty array (<code>[]</code>) as the default value.</p>
</dd>
<dt><a href="#_getBaseURL">_getBaseURL()</a> ⇒ <code>string</code> ℗</dt>
<dd><p>Gets the base URL for API requests.</p>
<p>Constructs the base URL by combining the <code>host</code> and <code>namespace</code>
properties of the instance.</p>
</dd>
<dt><a href="#_isCollectionExisting">_isCollectionExisting(collectionName)</a> ℗</dt>
<dd><p>Checks if a collection exists in the current instance.</p>
<p>This method verifies if a collection with the given <code>collectionName</code>
exists in the <code>collections</code> object of the <code>ApiResourceManager</code> instance.</p>
</dd>
<dt><a href="#_addCollection">_addCollection(collectionName, collectionRecords)</a> ℗</dt>
<dd><p>Adds a collection to the current instance.</p>
<p>This method adds a new collection with the specified <code>collectionName</code>
to the <code>collections</code> object of the <code>ApiResourceManager</code>. The
<code>collectionRecords</code> array is used to initialize the collection&#39;s data.</p>
</dd>
<dt><a href="#_addAlias">_addAlias(aliasName, aliasRecords)</a> ℗</dt>
<dd><p>Adds an alias to the aliases object.</p>
<p>This method creates an alias for a collection or a single record.
The <code>aliasName</code> specifies the name of the alias, and <code>aliasRecords</code>
can be either an array of records (for a collection alias) or a
single record object.</p>
<p>If <code>aliasRecords</code> is an array, it&#39;s used directly (or an empty array
if <code>aliasRecords</code> is falsy). If it&#39;s a plain object, it&#39;s used directly
(or an empty object if <code>aliasRecords</code> is falsy).</p>
</dd>
<dt><a href="#_addRequestAlias">_addRequestAlias(aliasName, requestHashKey)</a> ℗</dt>
<dd><p>Adds a request alias to the request aliases object.</p>
<p>This method maps a specific <code>aliasName</code> to a <code>requestHashKey</code> in the
<code>requestAliases</code> dictionary. This allows the system to reference a
specific request context using a human-readable alias.</p>
</dd>
<dt><a href="#_generateHashId">_generateHashId([object])</a> ⇒ <code>string</code> ℗</dt>
<dd><p>Generates a hash ID based on the provided object.</p>
<p>This method generates a unique hash ID by stringifying the given
<code>object</code> and then calculating its MD5 hash using the <code>md5</code> library.
If no <code>object</code> is provided, it defaults to an object with an
<code>id</code> property generated using <code>uuidv1()</code>.</p>
</dd>
<dt><a href="#_setProperties">_setProperties(targetObject, keyValuePairs)</a> ℗</dt>
<dd><p>Sets multiple properties on a target object recursively.</p>
<p>This method iterates through the <code>keyValuePairs</code> object and sets the
corresponding properties on the <code>targetObject</code>. It handles nested
objects by recursively calling itself with an updated <code>prefix</code>.</p>
</dd>
<dt><a href="#_getRecordProperty">_getRecordProperty(key)</a> ⇒ <code>*</code> ℗</dt>
<dd><p>Gets a property from the current record.</p>
<p>This method retrieves the value of a property with the given <code>key</code>
from the current record object (<code>this</code>). It uses Lodash&#39;s <code>get</code>
function (aliased as <code>getProperty</code>) to access the property.</p>
</dd>
<dt><a href="#_setRecordProperty">_setRecordProperty(key, value)</a> ℗</dt>
<dd><p>Sets a single property on the current record and updates its state
based on changes.</p>
<p>This method sets the property with the given <code>key</code> to the specified
<code>value</code> on the current record object (<code>this</code>). It then checks if the
record has been modified by comparing it with the <code>originalRecord</code>.
If changes are detected, it updates the <code>isDirty</code> and <code>isPristine</code>
flags accordingly.</p>
</dd>
<dt><a href="#_setRecordProperties">_setRecordProperties(values)</a> ℗</dt>
<dd><p>Sets multiple properties on the current record and updates its state
based on changes.</p>
<p>This method sets multiple properties on the current record object
(<code>this</code>) using the provided <code>values</code> object. It then compares the
updated record with the <code>originalRecord</code> to detect any modifications.
If the record has been changed, it updates the <code>isDirty</code> and
<code>isPristine</code> flags.</p>
</dd>
<dt><a href="#_sortRecordsBy">_sortRecordsBy(currentRecords, [sortProperties])</a> ⇒ <code>Array</code> ℗</dt>
<dd><p>Sorts an array of records based on specified properties and sort orders.</p>
<p>This method sorts the <code>currentRecords</code> array using the provided
<code>sortProperties</code>. Each <code>sortProperty</code> should be a string in the
format &quot;property:order&quot;, where &quot;property&quot; is the name of the property
to sort by and &quot;order&quot; is either &quot;asc&quot; (ascending) or &quot;desc&quot;
(descending).</p>
</dd>
<dt><a href="#_unloadFromCollection">_unloadFromCollection(collectionRecord)</a> ℗</dt>
<dd><p>Removes a record from a specified collection based on its hash ID.</p>
<p>This method removes a <code>collectionRecord</code> from its corresponding
collection in the <code>collections</code> object. It determines the collection
using the record&#39;s <code>collectionName</code> property and finds the record&#39;s
index within the collection using its <code>hashId</code>. If the record is
found, it&#39;s removed from the collection using Lodash&#39;s <code>pullAt</code>.</p>
</dd>
<dt><a href="#_unloadFromRequestHashes">_unloadFromRequestHashes(collectionRecord)</a> ℗</dt>
<dd><p>Removes a record from all request hashes based on its hash ID.</p>
<p>This method iterates through all request hashes in the <code>requestHashes</code>
object and removes any occurrences of the <code>collectionRecord</code> based on
its <code>hashId</code>. It handles both array-based and object-based request
hash data.</p>
</dd>
<dt><a href="#_unloadFromAliases">_unloadFromAliases(collectionRecord)</a> ℗</dt>
<dd><p>Removes a record from all aliases based on its hash ID.</p>
<p>This method iterates through all aliases in the <code>aliases</code> object
and removes any occurrences of the <code>collectionRecord</code> based on its
<code>hashId</code>. It handles both array-based and object-based alias data.</p>
</dd>
<dt><a href="#unloadRecord">unloadRecord(currentRecord)</a></dt>
<dd><p>Removes a record from all local data stores: its collection, any aliases, and any
request hashes that reference it.</p>
<p>This is called automatically after a successful <code>destroyRecord</code>. You can also call
it manually to remove a record from local state without hitting the server.</p>
</dd>
<dt><a href="#_saveRecord">_saveRecord(currentRecord, [collectionConfig])</a> ⇒ <code><a href="#CollectionRecord">Promise.&lt;CollectionRecord&gt;</a></code> ℗</dt>
<dd><p>Saves a record to the server.</p>
<p>Determines the HTTP method based on the record&#39;s <code>id</code>:</p>
<ul>
<li><strong>POST</strong> when <code>id</code> is a UUID (i.e. a record created locally via <code>createRecord</code> that
has never been persisted). After a successful POST, the temporary local record is
unloaded and replaced with the server response.</li>
<li><strong>PUT</strong> when <code>id</code> is any non-UUID value (numeric or string) - meaning the record
already exists on the server.</li>
</ul>
</dd>
<dt><a href="#_deleteRecord">_deleteRecord(currentRecord, [collectionConfig])</a> ⇒ <code><a href="#CollectionRecord">Promise.&lt;CollectionRecord&gt;</a></code> ℗</dt>
<dd><p>Deletes a record from the server.</p>
<p>Sends a DELETE request using the record&#39;s <code>collectionName</code> and <code>id</code>. On success,
the record is automatically unloaded from the local collection, aliases, and
request hashes.</p>
</dd>
<dt><a href="#_reloadRecord">_reloadRecord(currentRecord, [collectionConfig])</a> ⇒ <code><a href="#CollectionRecord">Promise.&lt;CollectionRecord&gt;</a></code> ℗</dt>
<dd><p>Reloads a record from the server.</p>
<p>Sends a GET request using the record&#39;s <code>collectionName</code> and <code>id</code>, then merges the
server response back into the local record. A unique <code>skipId</code> is added automatically
so the cache is always bypassed and the latest data is fetched.</p>
</dd>
<dt><a href="#_rollbackRecordAttributes">_rollbackRecordAttributes()</a> ⇒ <code>void</code> ℗</dt>
<dd><p>Reverts the record&#39;s attributes to their original state.</p>
<p>This method retrieves the stored <code>originalRecord</code> (excluding internal
ARM properties), applies those values back to the current record instance,
and resets the <code>isDirty</code> and <code>isPristine</code> state flags.</p>
</dd>
<dt><a href="#_getCollectionRecord">_getCollectionRecord(collectionName, [collectionConfig], currentRecord)</a> ⇒ <code>Object</code> | <code>Array</code> ℗</dt>
<dd><p>Retrieves records from a specified collection based on given criteria.</p>
<p>This method retrieves records from the collection with the specified
<code>collectionName</code>, potentially fetching them asynchronously if needed.
It uses the <code>collectionConfig</code> to determine how to filter, sort,
and retrieve the records.</p>
<p>The <code>currentRecord</code> is used to extract related records based on the
<code>referenceKey</code> provided in the <code>collectionConfig</code>. If the related
records are not already in the local collection and <code>async</code> is true
in the <code>collectionConfig</code>, it initiates an asynchronous request to
fetch them.</p>
</dd>
<dt><a href="#_injectCollectionActions">_injectCollectionActions(collectionRecord)</a> ℗</dt>
<dd><p>Injects action methods into a collection record.</p>
<p>Decorates <code>collectionRecord</code> with the full record-level API defined in <a href="#CollectionRecord">CollectionRecord</a>:</p>
<ul>
<li><code>get(key)</code> / <code>set(key, value)</code> / <code>setProperties(values)</code> - reactive property access</li>
<li><code>rollbackAttributes()</code> - revert unsaved changes</li>
<li><code>save(config)</code> - POST (new) or PUT (existing)</li>
<li><code>reload(config)</code> - re-fetch from server</li>
<li><code>destroyRecord(config)</code> - DELETE and unload</li>
<li><code>getCollection(collectionName, config)</code> - resolve related records from a local collection</li>
<li><code>getARMContext()</code> - returns the ARM instance that owns this record</li>
</ul>
</dd>
<dt><a href="#_injectRequestHashActions">_injectRequestHashActions(requestObject, responseObject, requestHashKey)</a> ℗</dt>
<dd><p>Decorates the response object with actionable methods.</p>
<ul>
<li>Attaches a <code>reload</code> method to the <code>responseObject</code> that, when invoked,
triggers a re-fetch of the original request using the stored hash key.</li>
</ul>
</dd>
<dt><a href="#_injectCollectionReferenceKeys">_injectCollectionReferenceKeys(collectionName, collectionRecord, [collectionRecordHashId])</a> ℗</dt>
<dd><p>Injects reference keys into a collection record.</p>
<p>This method adds essential reference keys to a <code>collectionRecord</code>,
including:</p>
<ul>
<li><code>collectionName</code>: The name of the collection the record belongs to.</li>
<li><code>hashId</code>: A unique hash ID generated for the record.</li>
<li><code>isLoading</code>, <code>isError</code>, <code>isPristine</code>, <code>isDirty</code>: Flags to track
 the record&#39;s state.</li>
<li><code>originalRecord</code>: A copy of the original record data for change
 tracking.</li>
</ul>
</dd>
<dt><a href="#_pushToCollection">_pushToCollection(collectionName, collectionRecords)</a> ⇒ <code>Array</code> | <code>Object</code> ℗</dt>
<dd><p>Pushes records to a specified collection.</p>
<p>This method adds or updates records in the collection with the given
<code>collectionName</code>. The <code>collectionRecords</code> can be either an array of
records or a single record object.</p>
<p>If <code>collectionRecords</code> is an array, it iterates through the records
and adds them to the collection if they don&#39;t already exist. If a
record with the same <code>hashId</code> already exists, it updates the existing
record with the new data.</p>
<p>If <code>collectionRecords</code> is a single object, it adds it to the collection
if it doesn&#39;t exist or updates the existing record if it has the same
<code>hashId</code>.</p>
</dd>
<dt><a href="#_pushToAliases">_pushToAliases(collectionRecords)</a> ℗</dt>
<dd><p>Pushes records to specified aliases.</p>
<p>This method updates aliases in the <code>aliases</code> object with the provided
<code>collectionRecords</code>. It handles both array-based and object-based
aliases.</p>
<p>If an alias refers to an array of records, the method iterates through
the <code>collectionRecords</code> and updates any matching records within the
alias array based on their <code>hashId</code>.</p>
<p>If an alias refers to a single record object, the method updates the
alias with the matching <code>collectionRecord</code> based on its <code>hashId</code>.</p>
</dd>
<dt><a href="#_pushToRequestHashes">_pushToRequestHashes(collectionRecords)</a> ℗</dt>
<dd><p>Pushes records to specified request hashes.</p>
<p>This method updates request hashes in the <code>requestHashes</code> object with
the provided <code>collectionRecords</code>. It handles both array-based and
object-based request hash data.</p>
<p>If a request hash&#39;s <code>data</code> property is an array, the method iterates
through the <code>collectionRecords</code> and updates any matching records
within the <code>data</code> array based on their <code>hashId</code>.</p>
<p>If a request hash&#39;s <code>data</code> property is a single record object, the
method updates the <code>data</code> with the matching <code>collectionRecord</code> based
on its <code>hashId</code>.</p>
</dd>
<dt><a href="#_pushPayload">_pushPayload(collectionName, collectionRecords)</a> ⇒ <code>Array</code> | <code>Object</code> ℗</dt>
<dd><p>Pushes records to a collection, aliases, and request hashes.</p>
<p>This method orchestrates the process of adding or updating records
in various data stores within the <code>ApiResourceManager</code>. It takes a
<code>collectionName</code> and <code>collectionRecords</code> (which can be an array or
a single object) and performs the following actions:</p>
<ol>
<li>Checks if the specified collection exists.</li>
<li>Pushes the records to the collection using <code>_pushToCollection</code>.</li>
<li>Updates any relevant aliases using <code>_pushToAliases</code>.</li>
<li>Updates any relevant request hashes using <code>_pushToRequestHashes</code>.</li>
</ol>
</dd>
<dt><a href="#pushPayload">pushPayload(collectionName, collectionRecords)</a></dt>
<dd><p>Injects ARM reference keys into raw record objects and pushes them into the named collection.</p>
<p>Unlike the internal <code>_pushPayload</code>, this public method first stamps each record with ARM&#39;s
internal metadata (<code>hashId</code>, <code>collectionName</code>, <code>isLoading</code>, <code>isError</code>, <code>isPristine</code>,
<code>isDirty</code>, <code>originalRecord</code>) before pushing. Use this to load records into a collection
from sources other than an API request (e.g. server-side props, local fixtures).</p>
</dd>
<dt><a href="#_pushRequestHash">_pushRequestHash(requestObject, responseObject)</a> ⇒ <code>Object</code> ℗</dt>
<dd><p>Caches a request/response pair in the internal hash store.</p>
<ul>
<li>Generates a unique key based on the request and performs one of two actions:</li>
</ul>
<ol>
<li>If the key exists and the new response is marked <code>isNew</code>, it toggles the
existing entry&#39;s <code>isNew</code> flag to <code>false</code>.</li>
<li>Otherwise, it stores the new response object under that key.</li>
</ol>
<ul>
<li>Also injects contextual actions (e.g., reload) into the response object.</li>
</ul>
</dd>
<dt><a href="#setHost">setHost(host)</a></dt>
<dd><p>Sets the API base host URL and updates the Axios <code>baseURL</code> immediately.</p>
</dd>
<dt><a href="#setNamespace">setNamespace(namespace)</a></dt>
<dd><p>Sets the API namespace used as the path prefix in every request URL.</p>
<p>Combined with <code>host</code>, this forms the Axios <code>baseURL</code>: <code>{host}/{namespace}</code>.
Defaults to <code>&#39;api/v1&#39;</code>.</p>
</dd>
<dt><a href="#setHeadersCommon">setHeadersCommon(key, value)</a></dt>
<dd><p>Sets a header that is sent on every Axios request made by ARM.</p>
</dd>
<dt><a href="#setPayloadIncludeReference">setPayloadIncludeReference(key)</a></dt>
<dd><p>Sets the key ARM reads from each <code>included</code> item to determine which collection it belongs to.</p>
<p>Defaults to <code>&#39;type&#39;</code>, matching the JSON:API convention where <code>included[].type</code> names
the resource type. Override this if your API uses a different field name.</p>
</dd>
<dt><a href="#setGlobal">setGlobal()</a></dt>
<dd><p>Attaches this ARM instance to <code>window.ARM</code> in browser environments.</p>
<p>The instance is frozen with <code>Object.freeze()</code> to prevent accidental mutation.
This is a convenience for debugging and for accessing ARM from outside a React
component tree. No-op in non-browser (SSR) environments.</p>
</dd>
<dt><a href="#getCollection">getCollection(collectionName)</a> ⇒ <code><a href="#CollectionRecord">Array.&lt;CollectionRecord&gt;</a></code></dt>
<dd><p>Returns all records in a collection as a MobX observable array.</p>
<p>Returns an empty observable array if the collection has no records yet.
Unlike <code>peekAll</code>, this always returns an observable so components can
react to future changes.</p>
</dd>
<dt><a href="#_unloadCollection">_unloadCollection(collectionName)</a> ℗</dt>
<dd><p>Unloads a collection by resetting it to an empty array.</p>
<p>This method removes all records from the specified collection in the
<code>collections</code> object of the <code>ApiResourceManager</code>.</p>
</dd>
<dt><a href="#clearCollection">clearCollection(collectionName)</a></dt>
<dd><p>Removes all records from a collection and cleans up any references to those
records in aliases and request hashes.</p>
</dd>
<dt><a href="#getAlias">getAlias(aliasName, [fallbackRecords])</a> ⇒ <code><a href="#CollectionRecord">CollectionRecord</a></code> | <code><a href="#CollectionRecord">Array.&lt;CollectionRecord&gt;</a></code></dt>
<dd><p>Returns the records stored under an alias, or <code>fallbackRecords</code> if the alias is not yet set.</p>
<p>Aliases are populated when a request is made with <code>{ alias: &#39;myAlias&#39; }</code> in the config.
If <code>fallbackRecords</code> is a plain object, ARM injects the record-level action methods into
it so it can be used as a placeholder record before the real data arrives.</p>
</dd>
<dt><a href="#getRequestAlias">getRequestAlias(aliasName)</a> ⇒ <code>Object</code> | <code>null</code></dt>
<dd><p>Returns the request hash object for a named alias.</p>
<p>The request hash contains the full request state (<code>isLoading</code>, <code>isError</code>, <code>data</code>,
<code>error</code>, <code>included</code>, <code>meta</code>, and a <code>reload()</code> method) for the most recent request
that used the given <code>alias</code>. Returns <code>null</code> if no request has used that alias yet.</p>
</dd>
<dt><a href="#createRecord">createRecord(collectionName, [collectionRecord], [collectionRecordRandomId])</a> ⇒ <code><a href="#CollectionRecord">CollectionRecord</a></code></dt>
<dd><p>Creates a new local record in the named collection without making a network request.</p>
<p>The record is pushed into the collection immediately as an observable object with
the full ARM record API injected (<code>get</code>, <code>set</code>, <code>save</code>, <code>reload</code>, etc.).</p>
<p>By default, ARM assigns a UUID v1 as the record&#39;s <code>id</code>. This UUID signals to
<code>record.save()</code> that the record is new and should be sent as a POST request.
Pass <code>collectionRecordRandomId = false</code> to assign the nil UUID instead (useful
when you need a known placeholder ID).</p>
</dd>
<dt><a href="#_reloadRequest">_reloadRequest(requestObject, requestHashKey)</a> ⇒ <code>Promise.&lt;void&gt;</code> ℗</dt>
<dd><p>Reloads a request by updating its skip ID and re-executing the request.</p>
<p>This method modifies the <code>requestObject</code> by generating a new skip ID
using <code>uuidv1()</code> and setting <code>autoResolve</code> to <code>false</code> and <code>autoResolveOrigin</code>
to <code>&#39;_internal&#39;</code>. It then re-executes the request using the <code>_request</code>
method. During the reload process, it sets the <code>isLoading</code> flag of the
corresponding request hash to <code>true</code> and resets it to <code>false</code> after
the request is completed.</p>
</dd>
<dt><a href="#_resolveRequest">_resolveRequest(config, requestXHR, requestHashObject)</a> ⇒ <code>Promise</code> | <code>Object</code> ℗</dt>
<dd><p>Resolves the request based on configuration.</p>
<p>This method determines how to resolve an API request based on the
<code>autoResolve</code> option in the <code>config</code> object.</p>
<p>If <code>autoResolve</code> is true (which is the default if not explicitly
provided), the method returns the <code>requestHashObject</code>, which likely
contains the cached response data.</p>
<p>If <code>autoResolve</code> is false, the method returns the <code>requestXHR</code> object,
which represents the actual Axios request Promise. This allows for
more control over handling the response, such as accessing the raw
response data or handling specific HTTP status codes.</p>
</dd>
<dt><a href="#_request">_request(requestConfig)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Makes an API request based on the provided configuration.</p>
<p>This method handles various HTTP methods (GET, POST, PUT, DELETE), resource URLs,
query parameters, payloads, and error handling. It also manages aliases,
request caching, and asynchronous loading of related resources.</p>
</dd>
<dt><a href="#_processRequestPayload">_processRequestPayload(resourceIgnorePayload, resourcePayloadRecord, requestOptions)</a></dt>
<dd><p>Processes the payload for a request, omitting specified keys and setting it in the request options.</p>
</dd>
<dt><a href="#_processRequestURL">_processRequestURL(requestOptions, resourceName, resourceId)</a></dt>
<dd><p>Processes the URL for a request, constructing it from the resource name and ID.</p>
</dd>
<dt><a href="#_processRequestAlias">_processRequestAlias(requestObject, collectionRecords)</a> ℗</dt>
<dd><p>Processes an alias for a request, mapping both the records and the request hash.</p>
<p>This method extracts the alias name from the request configuration and:</p>
<ol>
<li>Maps the alias name to the provided collection records in the aliases store.</li>
<li>Maps the alias name to the generated request hash key in the request aliases store.</li>
</ol>
</dd>
<dt><a href="#_processRequestOverride">_processRequestOverride(resourceConfig, requestOptions)</a></dt>
<dd><p>Processes request overrides based on the provided configuration.</p>
<p>This method modifies the <code>requestOptions</code> object to incorporate any overrides
specified in the <code>resourceConfig</code>.</p>
</dd>
<dt><a href="#query">query(resource, [params], [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Fetches multiple records from the server (<code>GET /{resource}</code>).</p>
<p>By default returns a reactive request hash object immediately (before the request
resolves) so it can be bound directly in a component. Set <code>config.autoResolve: false</code>
to receive a Promise instead.</p>
</dd>
<dt><a href="#queryRecord">queryRecord(resource, [params], [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Fetches a single record from the server without an ID (<code>GET /{resource}</code>).</p>
<p>Unlike <code>findRecord</code>, no ID is appended to the URL - the server is expected to
return a single object (e.g. the current user&#39;s profile, a singleton resource).</p>
</dd>
<dt><a href="#findAll">findAll(resource, [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Fetches all records from the server without query parameters (<code>GET /{resource}</code>).</p>
<p>Equivalent to <code>query(resource, {}, config)</code> but signals intent more clearly when
no filtering is needed.</p>
</dd>
<dt><a href="#findRecord">findRecord(resource, id, [params], [config])</a> ⇒ <code>Object</code> | <code>Promise</code></dt>
<dd><p>Fetches a single record by ID from the server (<code>GET /{resource}/{id}</code>).</p>
<p>Accepts both numeric and string IDs (string ID support added in v2.9.0).</p>
</dd>
<dt><a href="#peekAll">peekAll(collectionName)</a> ⇒ <code><a href="#CollectionRecord">Array.&lt;CollectionRecord&gt;</a></code> | <code>undefined</code></dt>
<dd><p>Returns all locally cached records in a collection without making a network request.</p>
</dd>
<dt><a href="#peekRecord">peekRecord(collectionName, collectionRecordId)</a> ⇒ <code><a href="#CollectionRecord">CollectionRecord</a></code> | <code>undefined</code></dt>
<dd><p>Returns a single locally cached record by ID without making a network request.</p>
<p>Accepts both numeric and string IDs (string ID support added in v2.9.0).</p>
</dd>
<dt><a href="#_setRootScope">_setRootScope(rootScopeProperty, rootScopeValue)</a> ℗</dt>
<dd></dd>
<dt><a href="#setRootScope">setRootScope(rootScopeProperty, rootScopeValue)</a></dt>
<dd><p>Stores a value in the shared reactive root scope.</p>
<p>The root scope is a MobX observable object that lives on the ARM instance,
making it a lightweight global state store accessible from any component
that has access to ARM.</p>
</dd>
<dt><a href="#getRootScope">getRootScope(rootScopeProperty)</a> ⇒ <code>*</code></dt>
<dd><p>Reads a value from the shared reactive root scope.</p>
</dd>
<dt><a href="#ajax">ajax([config])</a> ⇒ <code>Promise</code></dt>
<dd><p>Makes a raw Axios request using the ARM instance&#39;s configured headers and base URL.</p>
<p>Use this for one-off requests that don&#39;t map to a collection (e.g. file uploads,
action endpoints, or any API call where you don&#39;t need record management).</p>
</dd>
<dt><a href="#findBy">findBy(objects, [findProperties])</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Returns the first object in an array that matches the given properties.</p>
</dd>
<dt><a href="#findIndexBy">findIndexBy(objects, [findIndexProperties])</a> ⇒ <code>number</code></dt>
<dd><p>Returns the index of the first object in an array that matches the given properties.</p>
</dd>
<dt><a href="#filterBy">filterBy(objects, [filterProperties])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Returns all objects in an array that match the given properties.</p>
</dd>
<dt><a href="#uniqBy">uniqBy(objects, uniqByProperty)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Returns a new array with duplicate objects removed, comparing by a given property.</p>
</dd>
<dt><a href="#uniq">uniq(values)</a> ⇒ <code>Array.&lt;*&gt;</code></dt>
<dd><p>Returns a new array with duplicate primitive values removed.</p>
</dd>
<dt><a href="#groupBy">groupBy(objects, groupByProperty)</a> ⇒ <code>Object</code></dt>
<dd><p>Groups objects into arrays keyed by the value of a specified property.</p>
</dd>
<dt><a href="#mapBy">mapBy(objects, mapByProperty)</a> ⇒ <code>Array.&lt;*&gt;</code></dt>
<dd><p>Extracts a single property from every object in an array.</p>
</dd>
<dt><a href="#firstObject">firstObject([objects])</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Returns the first element of an array.</p>
</dd>
<dt><a href="#lastObject">lastObject([objects])</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Returns the last element of an array.</p>
</dd>
<dt><a href="#mergeObjects">mergeObjects([objects], [otherObjects])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Concatenates two arrays and removes duplicate objects (deep equality check).</p>
</dd>
<dt><a href="#chunkObjects">chunkObjects([objects], [chunkSize])</a> ⇒ <code>Array.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Splits an array into smaller arrays (chunks) of a given size.</p>
</dd>
<dt><a href="#sortBy">sortBy(objects, sortProperties)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Sorts an array of objects by one or more properties.</p>
<p>Each entry in <code>sortProperties</code> is a string in the format <code>&#39;property:order&#39;</code>
where <code>order</code> is <code>&#39;asc&#39;</code> or <code>&#39;desc&#39;</code>. Supports dot-notation for nested properties.</p>
</dd>
<dt><a href="#sum">sum(objects)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the sum of all values in an array of numbers.</p>
</dd>
<dt><a href="#sumBy">sumBy(objects, sumByProperty)</a> ⇒ <code>number</code></dt>
<dd><p>Sums the value of a specific numeric property across all objects in an array.</p>
<p>Returns <code>0</code> if the result is not a number (guards against <code>NaN</code> from missing properties).</p>
</dd>
<dt><a href="#isEmpty">isEmpty(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if the value is empty (empty string, array, object, <code>null</code>, or <code>undefined</code>).</p>
</dd>
<dt><a href="#isPresent">isPresent(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if the value is not empty. Inverse of <code>isEmpty</code>.</p>
</dd>
<dt><a href="#isEqual">isEqual(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if two values are deeply equal.</p>
</dd>
<dt><a href="#isNumber">isNumber(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if the value is a number (including <code>NaN</code> and <code>Infinity</code>).</p>
</dd>
<dt><a href="#isNil">isNil(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if the value is <code>null</code> or <code>undefined</code>.</p>
</dd>
<dt><a href="#isNull">isNull(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if the value is strictly <code>null</code>.</p>
</dd>
<dt><a href="#isGte">isGte(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if <code>value &gt;= other</code>.</p>
</dd>
<dt><a href="#isGt">isGt(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if <code>value &gt; other</code>.</p>
</dd>
<dt><a href="#isLte">isLte(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if <code>value &lt;= other</code>.</p>
</dd>
<dt><a href="#isLt">isLt(value, other)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns <code>true</code> if <code>value &lt; other</code>.</p>
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
<dt><a href="#RequestConfig">RequestConfig</a> : <code>Object</code></dt>
<dd><p>Configuration options accepted by all request methods:
<a href="ApiResourceManager#query">ApiResourceManager#query</a>, <a href="ApiResourceManager#queryRecord">ApiResourceManager#queryRecord</a>,
<a href="ApiResourceManager#findAll">ApiResourceManager#findAll</a>, and <a href="ApiResourceManager#findRecord">ApiResourceManager#findRecord</a>.</p>
</dd>
<dt><a href="#CollectionRecord">CollectionRecord</a> : <code>Object</code></dt>
<dd><p>A record object returned from the collection after a fetch or local lookup.
ARM injects these methods at runtime onto every record pushed into a collection.</p>
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
<a name="_initializeAxiosConfig"></a>

## \_initializeAxiosConfig() ℗
Initializes the Axios configuration with the base URL.

Sets the `baseURL` property in the Axios defaults to the value
returned by the `_getBaseURL()` method. This ensures that all
Axios requests use the correct base URL for the API.

**Kind**: global function  
**Access**: private  
<a name="_initializeCollections"></a>

## \_initializeCollections(collections) ℗
Initializes a collection of collections with optional default values.

Iterates through the provided array of `collections` and calls the
`_addCollection` method for each collection name, initializing it
with an empty array (`[]`) as the default value.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collections | <code>Array.&lt;string&gt;</code> | An array of collection names to initialize. |

<a name="_getBaseURL"></a>

## \_getBaseURL() ⇒ <code>string</code> ℗
Gets the base URL for API requests.

Constructs the base URL by combining the `host` and `namespace`
properties of the instance.

**Kind**: global function  
**Returns**: <code>string</code> - The base URL constructed from `host` and `namespace`.  
**Access**: private  
<a name="_isCollectionExisting"></a>

## \_isCollectionExisting(collectionName) ℗
Checks if a collection exists in the current instance.

This method verifies if a collection with the given `collectionName`
exists in the `collections` object of the `ApiResourceManager` instance.

**Kind**: global function  
**Throws**:

- <code>Error</code> If the collection does not exist.

**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to check. |

<a name="_addCollection"></a>

## \_addCollection(collectionName, collectionRecords) ℗
Adds a collection to the current instance.

This method adds a new collection with the specified `collectionName`
to the `collections` object of the `ApiResourceManager`. The
`collectionRecords` array is used to initialize the collection's data.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to add. |
| collectionRecords | <code>Array</code> | The initial records for the collection. |

<a name="_addAlias"></a>

## \_addAlias(aliasName, aliasRecords) ℗
Adds an alias to the aliases object.

This method creates an alias for a collection or a single record.
The `aliasName` specifies the name of the alias, and `aliasRecords`
can be either an array of records (for a collection alias) or a
single record object.

If `aliasRecords` is an array, it's used directly (or an empty array
if `aliasRecords` is falsy). If it's a plain object, it's used directly
(or an empty object if `aliasRecords` is falsy).

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| aliasName | <code>string</code> | The name of the alias. |
| aliasRecords | <code>Array</code> \| <code>Object</code> | The records to be aliased. |

<a name="_addRequestAlias"></a>

## \_addRequestAlias(aliasName, requestHashKey) ℗
Adds a request alias to the request aliases object.

This method maps a specific `aliasName` to a `requestHashKey` in the
`requestAliases` dictionary. This allows the system to reference a
specific request context using a human-readable alias.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| aliasName | <code>string</code> | The name of the alias for the request. |
| requestHashKey | <code>string</code> | The unique hash key identifying the request. |

<a name="_generateHashId"></a>

## \_generateHashId([object]) ⇒ <code>string</code> ℗
Generates a hash ID based on the provided object.

This method generates a unique hash ID by stringifying the given
`object` and then calculating its MD5 hash using the `md5` library.
If no `object` is provided, it defaults to an object with an
`id` property generated using `uuidv1()`.

**Kind**: global function  
**Returns**: <code>string</code> - The generated hash ID.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [object] | <code>Object</code> | <code>{ id: uuidv1() }</code> | The object to generate the hash ID from. |

<a name="_setProperties"></a>

## \_setProperties(targetObject, keyValuePairs) ℗
Sets multiple properties on a target object recursively.

This method iterates through the `keyValuePairs` object and sets the
corresponding properties on the `targetObject`. It handles nested
objects by recursively calling itself with an updated `prefix`.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| targetObject | <code>Object</code> | The object on which to set the properties. |
| keyValuePairs | <code>Object</code> | An object containing key-value pairs to set. |

<a name="_getRecordProperty"></a>

## \_getRecordProperty(key) ⇒ <code>\*</code> ℗
Gets a property from the current record.

This method retrieves the value of a property with the given `key`
from the current record object (`this`). It uses Lodash's `get`
function (aliased as `getProperty`) to access the property.

**Kind**: global function  
**Returns**: <code>\*</code> - The value of the property.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the property to retrieve. |

<a name="_setRecordProperty"></a>

## \_setRecordProperty(key, value) ℗
Sets a single property on the current record and updates its state
based on changes.

This method sets the property with the given `key` to the specified
`value` on the current record object (`this`). It then checks if the
record has been modified by comparing it with the `originalRecord`.
If changes are detected, it updates the `isDirty` and `isPristine`
flags accordingly.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The property key to set. |
| value | <code>\*</code> | The value to set for the property. |

<a name="_setRecordProperties"></a>

## \_setRecordProperties(values) ℗
Sets multiple properties on the current record and updates its state
based on changes.

This method sets multiple properties on the current record object
(`this`) using the provided `values` object. It then compares the
updated record with the `originalRecord` to detect any modifications.
If the record has been changed, it updates the `isDirty` and
`isPristine` flags.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>Object</code> | An object containing key-value pairs to set                          on the record. |

<a name="_sortRecordsBy"></a>

## \_sortRecordsBy(currentRecords, [sortProperties]) ⇒ <code>Array</code> ℗
Sorts an array of records based on specified properties and sort orders.

This method sorts the `currentRecords` array using the provided
`sortProperties`. Each `sortProperty` should be a string in the
format "property:order", where "property" is the name of the property
to sort by and "order" is either "asc" (ascending) or "desc"
(descending).

**Kind**: global function  
**Returns**: <code>Array</code> - The sorted array of records.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| currentRecords | <code>Array</code> |  | The array of records to sort. |
| [sortProperties] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | An array of sort properties. |

<a name="_unloadFromCollection"></a>

## \_unloadFromCollection(collectionRecord) ℗
Removes a record from a specified collection based on its hash ID.

This method removes a `collectionRecord` from its corresponding
collection in the `collections` object. It determines the collection
using the record's `collectionName` property and finds the record's
index within the collection using its `hashId`. If the record is
found, it's removed from the collection using Lodash's `pullAt`.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecord | <code>Object</code> | The record to be removed from                                   the collection. |

<a name="_unloadFromRequestHashes"></a>

## \_unloadFromRequestHashes(collectionRecord) ℗
Removes a record from all request hashes based on its hash ID.

This method iterates through all request hashes in the `requestHashes`
object and removes any occurrences of the `collectionRecord` based on
its `hashId`. It handles both array-based and object-based request
hash data.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecord | <code>Object</code> | The record to be removed from                                   request hashes. |

<a name="_unloadFromAliases"></a>

## \_unloadFromAliases(collectionRecord) ℗
Removes a record from all aliases based on its hash ID.

This method iterates through all aliases in the `aliases` object
and removes any occurrences of the `collectionRecord` based on its
`hashId`. It handles both array-based and object-based alias data.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecord | <code>Object</code> | The record to be removed from aliases. |

<a name="unloadRecord"></a>

## unloadRecord(currentRecord)
Removes a record from all local data stores: its collection, any aliases, and any
request hashes that reference it.

This is called automatically after a successful `destroyRecord`. You can also call
it manually to remove a record from local state without hitting the server.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| currentRecord | [<code>CollectionRecord</code>](#CollectionRecord) | The record to remove. |

**Example**  
```js
const record = ARM.peekRecord('addresses', 123)
ARM.unloadRecord(record)
// record is now gone from the collection and any aliases/request hashes
```
<a name="_saveRecord"></a>

## \_saveRecord(currentRecord, [collectionConfig]) ⇒ [<code>Promise.&lt;CollectionRecord&gt;</code>](#CollectionRecord) ℗
Saves a record to the server.

Determines the HTTP method based on the record's `id`:
- **POST** when `id` is a UUID (i.e. a record created locally via `createRecord` that
  has never been persisted). After a successful POST, the temporary local record is
  unloaded and replaced with the server response.
- **PUT** when `id` is any non-UUID value (numeric or string) - meaning the record
  already exists on the server.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;CollectionRecord&gt;</code>](#CollectionRecord) - Resolves with the updated record on success.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| currentRecord | [<code>CollectionRecord</code>](#CollectionRecord) |  | The record to be saved. |
| [collectionConfig] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Optional request configuration. |

<a name="_deleteRecord"></a>

## \_deleteRecord(currentRecord, [collectionConfig]) ⇒ [<code>Promise.&lt;CollectionRecord&gt;</code>](#CollectionRecord) ℗
Deletes a record from the server.

Sends a DELETE request using the record's `collectionName` and `id`. On success,
the record is automatically unloaded from the local collection, aliases, and
request hashes.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;CollectionRecord&gt;</code>](#CollectionRecord) - Resolves with the server response record on success.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| currentRecord | [<code>CollectionRecord</code>](#CollectionRecord) |  | The record to delete. |
| [collectionConfig] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Optional request configuration. |

<a name="_reloadRecord"></a>

## \_reloadRecord(currentRecord, [collectionConfig]) ⇒ [<code>Promise.&lt;CollectionRecord&gt;</code>](#CollectionRecord) ℗
Reloads a record from the server.

Sends a GET request using the record's `collectionName` and `id`, then merges the
server response back into the local record. A unique `skipId` is added automatically
so the cache is always bypassed and the latest data is fetched.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;CollectionRecord&gt;</code>](#CollectionRecord) - Resolves with the refreshed record on success.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| currentRecord | [<code>CollectionRecord</code>](#CollectionRecord) |  | The record to reload. |
| [collectionConfig] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Optional request configuration. |

<a name="_rollbackRecordAttributes"></a>

## \_rollbackRecordAttributes() ⇒ <code>void</code> ℗
Reverts the record's attributes to their original state.

This method retrieves the stored `originalRecord` (excluding internal
ARM properties), applies those values back to the current record instance,
and resets the `isDirty` and `isPristine` state flags.

**Kind**: global function  
**Access**: private  
<a name="_getCollectionRecord"></a>

## \_getCollectionRecord(collectionName, [collectionConfig], currentRecord) ⇒ <code>Object</code> \| <code>Array</code> ℗
Retrieves records from a specified collection based on given criteria.

This method retrieves records from the collection with the specified
`collectionName`, potentially fetching them asynchronously if needed.
It uses the `collectionConfig` to determine how to filter, sort,
and retrieve the records.

The `currentRecord` is used to extract related records based on the
`referenceKey` provided in the `collectionConfig`. If the related
records are not already in the local collection and `async` is true
in the `collectionConfig`, it initiates an asynchronous request to
fetch them.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Array</code> - The retrieved records (single object or array).  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| collectionName | <code>string</code> |  | The name of the collection. |
| [collectionConfig] | <code>Object</code> | <code>{}</code> | Configuration for retrieving                                        the records. |
| currentRecord | <code>Object</code> \| <code>Array</code> |  | The record containing potential                                       related records. |

<a name="_injectCollectionActions"></a>

## \_injectCollectionActions(collectionRecord) ℗
Injects action methods into a collection record.

Decorates `collectionRecord` with the full record-level API defined in [CollectionRecord](#CollectionRecord):
- `get(key)` / `set(key, value)` / `setProperties(values)` - reactive property access
- `rollbackAttributes()` - revert unsaved changes
- `save(config)` - POST (new) or PUT (existing)
- `reload(config)` - re-fetch from server
- `destroyRecord(config)` - DELETE and unload
- `getCollection(collectionName, config)` - resolve related records from a local collection
- `getARMContext()` - returns the ARM instance that owns this record

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecord | <code>Object</code> | The collection record to decorate. |

<a name="_injectRequestHashActions"></a>

## \_injectRequestHashActions(requestObject, responseObject, requestHashKey) ℗
Decorates the response object with actionable methods.
* Attaches a `reload` method to the `responseObject` that, when invoked,
triggers a re-fetch of the original request using the stored hash key.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| requestObject | <code>Object</code> | The original request configuration. |
| responseObject | <code>Object</code> | The object to be decorated with actions. |
| requestHashKey | <code>string</code> | The unique identifier for the request in the store. |

<a name="_injectCollectionReferenceKeys"></a>

## \_injectCollectionReferenceKeys(collectionName, collectionRecord, [collectionRecordHashId]) ℗
Injects reference keys into a collection record.

This method adds essential reference keys to a `collectionRecord`,
including:
 - `collectionName`: The name of the collection the record belongs to.
 - `hashId`: A unique hash ID generated for the record.
 - `isLoading`, `isError`, `isPristine`, `isDirty`: Flags to track
    the record's state.
 - `originalRecord`: A copy of the original record data for change
    tracking.

**Kind**: global function  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| collectionName | <code>string</code> |  | The name of the collection. |
| collectionRecord | <code>Object</code> |  | The collection record to inject keys into. |
| [collectionRecordHashId] | <code>string</code> | <code>null</code> | Optional pre-generated                                                 hash ID for the record. |

<a name="_pushToCollection"></a>

## \_pushToCollection(collectionName, collectionRecords) ⇒ <code>Array</code> \| <code>Object</code> ℗
Pushes records to a specified collection.

This method adds or updates records in the collection with the given
`collectionName`. The `collectionRecords` can be either an array of
records or a single record object.

If `collectionRecords` is an array, it iterates through the records
and adds them to the collection if they don't already exist. If a
record with the same `hashId` already exists, it updates the existing
record with the new data.

If `collectionRecords` is a single object, it adds it to the collection
if it doesn't exist or updates the existing record if it has the same
`hashId`.

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Object</code> - The pushed records (array or single object).  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to push                                 records to. |
| collectionRecords | <code>Array</code> \| <code>Object</code> | The records to be pushed. |

<a name="_pushToAliases"></a>

## \_pushToAliases(collectionRecords) ℗
Pushes records to specified aliases.

This method updates aliases in the `aliases` object with the provided
`collectionRecords`. It handles both array-based and object-based
aliases.

If an alias refers to an array of records, the method iterates through
the `collectionRecords` and updates any matching records within the
alias array based on their `hashId`.

If an alias refers to a single record object, the method updates the
alias with the matching `collectionRecord` based on its `hashId`.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecords | <code>Array</code> \| <code>Object</code> | The records to be pushed to                                          aliases. |

<a name="_pushToRequestHashes"></a>

## \_pushToRequestHashes(collectionRecords) ℗
Pushes records to specified request hashes.

This method updates request hashes in the `requestHashes` object with
the provided `collectionRecords`. It handles both array-based and
object-based request hash data.

If a request hash's `data` property is an array, the method iterates
through the `collectionRecords` and updates any matching records
within the `data` array based on their `hashId`.

If a request hash's `data` property is a single record object, the
method updates the `data` with the matching `collectionRecord` based
on its `hashId`.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecords | <code>Array</code> \| <code>Object</code> | The records to be pushed to                                          request hashes. |

<a name="_pushPayload"></a>

## \_pushPayload(collectionName, collectionRecords) ⇒ <code>Array</code> \| <code>Object</code> ℗
Pushes records to a collection, aliases, and request hashes.

This method orchestrates the process of adding or updating records
in various data stores within the `ApiResourceManager`. It takes a
`collectionName` and `collectionRecords` (which can be an array or
a single object) and performs the following actions:

1. Checks if the specified collection exists.
2. Pushes the records to the collection using `_pushToCollection`.
3. Updates any relevant aliases using `_pushToAliases`.
4. Updates any relevant request hashes using `_pushToRequestHashes`.

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Object</code> - The updated collection records.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection. |
| collectionRecords | <code>Array</code> \| <code>Object</code> | The records to be pushed. |

<a name="pushPayload"></a>

## pushPayload(collectionName, collectionRecords)
Injects ARM reference keys into raw record objects and pushes them into the named collection.

Unlike the internal `_pushPayload`, this public method first stamps each record with ARM's
internal metadata (`hashId`, `collectionName`, `isLoading`, `isError`, `isPristine`,
`isDirty`, `originalRecord`) before pushing. Use this to load records into a collection
from sources other than an API request (e.g. server-side props, local fixtures).

**Kind**: global function  
**Throws**:

- <code>Error</code> If `collectionName` was not registered during ARM initialization.


| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The collection to push records into. |
| collectionRecords | <code>Object</code> \| <code>Array.&lt;Object&gt;</code> | A single record object or an array of records. |

**Example**  
```js
ARM.pushPayload('addresses', [
  { id: 1, type: 'addresses', attributes: { address1: '123 Main St' } },
  { id: 2, type: 'addresses', attributes: { address1: '456 Oak Ave' } },
])
```
**Example**  
```js
// Single record
ARM.pushPayload('addresses', { id: 'ABC-001', type: 'addresses', attributes: { address1: 'HQ' } })
```
<a name="_pushRequestHash"></a>

## \_pushRequestHash(requestObject, responseObject) ⇒ <code>Object</code> ℗
Caches a request/response pair in the internal hash store.
* Generates a unique key based on the request and performs one of two actions:
1. If the key exists and the new response is marked `isNew`, it toggles the
existing entry's `isNew` flag to `false`.
2. Otherwise, it stores the new response object under that key.
* Also injects contextual actions (e.g., reload) into the response object.

**Kind**: global function  
**Returns**: <code>Object</code> - The stored request hash entry.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| requestObject | <code>Object</code> | The source object used to generate the hash key. |
| responseObject | <code>Object</code> | The data/state to be stored. |

<a name="setHost"></a>

## setHost(host)
Sets the API base host URL and updates the Axios `baseURL` immediately.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | The base URL of the API server (no trailing slash). |

**Example**  
```js
ARM.setHost('https://api.example.com')
```
<a name="setNamespace"></a>

## setNamespace(namespace)
Sets the API namespace used as the path prefix in every request URL.

Combined with `host`, this forms the Axios `baseURL`: `{host}/{namespace}`.
Defaults to `'api/v1'`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | The namespace (e.g. `'api/v2'`). |

**Example**  
```js
ARM.setNamespace('api/v2')
// All subsequent requests go to https://api.example.com/api/v2/...
```
<a name="setHeadersCommon"></a>

## setHeadersCommon(key, value)
Sets a header that is sent on every Axios request made by ARM.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Header name (e.g. `'Authorization'`, `'Content-Type'`). |
| value | <code>string</code> \| <code>number</code> \| <code>boolean</code> | Header value. |

**Example**  
```js
ARM.setHeadersCommon('Authorization', `Bearer ${token}`)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
```
<a name="setPayloadIncludeReference"></a>

## setPayloadIncludeReference(key)
Sets the key ARM reads from each `included` item to determine which collection it belongs to.

Defaults to `'type'`, matching the JSON:API convention where `included[].type` names
the resource type. Override this if your API uses a different field name.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The property name to read from each included record (default: `'type'`). |

**Example**  
```js
// JSON:API default - included items have a `type` field
ARM.setPayloadIncludeReference('type')
```
**Example**  
```js
// Custom API that uses `resource_type` instead
ARM.setPayloadIncludeReference('resource_type')
```
<a name="setGlobal"></a>

## setGlobal()
Attaches this ARM instance to `window.ARM` in browser environments.

The instance is frozen with `Object.freeze()` to prevent accidental mutation.
This is a convenience for debugging and for accessing ARM from outside a React
component tree. No-op in non-browser (SSR) environments.

**Kind**: global function  
**Example**  
```js
ARM.setGlobal()
// Now accessible anywhere in the browser as window.ARM
```
<a name="getCollection"></a>

## getCollection(collectionName) ⇒ [<code>Array.&lt;CollectionRecord&gt;</code>](#CollectionRecord)
Returns all records in a collection as a MobX observable array.

Returns an empty observable array if the collection has no records yet.
Unlike `peekAll`, this always returns an observable so components can
react to future changes.

**Kind**: global function  
**Returns**: [<code>Array.&lt;CollectionRecord&gt;</code>](#CollectionRecord) - Observable array of all records in the collection.  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The registered collection name. |

**Example**  
```js
const addresses = ARM.getCollection('addresses')
// addresses is a live observable array - updates when records are added/removed
```
<a name="_unloadCollection"></a>

## \_unloadCollection(collectionName) ℗
Unloads a collection by resetting it to an empty array.

This method removes all records from the specified collection in the
`collections` object of the `ApiResourceManager`.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to unload. |

<a name="clearCollection"></a>

## clearCollection(collectionName)
Removes all records from a collection and cleans up any references to those
records in aliases and request hashes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The registered collection name to clear. |

**Example**  
```js
ARM.clearCollection('addresses')
// All address records are removed from local state
```
<a name="getAlias"></a>

## getAlias(aliasName, [fallbackRecords]) ⇒ [<code>CollectionRecord</code>](#CollectionRecord) \| [<code>Array.&lt;CollectionRecord&gt;</code>](#CollectionRecord)
Returns the records stored under an alias, or `fallbackRecords` if the alias is not yet set.

Aliases are populated when a request is made with `{ alias: 'myAlias' }` in the config.
If `fallbackRecords` is a plain object, ARM injects the record-level action methods into
it so it can be used as a placeholder record before the real data arrives.

**Kind**: global function  
**Returns**: [<code>CollectionRecord</code>](#CollectionRecord) \| [<code>Array.&lt;CollectionRecord&gt;</code>](#CollectionRecord) - The aliased records or the fallback.  

| Param | Type | Description |
| --- | --- | --- |
| aliasName | <code>string</code> | The alias name to look up. |
| [fallbackRecords] | <code>Object</code> \| <code>Array.&lt;Object&gt;</code> | Returned as an observable if the alias is empty. |

**Example**  
```js
// Populate the alias via a request
ARM.findRecord('addresses', 123, null, { alias: 'currentAddress' })

// Read it back (returns fallback object until the request resolves)
const address = ARM.getAlias('currentAddress', {})
```
**Example**  
```js
// Array alias
ARM.findAll('addresses', { alias: 'allAddresses' })
const addresses = ARM.getAlias('allAddresses', [])
```
<a name="getRequestAlias"></a>

## getRequestAlias(aliasName) ⇒ <code>Object</code> \| <code>null</code>
Returns the request hash object for a named alias.

The request hash contains the full request state (`isLoading`, `isError`, `data`,
`error`, `included`, `meta`, and a `reload()` method) for the most recent request
that used the given `alias`. Returns `null` if no request has used that alias yet.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>null</code> - The request hash object, or `null` if not found.  

| Param | Type | Description |
| --- | --- | --- |
| aliasName | <code>string</code> | The alias name to resolve. |

**Example**  
```js
ARM.findAll('addresses', { alias: 'allAddresses' })

const requestState = ARM.getRequestAlias('allAddresses')
console.log(requestState.isLoading) // true while fetching
console.log(requestState.meta)      // pagination metadata, etc.
requestState.reload()               // re-trigger the original request
```
<a name="createRecord"></a>

## createRecord(collectionName, [collectionRecord], [collectionRecordRandomId]) ⇒ [<code>CollectionRecord</code>](#CollectionRecord)
Creates a new local record in the named collection without making a network request.

The record is pushed into the collection immediately as an observable object with
the full ARM record API injected (`get`, `set`, `save`, `reload`, etc.).

By default, ARM assigns a UUID v1 as the record's `id`. This UUID signals to
`record.save()` that the record is new and should be sent as a POST request.
Pass `collectionRecordRandomId = false` to assign the nil UUID instead (useful
when you need a known placeholder ID).

**Kind**: global function  
**Returns**: [<code>CollectionRecord</code>](#CollectionRecord) - The newly created observable record.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| collectionName | <code>string</code> |  | The registered collection to create the record in. |
| [collectionRecord] | <code>Object</code> | <code>{}</code> | Initial attribute data for the record. |
| [collectionRecordRandomId] | <code>boolean</code> | <code>true</code> | `true` to assign a random UUID; `false` for nil UUID. |

**Example**  
```js
const newAddress = ARM.createRecord('addresses', {
  attributes: { address1: '123 Main St', kind: 'home' },
})

// Persist to the server (sends POST /addresses)
await newAddress.save()
```
<a name="_reloadRequest"></a>

## \_reloadRequest(requestObject, requestHashKey) ⇒ <code>Promise.&lt;void&gt;</code> ℗
Reloads a request by updating its skip ID and re-executing the request.

This method modifies the `requestObject` by generating a new skip ID
using `uuidv1()` and setting `autoResolve` to `false` and `autoResolveOrigin`
to `'_internal'`. It then re-executes the request using the `_request`
method. During the reload process, it sets the `isLoading` flag of the
corresponding request hash to `true` and resets it to `false` after
the request is completed.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the request is reloaded.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| requestObject | <code>Object</code> | The request object to reload. |
| requestHashKey | <code>string</code> | The key of the request hash to update. |

<a name="_resolveRequest"></a>

## \_resolveRequest(config, requestXHR, requestHashObject) ⇒ <code>Promise</code> \| <code>Object</code> ℗
Resolves the request based on configuration.

This method determines how to resolve an API request based on the
`autoResolve` option in the `config` object.

If `autoResolve` is true (which is the default if not explicitly
provided), the method returns the `requestHashObject`, which likely
contains the cached response data.

If `autoResolve` is false, the method returns the `requestXHR` object,
which represents the actual Axios request Promise. This allows for
more control over handling the response, such as accessing the raw
response data or handling specific HTTP status codes.

**Kind**: global function  
**Returns**: <code>Promise</code> \| <code>Object</code> - The resolved value based on the
                         `autoResolve` configuration.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The configuration object for the request. |
| requestXHR | <code>Promise</code> | The Axios request Promise. |
| requestHashObject | <code>Object</code> | The request hash object containing                                    cached response data. |

<a name="_request"></a>

## \_request(requestConfig) ⇒ <code>Promise.&lt;\*&gt;</code>
Makes an API request based on the provided configuration.

This method handles various HTTP methods (GET, POST, PUT, DELETE), resource URLs,
query parameters, payloads, and error handling. It also manages aliases,
request caching, and asynchronous loading of related resources.

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A Promise that resolves with the API response data or the request hash object (if autoResolve is true), or rejects with an error.  

| Param | Type | Description |
| --- | --- | --- |
| requestConfig | <code>Object</code> | The configuration object for the request. |
| requestConfig.resourceMethod | <code>string</code> | The HTTP method for the request (e.g., 'get', 'post', 'put', 'delete'). |
| requestConfig.resourceName | <code>string</code> | The name of the API resource being accessed. |
| [requestConfig.resourceId] | <code>string</code> \| <code>number</code> | Optional ID of the specific resource for GET/PUT/DELETE requests. |
| [requestConfig.resourceParams] | <code>Object</code> | Optional query parameters for the request. |
| [requestConfig.resourcePayload] | <code>Object</code> | Optional payload data for POST/PUT requests. |
| [requestConfig.resourceFallback] | <code>\*</code> | Optional fallback value to return if the request fails and no response data is available. |
| [requestConfig.resourceConfig] | <code>Object</code> | Optional configuration overrides for the request (e.g., alias, autoResolve, skip, ignorePayload, override). |

<a name="_processRequestPayload"></a>

## \_processRequestPayload(resourceIgnorePayload, resourcePayloadRecord, requestOptions)
Processes the payload for a request, omitting specified keys and setting it in the request options.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resourceIgnorePayload | <code>Array.&lt;string&gt;</code> | An array of keys to be ignored (omitted) from the payload. |
| resourcePayloadRecord | <code>Object</code> | The record object containing the payload data. |
| requestOptions | <code>Object</code> | The options object for the request, where the processed payload will be set. |

<a name="_processRequestURL"></a>

## \_processRequestURL(requestOptions, resourceName, resourceId)
Processes the URL for a request, constructing it from the resource name and ID.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| requestOptions | <code>Object</code> | The options object for the request, where the URL will be set. |
| resourceName | <code>string</code> | The name of the resource being accessed. |
| resourceId | <code>string</code> \| <code>number</code> | The ID of the specific resource. |

<a name="_processRequestAlias"></a>

## \_processRequestAlias(requestObject, collectionRecords) ℗
Processes an alias for a request, mapping both the records and the request hash.

This method extracts the alias name from the request configuration and:
1. Maps the alias name to the provided collection records in the aliases store.
2. Maps the alias name to the generated request hash key in the request aliases store.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| requestObject | <code>Object</code> | The full request object used to generate the hash ID and containing the resource configuration. |
| collectionRecords | <code>Array</code> \| <code>Object</code> | The records to be aliased. Can be an array or a single object. |

<a name="_processRequestOverride"></a>

## \_processRequestOverride(resourceConfig, requestOptions)
Processes request overrides based on the provided configuration.

This method modifies the `requestOptions` object to incorporate any overrides
specified in the `resourceConfig`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resourceConfig | <code>Object</code> | The configuration object for the resource request. |
| resourceConfig.override | <code>Object</code> | Optional overrides for the request. |
| [resourceConfig.override.host] | <code>string</code> | Optional override for the base URL host. |
| [resourceConfig.override.namespace] | <code>string</code> | Optional override for the API namespace. |
| [resourceConfig.override.path] | <code>string</code> | Optional override for the request path. |
| [resourceConfig.override.headers] | <code>Object</code> | Optional override for request headers. |
| requestOptions | <code>Object</code> | The request options object to be modified. |

<a name="query"></a>

## query(resource, [params], [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Fetches multiple records from the server (`GET /{resource}`).

By default returns a reactive request hash object immediately (before the request
resolves) so it can be bound directly in a component. Set `config.autoResolve: false`
to receive a Promise instead.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - Reactive request hash (default) or Axios Promise when `autoResolve: false`.  
**Throws**:

- <code>Error</code> If `resource` is not a registered collection.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The resource name / collection name (e.g. `'addresses'`). |
| [params] | <code>Object</code> | <code>{}</code> | Query parameters appended to the request URL. |
| [config] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Request configuration options. |

**Example**  
```js
// Reactive (default) - bind directly in a component
const result = ARM.query('addresses', { 'filter[kind]': 'home' }, { alias: 'homeAddresses' })
result.isLoading // true while fetching
result.data      // array of CollectionRecord
```
**Example**  
```js
// Awaitable - full control over loading state
const result = await ARM.query('addresses', { include: 'users' }, { autoResolve: false })
```
<a name="queryRecord"></a>

## queryRecord(resource, [params], [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Fetches a single record from the server without an ID (`GET /{resource}`).

Unlike `findRecord`, no ID is appended to the URL - the server is expected to
return a single object (e.g. the current user's profile, a singleton resource).

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - Reactive request hash (default) or Axios Promise when `autoResolve: false`.  
**Throws**:

- <code>Error</code> If `resource` is not a registered collection.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The resource name / collection name. |
| [params] | <code>Object</code> | <code>{}</code> | Query parameters appended to the request URL. |
| [config] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Request configuration options. |

**Example**  
```js
// Reactive
const result = ARM.queryRecord('addresses', { 'filter[id]': 123 }, { alias: 'currentAddress' })
result.isLoading // true while fetching
result.data      // CollectionRecord once resolved
```
**Example**  
```js
// Awaitable
await ARM.queryRecord('profile', {}, { autoResolve: false })
```
<a name="findAll"></a>

## findAll(resource, [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Fetches all records from the server without query parameters (`GET /{resource}`).

Equivalent to `query(resource, {}, config)` but signals intent more clearly when
no filtering is needed.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - Reactive request hash (default) or Axios Promise when `autoResolve: false`.  
**Throws**:

- <code>Error</code> If `resource` is not a registered collection.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The resource name / collection name. |
| [config] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Request configuration options. |

**Example**  
```js
// Reactive
const result = ARM.findAll('addresses', { alias: 'allAddresses' })
result.isLoading // true while fetching
result.data      // CollectionRecord[] once resolved
```
**Example**  
```js
// Awaitable
await ARM.findAll('addresses', { autoResolve: false })
```
<a name="findRecord"></a>

## findRecord(resource, id, [params], [config]) ⇒ <code>Object</code> \| <code>Promise</code>
Fetches a single record by ID from the server (`GET /{resource}/{id}`).

Accepts both numeric and string IDs (string ID support added in v2.9.0).

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Promise</code> - Reactive request hash (default) or Axios Promise when `autoResolve: false`.  
**Throws**:

- <code>Error</code> If `resource` is not a registered collection.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | The resource name / collection name. |
| id | <code>number</code> \| <code>string</code> |  | The record ID to fetch. |
| [params] | <code>Object</code> | <code>{}</code> | Query parameters appended to the request URL. |
| [config] | [<code>RequestConfig</code>](#RequestConfig) | <code>{}</code> | Request configuration options. |

**Example**  
```js
// Reactive - numeric ID
const result = ARM.findRecord('addresses', 123, null, { alias: 'currentAddress' })
result.isLoading // true while fetching
result.data      // CollectionRecord once resolved
```
**Example**  
```js
// String ID
ARM.findRecord('addresses', 'JO-26181S4VPU65', null, { alias: 'currentAddress' })
```
**Example**  
```js
// Awaitable with query params
await ARM.findRecord('addresses', 123, { include: 'user' }, { autoResolve: false })
```
<a name="peekAll"></a>

## peekAll(collectionName) ⇒ [<code>Array.&lt;CollectionRecord&gt;</code>](#CollectionRecord) \| <code>undefined</code>
Returns all locally cached records in a collection without making a network request.

**Kind**: global function  
**Returns**: [<code>Array.&lt;CollectionRecord&gt;</code>](#CollectionRecord) \| <code>undefined</code> - The array of cached records, or `undefined`
  if the collection has not been initialized.  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The registered collection name. |

**Example**  
```js
const addresses = ARM.peekAll('addresses')
// Returns whatever is currently in the local collection (may be empty)
```
<a name="peekRecord"></a>

## peekRecord(collectionName, collectionRecordId) ⇒ [<code>CollectionRecord</code>](#CollectionRecord) \| <code>undefined</code>
Returns a single locally cached record by ID without making a network request.

Accepts both numeric and string IDs (string ID support added in v2.9.0).

**Kind**: global function  
**Returns**: [<code>CollectionRecord</code>](#CollectionRecord) \| <code>undefined</code> - The matching record, or `undefined` if not in the local cache.  

| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The registered collection name. |
| collectionRecordId | <code>number</code> \| <code>string</code> | The record ID to look up. |

**Example**  
```js
// Numeric ID
const address = ARM.peekRecord('addresses', 123)
```
**Example**  
```js
// String ID
const address = ARM.peekRecord('addresses', 'JO-26181S4VPU65')
```
<a name="_setRootScope"></a>

## \_setRootScope(rootScopeProperty, rootScopeValue) ℗
**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| rootScopeProperty | <code>string</code> | Property name. |
| rootScopeValue | <code>\*</code> | Value to set. |

<a name="setRootScope"></a>

## setRootScope(rootScopeProperty, rootScopeValue)
Stores a value in the shared reactive root scope.

The root scope is a MobX observable object that lives on the ARM instance,
making it a lightweight global state store accessible from any component
that has access to ARM.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rootScopeProperty | <code>string</code> | The property name to set (supports dot notation). |
| rootScopeValue | <code>\*</code> | The value to store. |

**Example**  
```js
ARM.setRootScope('currentUser', { id: 1, name: 'Alice' })
ARM.setRootScope('ui.sidebarOpen', true)
```
<a name="getRootScope"></a>

## getRootScope(rootScopeProperty) ⇒ <code>\*</code>
Reads a value from the shared reactive root scope.

**Kind**: global function  
**Returns**: <code>\*</code> - The stored value, or `undefined` if not set.  

| Param | Type | Description |
| --- | --- | --- |
| rootScopeProperty | <code>string</code> | The property name to read (supports dot notation). |

**Example**  
```js
const user = ARM.getRootScope('currentUser')
const isOpen = ARM.getRootScope('ui.sidebarOpen')
```
<a name="ajax"></a>

## ajax([config]) ⇒ <code>Promise</code>
Makes a raw Axios request using the ARM instance's configured headers and base URL.

Use this for one-off requests that don't map to a collection (e.g. file uploads,
action endpoints, or any API call where you don't need record management).

**Kind**: global function  
**Returns**: <code>Promise</code> - Resolves with the Axios response or rejects with an error.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | Any valid Axios request config object. |

**Example**  
```js
const response = await ARM.ajax({
  method: 'post',
  url: '/addresses/bulk-delete',
  data: { ids: [1, 2, 3] },
})
```
<a name="findBy"></a>

## findBy(objects, [findProperties]) ⇒ <code>Object</code> \| <code>undefined</code>
Returns the first object in an array that matches the given properties.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The first matching object, or `undefined`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> |  | The array to search. |
| [findProperties] | <code>Object</code> | <code>{}</code> | Key-value pairs to match against. |

**Example**  
```js
const home = ARM.findBy(addresses, { attributes: { kind: 'home' } })
```
<a name="findIndexBy"></a>

## findIndexBy(objects, [findIndexProperties]) ⇒ <code>number</code>
Returns the index of the first object in an array that matches the given properties.

**Kind**: global function  
**Returns**: <code>number</code> - The index of the first match, or `-1` if not found.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> |  | The array to search. |
| [findIndexProperties] | <code>Object</code> | <code>{}</code> | Key-value pairs to match against. |

**Example**  
```js
const idx = ARM.findIndexBy(addresses, { id: 123 })
```
<a name="filterBy"></a>

## filterBy(objects, [filterProperties]) ⇒ <code>Array.&lt;Object&gt;</code>
Returns all objects in an array that match the given properties.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of matching objects (empty array if none match).  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> |  | The array to filter. |
| [filterProperties] | <code>Object</code> | <code>{}</code> | Key-value pairs to match against. |

**Example**  
```js
const homeAddresses = ARM.filterBy(addresses, { attributes: { kind: 'home' } })
```
<a name="uniqBy"></a>

## uniqBy(objects, uniqByProperty) ⇒ <code>Array.&lt;Object&gt;</code>
Returns a new array with duplicate objects removed, comparing by a given property.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array with duplicates (by property) removed.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The source array. |
| uniqByProperty | <code>string</code> | The property to determine uniqueness by. |

**Example**  
```js
const unique = ARM.uniqBy(addresses, 'attributes.city')
```
<a name="uniq"></a>

## uniq(values) ⇒ <code>Array.&lt;\*&gt;</code>
Returns a new array with duplicate primitive values removed.

**Kind**: global function  
**Returns**: <code>Array.&lt;\*&gt;</code> - Array with duplicates removed.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>Array.&lt;\*&gt;</code> | The source array of primitive values. |

**Example**  
```js
ARM.uniq([1, 2, 2, 3]) // [1, 2, 3]
```
<a name="groupBy"></a>

## groupBy(objects, groupByProperty) ⇒ <code>Object</code>
Groups objects into arrays keyed by the value of a specified property.

**Kind**: global function  
**Returns**: <code>Object</code> - An object where each key is a distinct property value and each
  value is an array of matching objects.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array to group. |
| groupByProperty | <code>string</code> | The property whose value becomes the group key. |

**Example**  
```js
const byKind = ARM.groupBy(addresses, 'attributes.kind')
// { home: [...], office: [...] }
```
<a name="mapBy"></a>

## mapBy(objects, mapByProperty) ⇒ <code>Array.&lt;\*&gt;</code>
Extracts a single property from every object in an array.

**Kind**: global function  
**Returns**: <code>Array.&lt;\*&gt;</code> - A new array of the extracted values.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array to map over. |
| mapByProperty | <code>string</code> | Dot-notation path to the property to extract. |

**Example**  
```js
const ids = ARM.mapBy(addresses, 'id')
const cities = ARM.mapBy(addresses, 'attributes.city')
```
<a name="firstObject"></a>

## firstObject([objects]) ⇒ <code>Object</code> \| <code>undefined</code>
Returns the first element of an array.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The first element, or `undefined` if the array is empty.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The source array. |

**Example**  
```js
const first = ARM.firstObject(addresses)
```
<a name="lastObject"></a>

## lastObject([objects]) ⇒ <code>Object</code> \| <code>undefined</code>
Returns the last element of an array.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - The last element, or `undefined` if the array is empty.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The source array. |

**Example**  
```js
const last = ARM.lastObject(addresses)
```
<a name="mergeObjects"></a>

## mergeObjects([objects], [otherObjects]) ⇒ <code>Array.&lt;Object&gt;</code>
Concatenates two arrays and removes duplicate objects (deep equality check).

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - A new array with all unique objects from both inputs.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The first array. |
| [otherObjects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The second array to merge in. |

**Example**  
```js
const merged = ARM.mergeObjects(localAddresses, serverAddresses)
```
<a name="chunkObjects"></a>

## chunkObjects([objects], [chunkSize]) ⇒ <code>Array.&lt;Array.&lt;Object&gt;&gt;</code>
Splits an array into smaller arrays (chunks) of a given size.

**Kind**: global function  
**Returns**: <code>Array.&lt;Array.&lt;Object&gt;&gt;</code> - Array of chunk arrays.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [objects] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | The array to split. |
| [chunkSize] | <code>number</code> | <code>1</code> | Maximum number of elements per chunk. |

**Example**  
```js
ARM.chunkObjects(addresses, 10)
// [[...10 items...], [...10 items...], ...]
```
<a name="sortBy"></a>

## sortBy(objects, sortProperties) ⇒ <code>Array.&lt;Object&gt;</code>
Sorts an array of objects by one or more properties.

Each entry in `sortProperties` is a string in the format `'property:order'`
where `order` is `'asc'` or `'desc'`. Supports dot-notation for nested properties.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - A new sorted array.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array to sort. |
| sortProperties | <code>Array.&lt;string&gt;</code> | Sort descriptors in `'property:order'` format. |

**Example**  
```js
ARM.sortBy(addresses, ['attributes.city:asc', 'id:desc'])
```
<a name="sum"></a>

## sum(objects) ⇒ <code>number</code>
Returns the sum of all values in an array of numbers.

**Kind**: global function  
**Returns**: <code>number</code> - The total sum.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;number&gt;</code> | The array of numbers to sum. |

**Example**  
```js
ARM.sum([10, 20, 30]) // 60
```
<a name="sumBy"></a>

## sumBy(objects, sumByProperty) ⇒ <code>number</code>
Sums the value of a specific numeric property across all objects in an array.

Returns `0` if the result is not a number (guards against `NaN` from missing properties).

**Kind**: global function  
**Returns**: <code>number</code> - The total sum, or `0` if the result is not a valid number.  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;Object&gt;</code> | The array of objects. |
| sumByProperty | <code>string</code> | Dot-notation path to the numeric property. |

**Example**  
```js
ARM.sumBy(orderItems, 'attributes.quantity')
```
<a name="isEmpty"></a>

## isEmpty(value) ⇒ <code>boolean</code>
Returns `true` if the value is empty (empty string, array, object, `null`, or `undefined`).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

**Example**  
```js
ARM.isEmpty([])    // true
ARM.isEmpty('')    // true
ARM.isEmpty(null)  // true
ARM.isEmpty([1])   // false
```
<a name="isPresent"></a>

## isPresent(value) ⇒ <code>boolean</code>
Returns `true` if the value is not empty. Inverse of `isEmpty`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

**Example**  
```js
ARM.isPresent([1])  // true
ARM.isPresent([])   // false
```
<a name="isEqual"></a>

## isEqual(value, other) ⇒ <code>boolean</code>
Returns `true` if two values are deeply equal.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The first value. |
| other | <code>\*</code> | The second value. |

**Example**  
```js
ARM.isEqual({ a: 1 }, { a: 1 }) // true
```
<a name="isNumber"></a>

## isNumber(value) ⇒ <code>boolean</code>
Returns `true` if the value is a number (including `NaN` and `Infinity`).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

**Example**  
```js
ARM.isNumber(42)    // true
ARM.isNumber('42')  // false
```
<a name="isNil"></a>

## isNil(value) ⇒ <code>boolean</code>
Returns `true` if the value is `null` or `undefined`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

**Example**  
```js
ARM.isNil(null)      // true
ARM.isNil(undefined) // true
ARM.isNil(0)         // false
```
<a name="isNull"></a>

## isNull(value) ⇒ <code>boolean</code>
Returns `true` if the value is strictly `null`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

**Example**  
```js
ARM.isNull(null)      // true
ARM.isNull(undefined) // false
```
<a name="isGte"></a>

## isGte(value, other) ⇒ <code>boolean</code>
Returns `true` if `value >= other`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The value to compare. |
| other | <code>number</code> | The threshold. |

**Example**  
```js
ARM.isGte(5, 5) // true
ARM.isGte(4, 5) // false
```
<a name="isGt"></a>

## isGt(value, other) ⇒ <code>boolean</code>
Returns `true` if `value > other`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The value to compare. |
| other | <code>number</code> | The threshold. |

**Example**  
```js
ARM.isGt(6, 5) // true
ARM.isGt(5, 5) // false
```
<a name="isLte"></a>

## isLte(value, other) ⇒ <code>boolean</code>
Returns `true` if `value <= other`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The value to compare. |
| other | <code>number</code> | The threshold. |

**Example**  
```js
ARM.isLte(5, 5) // true
ARM.isLte(6, 5) // false
```
<a name="isLt"></a>

## isLt(value, other) ⇒ <code>boolean</code>
Returns `true` if `value < other`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The value to compare. |
| other | <code>number</code> | The threshold. |

**Example**  
```js
ARM.isLt(4, 5) // true
ARM.isLt(5, 5) // false
```
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

<a name="RequestConfig"></a>

## RequestConfig : <code>Object</code>
Configuration options accepted by all request methods:
[ApiResourceManager#query](ApiResourceManager#query), [ApiResourceManager#queryRecord](ApiResourceManager#queryRecord),
[ApiResourceManager#findAll](ApiResourceManager#findAll), and [ApiResourceManager#findRecord](ApiResourceManager#findRecord).

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [alias] | <code>string</code> |  | Store the response data under this alias name.   The resolved records are then accessible via [ApiResourceManager#getAlias](ApiResourceManager#getAlias) and   the request hash via [ApiResourceManager#getRequestAlias](ApiResourceManager#getRequestAlias). |
| [autoResolve] | <code>boolean</code> | <code>true</code> | When `true` (default), the method returns the   reactive request hash object immediately (useful for binding directly in UI components).   When `false`, returns the raw Axios Promise so you can `await` the result and handle   loading/error state yourself. |
| [skip] | <code>boolean</code> |  | When `true`, skip making the network request   entirely. Useful for conditional fetching. |
| [skipId] | <code>string</code> |  | A unique value (typically a UUID) that forces   the request to bypass the internal cache and always re-fetch from the server. Each unique   `skipId` value is treated as a new request. |
| [ignorePayload] | <code>Array.&lt;string&gt;</code> |  | An array of attribute keys to omit from the   request payload when saving a record via `record.save()`. |
| [override] | <code>Object</code> |  | Override specific parts of the request URL or   headers for this single request only. |
| [override.host] | <code>string</code> |  | Override the base host URL (e.g. `'https://other-api.com'`). |
| [override.namespace] | <code>string</code> |  | Override the API namespace (e.g. `'api/v2'`). |
| [override.path] | <code>string</code> |  | Override the full request path. |
| [override.headers] | <code>Object</code> |  | Additional headers to merge into the request. |

<a name="CollectionRecord"></a>

## CollectionRecord : <code>Object</code>
A record object returned from the collection after a fetch or local lookup.
ARM injects these methods at runtime onto every record pushed into a collection.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The record's identifier (numeric or string). |
| type | <code>string</code> | The resource type (matches the collection name). |
| attributes | <code>Object</code> | The record's attribute payload from the API. |
| [relationships] | <code>Object</code> | Optional JSON:API relationships block. |
| hashId | <code>string</code> | Internal MD5-based unique key used by ARM. |
| collectionName | <code>string</code> | The collection this record belongs to. |
| isLoading | <code>boolean</code> | `true` while a save/reload/destroy request is in flight. |
| isError | <code>boolean</code> | `true` if the last request for this record errored. |
| isDirty | <code>boolean</code> | `true` if the record has unsaved local changes. |
| isPristine | <code>boolean</code> | `true` if the record matches its last-saved state. |
| originalRecord | <code>Object</code> | Snapshot of the record at the time it was last synced. |
| get | <code>function</code> | Read a property by dot-notation key. |
| set | <code>function</code> | Set a single property and update dirty state. |
| setProperties | <code>function</code> | Set multiple properties at once. |
| rollbackAttributes | <code>function</code> | Revert all changes back to `originalRecord`. |
| save | <code>function</code> | Persist changes to the server (PUT) or create (POST). |
| reload | <code>function</code> | Re-fetch this record from the server. |
| destroyRecord | <code>function</code> | Delete this record from the server and unload it locally. |
| getCollection | <code>function</code> | - Retrieve related records from a local collection using this record's relationship data. |

