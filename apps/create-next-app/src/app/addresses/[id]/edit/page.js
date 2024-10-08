'use client'

import styles from './page.module.css'
import { observer } from 'mobx-react'
import Model from './model'
import Controller from './controller'

const AddressEditPage = observer(() => {
  const model = Model()
  const controller = Controller(model)

  return (
    <div className="edit-address-page">
      {model.isLoading && <div className={styles.inputGroup}>Loading...</div>}
      {!model.isLoading && (
        <>
          <div className={styles.inputGroup}>
            <label>ID:</label>
            <input type="text" disabled={true} value={model.data.get('id')} />
          </div>
          <div className={styles.inputGroup}>
            <label>Label:</label>
            <input
              type="text"
              value={model.data.get('attributes.label')}
              onChange={(event) =>
                model.data.set('attributes.label', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Kind:</label>
            <input
              type="text"
              value={model.data.get('attributes.kind')}
              onChange={(event) =>
                model.data.set('attributes.kind', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Address 1:</label>
            <input
              type="text"
              value={model.data.get('attributes.address1')}
              onChange={(event) =>
                model.data.set('attributes.address1', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Address 2:</label>
            <input
              type="text"
              value={model.data.get('attributes.address2')}
              onChange={(event) =>
                model.data.set('attributes.address2', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Landmark:</label>
            <input
              type="text"
              value={model.data.get('attributes.landmark')}
              onChange={(event) =>
                model.data.set('attributes.landmark', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Latitude:</label>
            <input
              type="text"
              value={model.data.get('attributes.latitude')}
              onChange={(event) =>
                model.data.set('attributes.latitude', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>LONGITUDE:</label>
            <input
              type="text"
              value={model.data.get('attributes.longitude')}
              onChange={(event) =>
                model.data.set('attributes.longitude', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Post Code:</label>
            <input
              type="text"
              value={model.data.get('attributes.post-code')}
              onChange={(event) =>
                model.data.set('attributes.post-code', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <button
              type="button"
              className={styles.button}
              onClick={controller.onClickCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => controller.onClickSave(model.data)}
            >
              {model.data.get('isLoading') ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  )
})

export default AddressEditPage
