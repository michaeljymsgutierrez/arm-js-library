'use client'

import styles from './page.module.css'
import { observer } from 'mobx-react-lite'
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
            <label for="name">ID:</label>
            <input
              type="text"
              disabled={true}
              defaultValue={model.data.get('id')}
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">LABEL:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.label')}
              onChange={(event) =>
                model.data.set('attributes.label', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">KIND:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.kind')}
              onChange={(event) =>
                model.data.set('attributes.kind', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">ADDRESS 1:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.address1')}
              onChange={(event) =>
                model.data.set('attributes.address1', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">ADDRESS 2:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.address2')}
              onChange={(event) =>
                model.data.set('attributes.address2', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">LATITUDE:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.latitude')}
              onChange={(event) =>
                model.data.set('attributes.latitude', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">LONGITUDE:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.longitude')}
              onChange={(event) =>
                model.data.set('attributes.longitude', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="name">POST CODE:</label>
            <input
              type="text"
              defaultValue={model.data.get('attributes.post-code')}
              onChange={(event) =>
                model.data.set('attributes.post-code', event.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <button type="button" onClick={() => model.data.save()}>
              {model.data.get('isLoading') ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </>
      )}
    </div>
  )
})

export default AddressEditPage
