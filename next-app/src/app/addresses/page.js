'use client'

import Link from 'next/link'
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
            <th>LABEL</th>
            <th>KIND</th>
            <th>ADDRESS 1</th>
            <th>ADDRESS 2</th>
            <th>LANDMARK</th>
            <th>LATITUDE</th>
            <th>LONGITUDE</th>
            <th>POST CODE</th>
            <th>&nbsp;</th>
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
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => controller.onClickEdit(address.get('id'))}
                >
                  EDIT
                </button>
                {/* <Link href={`/addresses/${address.get('id')}/edit`}>EDIT</Link> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default AddressesListPage
