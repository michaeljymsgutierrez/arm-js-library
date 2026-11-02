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
      title="unloadRecord()"
      method="No request - removes one record from the local collection only"
      guideHref="/docs/guides/collections#remove">
      <AddressesTable
        addresses={addresses.data}
        isLoading={addresses.isLoading}
        rowActions={(address) => (
          <button className="blue-btn" onClick={() => ARM.unloadRecord(address)}>
            Unload
          </button>
        )}
      />
    </DemoPage>
  )
})

export default Page
