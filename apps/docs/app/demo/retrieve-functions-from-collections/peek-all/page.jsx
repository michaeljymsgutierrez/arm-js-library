'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'
import Controller from './controller'

const Page = observer(() => {
  const { isLoading } = Model()
  const { addresses } = Controller()

  return (
    <DemoPage
      title="peekAll()"
      method="No request - reads the local collection directly"
      guideHref="/docs/guides/collections#retrieve-functions">
      <AddressesTable addresses={addresses} isLoading={isLoading} />
    </DemoPage>
  )
})

export default Page
