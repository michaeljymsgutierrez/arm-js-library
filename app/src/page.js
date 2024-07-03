import './page.css'
import { observer } from 'mobx-react-lite'
import { ARM } from './index.js'

const App = observer(() => {
  // const customerAddressesFromAlias = ARM.getAlias('customerAddresses', [])
  // const customerAddressesFromCollection = ARM.getCollection('addresses')
  //
  // const { isLoading, data: customerAddressesFromRequest } = ARM.findAll(
  //   'addresses',
  //   { alias: 'customerAddresses' }
  // )

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
    {},
    // { include: 'addresses' },
    { alias: 'currentUser' }
  )

  return (
    <div className="App">
      {/* <table> */}
      {/*   <thead> */}
      {/*     <tr> */}
      {/*       <th>HASH ID</th> */}
      {/*       <th>ID</th> */}
      {/*       <th>ADDRESS1</th> */}
      {/*       <th>ADDRESS2</th> */}
      {/*       <th>KIND</th> */}
      {/*       <th>UPDATED</th> */}
      {/*       <th>LOADING</th> */}
      {/*       <th>ERROR</th> */}
      {/*       <th>PRISTINE</th> */}
      {/*       <th>DIRTY</th> */}
      {/*       <th>ACTION</th> */}
      {/*     </tr> */}
      {/*   </thead> */}
      {/*  */}
      {/*   <tbody> */}
      {/*     <tr> */}
      {/*       <td colSpan="100%">FROM COLLECTION</td> */}
      {/*     </tr> */}
      {/*     {customerAddressesFromCollection.map((customerAddress, index) => ( */}
      {/*       <tr key={index}> */}
      {/*         <td>{customerAddress.get('hashId')}</td> */}
      {/*         <td>{customerAddress.get('id')}</td> */}
      {/*         <td>{customerAddress.get('attributes.address1')}</td> */}
      {/*         <td>{customerAddress.get('attributes.address2')}</td> */}
      {/*         <td>{customerAddress.get('attributes.kind')}</td> */}
      {/*         <td> */}
      {/*           {(() => { */}
      {/*             const formattedDate = new Date( */}
      {/*               customerAddress.get('attributes.updated-at') */}
      {/*             ).toLocaleString() */}
      {/*             return formattedDate */}
      {/*           })()} */}
      {/*         </td> */}
      {/*         <td>{String(customerAddress.get('isLoading'))}</td> */}
      {/*         <td>{String(customerAddress.get('isError'))}</td> */}
      {/*         <td>{String(customerAddress.get('isPristine'))}</td> */}
      {/*         <td>{String(customerAddress.get('isDirty'))}</td> */}
      {/*         <td> */}
      {/*           <button */}
      {/*             onClick={() => { */}
      {/*               customerAddress.set( */}
      {/*                 'attributes.address1', */}
      {/*                 `Test ${new Date().getTime()}` */}
      {/*               ) */}
      {/*               customerAddress */}
      {/*                 .save() */}
      {/*                 .then((result) => { */}
      {/*                   console.log(result) */}
      {/*                 }) */}
      {/*                 .catch((error) => { */}
      {/*                   console.log(error) */}
      {/*                 }) */}
      {/*             }} */}
      {/*           > */}
      {/*             {customerAddress.get('isLoading') ? 'Saving' : 'Save'} */}
      {/*           </button> */}
      {/*           <button onClick={() => customerAddress.destroyRecord()}> */}
      {/*             Delete */}
      {/*           </button> */}
      {/*           <button onClick={() => ARM.unloadRecord(customerAddress)}> */}
      {/*             Unload */}
      {/*           </button> */}
      {/*         </td> */}
      {/*       </tr> */}
      {/*     ))} */}
      {/*  */}
      {/*     <tr> */}
      {/*       <td colSpan="100%">FROM ALIAS</td> */}
      {/*     </tr> */}
      {/*     {customerAddressesFromAlias.map((customerAddress, index) => ( */}
      {/*       <tr key={index}> */}
      {/*         <td>{customerAddress.get('hashId')}</td> */}
      {/*         <td>{customerAddress.get('id')}</td> */}
      {/*         <td>{customerAddress.get('attributes.address1')}</td> */}
      {/*         <td>{customerAddress.get('attributes.address2')}</td> */}
      {/*         <td>{customerAddress.get('attributes.kind')}</td> */}
      {/*         <td> */}
      {/*           {(() => { */}
      {/*             const formattedDate = new Date( */}
      {/*               customerAddress.get('attributes.updated-at') */}
      {/*             ).toLocaleString() */}
      {/*             return formattedDate */}
      {/*           })()} */}
      {/*         </td> */}
      {/*         <td>{String(customerAddress.get('isLoading'))}</td> */}
      {/*         <td>{String(customerAddress.get('isError'))}</td> */}
      {/*         <td>{String(customerAddress.get('isPristine'))}</td> */}
      {/*         <td>{String(customerAddress.get('isDirty'))}</td> */}
      {/*         <td> */}
      {/*           <button */}
      {/*             onClick={() => { */}
      {/*               customerAddress.set( */}
      {/*                 'attributes.address1', */}
      {/*                 `Test ${new Date().getTime()}` */}
      {/*               ) */}
      {/*               customerAddress */}
      {/*                 .save() */}
      {/*                 .then((result) => { */}
      {/*                   console.log(result) */}
      {/*                 }) */}
      {/*                 .catch((error) => { */}
      {/*                   console.log(error) */}
      {/*                 }) */}
      {/*             }} */}
      {/*           > */}
      {/*             {customerAddress.get('isLoading') ? 'Saving' : 'Save'} */}
      {/*           </button> */}
      {/*           <button onClick={() => customerAddress.destroyRecord()}> */}
      {/*             Delete */}
      {/*           </button> */}
      {/*           <button onClick={() => ARM.unloadRecord(customerAddress)}> */}
      {/*             Unload */}
      {/*           </button> */}
      {/*         </td> */}
      {/*       </tr> */}
      {/*     ))} */}
      {/*  */}
      {/*     <tr> */}
      {/*       <td colSpan="100%"> */}
      {/*         FROM REQUEST: {isLoading ? 'FETCHING' : 'DONE'} */}
      {/*       </td> */}
      {/*     </tr> */}
      {/*     {customerAddressesFromRequest.map((customerAddress, index) => ( */}
      {/*       <tr key={index}> */}
      {/*         <td>{customerAddress.get('hashId')}</td> */}
      {/*         <td>{customerAddress.get('id')}</td> */}
      {/*         <td>{customerAddress.get('attributes.address1')}</td> */}
      {/*         <td>{customerAddress.get('attributes.address2')}</td> */}
      {/*         <td>{customerAddress.get('attributes.kind')}</td> */}
      {/*         <td> */}
      {/*           {(() => { */}
      {/*             const formattedDate = new Date( */}
      {/*               customerAddress.get('attributes.updated-at') */}
      {/*             ).toLocaleString() */}
      {/*             return formattedDate */}
      {/*           })()} */}
      {/*         </td> */}
      {/*         <td>{String(customerAddress.get('isLoading'))}</td> */}
      {/*         <td>{String(customerAddress.get('isError'))}</td> */}
      {/*         <td>{String(customerAddress.get('isPristine'))}</td> */}
      {/*         <td>{String(customerAddress.get('isDirty'))}</td> */}
      {/*         <td> */}
      {/*           <button */}
      {/*             onClick={() => { */}
      {/*               customerAddress.set( */}
      {/*                 'attributes.address1', */}
      {/*                 `Test ${new Date().getTime()}` */}
      {/*               ) */}
      {/*               customerAddress */}
      {/*                 .save() */}
      {/*                 .then((result) => { */}
      {/*                   console.log(result) */}
      {/*                 }) */}
      {/*                 .catch((error) => { */}
      {/*                   console.log(error) */}
      {/*                 }) */}
      {/*             }} */}
      {/*           > */}
      {/*             {customerAddress.get('isLoading') ? 'Saving' : 'Save'} */}
      {/*           </button> */}
      {/*           <button onClick={() => customerAddress.destroyRecord()}> */}
      {/*             Delete */}
      {/*           </button> */}
      {/*           <button onClick={() => ARM.unloadRecord(customerAddress)}> */}
      {/*             Unload */}
      {/*           </button> */}
      {/*         </td> */}
      {/*       </tr> */}
      {/*     ))} */}
      {/*   </tbody> */}
      {/* </table> */}

      {!isLoading && <h3>Current User: {user.get('id')}</h3>}
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
            <th>PRISTINE</th>
            <th>DIRTY</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan="100%">FROM RECORD GET COLLECTION</td>
          </tr>
          {!isLoading &&
            user
              .getCollection('addresses', {
                referenceKey: 'relationships.addresses.data',
                async: true,
              })
              .map((customerAddress, index) => (
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
                  <td>{String(customerAddress.get('isPristine'))}</td>
                  <td>{String(customerAddress.get('isDirty'))}</td>
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
                    <button onClick={() => ARM.unloadRecord(customerAddress)}>
                      Unload
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

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
      {/*   </div> */}
      {/* )} */}
    </div>
  )
})

export default App
