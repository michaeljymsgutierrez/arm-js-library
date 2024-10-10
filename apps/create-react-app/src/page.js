import './page.css'
import { observer } from 'mobx-react'
import Model from './model'
import Controller from './controller'
import { ARM } from './index.js'

const App = observer(() => {
  const model = Model()
  const controller = Controller(model)

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
            <th>Kind</th>
            <th>Address 1</th>
            <th>Address 2</th>
            <th>Landmark</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Post Code</th>
            <th>User ID</th>
            <th>
              <button onClick={controller.onClickNew}>New</button>
            </th>
          </tr>
        </thead>

        <tbody>
          {model.isLoading && (
            <tr>
              <td colSpan="10">Loading...</td>
            </tr>
          )}

          {model.data.map((address, index) => {
            const user = address.getCollection('users', {
              referenceKey: 'relationships.user.data',
              async: true,
            })

            return (
              <tr key={index}>
                <td>{address.get('id')}</td>
                <td>{address.get('attributes.label')}</td>
                <td>{address.get('attributes.kind')}</td>
                <td>{address.get('attributes.address1')}</td>
                <td>{address.get('attributes.address2')}</td>
                <td>{address.get('attributes.landmark')}</td>
                <td>{address.get('attributes.latitude')}</td>
                <td>{address.get('attributes.longitude')}</td>
                <td>{address.get('attributes.post-code')}</td>
                <td>{ARM.isPresent(user) ? user.get('id') : ''}</td>
                <td>
                  {/* <button */}
                  {/*   type="button" */}
                  {/*   onClick={() => */}
                  {/*     address.destroyRecord({ */}
                  {/*       override: { */}
                  {/*         host: 'https://ww7.test-demo.com', */}
                  {/*         namespace: 'api/v2', */}
                  {/*         path: `delete/${user.get('id')}`, */}
                  {/*       }, */}
                  {/*     }) */}
                  {/*   } */}
                  {/* > */}
                  {/*   Delete */}
                  {/* </button> */}
                  {/* &nbsp; */}
                  <button
                    type="button"
                    onClick={() => controller.onClickEdit(address.get('id'))}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})

export default App
