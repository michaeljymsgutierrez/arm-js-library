# Overview

ARM (API Resource Manager) is a JavaScript library designed to manage API resources efficiently, leveraging axios for HTTP requests, lodash for utility functions, mobx for state management, and uuid and crypto-js for unique identifiers and hashing.

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
    ARM.setHost('https://www.api.com')
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

#### Fetch functions
