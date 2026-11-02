'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

  return (
    <DemoPage
      title="findRecord()"
      method="GET /addresses/2519858?include=user"
      guideHref="/docs/guides/request-functions">
      <AddressesTable addresses={isLoading ? [] : [address]} isLoading={isLoading} />
    </DemoPage>
  )
})

export default Page
