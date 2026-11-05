'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'

const Page = observer(() => {
  const { addresses } = Model()

  return (
    <DemoPage
      title="query()"
      method="GET /addresses"
      guideHref="/docs/guides/request-functions">
      <AddressesTable addresses={addresses.data} isLoading={addresses.isLoading} />
    </DemoPage>
  )
})

export default Page
