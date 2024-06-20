# ARM JavaScript Library v1.0.0

ARM (API Resource Manager) is a JavaScript library designed to manage API resources efficiently, leveraging axios for HTTP requests, lodash for utility functions, mobx for state management, and uuid and crypto-js for unique identifiers and hashing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Setting Configurations](#setting-configurations)
  - [Managing Collections](#managing-collections)
  - [Request Handling](#request-handling)
- [API](#api)
  - [Initialization Methods](#initialization-methods)
  - [Collection Methods](#collection-methods)
  - [Request Methods](#request-methods)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install arm-js-library
```

## Usage

### Initialization

To use ARM, initialize it with an optional list of collections.

```javascript
import ApiResourceManager from 'arm-js-library';

const collections = ['users', 'posts'];
const arm = new ApiResourceManager(collections);
```

### Setting Configurations

You can configure the ARM instance to set the host, namespace, headers, and more.

```javascript
arm.setHost('https://api.example.com');
arm.setNamespace('v2');
arm.setHeadersCommon('Authorization', 'Bearer your-token');
arm.setPayloadIncludeReference('type');
```

### Managing Collections

#### Adding a Collection

```javascript
arm.createRecord('users', { name: 'John Doe' });
```

#### Accessing a Collection

```javascript
const users = arm.getCollection('users');
```

#### Clearing a Collection

```javascript
arm.clearCollection('users');
```

#### Aliasing Data

```javascript
arm.setAlias('current_user', { id: 1, name: 'John Doe' });
const currentUser = arm.getAlias('current_user');
```

### Request Handling

#### Querying Data

```javascript
arm.query('users', { active: true });
```

#### Querying a Single Record

```javascript
arm.queryRecord('users', { id: 1 });
```

#### Finding All Records

```javascript
arm.findAll('users');
```

## API

### Initialization Methods

- `constructor(collections = [])`: Initializes the ARM with the specified collections.
- `setHost(host)`: Sets the host for API requests.
- `setNamespace(namespace)`: Sets the namespace for API requests.
- `setHeadersCommon(key, value)`: Sets common headers for API requests.
- `setPayloadIncludeReference(key)`: Sets the reference key for included payloads.
- `setGlobal()`: Sets the ARM instance to a global window variable.

### Collection Methods

- `getCollection(collectionName)`: Retrieves the specified collection.
- `clearCollection(collectionName)`: Clears the specified collection.
- `createRecord(collectionName, collectionRecord = {})`: Creates a new record in the specified collection.
- `getAlias(aliasName, fallbackRecords)`: Retrieves an alias or fallback records.
- `setAlias(aliasName, aliasRecords)`: Sets an alias for the specified records.

### Request Methods

- `query(resource, params = {}, config = {})`: Queries a collection with the specified parameters.
- `queryRecord(resource, params = {}, config = {})`: Queries a single record with the specified parameters.
- `findAll(resource, config = {})`: Retrieves all records from the specified resource.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
