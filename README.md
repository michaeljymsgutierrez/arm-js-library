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
    <img src="https://img.shields.io/badge/npm_version-2.5.3-blue" alt="npm-badge-logo" />
  </a>
  <a href="https://github.com/michaeljymsgutierrez/arm-js-library?tab=MIT-1-ov-file">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="license-badge-logo" />
  </a>
</p>

## Table of Contents

* [Overview](#overview)
  * [Core Functionalities](#core-functionalities)
  * [Key Features](#key-features)
  * [Benefits](#benefits)
* [Basic Usage](#basic-usage)
* [Installation](#installation)
* [Dependency Packages](#dependency-packages)
  * [Initialization and Configuration](#initialization-and-configuration)
    * [Initialization](#initialization)
    * [Configuration](#configuration)
* [Utilization](#utilization)
  * [Request functions from server](#request-functions-from-server)
    * [Passed Arguments: `Request functions from server`](#passed-arguments-request-functions-from-server)
    * [Returned Object: `Request functions from server`](#returned-object-request-functions-from-server)
  * [Retrieve functions from collections](#retrieve-functions-from-collections)
  * [Create collection record function](#create-collection-record-function)
  * [Remove collection record functions](#remove-collection-record-functions)
  * [Push collection record function](#push-collection-record-function)
* [Collection Records: `Properties and Functions`](#collection-records-properties-and-functions)
* [Root Scope: `Functions`](#root-scope-functions)
* [Utility Functions](#utility-functions)
  * [Data Retrieval and Manipulation](#data-retrieval-and-manipulation)
  * [Data Validation and Comparison](#data-validation-and-comparison)

## Overview

**ARM (API Resource Manager)** is a JavaScript library designed to centralize data management and simplify interactions with APIs. By providing a structured approach to handling and storing fetched data, ARM promotes efficient and flexible data usage throughout your application.

### Core Functionalities
* **Centralized Data Storage:** Organizes fetched data into easily accessible collections, acting as a single source of truth for your application's data.
* **API Interactions:** Manages API requests and responses, providing methods for common HTTP operations (GET, POST, PUT, DELETE).
* **Caching:** Optimizes performance by caching frequently accessed data, reducing API calls and improving response times.
* **Request Management:** Tracks ongoing requests to prevent redundancy and manages their state.
* **Utility Functions:** Offers helper functions for data manipulation, filtering, sorting, and other common operations.
* **Root Scope:** An object that can be used to store and manage global state.

### Key Features
* **Collections:** Stores fetched data in collections for efficient retrieval and management.
* **Record Management:** Provides methods to create, update, delete, and retrieve individual records within collections.
* **Reactive Data:** Employs observable patterns (likely through a library like Mobx) to enable real-time updates and dependency tracking.
* **Asynchronous Operations:** Handles API interactions asynchronously using Promises for non-blocking operations.
* **Error Handling:** Manages errors gracefully and provides informative feedback.
* **Configurability:** Allows customization of API endpoints, headers, and request behavior.
* **Extensibility:** Can be integrated with other libraries and frameworks to fit various application architectures.

### Benefits
* **Centralized Data Access:** Provides a single source of truth for application data, ensuring consistency and reducing data duplication.
* **Improved Performance:** Caching and optimized request management enhance application speed.
* **Enhanced Developer Experience:** Simplifies data management and reduces boilerplate code.
* **Flexibility:** Can be used across different components and parts of an application.
* **Maintainability:** Promotes code organization and reduces potential inconsistencies.

By centralizing data management and offering flexible access to it, ARM empowers developers to build more efficient, scalable, and maintainable applications.

## Basic Usage
```javascript
// Example usage in ReactJS/NextJS
import { observer } from 'mobx-react-lite'
import { ARM } from '@/components/providers/arm-config-provider'

const App = observer(() => {
  // GET /addresses/123456?include=user  
  const { isLoading, isError, data: address } = ARM.findRecord(
    'addresses',
    123456,
    { include: 'user' },
    { alias: 'customerAddress' }
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
            }}
          >
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

#### Initialization

1. Create `arm-config-provider` component that will store the new `ARM` instance.<br/>
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
2. Use `arm-config-provider` component on your application.<br/>
    For **NextJS** project, `arm-config-provider` component should be imported to a centralized client component providers `application-providers`.<br>
    It is optional but **recommended** so that, `NextJS` will not throw an error related to `SSR`.<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/apps/create-next-app/src/components/providers/application-providers/index.jsx)
     ```javascript
     'use client'

     import dynamic from 'next/dynamic'

     const ARMConfigProvider = dynamic(
       () => import('@/components/providers/arm-config-provider'),
       { ssr: false }
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

    Wrap root layout `src/app/layout.jsx` with `application-providers` component.<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/apps/create-next-app/src/app/layout.js)
    ```javascript
    import ApplicationProviders from '@/components/providers/application-providers'

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body className='antialiased'>
            {/* Wrap your application with application-providers component */}
            <ApplicationProviders>{children}</ApplicationProviders>
          </body>
        </html>
      )
    }
    ```

   For **Non NextJS** project, you can wrap root app `src/index.js` with `arm-config-provider` component directly.
    ```javascript
    import ARMConfigProvider from '@/components/providers/arm-config-provider'
    import ReactDOM from 'react-dom/client'
    import App from './App'

    const root = ReactDOM.createRoot(document.getElementById('root'))

    root.render(

     {/* Wrap your application with arm-config-provider component */}
      <ARMConfigProvider>
        <App />
      </ARMConfigProvider>
    )
    ```
#### Configuration

Configure stored ARM instance from where you stored it, to be able to use it on your application.

**Required configurations**
* **setHost(value)**
    ```javascript
    // Set API endpoint host URL
    // By default host is set to window.location.origin
    ARM.setHost('https://www.test-demo.com')
    ```
* **setHeadersCommon(key, value)**
    ```javascript
    // Set common request headers required on calling API endpoints
    // ie. Authoization, Content-Type, etc.
    ARM.setHeadersCommon('Authorization', `${token}`)
    ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
    ARM.setHeadersCommon('X-Client-Platform', 'Web')
    ```
* **setNamespace(value)**
    ```javascript
    // Set namespace for API endpoint host URL
    // By default namespace is set to 'api/v1'
    ARM.setNamespace('api/v1')
    ```
**Optional configurations**
* **setGlobal(value)**
    ```javascript
    // Set ARM instace to global
    // This will make ARM instance available on browser window object via window.ARM
    // Example:
    //  console.log(window.ARM)
    ARM.setGlobal()
    ```
* **setPayloadIncludeReference(value)**
    ```javascript
    // Set payload included reference key
    // Payload included reference key serve as mapper to determine what collection
    // the data received belongs to
    // Example:
    //  {
    //    data: [...],
    //    included: [ { id: 1, type: 'addresses' } ]
    //  }
    ARM.setPayloadIncludeReference('type')
    ```
## Utilization
To be able to use ARM features. You have to import the stored ARM instance from `arm-config-provider` component.
```javascript
// Import ARM instance from arm-config-provider component
import { ARM } from '@/components/providers/arm-config-provider'
```

#### Request functions from server
---

* **query(resource, params, config)**
    * Querying multiple records from the server.
    * Support query params. - **required**
    * Support config. - **optional**<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/query)
    ```javascript
    ARM.query(
      'addresses',
      {
        sort: '-id',
        include: 'user',
      },
      {
        alias: 'customerAddresses',
      }
    )
    ```
* **queryRecord(resource, params, config)**
    * Querying for a single record from the server.
    * Support query params. - **required**
    * Support config. - **optional**<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/query-record)
    ```javascript
    ARM.queryRecord(
      'addresses',
      {
        id: 123456,
        sort: '-id',
        include: 'user',
      },
      { alias: 'customerAddress' }
    )
    ```
* **findAll(resource, config)**
    * Retrieving multiple records from the server.
    * Support config. - **optional**<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/find-all)
    ```javascript
    ARM.findAll('addresses', {
      alias: 'customerAddresses',
    })
    ```
* **findRecord(resource, id, params, config)**
    * Retrieving single record from the server.
    * Params ID by default. - **required**
    * Support query params. - **required**
    * Support config. - **optional**<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/find-record)
    ```javascript
    ARM.findRecord(
      'addresses',
      123456,
      { include: 'user' },
      {
        alias: 'customerAddress',
      }
    )
    ```
#### Passed Arguments: `Request functions from server`
---
```javascript
 // Example: https://www.test-demo.com/api/v1/addresses/1?include=user
 ARM.findRecord('addresses', 123456,
   { 
     include: 'user' 
   },
   {
     skip: true,
     alias: 'customerAddress',
   }
 )
```
See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/passed-arguments)<br/>
* **resource - String**
    * `https://www.test-demo.com/api/v1/` **addresses** `/1?include=user`
    * Endpoint resource name.
    * Serve as collection name defined on the collection intialization of ARM instance.
* **id - Number**
    * `https://www.test-demo.com/api/v1/addresses/` **1**`?include=user`
    * Endpoint id parameter.
* **params - Object**
    * `https://www.test-demo.com/api/v1/addresses/1?` **include=user**
    * Endpoint query string parameters.
* **config - Object**
    * Contains request config such as `(skip, alias, autoResolve, ignorePayload, override)` which are currently available.
    ```javascript
      {
        // Skip serve as request go signal to proceed 
        // if Request B has dependency on Request A
        skip: true,

        // Alias serve as identifier for the records obtain from the server.
        // Can be used anywhere in your application through ARM.getAlias('customerAddress')
        alias: 'customerAddress' ,

        // Auto resolve serve as flag if the request functions will return 
        // 1. Promise Function
        //  - To handle success and errors on manual resolve) if autoResolve is set to false
        // 2. Observable/Reactive Data
        //  - To handle success and errors on auto resolve) if autoResolve is set to true 
        // Note: autoResolve is only available on query, queryRecord, findAll, findRecord functions.
        // By default autoResolve is set to true.
        autoResolve: false,

        // Ignore payload serve as list of keys to be omitted on request payload.
        ignorePayload: ['attributes.address2', 'attributes.address1'],

        // Override serve as request override for the default configuration of axios current request.
        // Currently support host, namespace, path and headers for the meantime.
        // Example:
        // Before override: https://www.test-demo.com/api/v1/users/1
        // After override: https://www.another-test-demo.com/api/v2/update-users/1
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
#### Returned Object: `Request functions from server`
---

```javascript
// Returned object data properties are observable
// It will automatically update once the request is already done
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
See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/request-functions-from-server/returned-object)<br/>
* **isLoading - Boolean**
    * Current loading state of the request.
    * By default set to **true**.
    * Set to **true** once the request is initiated and set to **false** once request is done.
* **isError - Boolean**
    * Current error state of the request.
    * By default set to **false**.
    * Set to **true** if the request received/encountered an error and set to **false** if none.
* **isNew - Boolean**
    * Identifier if the request is newly created.
    * By default set to **true**.
    * Set to **true** if the request is already initiated once and set to **false** once it is already intiated before. 
      Request functions are built with optimization, it does not repeatedly executing API request.
      Since it is optimized, it can be **override** using **skip** from request configuration.
* **data - Array || Object**
    * Contains the request returned payload.
    * By default has value of an empty **array** or **object** depending on the request function used.
* **error - Object || String**
    * Contains the request returned error.
    * By default has value of a **null**.
* **included - Array**
    * Contains the request returned payload property **included**.
    * Specifically for **JSON API**.
* **meta - Object**
    * Contains the request returned payload property **meta**.
    * Specifically for **JSON API**.
* **reload - Function**
    * Allows for **re-execution** of a request and automatic update of the **request hash object** and relevant **collections**.

#### Retrieve functions from collections
---

* **peekAll(collectionName)**
    * Retrieving multiple records from collection.<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/peek-all)
    ```javascript
    ARM.peekAll('addresses')
    ```
* **peekRecord(collectionName, collectionRecordId)**
    * Retrieving single record from collection.
    * Params ID by default. - **required**<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/peek-record)
    ```javascript
    ARM.peekRecord('addresses', 123456)
    ```
* **getCollection(collectionName)**
    * Retrieving all records from collection.<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/get-collection)
    ```javascript
    ARM.getCollection('addresses')
    ```
* **getAlias(collectionName, collectionFallbackRecord)**
    * Retrieving records from aliased request results.
    * Support collectionFallbackRecord. - **optional**<br/>
    See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/retrieve-functions-from-collections/get-collection)
    ```javascript
    const addresses = ARM.getAlias('customerAddresses', [])

    ARM.findAll('addresses', { alias: 'customerAddresses' })

    <ul>
      {addresses.map((address, index) => (
        <li key={index}>{address.get('id')}</li>
      ))}
    </ul>
    ```
#### Create collection record function
---
* **createRecord(collectionName, collectionRecord, collectionRecordRandomId)**
    * Create new collection record.
    * By default collectionRecord params is set to empty object if omitted - **required**
    * By default collectionRecordRandomId params is set to true - **optional**
    ```javascript
    // Usage #1
    // Can ommit collectionRecord on createRecord initialization
    const newAddress = ARM.createRecord('addresses')
    newAddress.set('attributes.kind', 'school')
    newAddress.set('attributes.label', 'My school')

    // Usage #2
    // Can ommit collectionRecord on createRecord initialization
    const newAddress = ARM.createRecord('addresses', {
      attributes: { kind: 'school', label: 'My school' }
    })

    // Persist collection record to server.
    // Will call POST /addresses
    newAddress.save()
    ```
#### Remove collection record functions
---
* **unloadRecord(collectionRecord)**
    * Remove record from collection only.
    ```javascript
    // Collection record to be remove collection.
    const address = ARM.peekRecord('addresses', 123456)

    // This will remove the record from collection and will not
    // remove permanently from the server.
    ARM.unloadRecord(address)
    ```
* **clearCollection(collectionName)**
    * Clears a specified collection and unloads related records from aliases and request hashes.
    ```javascript
    ARM.clearCollection('addresses')
    ```
#### Push collection record function
---
* **pushPayload(collectionName, collectionRecords)**
    * Push raw collection record/records to respective collections.
    ```javascript
    // Retrieve raw data with barebone ajax/fetch function.
    ARM.ajax({
      method: 'get',
      url: 'addresses/12345'
    }).then(results => {
      // Will add/update collection records.
      ARM.pushPayload('addresses', results.data.data)
    })
    ```
#### Collection Records: `Properties and Functions`
---
```javascript
// Example response data from API
// See available properties, getter and  setter functions and request functions below.
{
  "id": 123456,
  "type": "addresses",
  "attributes": {
    "address1": "Test Address 1",
    "address2": "171872.5.3222",
    "kind": "office",
    "label": "Anabu Hills",
    "latitude": "14.394261",
    "longitude": "120.940783"
  }
}
```
* **State Properties**
    * **isLoading - Boolean**
        * Current loading state of the record.
        * By default set to **false**.
        * Set to **true** once request functions **(save, reload, destroyRecord)** are initiated and set to **false** once done.<br/>
        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/state-properties)
        ```javascript
        address.get('isLoading')
        ```
    * **isError - Boolean**
        * Current error state of the record.
        * By default set to **false**.
        * Set to **true** once request functions **(save, reload, destroyRecord)** received an error and set to **false** if none.<br/>
        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/state-properties)
        ```javascript
        address.get('isError')
        ```
    * **isPristine - Boolean**
        * Current pristine state of the record.
        * By default set to **true**.
        * Set to **false** if the record is modified and set to **true** once reverted.<br/>
        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/state-properties)
        ```javascript
        address.get('isPristine')
        ```
    * **isDirty - Boolean**
        * Current dirty state of the record.
        * By default set to **false**.
        * Set to **true** if the record is modified and set to **false** once reverted.<br/>
        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/state-properties)
        ```javascript
        address.get('isDirty')
        ```
* **Getter and Setter Functions**
    * **get(key)**
        * Single property getter function.
        * Passed arguments:
            * **key - String**<br/>

        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/getter-setter-functions)
        ```javascript
        // Returned value 123456
        address.get('id') 

        // Returned value 'office'
        address.get('attributes.label') 
        ```
    * **set(key, value)**
        * Single property setter function.
        * Passed arguments:
            * **key - String**
            * **value - Primitive**<br/>
        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/getter-setter-functions)
        ```javascript
        // Returned value 'office'
        address.get('attributes.kind')

        // Set property label of attributes
        address.set('attributes.kind', 'school')

        // Returned value 'office'
        address.get('attributes.kind')
        ```
    * **setProperties(value)**
        * Multiple properties setter function.
        * Passed arguments:
            * **value - Object**<br/>
        See example [here](https://github.com/michaeljymsgutierrez/arm-js-library/tree/main/apps/create-next-app/src/app/demo/collection-records/getter-setter-functions)
        ```javascript
        // Returned value 'office'
        address.get('attributes.kind')
        // Returned value 'Anabu Hills'
        address.get('attributes.label')

        // Set properties label and kind of attributes
        address.setProperties({
          attributes: { kind: 'school', label: 'My School' }
        })

        // Returned value 'school'
        address.get('attributes.kind')
        // Returned value 'My School'
        address.get('attributes.label')
        ```
* **Request Functions**
    * **save(collectionConfig)**
        * Persist collection record changes to server.
        * Create a new record to server  only if it doesn't already exist in the database.
            * Will call **POST** method: `POST /addresses`
        * Update existing record to server.
            * Will call **PUT** method: `PUT /addresses/123456`
        * Support collectionConfig. - **optional**
            * Available collectionConfig `(skip, alias, autoResolve, ignorePayload, override)`
        ```javascript
        // Returned promise
        // Without collectionConfig
        address.save()

        // With collectionConfig
        address.save({ ignorePayload: ['attributes.address2'] })
        ```
    * **reload()**
        * Refresh collection record changes from server.
            * Will call **GET** method: `GET /addresses/123456`
        * Support collectionConfig. - **optional**
            * Available collectionConfig `(skip, alias, autoResolve, ignorePayload, override)`
        ```javascript
        // Returned promise
        address.reload()

        // With collectionConfig
        address.reload({ 
           override: {
               namespace: 'api/v2',
           }
        })
        ```
    * **destroyRecord(collectionConfig)**
        * Remove collection record permanently from server.
            * Will call **GET** method: `DELETE /addresses/123456`
        * Support collectionConfig. - **optional**
            * Available collectionConfig `(skip, alias, autoResolve, ignorePayload, override)`
        ```javascript
        // Returned promise
        // Without collectionConfig
        address.destroyRecord()

        // With collectionConfig
        address.destroyRecord({
          override: {
            host: 'https://ww7.test-demo.com',
            namespace: 'api/v2',
            path: `destroy-addresses/${address.get('id')}`,
          }
        })
        ```
    * **getCollection(collectionName, collectionConfig)**
        * Retrieve records from server automatically if **async** option value is set to true **true** on **collectionConfig**.
        * Retrieve records that are already loaded on collection if **async** option value is set to **false** on **collectionConfig**.
        * Passed arguments:
            * **collectionName - String**
            * **collectionConfig - Object**                 
                * **referenceKey - String**
                    * Collection record property mapping.
                * **async - Boolean**
                    * Flag for invoking request function on resolving not yet loaded records on collection.
                * **filterBy - Object**
                    * Filter return collection records based on passed filter properties.
                * **sortBy - Array**
                    * Sort returned collection records based on passed array of sort criteria.
                * **config - Object**
                    * Contains request config such as `(skip, alias, autoResolve, ignorePayload, override)` which are currently available.
        ```javascript
        // Get user record from the server but don't preload addresses records.
        const { isLoading, data: user } = ARM.findRecord(
          'users',
          123456,
          {
            // include: 'user'
          },
          { alias: 'currentUser' }
        )

        // The getCollection function will populate records from collection
        // and server depending on passed collectionConfig.
        {!isLoading && (
          <ul>
            {user
              .getCollection('addresses', {
                referenceKey: 'relationships.addresses.data',
                async: true,
                sortBy: ['id:desc'],
                filterBy: {
                  attributes: {
                    'label': 'Test'
                  }
                },
                override: {
                  namespace: 'api/v2',
                }
              })
              .map((address, index) => (
                <li key={index}>{address.get('id')}</li>
              ))}
          </ul>
        )}
        ```

## Root Scope Functions
The root scope is an object that can be used to store and manage global state. The Root Scope Functions provide a way to manage and access it.

* **setRootScope(rootScopeProperty, rootScopeValue)**
    * Sets a value on the root scope.
    * Passed arguments:
        * **rootScopeProperty - String**
        * **rootScopeValue - Any**
    ```javascript
    // Set root scope property 'fullName' to 'John Doe'
    ARM.setRootScope('fullName', 'John Doe')
    ```

* **getRootScope(rootScopeProperty)**
    * Retrieves a value from the root scope.
    * Passed arguments:
        * **rootScopeProperty - String**
    ```javascript
    // Returns value 'John Doe'
    ARM.getRootScope('fullName')
    ```
## Utility Functions
Collection of utility functions that leverage Lodash for common data manipulation tasks.
These functions primarily focus on searching, filtering, sorting, and validating data within objects or arrays.

#### Data Retrieval and Manipulation
---
```javascript
// Example response data from API
const addresses = [
   {
     "id": 1,
     "attributes": {
       "kind": "office",
       "label": "My Office",
     }
   },
   {
     "id": 2,
     "attributes": {
       "kind": "school",
       "label": "My School",
     }
   },
   {
     "id": 3,
     "attributes": {
       "kind": "school",
       "label": "My Brother's School",
     }
   }
 ]
```
* **findBy(objects, findProperties)**
    * Finds the first element in the given array of objects that satisfies the provided find properties.
    ```javascript
    // Return record with id 1
    ARM.findBy(addresses, { id: 1 })
    ```
* **findIndexBy(objects, findIndexProperties)**
    * Returns the index of the first element in the given array of objects that satisfies the provided find properties.
    ```javascript
    // Return index number of record with id 1
    ARM.findIndexBy(addresses, {
      attributes: { kind: 'office' }
    })
    ```
* **filterBy(objects, filterProperties)**
    * Creates a new array with all elements from the given array of objects that pass the filter test implemented by the provided filter properties. 
    ```javascript
    // Returns records with ids 2 and 3
    ARM.filterBy(addresses, {
      attributes: { kind: 'school' }
    })
    ```
* **uniqBy(objects, uniqByProperty)**
    * Removes **duplicate** objects from an array based on a unique property. 
    ```javascript
    // Returns records with ids 1 and 2
    ARM.uniqBy(addresses, 'attributes.kind')
    ```
* **uniq(values)**
    * Removes **duplicate** values from an array.
    ```javascript
    // Returns array with 1,2,3
    ARM.uniq([1, 2, 2, 3, 3, 3])
    ```
* **groupBy(objects, groupByProperty)**
    * **Incorrectly** uses **uniqBy** instead of grouping objects by the specified property. 
    ```javascript
    // Returns { school: [{ id: 2 }, { id: 3 }], office: [{ id: 1 }]} 
    ARM.groupBy(addresses, 'attributes.kind')
    ```
* **mapBy(objects, mapByProperty)**
    * **Maps** an array of objects, extracting a specific property from each.
    ```javascript
    // Returns ['office', 'school', 'school']
    ARM.mapBy(addresses, 'attributes.kind')
    ```

* **firstObject(objects)**
    * Returns the **first element** from the given array of objects. If the array is empty, it returns **undefined**. 
    ```javascript
    // Return record with id 1
    ARM.firstObject(addresses)
    ```
* **lastObject(objects)**
    * Returns the **last element** from the given array of objects. If the array is empty, it returns **undefined**. 
    ```javascript
    // Return record with id 3
    ARM.lastObject(addresses)
    ```
* **mergeObjects(objects, otherObjects)**
    * Combines two arrays of objects into one, removing duplicates. 
    ```javascript
    ARM.mergeObjects(addresses, otherAddresses)
    ```
* **chunkObjects(objects, chunkSize)**
    * Splits an array of objects into smaller arrays of a given **size**. 
    ```javascript
    ARM.chunkObjects(addresses, 2)
    ```
* **sortBy(objects, sortProperties)**
    * Sorts the given array of objects by the specified sort properties. 
    ```javascript
    // Returns records order by ids 1,2,3
    ARM.sortBy(addresses, ['id:asc'])

    // Returns records order by ids 3,2,1
    ARM.sortBy(addresses, ['id:desc'])
    ```
* **ajax(config)**
    * Axios instance under the hood with default ARM config.
    * Config accepts all properties that can be passed on **axios.request** config.
    ```javascript
    // Return promise
    ARM.ajax({
      method: 'get',
      baseURL: 'https://other-api.test-demo.com',
      url: '/api/v1/addresses'
    })
    .then(results => console.log(results))
    .catch(errors => console.log(errors))
    ```
#### Data Validation and Comparison

* **isEmpty(value)**
    * Checks if a value is considered empty **(null, undefined, empty string, empty array, or empty object)**. 
    ```javascript
    // Return boolean value
    ARM.isEmpty(value)
    ```
* **isPresent(value)**
    * Returns the opposite of isEmpty. 
    ```javascript
    // Return boolean value
    ARM.isPresent(value)
    ```
* **isEqual(value, other)**
    * Performs a deep comparison between two values to determine if they are equal. 
    ```javascript
    // Return boolean value
    ARM.isEqual(value, other)
    ```
* **isNumber(value)**
    * Checks if a value is a **number**. 
    ```javascript
    // Return boolean value
    ARM.isNumber(value)
    ```
* **isNil(value)**
    * Checks if a value is **null** or **undefined**. 
    ```javascript
    // Return boolean value
    ARM.isNil(value)
    ```
* **isNull(value)**
    * Checks if a value is **null**. 
    ```javascript
    // Return boolean value
    ARM.isNull(value)
    ```
* **isGte(value, other)**
    * Checks if the first value is **greater than or equal** to the second value. 
    ```javascript
    // Return boolean value
    ARM.isGte(value, other)
    ```
* **isGt(value, other)**
    * Checks if the first value is **greater than** the second value. 
    ```javascript
    // Return boolean value
    ARM.isGt(value, other)
    ```
* **isLte(value, other)**
    * Checks if the first value is **less than or equal** to the second value. 
    ```javascript
    // Return boolean value
    ARM.isLte(value, other)
    ```
* **isLt(value, other)**
    * Checks if the first value is **less than** the second value. 
    ```javascript
    // Return boolean value
    ARM.isLt(value, other)
    ```
