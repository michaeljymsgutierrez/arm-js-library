'use client'

import { observer } from 'mobx-react-lite'
import Model from './model'

const Page = observer(() => {
  const model = Model()
  const {
    isLoading,
    data,
    // isError,
    // isNew,
    // error,
    // included,
    // meta,
    // reload
  } = model

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
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan="10">Loading...</td>
          </tr>
        )}

        {!isLoading && (
          <tr>
            <td>{data.get('attributes.address1')}</td>
            <td>{data.get('attributes.address2')}</td>
            <td>{data.get('attributes.city')}</td>
            <td>{data.get('attributes.post-code')}</td>
            <td>{data.get('attributes.landmark')}</td>
            <td>{data.get('attributes.kind')}</td>
            <td>{data.get('attributes.label')}</td>
            <td>{data.get('attributes.longitude')}</td>
            <td>{data.get('attributes.latitude')}</td>
            <td>
              <button
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  model.reload()
                }}
              >
                Reload
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
})

export default Page
