'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'
import Controller from './controller'

const Page = observer(() => {
  const { isLoading } = Model()
  const { address } = Controller()

  return (
    <DemoPage
      title="peekRecord()"
      method="No request - reads one record from the local collection directly"
      guideHref="/docs/guides/collections#retrieve-functions">
      <AddressesTable
        addresses={!isLoading && address ? [address] : []}
        isLoading={isLoading}
      />
    </DemoPage>
  )
})

export default Page
