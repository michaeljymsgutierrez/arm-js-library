import './page.css'
import { observer } from 'mobx-react-lite'
import { ARM } from './index.js'

const App = observer(() => {
  const { isLoading, data: customerAddresses } = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    { alias: 'customerAddresses' }
  )

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ADDRESS1</th>
            <th>KIND</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          )}
          {customerAddresses.map((address, index) => (
            <tr key={index}>
              <td>{address.get('id')}</td>
              <td>{address.get('attributes.address1')}</td>
              <td>{address.get('attributes.kind')}</td>
              <td>
                <button
                  onClick={() => {
                    address.set('attributes.kind', 'office')
                    address
                      .save()
                      .then((results) => console.log(results))
                      .catch((errors) => console.log(errors))
                  }}
                >
                  {address.isLoading ? 'Updating' : 'Update'}
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
