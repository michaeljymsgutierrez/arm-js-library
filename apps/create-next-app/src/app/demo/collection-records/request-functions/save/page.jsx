'use client'

import { observer } from 'mobx-react-lite'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

  if (isLoading) return <div>Loading...</div>

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="form-control">
        <label htmlFor="address1">Address1</label>
        <input
          type="text"
          name="address1"
          value={address.get('attributes.address1') ?? ''}
          onChange={(event) =>
            address.set('attributes.address1', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="address2">Address2</label>
        <input
          type="text"
          name="address2"
          value={address.get('attributes.address2') ?? ''}
          onChange={(event) =>
            address.set('attributes.address2', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          value={address.get('attributes.city') ?? ''}
          onChange={(event) =>
            address.set('attributes.city', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="post-code">Post code</label>
        <input
          type="text"
          name="post-code"
          value={address.get('attributes.post-code') ?? ''}
          onChange={(event) =>
            address.set('attributes.post-code', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="landmark">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={address.get('attributes.landmark') ?? ''}
          onChange={(event) =>
            address.set('attributes.landmark', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="kind">Kind</label>
        <input
          type="text"
          name="kind"
          value={address.get('attributes.kind') ?? ''}
          onChange={(event) =>
            address.set('attributes.kind', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="label">Label</label>
        <input
          type="text"
          name="label"
          value={address.get('attributes.label') ?? ''}
          onChange={(event) =>
            address.set('attributes.label', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="latitude">Latitude</label>
        <input
          type="text"
          name="latitude"
          value={address.get('attributes.latitude')}
          onChange={(event) =>
            address.set('attributes.latitude', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <label htmlFor="longitude">Longitude</label>
        <input
          type="text"
          name="longitude"
          value={address.get('attributes.longitude')}
          onChange={(event) =>
            address.set('attributes.longitude', event.target.value)
          }
        />
      </div>

      <div className="form-control">
        <button className="blue-btn" onClick={() => address.save()}>
          {address.get('isLoading') ? 'Saving' : 'Save'}
        </button>
      </div>
    </form>
  )
})

export default Page
