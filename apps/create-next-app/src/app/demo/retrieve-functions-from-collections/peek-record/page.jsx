'use client'

import { observer } from 'mobx-react-lite'
import Model from './model'
import Controller from './controller'

const Page = observer(() => {
  const controller = Controller()
  const { isLoading } = Model()

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
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan="9">Loading...</td>
          </tr>
        )}
        {!isLoading && controller.address && (
          <tr key={controller.address.get('id')}>
            <td>{controller.address.get('attributes.address1')}</td>
            <td>{controller.address.get('attributes.address2')}</td>
            <td>{controller.address.get('attributes.city')}</td>
            <td>{controller.address.get('attributes.post-code')}</td>
            <td>{controller.address.get('attributes.landmark')}</td>
            <td>{controller.address.get('attributes.kind')}</td>
            <td>{controller.address.get('attributes.label')}</td>
            <td>{controller.address.get('attributes.longitude')}</td>
            <td>{controller.address.get('attributes.latitude')}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
})

export default Page
