import { observer } from 'mobx-react-lite'
import { ARM } from './index.js'

const App = observer(() => {
  // const addresses = ARM.getAlias('customerAddresses', [])
  //
  // ARM.findAll('addresses', { alias: 'customerAddresses' })

  // const { isLoading, data: address } = ARM.findRecord(
  //   'addresses',
  //   2461018,
  //   { include: 'user' },
  //   { alias: 'customerAddress' }
  // )
  //

  const { isLoading, data: user } = ARM.findRecord(
    'users',
    12980860,
    { include: 'addresses' },
    { alias: 'currentUser' }
  )

  return (
    <div className="App">
      {!isLoading && <h3>Current User: {user.get('id')}</h3>}
      {/* {!isLoading && user.getCollection('addresses', 'relationships.addresses.data')} */}
      {!isLoading &&
        user.getCollection('addresses', {
          referenceKey: 'relationships.addresses.data',
          async: true,
        })}
      {/* <ul> */}
      {/*   {addresses.map((address, index) => ( */}
      {/*     <li key={index}>{address.get('id')}</li> */}
      {/*   ))} */}
      {/* </ul> */}
      {/* {isLoading && <span>Loading...</span>} */}
      {/* {!isLoading && ( */}
      {/*   <div className="form"> */}
      {/*     <label>Address1 </label> */}
      {/*     <input */}
      {/*       defaultValue={address.get('attributes.address1')} */}
      {/*       onChange={(event) => */}
      {/*         address.set('attributes.address1', event.target.value) */}
      {/*       } */}
      {/*     /> */}
      {/*     &nbsp; */}
      {/*     <button */}
      {/*       onClick={() => { */}
      {/*         address */}
      {/*           .save() */}
      {/*           .then((result) => console.log(result)) */}
      {/*           .catch((error) => console.log(error)) */}
      {/*       }} */}
      {/*     > */}
      {/*       {address.get('isLoading') ? 'Saving' : 'Save'} */}
      {/*     </button> */}
      {/*     <button onClick={() => address.getCollection()}>getCollection</button> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  )
})

export default App
