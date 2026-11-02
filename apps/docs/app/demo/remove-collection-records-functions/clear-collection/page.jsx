'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import { ARM } from '@/components/providers/arm-config-provider'
import Model from './model'

const Page = observer(() => {
  const { addresses } = Model()

  return (
    <DemoPage
      title="clearCollection()"
      method="No request - empties the local collection, aliases, and request hashes"
      guideHref="/docs/guides/collections#remove">
      <AddressesTable
        addresses={addresses.data}
        isLoading={addresses.isLoading}
        footer={
          !addresses.isLoading && (
            <button
              className="blue-btn"
              onClick={() => ARM.clearCollection('addresses')}>
              Clear Collection
            </button>
          )
        }
      />
    </DemoPage>
  )
})

export default Page
