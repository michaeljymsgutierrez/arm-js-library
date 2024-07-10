'use client'

import styles from './page.module.css'
import { observer } from 'mobx-react-lite'
import Model from './model'
import Controller from './controller'

const AddressNewPage = observer(() => {
  const model = Model()
  const controller = Controller(model)

  return (
    <div className="add-address-page">
      <div className={styles.inputGroup}>
        <label>ID:</label>
        <input type="text" disabled={true} defaultValue={model.get('id')} />
      </div>
      <div className={styles.inputGroup}>
        <label>LABEL:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.label')}
          onChange={(event) =>
            model.set('attributes.label', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>KIND:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.kind')}
          onChange={(event) => model.set('attributes.kind', event.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>ADDRESS 1:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.address1')}
          onChange={(event) =>
            model.set('attributes.address1', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>ADDRESS 2:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.address2')}
          onChange={(event) =>
            model.set('attributes.address2', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>LANDMARK:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.landmark')}
          onChange={(event) =>
            model.set('attributes.landmark', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>LATITUDE:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.latitude')}
          onChange={(event) =>
            model.set('attributes.latitude', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>LONGITUDE:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.longitude')}
          onChange={(event) =>
            model.set('attributes.longitude', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>POST CODE:</label>
        <input
          type="text"
          defaultValue={model.get('attributes.post-code')}
          onChange={(event) =>
            model.set('attributes.post-code', event.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <button
          type="button"
          className={styles.button}
          onClick={controller.onClickCancel}
        >
          CANCEL
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => controller.onClickSave(model)}
        >
          {model.get('isLoading') ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </div>
  )
})

export default AddressNewPage
