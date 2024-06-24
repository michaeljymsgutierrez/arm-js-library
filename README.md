# Overview

ARM (API Resource Manager) is a JavaScript library designed to manage API resources efficiently, leveraging axios for HTTP requests, lodash for utility functions, mobx for state management, and uuid and crypto-js for unique identifiers and hashing.

## Installation
```
npm install arm-js-library --save
```
## Usage

#### Initialization

Somewhere on your application init, create and store new ARM instance.
```javascript
// Create a new instance of ARM
import ApiResourceManager from 'arm-js-library'

// Create an array of collections to initialize
const collections = ['addresses', 'users']

// Export new instance of ARM for later utilization
export const ARM = new ApiResourceManager(collections)
```

#### Configuration

**Required configurations**
```javascript
// Set API endpoint host URL
// By default host is set to window.location.origin
ARM.setHost('https://www.api.com')

// Set common request headers required on calling API endpoints
// ie. Authoization, Content-Type, etc.
ARM.setHeadersCommon('Authorization', `${token}`)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')

// Set namespace for API endpoint host URL
// By default namespace is set to 'api/v1'
ARM.setNamespace('api/v1')
```

**Optional configurations**
```javascript
// Set ARM instace to global
// This will make ARM instance available on browser window object via window.ARM
ARM.setGlobal()

// Set payload included reference key
//
ARM.setPayloadIncludeReference('type')
