'use client'

import styles from './page.module.css'
import { observer } from 'mobx-react'
import Model from './model'
import Controller from './controller'
import ItemsList from '@/components/items-list'

const ItemsListPage = observer(() => {
  const model = Model()
  const controller = Controller(model)

  if (model.isLoading) {
    return <></>
  }

  return (
    <div className="items-list-page">
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>COUNT</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          {model.data.map((item, index) => (
            <tr key={index} className={styles.tableBodyRow}>
              <td>{item.get('id')}</td>
              <td>
                {item
                  .getCollection('products', {
                    referenceKey: 'relationships.product.data',
                    async: true,
                  })
                  .get('attributes.name')}
              </td>
              <td>{item.get('attributes.count')}</td>
              <td>
                <button
                  type="button"
                  onClick={() => controller.onClickIncrement(item)}
                >
                  Increment
                </button>
                <button
                  type="button"
                  onClick={() => controller.onClickDecrement(item)}
                >
                  Decrement
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ItemsList />
    </div>
  )
})

export default ItemsListPage
