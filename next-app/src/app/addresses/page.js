'use client'

import styles from './page.module.css'
import { observer } from 'mobx-react-lite'
import Model from './model'
import Controller from './controller'

const AddressesListPage = observer(() => {
  const model = Model()
  const controller = Controller(model)

  return (
    <div className="addreses-list-page">
      <table className={styles.table}>
        <thead className={styles.tableHead}>
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

        <tbody className={styles.tableBody}>
          {model.isLoading && (
            <tr className={styles.tableBodyRow}>
              <td colSpan="10">Loading...</td>
            </tr>
          )}

          {model.data.map((address, index) => (
            <tr key={index} className={styles.tableBodyRow}>
              <td>{address.get('id')}</td>
              <td>{address.get('attributes.label')}</td>
              <td>{address.get('attributes.kind')}</td>
              <td>{address.get('attributes.address1')}</td>
              <td>{address.get('attributes.address2')}</td>
              <td>{address.get('attributes.landmark')}</td>
              <td>{address.get('attributes.latitude')}</td>
              <td>{address.get('attributes.longitude')}</td>
              <td>{address.get('attributes.post-code')}</td>
              <td>
                {address
                  .getCollection('users', {
                    referenceKey: 'relationships.user.data',
                    async: true,
                  })
                  .map((user, index) => (
                    <span key={index}>{user.get('id')}</span>
                  ))}
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => controller.onClickEdit(address.get('id'))}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default AddressesListPage
