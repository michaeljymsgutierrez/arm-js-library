'use client'

import { observer } from 'mobx-react-lite'
import Model from './model'
import { ARM } from '@/components/providers/arm-config-provider'

const Page = observer(() => {
  const { addresses } = Model()

  return (
    <table>
      <thead>
        <tr>
          <th>ADDRESS1</th>
          <th>ADDRESS2</th>
          <th>CITY</th>
          <th>POST CODE</th>
          <th>LANDMARK</th>
          <th>KIND</th>
          <th>LABEL</th>
          <th>LONGITUDE</th>
          <th>LATITUDE</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {addresses.isLoading && (
          <tr>
            <td colSpan="10">Loading...</td>
          </tr>
        )}
        {!addresses.isLoading &&
          addresses.data.map((address) => (
            <tr key={address.get('id')}>
              <td>{address.get('attributes.address1')}</td>
              <td>{address.get('attributes.address2')}</td>
              <td>{address.get('attributes.city')}</td>
              <td>{address.get('attributes.post-code')}</td>
              <td>{address.get('attributes.landmark')}</td>
              <td>{address.get('attributes.kind')}</td>
              <td>{address.get('attributes.label')}</td>
              <td>{address.get('attributes.longitude')}</td>
              <td>{address.get('attributes.latitude')}</td>
              <td>
                <button
                  className="blue-btn"
                  onClick={() => ARM.unloadRecord(address)}
                >
                  Unload
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
})

export default Page
