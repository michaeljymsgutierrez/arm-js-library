import './App.css'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ApiResourceManager from './api-resource-manager'

export const ARM = new ApiResourceManager(['addresses'])

ARM.setHost('https://www.metromart.com')
ARM.setHeadersCommon(
  'Authorization',
  `Token ${window.localStorage.getItem('token')}`
)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

const App = observer(() => {
  const customerAdderesses = ARM.getAlias('customerAdderesses', [])

  useEffect(() => {
    ARM.query('addresses', {
      sort: '-id'
    }, { alias: 'customerAdderesses' })
  }, [])

  return (
    <div className="App">
      <h3>Customer Addresses</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>ADDRESS1</th>
          <th>ADDRESS2</th>
          <th>KIND</th>
          <th>ACTION</th>
        </tr>

        {customerAdderesses.map((customerAdderess, index) => (
          <tr key={index}>
            <td>{customerAdderess.get('id')}</td>
            <td>{customerAdderess.get('attributes.address1')}</td>
            <td>{customerAdderess.get('attributes.address2')}</td>
            <td>{customerAdderess.get('attributes.kind')}</td>
            <td>
              <button onClick={() => customerAdderess.save()}>Save</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
})

export default App
