<p align="center" style="margin-bottom:10px;">
  <a href="https://www.npmjs.com/package/arm-js-library">
    <img src="https://assets-omega-neon.vercel.app/images/arm-js-title-logo.png" alt="arm-js-logo" height="200" width="143.7" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/michaeljymsgutierrez/arm-js-library/actions/workflows/ci-cd.yml">
    <img src="https://github.com/michaeljymsgutierrez/arm-js-library/actions/workflows/ci-cd.yml/badge.svg" alt="cicd-badge-logo" />
  </a>
  <a href="https://www.npmjs.com/package/arm-js-library">
    <img src="https://img.shields.io/badge/npm_version-2.9.2-blue" alt="npm-badge-logo" />
  </a>
  <a href="https://github.com/michaeljymsgutierrez/arm-js-library?tab=MIT-1-ov-file">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="license-badge-logo" />
  </a>
</p>

## Table of Contents

- [Overview](#overview)
  - [Core Functionalities](#core-functionalities)
  - [Key Features](#key-features)
  - [Benefits](#benefits)
- [Quick Reference](#quick-reference)
- [Basic Usage](#basic-usage)
- [Installation](#installation)
- [Dependency Packages](#dependency-packages)
- [Initialization and Configuration](#initialization-and-configuration)
  - [Initialization](#initialization)
  - [Configuration](#configuration)
- [Utilization](#utilization)
  - [Request Functions from Server](#request-functions-from-server)
  - [Passed Arguments](#passed-arguments)
  - [Returned Object](#returned-object)
  - [Retrieve Functions from Collections](#retrieve-functions-from-collections)
  - [Create Collection Record Function](#create-collection-record-function)
  - [Remove Collection Record Functions](#remove-collection-record-functions)
  - [Push Collection Record Function](#push-collection-record-function)
- [Collection Records](#collection-records)
  - [State Properties](#state-properties)
  - [Getter and Setter Functions](#getter-and-setter-functions)
  - [Request and Retrieve Functions](#request-and-retrieve-functions)
- [Root Scope Functions](#root-scope-functions)
- [Utility Functions](#utility-functions)
  - [Data Retrieval and Manipulation](#data-retrieval-and-manipulation)
  - [Data Validation and Comparison](#data-validation-and-comparison)
- [Credits](#credits)
- [License](#license)
- [Contributing](#contributing)

## Overview

**ARM (API Resource Manager)** is a JavaScript library designed to centralize data management and simplify interactions with APIs. By providing a structured approach to handling and storing fetched data, ARM promotes efficient and flexible data usage throughout your application.

### Core Functionalities

- **Centralized Data Storage:** Organizes fetched data into easily accessible collections, acting as a single source of truth for your application's data.
- **API Interactions:** Manages API requests and responses, providing methods for common HTTP operations (GET, POST, PUT, DELETE).
- **Caching:** Optimizes performance by caching frequently accessed data, reducing API calls and improving response times.
- **Request Management:** Tracks ongoing requests to prevent redundancy and manages their state.
- **Utility Functions:** Offers helper functions for data manipulation, filtering, sorting, and other common operations.
- **Root Scope:** An object that can be used to store and manage global state.

### Key Features

- **Collections:** Stores fetched data in collections for efficient retrieval and management.
- **Record Management:** Provides methods to create, update, delete, and retrieve individual records within collections.
- **Reactive Data:** Employs observable patterns (through MobX) to enable real-time updates and dependency tracking.
- **Asynchronous Operations:** Handles API interactions asynchronously using Promises for non-blocking operations.
- **Error Handling:** Manages errors gracefully and provides informative feedback.
- **Configurability:** Allows customization of API endpoints, headers, and request behavior.
- **Extensibility:** Can be integrated with other libraries and frameworks to fit various application architectures.

### Benefits

- **Centralized Data Access:** Provides a single source of truth for application data, ensuring consistency and reducing data duplication.
- **Improved Performance:** Caching and optimized request management enhance application speed.
- **Enhanced Developer Experience:** Simplifies data management and reduces boilerplate code.
- **Flexibility:** Can be used across different components and parts of an application.
- **Maintainability:** Promotes code organization and reduces potential inconsistencies.

By centralizing data management and offering flexible access to it, ARM empowers developers to build more efficient, scalable, and maintainable applications.

## Quick Reference

| Method | Description |
| --- | --- |
| `query(resource, params, config)` | Fetch multiple records from server |
| `queryRecord(resource, params, config)` | Fetch a single record from server |
| `findAll(resource, config)` | Fetch all records from server |
| `findRecord(resource, id, params, config)` | Fetch a single record by ID from server |
| `peekAll(collectionName)` | Read all records from local collection |
| `peekRecord(collectionName, id)` | Read a single record from local collection |
| `getCollection(collectionName)` | Get all records in a collection |
| `getAlias(aliasName, fallbackRecords)` | Get records stored under an alias |
| `getRequestAlias(aliasName)` | Get the request hash object for an alias |
| `createRecord(collectionName, record, randomId)` | Create a new local record |
| `pushPayload(collectionName, records)` | Push raw records into a collection |
| `unloadRecord(record)` | Remove a record from local collection |
| `clearCollection(collectionName)` | Clear all records from a collection |
| `setHost(host)` | Set the API base host URL |
| `setNamespace(namespace)` | Set the API namespace |
| `setHeadersCommon(key, value)` | Set a common request header |
| `setPayloadIncludeReference(key)` | Set the included payload reference key |
| `setGlobal()` | Attach ARM instance to `window.ARM` |
| `setRootScope(property, value)` | Set a global state value |
| `getRootScope(property)` | Get a global state value |
| `ajax(config)` | Make a raw Axios request with ARM config |

## Basic Usage

```javascript
// Example usage in ReactJS/NextJS
import { observer } from 'mobx-react'
import { ARM } from '@/components/providers/arm-config-provider'

const App = observer(() => {
  // GET /addresses/2519858?include=user
  const {
    isLoading,
    isError,
    data: address,
  } = ARM.findRecord(
    'addresses',
    2519858,
    { include: 'user' },
    { alias: 'customerAddress' },
  )

  return (
    <div className="App">
      {isLoading && <span>Loading...</span>}
      {!isLoading && (
        <div className="form">
          <label>Address1 </label>
          <input
            value={address.get('attributes.address1')}
            onChange={(event) =>
              address.set('attributes.address1', event.target.value)
            }
          />
          &nbsp;
          <button
            onClick={() => {
              address
                .save()
                .then((result) => console.log(result))
                .catch((error) => console.log(error))
            }}>
            {address.get('isLoading') ? 'Saving' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
})

export default App
```

## Installation

```
npm install arm-js-library --save
```

## Dependency Packages

```
npm install mobx-react --save
```

## Initialization and Configuration

### Initialization

1. Create an `arm-config-provider` component to hold the ARM instance.<br/>
   See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/apps/create-next-app/src/components/providers/arm-config-provider/index.jsx)

   ```javascript
   'use client' // Omit this line if you are not using NextJS

   import ApiResourceManager from 'arm-js-library'

   const COLLECTIONS = ['addresses', 'users']

   export const ARM = new ApiResourceManager(COLLECTIONS)

   const ARMConfigProvider = ({ children }) => {
     return <>{children}</>
   }

   export default ARMConfigProvider
   ```

2. Use the `arm-config-provider` component in your application.<br/>
   For **NextJS** projects, wrap it in a centralized client component (`application-providers`) to prevent SSR-related errors.<br/>
   See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/apps/create-next-app/src/components/providers/application-providers/index.jsx)

   ```javascript
   'use client'

   import dynamic from 'next/dynamic'

   const ARMConfigProvider = dynamic(
     () => import('@/components/providers/arm-config-provider'),
     { ssr: false },
   )

   const ApplicationProviders = ({ children }) => {
     return (
       <>
         <ARMConfigProvider>{children}</ARMConfigProvider>
       </>
     )
   }

   export default ApplicationProviders
   ```

   Wrap the root layout `src/app/layout.jsx` with the `application-providers` component.<br/>
   See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/apps/create-next-app/src/app/layout.js)

   ```javascript
   import ApplicationProviders from '@/components/providers/application-providers'

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body className="antialiased">
           {/* Wrap your application with application-providers component */}
           <ApplicationProviders>{children}</ApplicationProviders>
         </body>
       </html>
     )
   }
   ```

   For **non-NextJS** projects, wrap the root app `src/index.js` directly with `arm-config-provider`.

   ```javascript
   import ARMConfigProvider from '@/components/providers/arm-config-provider'
   import ReactDOM from 'react-dom/client'
   import App from './App'

   const root = ReactDOM.createRoot(document.getElementById('root'))

   root.render(
     <ARMConfigProvider>
       <App />
     </ARMConfigProvider>
   )
   ```

### Configuration

Configure the ARM instance from wherever it is stored before using it in your application.

**Required configurations**

- **setHost(value)**
  - Set the API endpoint host URL.
  - By default, host is set to `window.location.origin`.
  ```javascript
  ARM.setHost('https://www.test-demo.com')
  ```

- **setHeadersCommon(key, value)**
  - Set common request headers required for API calls.
  ```javascript
  ARM.setHeadersCommon('Authorization', `${token}`)
  ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
  ARM.setHeadersCommon('X-Client-Platform', 'Web')
  ```

- **setNamespace(value)**
  - Set the API endpoint namespace.
  - By default, namespace is set to `'api/v1'`.
  ```javascript
  ARM.setNamespace('api/v1')
  ```

**Optional configurations**

- **setGlobal()**
  - Attaches the ARM instance to the global browser `window` object as `window.ARM`.
  ```javascript
  ARM.setGlobal()
  ```

- **setPayloadIncludeReference(value)**
  - Set the reference key used to map `included` payload data to their collections.
  ```javascript
  // Example payload:
  //  {
  //    data: [...],
  //    included: [ { id: 1, type: 'addresses' } ]
  //    meta: {...}
  //  }
  ARM.setPayloadIncludeReference('type')
  ```

## Utilization

Import the stored ARM instance from `arm-config-provider` to use ARM features.

```javascript
import { ARM } from '@/components/providers/arm-config-provider'
```

### Request Functions from Server

- **query(resource, params, config)**
  - Fetch multiple records from the server.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/query)
  - `params` - **required** | `config` - **optional**
  ```javascript
  ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    {
      alias: 'customerAddresses',
    },
  )
  ```

- **queryRecord(resource, params, config)**
  - Fetch a single record from the server.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/query-record)
  - `params` - **optional** | `config` - **optional**
  ```javascript
  ARM.queryRecord(
    'addresses',
    {
      id: 2519858,
      sort: '-id',
      include: 'user',
    },
    { alias: 'customerAddress' },
  )
  ```

- **findAll(resource, config)**
  - Fetch all records from the server.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/find-all)
  - `config` - **optional**
  ```javascript
  ARM.findAll('addresses', {
    alias: 'customerAddresses',
  })
  ```

- **findRecord(resource, id, params, config)**
  - Fetch a single record by ID from the server.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/find-record)
  - `id` - **required** | `params` - **optional** | `config` - **optional**
  ```javascript
  ARM.findRecord(
    'addresses',
    2519858,
    { include: 'user' },
    {
      alias: 'customerAddress',
    },
  )
  ```

### Passed Arguments

See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/passed-arguments)

```javascript
// Example: https://www.test-demo.com/api/v1/addresses/1?include=user
ARM.findRecord(
  'addresses',
  2519858,
  {
    include: 'user',
  },
  {
    skip: true,
    alias: 'customerAddress',
  },
)
```

- **resource - String**
  - `https://www.test-demo.com/api/v1/` **addresses** `/2519858?include=user`
  - Endpoint resource name. Also serves as the collection name defined during ARM initialization.

- **id - Number | String**
  - `https://www.test-demo.com/api/v1/addresses/` **2519858** `?include=user`
  - Endpoint ID parameter. Accepts both numeric and string IDs.

- **params - Object**
  - `https://www.test-demo.com/api/v1/addresses/2519858?` **include=user**
  - Endpoint query string parameters.

- **config - Object**
  - Contains request configuration options: `skip`, `alias`, `autoResolve`, `ignorePayload`, `override`.

  ```javascript
  {
    // Serve as a request go-signal. Useful when Request B depends on Request A.
    skip: true,

    // A human-readable identifier for the records returned from the server.
    // Can be accessed anywhere via ARM.getAlias('customerAddress').
    alias: 'customerAddress',

    // Controls whether the request function returns:
    //   false - a Promise (manual resolve, gives access to raw response)
    //   true  - Observable/Reactive data (auto-resolves, default behavior)
    // Note: only available on query, queryRecord, findAll, findRecord.
    autoResolve: false,

    // List of payload keys to omit from the request body.
    ignorePayload: ['attributes.address2', 'attributes.address1'],

    // Override the default Axios request configuration.
    // Supports host, namespace, path, and headers.
    // Before: https://www.test-demo.com/api/v1/users/1
    // After:  https://www.another-test-demo.com/api/v2/update-users/1
    override: {
      host: 'https://www.another-test-demo.com',
      namespace: 'api/v2',
      path: `update-users/${user.get('id')}`,
      headers: {
        'X-Client-Platform': 'Symbian',
      }
    }
  }
  ```

### Returned Object

See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/returned-object)

```javascript
// All properties are observable and update automatically when the request completes.
{
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  error: null,
  included: [],
  meta: {},
  reload: function
}
```

- **isLoading - Boolean**
  - Current loading state of the request.
  - Starts as `true` when the request is initiated, resets to `false` when complete.

- **isError - Boolean**
  - Current error state of the request.
  - Set to `true` if the request encounters an error, `false` otherwise.

- **isNew - Boolean**
  - Indicates whether this is the first time the request has been made.
  - Starts as `true`. Set to `false` on subsequent calls since ARM caches and deduplicates requests by default. Use `skip` in the config to force a re-fetch.

- **data - Array | Object**
  - Contains the response payload. Defaults to an empty array or object depending on the request function used.

- **error - Object | String**
  - Contains the error returned by the request. Defaults to `null`.

- **included - Array**
  - Contains the `included` property from the response payload (JSON API).

- **meta - Object**
  - Contains the `meta` property from the response payload (JSON API).

- **reload - Function**
  - Re-executes the original request and automatically updates the request hash and relevant collections.

### Retrieve Functions from Collections

- **peekAll(collectionName)**
  - Read all records from a local collection without triggering an API request.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/peek-all)
  ```javascript
  ARM.peekAll('addresses')
  ```

- **peekRecord(collectionName, collectionRecordId)**
  - Read a single record from a local collection without triggering an API request.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/peek-record)
  ```javascript
  ARM.peekRecord('addresses', 2519858)
  ```

- **getCollection(collectionName)**
  - Retrieve all records currently stored in a collection.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/get-collection)
  ```javascript
  ARM.getCollection('addresses')
  ```

- **getAlias(aliasName, fallbackRecords)**
  - Retrieve records stored under an alias from a previous request.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/get-alias)
  - `fallbackRecords` - **optional**
  ```javascript
  const addresses = ARM.getAlias('customerAddresses', [])

  ARM.findAll('addresses', { alias: 'customerAddresses' })

  <ul>
    {addresses.map((address, index) => (
      <li key={index}>{address.get('id')}</li>
    ))}
  </ul>
  ```

- **getRequestAlias(aliasName)**
  - Retrieve the full [returned object](#returned-object) (including `isLoading`, `data`, `meta`, etc.) for a previously aliased request.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/get-request-alias/)
  ```javascript
  const addresses = ARM.getRequestAlias('customerAddresses')

  ARM.findAll('addresses', { alias: 'customerAddresses' })

  <ul>
    {addresses.data.map((address, index) => (
      <li key={index}>{address.get('id')}</li>
    ))}
  </ul>
  ```

### Create Collection Record Function

- **createRecord(collectionName, collectionRecord, collectionRecordRandomId)**
  - Create a new record in a local collection.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/create-collection-record-function/create-record)
  - `collectionRecord` defaults to `{}` - **optional** | `collectionRecordRandomId` defaults to `true` - **optional**
  ```javascript
  // Usage #1 - set attributes after creation
  const newAddress = ARM.createRecord('addresses')
  newAddress.set('attributes.kind', 'school')
  newAddress.set('attributes.label', 'My school')

  // Usage #2 - pass initial attributes
  const newAddress = ARM.createRecord('addresses', {
    attributes: { kind: 'school', label: 'My school' },
  })

  // Persist the record to the server via POST /addresses
  newAddress.save()
  ```

### Remove Collection Record Functions

- **unloadRecord(collectionRecord)**
  - Remove a record from the local collection without deleting it from the server.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/remove-collection-records-functions/unload-record)
  ```javascript
  const address = ARM.peekRecord('addresses', 2519858)

  // Removes the record locally only - does not call the server.
  ARM.unloadRecord(address)
  ```

- **clearCollection(collectionName)**
  - Remove all records from a collection and unload them from any related aliases and request hashes.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/remove-collection-records-functions/clear-collection)
  ```javascript
  ARM.clearCollection('addresses')
  ```

### Push Collection Record Function

- **pushPayload(collectionName, collectionRecords)**
  - Push raw records directly into a collection. Useful when fetching data outside of ARM's standard request functions.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/push-collection-record-function/push-payload)
  ```javascript
  ARM.ajax({
    method: 'get',
    url: 'addresses/12345',
  }).then((results) => {
    // Adds or updates records in the collection.
    ARM.pushPayload('addresses', results.data.data)
  })
  ```

## Collection Records

Collection records are the individual objects stored inside ARM collections. Each record is automatically decorated with state properties, getter/setter functions, and request functions when it enters a collection.

```javascript
// Example record shape returned from the API
{
  "id": 2519858,
  "type": "addresses",
  "attributes": {
    "address1": "Test Address 1",
    "address2": "171872.9.2222",
    "kind": "office",
    "label": "Anabu Hills",
    "latitude": "14.394261",
    "longitude": "120.940783"
  }
}
```

### State Properties

See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/state-properties)

- **isLoading - Boolean**
  - Current loading state of the record. Defaults to `false`.
  - Set to `true` when `save`, `reload`, or `destroyRecord` is initiated; reset to `false` when complete.
  ```javascript
  address.get('isLoading')
  ```

- **isError - Boolean**
  - Current error state of the record. Defaults to `false`.
  - Set to `true` if `save`, `reload`, or `destroyRecord` receives an error.
  ```javascript
  address.get('isError')
  ```

- **isPristine - Boolean**
  - Indicates whether the record has unsaved local changes. Defaults to `true`.
  - Set to `false` when the record is modified; restored to `true` after a successful save or rollback.
  ```javascript
  address.get('isPristine')
  ```

- **isDirty - Boolean**
  - The inverse of `isPristine`. Defaults to `false`.
  - Set to `true` when the record has unsaved local changes.
  ```javascript
  address.get('isDirty')
  ```

### Getter and Setter Functions

See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/getter-setter-functions)

- **get(key)**
  - Read a single property from the record using dot-notation.
  ```javascript
  address.get('id')                  // Returns 2519858
  address.get('attributes.label')    // Returns 'Anabu Hills'
  ```

- **set(key, value)**
  - Set a single property on the record. Updates `isDirty` and `isPristine` flags automatically.
  ```javascript
  address.get('attributes.kind')             // Returns 'office'
  address.set('attributes.kind', 'school')
  address.get('attributes.kind')             // Returns 'school'
  ```

- **setProperties(values)**
  - Set multiple properties on the record at once.
  ```javascript
  address.setProperties({
    attributes: { kind: 'school', label: 'My School' },
  })

  address.get('attributes.kind')    // Returns 'school'
  address.get('attributes.label')   // Returns 'My School'
  ```

### Request and Retrieve Functions

- **save(collectionConfig)**
  - Persist record changes to the server.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/request-retrieve-functions/save)
  - Calls `POST /addresses` for new records, `PUT /addresses/2519858` for existing ones.
  - `collectionConfig` - **optional** | supports `skip`, `alias`, `autoResolve`, `ignorePayload`, `override`
  ```javascript
  address.save()

  // With config
  address.save({ ignorePayload: ['attributes.address2'] })
  ```

- **reload()**
  - Re-fetch the record from the server and update the local copy.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/request-retrieve-functions/reload)
  - Calls `GET /addresses/2519858`.
  - `collectionConfig` - **optional** | supports `skip`, `alias`, `autoResolve`, `ignorePayload`, `override`
  ```javascript
  address.reload()

  // With config
  address.reload({
    override: {
      namespace: 'api/v2',
    },
  })
  ```

- **rollbackAttributes()**
  - Revert the record's attributes to their last saved state without making an API request.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/request-retrieve-functions/rollback-attributes)
  ```javascript
  address.rollbackAttributes()
  ```

- **destroyRecord(collectionConfig)**
  - Permanently delete the record from the server and remove it from the local collection.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/request-retrieve-functions/destroy-record)
  - Calls `DELETE /addresses/2519858`.
  - `collectionConfig` - **optional** | supports `skip`, `alias`, `autoResolve`, `ignorePayload`, `override`
  ```javascript
  address.destroyRecord()

  // With config
  address.destroyRecord({
    override: {
      host: 'https://ww7.test-demo.com',
      namespace: 'api/v2',
      path: `destroy-addresses/${address.get('id')}`,
    },
  })
  ```

- **getCollection(collectionName, collectionConfig)**
  - Retrieve related records from another collection based on relationship data on the current record.
  - See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/request-retrieve-functions/get-collection)
  - When `async: true`, fetches missing records from the server automatically.
  - When `async: false`, returns only records already present in the local collection.

  | Option | Type | Description |
  | --- | --- | --- |
  | `referenceKey` | String | Dot-notation path to the relationship data on the record |
  | `async` | Boolean | Whether to fetch missing related records from the server |
  | `filterBy` | Object | Filter the returned records by property values |
  | `sortBy` | Array | Sort criteria in `'property:direction'` format |
  | `override` | Object | Override the default request config (host, namespace, path, headers) |

  ```javascript
  const { isLoading, data: user } = ARM.findRecord(
    'users',
    12980860,
    {},
    { alias: 'currentUser' },
  )

  {
    !isLoading && (
      <ul>
        {user
          .getCollection('addresses', {
            referenceKey: 'relationships.addresses.data',
            async: true,
            sortBy: ['id:desc'],
            filterBy: {
              attributes: {
                label: 'Test',
              },
            },
            override: {
              namespace: 'api/v2',
            },
          })
          .map((address, index) => (
            <li key={index}>{address.get('id')}</li>
          ))}
      </ul>
    )
  }
  ```

## Root Scope Functions

The root scope is a globally accessible object for storing and sharing state across your application.

- **setRootScope(rootScopeProperty, rootScopeValue)**
  - Set a value on the root scope.
  ```javascript
  ARM.setRootScope('fullName', 'John Doe')
  ```

- **getRootScope(rootScopeProperty)**
  - Retrieve a value from the root scope.
  ```javascript
  ARM.getRootScope('fullName')  // Returns 'John Doe'
  ```

## Utility Functions

A collection of utility functions built on Lodash for common data manipulation and validation tasks.

### Data Retrieval and Manipulation

```javascript
// Sample data used in examples below
const addresses = [
  {
    id: 1,
    attributes: { kind: 'office', label: 'My Office' },
  },
  {
    id: 2,
    attributes: { kind: 'school', label: 'My School' },
  },
  {
    id: 3,
    attributes: { kind: 'school', label: "My Brother's School" },
  },
]
```

- **findBy(objects, findProperties)**
  - Returns the first element matching the given properties.
  ```javascript
  ARM.findBy(addresses, { id: 1 })
  // Returns the record with id 1
  ```

- **findIndexBy(objects, findIndexProperties)**
  - Returns the index of the first element matching the given properties.
  ```javascript
  ARM.findIndexBy(addresses, { attributes: { kind: 'office' } })
  // Returns 0
  ```

- **filterBy(objects, filterProperties)**
  - Returns all elements matching the given properties.
  ```javascript
  ARM.filterBy(addresses, { attributes: { kind: 'school' } })
  // Returns records with ids 2 and 3
  ```

- **uniqBy(objects, uniqByProperty)**
  - Returns a new array with duplicates removed based on a specific property.
  ```javascript
  ARM.uniqBy(addresses, 'attributes.kind')
  // Returns records with ids 1 and 2
  ```

- **uniq(values)**
  - Returns a new array with duplicate primitive values removed.
  ```javascript
  ARM.uniq([1, 2, 2, 3, 3, 3])
  // Returns [1, 2, 3]
  ```

- **groupBy(objects, groupByProperty)**
  - Groups objects into arrays keyed by the specified property.
  ```javascript
  ARM.groupBy(addresses, 'attributes.kind')
  // Returns { office: [{ id: 1 }], school: [{ id: 2 }, { id: 3 }] }
  ```

- **mapBy(objects, mapByProperty)**
  - Returns a new array containing only the specified property from each object.
  ```javascript
  ARM.mapBy(addresses, 'attributes.kind')
  // Returns ['office', 'school', 'school']
  ```

- **firstObject(objects)**
  - Returns the first element of the array, or `undefined` if empty.
  ```javascript
  ARM.firstObject(addresses)
  // Returns the record with id 1
  ```

- **lastObject(objects)**
  - Returns the last element of the array, or `undefined` if empty.
  ```javascript
  ARM.lastObject(addresses)
  // Returns the record with id 3
  ```

- **mergeObjects(objects, otherObjects)**
  - Combines two arrays into one, removing duplicate entries.
  ```javascript
  ARM.mergeObjects(addresses, otherAddresses)
  ```

- **chunkObjects(objects, chunkSize)**
  - Splits an array into smaller arrays of the specified size.
  ```javascript
  ARM.chunkObjects(addresses, 2)
  ```

- **sortBy(objects, sortProperties)**
  - Sorts an array by the specified properties and directions.
  ```javascript
  ARM.sortBy(addresses, ['id:asc'])   // Returns records ordered 1, 2, 3
  ARM.sortBy(addresses, ['id:desc'])  // Returns records ordered 3, 2, 1
  ```

- **sum(objects)**
  - Returns the sum of an array of numbers.
  ```javascript
  ARM.sum([100, 200, 300])
  // Returns 600
  ```

- **sumBy(objects, sumByProperty)**
  - Returns the sum of a specific numeric property across an array of objects.
  ```javascript
  ARM.sumBy(
    [
      { id: 1, name: 'Banana', price: 100 },
      { id: 2, name: 'Apple', price: 200 },
      { id: 3, name: 'Orange', price: 300 },
    ],
    'price',
  )
  // Returns 600
  ```

- **ajax(config)**
  - Make a raw Axios request using the ARM base configuration. Accepts all standard `axios.request` config options.
  ```javascript
  ARM.ajax({
    method: 'get',
    baseURL: 'https://other-api.test-demo.com',
    url: '/api/v1/addresses',
  })
    .then((results) => console.log(results))
    .catch((errors) => console.log(errors))
  ```

### Data Validation and Comparison

- **isEmpty(value)**
  - Returns `true` if the value is `null`, `undefined`, an empty string, empty array, or empty object.
  ```javascript
  ARM.isEmpty(value)
  ```

- **isPresent(value)**
  - Returns the opposite of `isEmpty`.
  ```javascript
  ARM.isPresent(value)
  ```

- **isEqual(value, other)**
  - Performs a deep comparison between two values.
  ```javascript
  ARM.isEqual(value, other)
  ```

- **isNumber(value)**
  - Returns `true` if the value is a number.
  ```javascript
  ARM.isNumber(value)
  ```

- **isNil(value)**
  - Returns `true` if the value is `null` or `undefined`.
  ```javascript
  ARM.isNil(value)
  ```

- **isNull(value)**
  - Returns `true` if the value is `null`.
  ```javascript
  ARM.isNull(value)
  ```

- **isGte(value, other)**
  - Returns `true` if `value` is greater than or equal to `other`.
  ```javascript
  ARM.isGte(value, other)
  ```

- **isGt(value, other)**
  - Returns `true` if `value` is greater than `other`.
  ```javascript
  ARM.isGt(value, other)
  ```

- **isLte(value, other)**
  - Returns `true` if `value` is less than or equal to `other`.
  ```javascript
  ARM.isLte(value, other)
  ```

- **isLt(value, other)**
  - Returns `true` if `value` is less than `other`.
  ```javascript
  ARM.isLt(value, other)
  ```

## Credits

- **[Axl Asuncion](https://www.facebook.com/skpcls)** - Original logo/design creator
- **[Luigi Cruz](https://github.com/luigircruz)** - Features and bugs feedback
- **[Dickson Palomeras](https://github.com/DicksonPal)** - Features and bugs feedback

## License

This project is licensed under the [MIT](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/LICENSE.md) License.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide before submitting any changes.
