# Overview

ARM (API Resource Manager) is a JavaScript library designed to manage API resources efficiently, leveraging axios for HTTP requests, lodash for utility functions, mobx for state management, and uuid and crypto-js for unique identifiers and hashing.

## Installation
```
npm install arm-js-library --save
```
## Usage

#### Initialization

Somewhere on your application create and store new ARM instance.
```javascript
// Create a new instance of ARM
import ApiResourceManager from 'arm-js-library'

// Create an array of collections to initialize
const collections = ['addresses', 'users']

// Export new instance of ARM for later utilization
export const ARM = new ApiResourceManager(collections)
