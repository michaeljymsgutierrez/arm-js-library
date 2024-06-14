import './page.css'
import { observer } from 'mobx-react-lite'
import Model from './model'
import Controller from './controller'

const App = observer(() => {
  const model = Model()
  const controller = Controller(model)

  return (
    <div className="App">
      <h3>Model loading state: {JSON.stringify(model.isLoading)}</h3>
      <h3>Model error state: {JSON.stringify(model.isError)}</h3>

      <h3>[ALIAS]: Customer Addresses</h3>
      <table>
        <thead>
          <tr>
            <th>HASH ID</th>
            <th>ID</th>
            <th>ADDRESS1</th>
            <th>ADDRESS2</th>
            <th>KIND</th>
            <th>UPDATED</th>
            <th>LOADING</th>
            <th>ERROR</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {controller.customerAddresses.map((customerAddress, index) => (
            <tr key={index}>
              <td>{customerAddress.get('hashId')}</td>
              <td>{customerAddress.get('id')}</td>
              <td>{customerAddress.get('attributes.address1')}</td>
              <td>{customerAddress.get('attributes.address2')}</td>
              <td>{customerAddress.get('attributes.kind')}</td>
              <td>
                {(() => {
                  const formattedDate = new Date(
                    customerAddress.get('attributes.updated-at')
                  ).toLocaleString()
                  return formattedDate
                })()}
              </td>
              <td>{String(customerAddress.get('isLoading'))}</td>
              <td>{String(customerAddress.get('isError'))}</td>
              <td>
                <button
                  onClick={() => {
                    customerAddress.set(
                      'attributes.address1',
                      `Test ${new Date().getTime()}`
                    )
                    customerAddress
                      .save()
                      .then((result) => {
                        console.log(result)
                      })
                      .catch((error) => {
                        console.log(error)
                      })
                  }}
                >
                  {customerAddress.get('isLoading') ? 'Saving' : 'Save'}
                </button>
                <button onClick={() => customerAddress.destroyRecord()}>
                  Delete
                </button>
                <button
                  onClick={() => controller.unloadRecord(customerAddress)}
                >
                  Unload
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>[COLLECTION]: Customer Addresses</h3>
      <table>
        <thead>
          <tr>
            <th>HASH ID</th>
            <th>ID</th>
            <th>ADDRESS1</th>
            <th>ADDRESS2</th>
            <th>KIND</th>
            <th>UPDATED</th>
            <th>LOADING</th>
            <th>ERROR</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {controller.addresses.map((address, index) => (
            <tr key={index}>
              <td>{address.get('hashId')}</td>
              <td>{address.get('id')}</td>
              <td>{address.get('attributes.address1')}</td>
              <td>{address.get('attributes.address2')}</td>
              <td>{address.get('attributes.kind')}</td>
              <td>
                {(() => {
                  const formattedDate = new Date(
                    address.get('attributes.updated-at')
                  ).toLocaleString()
                  return formattedDate
                })()}
              </td>
              <td>{String(address.get('isLoading'))}</td>
              <td>{String(address.get('isError'))}</td>
              <td>
                <button
                  onClick={() => {
                    address.set(
                      'attributes.address1',
                      `Test ${new Date().getTime()}`
                    )
                    address
                      .save()
                      .then((result) => {
                        console.log(result)
                      })
                      .catch((error) => {
                        console.log(error)
                      })
                  }}
                >
                  {address.get('isLoading') ? 'Saving' : 'Save'}
                </button>
                <button onClick={() => address.reload()}>Reload</button>
                <button onClick={() => address.destroyRecord()}>Delete</button>
                <button onClick={() => controller.unloadRecord(address)}>
                  Unload
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>[RECORD]: Customer Addresses</h3>
      <button onClick={() => controller.createRecord()}>Create</button>
      <br />
      <br />
    </div>
  )
})

export default App
