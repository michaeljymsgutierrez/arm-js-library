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
      title="getCollection()"
      method="No request - returns every record currently in the collection"
      guideHref="/docs/guides/collections#retrieve-functions">
      <AddressesTable addresses={addresses} isLoading={isLoading} />
    </DemoPage>
  )
})

export default Page
