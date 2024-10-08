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
<dt><a href="#_generateHashId">_generateHashId([object])</a> ⇒ <code>string</code> ℗</dt>
<dd><p>Generates a hash ID based on the provided object.</p>
<p>This method generates a unique hash ID by stringifying the given
<code>object</code> and then calculating its MD5 hash using CryptoJS.
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
<dd><p>Unloads a record from the collection, request hashes, and aliases.</p>
<p>This method removes a <code>currentRecord</code> from all relevant data stores
within the <code>ApiResourceManager</code>:</p>
<ul>
<li>The main collection where the record belongs.</li>
<li>Any request hashes where the record might be present.</li>
<li>Any aliases that refer to the record.</li>
</ul>
</dd>
<dt><a href="#_saveRecord">_saveRecord(currentRecord, [collectionConfig])</a> ⇒ <code>Promise</code> ℗</dt>
<dd><p>Saves a record to the server.</p>
<p>This method saves the <code>currentRecord</code> to the server by making an API
request. It determines whether to use a PUT (update) or POST (create)
request based on the validity of the record&#39;s <code>id</code>. The <code>collectionConfig</code>
parameter can be used to provide additional configuration for the
request.</p>
</dd>
<dt><a href="#_deleteRecord">_deleteRecord(currentRecord, [collectionConfig])</a> ⇒ <code>Promise</code> ℗</dt>
<dd><p>Deletes a record from the server.</p>
<p>This method deletes the <code>currentRecord</code> from the server by making
a DELETE API request. The <code>collectionConfig</code> parameter can be used
to provide additional configuration for the request.</p>
</dd>
<dt><a href="#_reloadRecord">_reloadRecord(currentRecord)</a> ⇒ <code>Promise</code> ℗</dt>
<dd><p>Reloads a record from the server.</p>
<p>This method reloads the <code>currentRecord</code> from the server by making
a GET API request. It fetches the latest data for the record and
updates the local copy.</p>
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
<p>This method adds predefined action methods to a <code>collectionRecord</code>.
These methods provide convenient ways to interact with the record,
such as getting and setting properties, saving, deleting, reloading,
and retrieving related collections.</p>
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
<dt><a href="#pushPayload">pushPayload(collectionName, collectionRecords)</a> ⇒ <code>Array</code> | <code>Object</code> ℗</dt>
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
<dt><a href="#_pushRequestHash">_pushRequestHash(requestObject, responseObject)</a> ⇒ <code>Object</code> ℗</dt>
<dd><p>Pushes a request and its corresponding response to the request hash store.</p>
<p>This method adds or updates a request hash in the <code>requestHashes</code> object.
It generates a unique <code>requestHashKey</code> using the <code>_generateHashId</code>
method based on the <code>requestObject</code>.</p>
<p>If a request hash with the same key already exists and the <code>responseObject</code>
is marked as <code>isNew</code>, it updates the existing hash&#39;s <code>isNew</code> flag to
<code>false</code>. Otherwise, it adds a new request hash with the given key and
<code>responseObject</code>.</p>
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
<dt><a href="#_processRequestAlias">_processRequestAlias(resourceConfig, collectionRecords)</a></dt>
<dd><p>Processes an alias for a request, adding it to the aliases store.</p>
</dd>
<dt><a href="#_processRequestOverride">_processRequestOverride(resourceConfig, requestOptions)</a></dt>
<dd><p>Processes request overrides based on the provided configuration.</p>
<p>This method modifies the <code>requestOptions</code> object to incorporate any overrides
specified in the <code>resourceConfig</code>.</p>
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

<a name="_generateHashId"></a>

## \_generateHashId([object]) ⇒ <code>string</code> ℗
Generates a hash ID based on the provided object.

This method generates a unique hash ID by stringifying the given
`object` and then calculating its MD5 hash using CryptoJS.
If no `object` is provided, it defaults to an object with an
`id` property generated using `uuidv1()`.

**Kind**: global function  
**Returns**: <code>string</code> - The generated hash ID.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [object] | <code>Object</code> | <code>{ id: uuidv1() }</code> | The object to generate                                            the hash ID from. |

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

<a name="_saveRecord"></a>

## \_saveRecord(currentRecord, [collectionConfig]) ⇒ <code>Promise</code> ℗
Saves a record to the server.

This method saves the `currentRecord` to the server by making an API
request. It determines whether to use a PUT (update) or POST (create)
request based on the validity of the record's `id`. The `collectionConfig`
parameter can be used to provide additional configuration for the
request.

**Kind**: global function  
**Returns**: <code>Promise</code> - A Promise that resolves when the save is successful
                   or rejects with an error.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| currentRecord | <code>Object</code> |  | The record to be saved. |
| [collectionConfig] | <code>Object</code> | <code>{}</code> | Optional configuration for the                                        save request. |

<a name="_deleteRecord"></a>

## \_deleteRecord(currentRecord, [collectionConfig]) ⇒ <code>Promise</code> ℗
Deletes a record from the server.

This method deletes the `currentRecord` from the server by making
a DELETE API request. The `collectionConfig` parameter can be used
to provide additional configuration for the request.

**Kind**: global function  
**Returns**: <code>Promise</code> - A Promise that resolves when the deletion is
                   successful or rejects with an error.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| currentRecord | <code>Object</code> |  | The record to be deleted. |
| [collectionConfig] | <code>Object</code> | <code>{}</code> | Optional configuration for the                                        delete request. |

<a name="_reloadRecord"></a>

## \_reloadRecord(currentRecord) ⇒ <code>Promise</code> ℗
Reloads a record from the server.

This method reloads the `currentRecord` from the server by making
a GET API request. It fetches the latest data for the record and
updates the local copy.

**Kind**: global function  
**Returns**: <code>Promise</code> - A Promise that resolves with the updated record
                   or rejects with an error.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| currentRecord | <code>Object</code> | The record to be reloaded. |

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

This method adds predefined action methods to a `collectionRecord`.
These methods provide convenient ways to interact with the record,
such as getting and setting properties, saving, deleting, reloading,
and retrieving related collections.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| collectionRecord | <code>Object</code> | The collection record to inject                                   actions into. |

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

## pushPayload(collectionName, collectionRecords) ⇒ <code>Array</code> \| <code>Object</code> ℗
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

<a name="_pushRequestHash"></a>

## \_pushRequestHash(requestObject, responseObject) ⇒ <code>Object</code> ℗
Pushes a request and its corresponding response to the request hash store.

This method adds or updates a request hash in the `requestHashes` object.
It generates a unique `requestHashKey` using the `_generateHashId`
method based on the `requestObject`.

If a request hash with the same key already exists and the `responseObject`
is marked as `isNew`, it updates the existing hash's `isNew` flag to
`false`. Otherwise, it adds a new request hash with the given key and
`responseObject`.

**Kind**: global function  
**Returns**: <code>Object</code> - The updated or created request hash object.  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| requestObject | <code>Object</code> | The request object used to generate the                                 hash key. |
| responseObject | <code>Object</code> | The response object associated with                                  the request. |

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
| [requestConfig.resourceConfig] | <code>Object</code> | Optional configuration overrides for the request (e.g., alias, autoResolve, skip). |

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

## \_processRequestAlias(resourceConfig, collectionRecords)
Processes an alias for a request, adding it to the aliases store.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resourceConfig | <code>Object</code> | The configuration object for the resource request, containing the alias information. |
| collectionRecords | <code>Array</code> \| <code>Object</code> | The records to be aliased. Can be an array or an object. |

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

