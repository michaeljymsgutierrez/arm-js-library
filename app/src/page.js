import { observer } from 'mobx-react-lite'
import { ARM } from './index.js'

const App = observer(() => {
  const { isLoading, data: address } = ARM.findRecord(
    'addresses',
    2461018,
    { include: 'user' },
    { alias: 'customerAddress' }
  )

  return (
    <div className="App">
      {isLoading && <span>Loading...</span>}
      {!isLoading && (
        <div className="form">
          <label>Address1 </label>
          <input
            defaultValue={address.get('attributes.address1')}
            onChange={(event) =>
              address.set('attributes.address1', event.target.value)
            }
          />
          &nbsp;
          <button
            onClick={() => {
              address
                .save()
                .then((result) => console.log(result))
                .catch((error) => console.log(error))
            }}
          >
            {address.get('isLoading') ? 'Saving' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
})

export default App
