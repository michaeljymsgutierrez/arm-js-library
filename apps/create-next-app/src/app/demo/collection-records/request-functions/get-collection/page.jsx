'use client'

import { observer } from 'mobx-react-lite'
import Model from './model'

const Page = observer(() => {
  const { data: user, isLoading } = Model()

  return (
    <table>
      <thead>
        <tr>
          <th>USER ID</th>
          <th>PROFILE ID</th>
          <th>TIMEZONE</th>
          <th>ADDRESSES</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan="4">Loading...</td>
          </tr>
        )}

        {!isLoading && (
          <tr>
            <td>{user.get('id')}</td>
            <td>{user.get('attributes.profile-id')}</td>
            <td>{user.get('attributes.time-zone')}</td>
            <td>
              <ul>
                {user
                  .getCollection('addresses', {
                    referenceKey: 'relationships.addresses.data',
                    async: false,
                  })
                  .map((address) => (
                    <li key={address.get('id')}>
                      {address.get('attributes.address1')},
                      {address.get('attributes.address2')}
                    </li>
                  ))}
              </ul>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
})

export default Page
