'use client'

import { observer } from 'mobx-react-lite'
import Controller from './controller'
import Model from './model'

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

        {!isLoading && (
          <tr>
            <td>{controller.customerAddress.get('attributes.address1')}</td>
            <td>{controller.customerAddress.get('attributes.address2')}</td>
            <td>{controller.customerAddress.get('attributes.city')}</td>
            <td>{controller.customerAddress.get('attributes.postCode')}</td>
            <td>{controller.customerAddress.get('attributes.landmark')}</td>
            <td>{controller.customerAddress.get('attributes.kind')}</td>
            <td>{controller.customerAddress.get('attributes.label')}</td>
            <td>{controller.customerAddress.get('attributes.longitude')}</td>
            <td>{controller.customerAddress.get('attributes.latitude')}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
})

export default Page
