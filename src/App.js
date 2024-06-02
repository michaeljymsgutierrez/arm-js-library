import './App.css'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ApiResourceManager from './api-resource-manager'

export const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHost('https://www.metromart.com')
ARM.setHeadersCommon(
  'Authorization',
  `Token ${window.localStorage.getItem('token')}`
)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

const App = observer(() => {
  const customerAddresses = ARM.getAlias('customerAddresses', [])
  const addresses = ARM.getCollection('addresses', [])

  useEffect(() => {
    ARM.query(
      'addresses',
      {
        sort: '-id',
        include: 'user',
      },
      { alias: 'customerAddresses' }
    )
  }, [])

  return (
    <div className="App">
      <h3>Customer Addresses From Alias</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>ADDRESS1</th>
          <th>ADDRESS2</th>
          <th>KIND</th>
          <th>ACTION</th>
        </tr>

        {customerAddresses.map((customerAddress, index) => (
          <tr key={index}>
            <td>{customerAddress.get('id')}</td>
            <td>{customerAddress.get('attributes.address1')}</td>
            <td>{customerAddress.get('attributes.address2')}</td>
            <td>{customerAddress.get('attributes.kind')}</td>
            <td>
              <button onClick={() => customerAddress.save()}>
                Save Record
              </button>
              <button>Delete Record</button>
              <button
                onClick={() => {
                  ARM.unloadRecord(customerAddress)
                }}
              >
                Unload Record
              </button>
            </td>
          </tr>
        ))}
      </table>

      <hr />

      <h3>Customer Addresses From Collection</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>ADDRESS1</th>
          <th>ADDRESS2</th>
          <th>KIND</th>
          <th>ACTION</th>
        </tr>

        {addresses.map((address, index) => (
          <tr key={index}>
            <td>{address.get('id')}</td>
            <td>{address.get('attributes.address1')}</td>
            <td>{address.get('attributes.address2')}</td>
            <td>{address.get('attributes.kind')}</td>
            <td>
              <button onClick={() => address.save()}>Save Record</button>
              <button onClick={() => address.destroyRecord()}>
                Delete Record
              </button>
              <button
                onClick={() => {
                  ARM.unloadRecord(address)
                }}
              >
                Unload Record
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
})

export default App
