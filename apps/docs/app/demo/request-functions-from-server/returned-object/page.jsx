'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'

const Page = observer(() => {
  const requestHash = Model()
  const { isLoading, data: address } = requestHash

  return (
    <DemoPage
      title="Returned object"
      method="isLoading, isError, isNew, data, error, included, meta, reload"
      guideHref="/docs/guides/request-functions#returned-object">
      <AddressesTable
        addresses={isLoading ? [] : [address]}
        isLoading={isLoading}
        rowActions={() => (
          <button className="blue-btn" onClick={() => requestHash.reload()}>
            Reload
          </button>
        )}
      />
    </DemoPage>
  )
})

export default Page
