'use client'

import { useState } from 'react'
import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()
  const [lastGetResult, setLastGetResult] = useState(null)

  return (
    <DemoPage
      title="record.get()/set()/setProperties()"
      method="No request - all synchronous, local reads/writes"
      guideHref="/docs/guides/collection-records#getter-and-setter-functions">
      <AddressesTable
        addresses={isLoading ? [] : [address]}
        isLoading={isLoading}
        footer={
          !isLoading && (
            <>
              <p>
                <b>isDirty:</b>&nbsp;{String(address.get('isDirty'))}
              </p>
              {lastGetResult && (
                <p>
                  <b>Last get('attributes.address1'):</b>&nbsp;{lastGetResult}
                </p>
              )}
              <p className="flex flex-1 mt-5 gap-2">
                <button className="blue-btn" onClick={() => address.reload()}>
                  Reload
                </button>
                <button
                  className="blue-btn"
                  onClick={() =>
                    setLastGetResult(address.get('attributes.address1'))
                  }>
                  Get (Address1)
                </button>
                <button
                  className="blue-btn"
                  onClick={() =>
                    address.set('attributes.landmark', 'New landmark')
                  }>
                  Set (Landmark)
                </button>
                <button
                  className="blue-btn"
                  onClick={() =>
                    address.setProperties({
                      attributes: { landmark: 'Other landmark', 'post-code': '1226' },
                    })
                  }>
                  Set Properties (Landmark and Post Code)
                </button>
              </p>
            </>
          )
        }
      />
    </DemoPage>
  )
})

export default Page
