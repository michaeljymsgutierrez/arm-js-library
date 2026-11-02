'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressForm from '@/components/demo/address-form'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

  return (
    <DemoPage
      title="record.rollbackAttributes()"
      method="No request - reverts local edits to the last-saved state"
      guideHref="/docs/guides/collection-records#request-and-retrieve-functions">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AddressForm
          address={address}
          actionLabel="Rollback Attributes"
          busyLabel="Rollback Attributes"
          onAction={() => address.rollbackAttributes()}
        />
      )}
    </DemoPage>
  )
})

export default Page
