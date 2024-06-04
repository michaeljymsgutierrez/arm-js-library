import './page.css'
import { observer } from 'mobx-react-lite'
import Model from './model'
import Controller from './controller'

const App = observer(() => {
  const model = Model()
  const controller = Controller(model)

  return (
    <div className="App">
      <h3>[ALIAS]: Customer Addresses</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ADDRESS1</th>
            <th>ADDRESS2</th>
            <th>KIND</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {controller.customerAddresses.map((customerAddress, index) => (
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
                  onClick={() => controller.unloadRecord(customerAddress)}
                >
                  Unload Record
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>[COLLECTION]: Customer Addresses</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ADDRESS1</th>
            <th>ADDRESS2</th>
            <th>KIND</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {controller.addresses.map((address, index) => (
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
                <button onClick={() => controller.unloadRecord(address)}>
                  Unload Record
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default App
