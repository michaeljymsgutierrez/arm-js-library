'use client'

const FIELDS = [
  ['address1', 'Address1'],
  ['address2', 'Address2'],
  ['city', 'City'],
  ['post-code', 'Post code'],
  ['landmark', 'Landmark'],
  ['kind', 'Kind'],
  ['label', 'Label'],
  ['latitude', 'Latitude'],
  ['longitude', 'Longitude'],
]

/**
 * AddressForm
 *
 * Shared editable form for every demo that binds inputs to `address.get`/
 * `address.set` and exposes one action button - save/reload/rollback/destroy
 * all share this exact shape, differing only in the action itself.
 */
const AddressForm = ({ address, actionLabel, busyLabel, onAction }) => {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      {FIELDS.map(([key, label]) => (
        <div className="form-control" key={key}>
          <label htmlFor={key}>{label}</label>
          <input
            type="text"
            name={key}
            value={address.get(`attributes.${key}`) ?? ''}
            onChange={(event) =>
              address.set(`attributes.${key}`, event.target.value)
            }
          />
        </div>
      ))}

      <div className="form-control">
        <button className="blue-btn" onClick={onAction}>
          {address.get('isLoading') ? busyLabel : actionLabel}
        </button>
      </div>
    </form>
  )
}

export default AddressForm
