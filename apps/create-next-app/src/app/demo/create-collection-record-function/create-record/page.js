'use client'

import { observer } from 'mobx-react-lite'
import Controller from './controller'

const Page = observer(() => {
  const controller = Controller()

  return (
    <form>
      <div className="form-control">
        <label htmlFor="address1">Address1</label>
        <input
          type="text"
          name="address1"
          value={controller.address.get('attributes.address1') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.address1', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="address2">Address2</label>
        <input
          type="text"
          name="address2"
          value={controller.address.get('attributes.address2') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.address2', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          value={controller.address.get('attributes.city') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.city', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="post-code">Post code</label>
        <input
          type="text"
          name="post-code"
          value={controller.address.get('attributes.post-code') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.post-code', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="landmark">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={controller.address.get('attributes.landmark') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.landmark', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="kind">Kind</label>
        <input
          type="text"
          name="kind"
          value={controller.address.get('attributes.kind') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.kind', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="label">Label</label>
        <input
          type="text"
          name="label"
          value={controller.address.get('attributes.label') ?? ''}
          onChange={(event) =>
            controller.address.set('attributes.label', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="latitude">Latitude</label>
        <input
          type="text"
          name="latitude"
          value={controller.address.get('attributes.latitude')}
          onChange={(event) =>
            controller.address.set('attributes.latitude', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="longitude">Longitude</label>
        <input
          type="text"
          name="longitude"
          value={controller.address.get('attributes.longitude')}
          onChange={(event) =>
            controller.address.set('attributes.longitude', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <button className="blue-btn">Save</button>
      </div>
    </form>
  )
})

export default Page
