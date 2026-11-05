'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressForm from '@/components/demo/address-form'
import Model from './model'

const Page = observer(() => {
  const { isLoading, data: address } = Model()

  return (
    <DemoPage
      title="record.reload()"
      method="GET /addresses/:id"
      guideHref="/docs/guides/collection-records#request-and-retrieve-functions">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AddressForm
          address={address}
          actionLabel="Reload"
          busyLabel="Reloading"
          onAction={() => address.reload()}
        />
      )}
    </DemoPage>
  )
})

export default Page
