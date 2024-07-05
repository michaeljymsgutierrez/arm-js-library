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
      <div className={styles.table}>
        <div className={styles.tableHeadRow}>
          <div>ID</div>
          <div>LABEL</div>
          <div>KIND</div>
          <div>ADDRESS 1</div>
          <div>ADDRESS 2</div>
          <div>LANDMARK</div>
          <div>LATITUDE</div>
          <div>LONGITUDE</div>
          <div>POST CODE</div>
        </div>

        {model.isLoading && (
          <div className={styles.tableBodyRow}>
            <div>Loading...</div>
          </div>
        )}

        {controller.addresses.map((address, index) => (
          <div key={index} className={styles.tableBodyRow}>
            <div>{address.get('id')} </div>
            <div>{address.get('attributes.label')} </div>
            <div>{address.get('attributes.kind')} </div>
            <div>{address.get('attributes.address1')} </div>
            <div>{address.get('attributes.address2')} </div>
            <div>{address.get('attributes.landmark')} </div>
            <div>{address.get('attributes.latitude')} </div>
            <div>{address.get('attributes.longitude')} </div>
            <div>{address.get('attributes.post-code')} </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default AddressesListPage
