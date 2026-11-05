'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

  return (
    <DemoPage
      title="Record state properties"
      method="isLoading, isError, isPristine, isDirty"
      guideHref="/docs/guides/collection-records#state-properties">
      <AddressesTable
        addresses={isLoading ? [] : [address]}
        isLoading={isLoading}
        footer={
          !isLoading && (
            <>
              <p>
                <b>isLoading:</b>&nbsp;{String(address.get('isLoading'))}
              </p>
              <p>
                <b>isError:</b>&nbsp;{String(address.get('isError'))}
              </p>
              <p>
                <b>isPristine:</b>&nbsp;{String(address.get('isPristine'))}
              </p>
              <p>
                <b>isDirty:</b>&nbsp;{String(address.get('isDirty'))}
              </p>
              <p className="flex flex-1 mt-5 gap-2">
                <button className="blue-btn" onClick={() => address.reload()}>
                  Reload
                </button>
                <button
                  className="blue-btn"
                  onClick={() => address.set('attributes.landmark', 'New landmark')}>
                  Modify (Landmark)
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
