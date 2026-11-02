'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'
import Controller from './controller'

const Page = observer(() => {
  const { isLoading } = Model()
  const { addressesRequest } = Controller()

  return (
    <DemoPage
      title="getRequestAlias()"
      method="No request - reads the full request hash (isLoading/data/meta/...) for the 'customerAddresses' alias"
      guideHref="/docs/guides/collections#retrieve-functions">
      <AddressesTable addresses={addressesRequest?.data ?? []} isLoading={isLoading} />
    </DemoPage>
  )
})

export default Page
