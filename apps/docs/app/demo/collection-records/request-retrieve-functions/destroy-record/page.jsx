'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressForm from '@/components/demo/address-form'
import { ARM } from '@/components/providers/arm-config-provider'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

  return (
    <DemoPage
      title="record.destroyRecord()"
      method="DELETE /addresses/:id"
      guideHref="/docs/guides/collection-records#request-and-retrieve-functions">
      {isLoading && <div>Loading...</div>}
      {!isLoading && ARM.isNil(address) && <div>Address has been deleted.</div>}
      {!isLoading && !ARM.isNil(address) && (
        <AddressForm
          address={address}
          actionLabel="Delete"
          busyLabel="Deleting"
          onAction={() => address.destroyRecord()}
        />
      )}
    </DemoPage>
  )
})

export default Page
