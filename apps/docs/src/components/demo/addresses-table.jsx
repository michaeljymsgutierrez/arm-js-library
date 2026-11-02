'use client'

const COLUMNS = [
  ['address1', 'Address1'],
  ['address2', 'Address2'],
  ['city', 'City'],
  ['post-code', 'Post code'],
  ['landmark', 'Landmark'],
  ['kind', 'Kind'],
  ['label', 'Label'],
  ['longitude', 'Longitude'],
  ['latitude', 'Latitude'],
]

/**
 * AddressesTable
 *
 * Shared read-only table for every demo that renders one or more address
 * records - pass a single record wrapped in an array (`[address]`) for the
 * single-record demos, since the row shape is identical either way.
 *
 * `rowActions(address)` renders extra cells per row (e.g. an Unload button).
 * `footer` renders a full-width row below the data (e.g. a Clear Collection
 * or Push Payload button).
 */
const AddressesTable = ({ addresses = [], isLoading, rowActions, footer }) => {
  const columnCount = COLUMNS.length + (rowActions ? 1 : 0)

  return (
    <table>
      <thead>
        <tr>
          {COLUMNS.map(([, label]) => (
            <th key={label}>{label.toUpperCase()}</th>
          ))}
          {rowActions && <th>ACTIONS</th>}
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan={columnCount}>Loading...</td>
          </tr>
        )}

        {!isLoading &&
          addresses.map((address) => (
            <tr key={address.get('id')}>
              {COLUMNS.map(([key]) => (
                <td key={key}>{address.get(`attributes.${key}`)}</td>
              ))}
              {rowActions && <td>{rowActions(address)}</td>}
            </tr>
          ))}

        {!isLoading && footer && (
          <tr>
            <td colSpan={columnCount}>{footer}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default AddressesTable
