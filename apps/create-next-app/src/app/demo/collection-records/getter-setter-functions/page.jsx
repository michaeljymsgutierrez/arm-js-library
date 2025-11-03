'use client'

import { observer } from 'mobx-react-lite'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

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
          <>
            <tr>
              <td>{address.get('attributes.address1')}</td>
              <td>{address.get('attributes.address2')}</td>
              <td>{address.get('attributes.city')}</td>
              <td>{address.get('attributes.post-code')}</td>
              <td>{address.get('attributes.landmark')}</td>
              <td>{address.get('attributes.kind')}</td>
              <td>{address.get('attributes.label')}</td>
              <td>{address.get('attributes.longitude')}</td>
              <td>{address.get('attributes.latitude')}</td>
            </tr>

            <tr>
              <td colSpan="9">
                <p>
                  <b>isLoading:</b>&nbsp;
                  {String(address?.isLoading)}
                </p>

                <p>
                  <b>isError:</b>&nbsp;
                  {String(address?.isError)}
                </p>

                <p>
                  <b>isPristine:</b>&nbsp;
                  {String(address?.isPristine)}
                </p>

                <p>
                  <b>isDirty:</b>&nbsp;
                  {String(address?.isDirty)}
                </p>

                <p className="flex flex-1 mt-5 gap-2">
                  <button className="blue-btn" onClick={() => address.reload()}>
                    Reload
                  </button>

                  <button
                    className="blue-btn"
                    onClick={() => {
                      alert(address.get('attributes.address1'))
                    }}
                  >
                    Get (Address1)
                  </button>

                  <button
                    className="blue-btn"
                    onClick={() =>
                      address.set('attributes.landmark', 'New landmark')
                    }
                  >
                    Set (Landmark)
                  </button>

                  <button
                    className="blue-btn"
                    onClick={() =>
                      address.setProperties({
                        attributes: {
                          landmark: 'Other landmark',
                          'post-code': '1226',
                        },
                      })
                    }
                  >
                    Set Properties (Landmark and Post Code)
                  </button>
                </p>
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  )
})

export default Page
