# Overview

ARM (API Resource Manager) is a JavaScript library designed to manage API resources efficiently, leveraging axios for HTTP requests, lodash for utility functions, mobx for state management, and uuid and crypto-js for unique identifiers and hashing.

## Basic Usage


## Installation
```
npm install arm-js-library --save
```
## Initialization and Configuration 

#### Initialization

Somewhere on your application init, create and store new ARM instance.<br/>
Example: If you're using `React` app, store it on `src/index.js`

```javascript
// Create a new instance of ARM
import ApiResourceManager from 'arm-js-library'

// Create an array of collections to initialize
const collections = ['addresses', 'users']

// Export new instance of ARM for later utilization
export const ARM = new ApiResourceManager(collections)
```

#### Configuration

Configure stored ARM instance to be able to use on your application.

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
To be able to use ARM features. You have to import the stored ARM instance from the init file of the application.
```javascript
// ARM instance is stored on /src/index.js
import { ARM } from 'path-to-src/index.js'
```

#### Request functions from server
---

* **query(resource, params, config)**
    * Querying multiple records from the server.
    * Support query params. - **required**
    * Support config. - **optional**
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
    * Support config. - **optional**
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
    * Support config. - **optional**
    ```javascript
    ARM.findAll('addresses', {
      alias: 'customerAddresses',
    })
    ```
* **findRecord(resource, id, params, config)**
    * Retrieving single record from the server.
    * Params ID by default. - **required**
    * Support query params. - **required**
    * Support config. - **optional**
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
        alias: 'customerAddress',
      }
    )
```
* **resource - String**
    * `https://www.test-demo.com/api/v1/` **addresses** `/1?include=user`
    * Endpoint resource name.
    * Serve as collection name defined on the collection intialization of ARM instance.
* **id - Integer**
    * `https://www.test-demo.com/api/v1/addresses/` **1**`?include=user`
    * Endpoint id parameter.
* **params - Object**
    * `https://www.test-demo.com/api/v1/addresses/1?` **include=user**
    * Endpoint query string parameters.
* **config - Object**
    * Contains request config such as `(skip, alias`) which are currently available.
    ```javascript
      {
        // Skip serve as request go signal to proceed 
        // if Request B has dependency on Request A
        skip: true,

        // Alias serve as identifier for the records obtain from the server.
        // Can be used anywhere in your application through ARM.getAlias('customerAddress')
        alias: 'customerAddress' 
      }
    ```
#### Returned Object: `Request functions from server`
---

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
* **included - Array**
    * Contains the request returned payload property **included**.
    * Specifically for **JSON API**.
* **meta - Object**
    * Contains the request returned payload property **meta**.
    * Specifically for **JSON API**.
```javascript
// Returned object data properties are observable
// It will automatically update once the request is already done
{
  isLoading: true,
  isError: false,
  isNew: true,
  data: [],
  included: [],
  meta: {},
}
```

#### Retrieve functions from collections
---

* **peekAll(collectionName)**
    * Retrieving multiple records from collection.
    ```javascript
    ARM.peekAll('addresses')
    ```
* **peekRecord(collectionName, collectionRecordId)**
    * Retrieving single record from collection.
    * Params ID by default. - **required**
    ```javascript
    ARM.peekRecord('addresses', 123456)
    ```
