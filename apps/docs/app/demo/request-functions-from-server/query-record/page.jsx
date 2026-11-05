'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'

const Page = observer(() => {
  const { addressRequest } = Model()
  // queryRecord returns a single record under `data`, not an array - see
  // DefaultRequestObjectResponse in the API reference.
  const address = addressRequest.data

  return (
    <DemoPage
      title="queryRecord()"
      method="GET /addresses?filter[id]=2519858"
      guideHref="/docs/guides/request-functions">
      <AddressesTable
        addresses={addressRequest.isLoading ? [] : [address]}
        isLoading={addressRequest.isLoading}
      />
    </DemoPage>
  )
})

export default Page
