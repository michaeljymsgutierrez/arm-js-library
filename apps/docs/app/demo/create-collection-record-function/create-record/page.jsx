'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressForm from '@/components/demo/address-form'
import Controller from './controller'

const Page = observer(() => {
  const { address, onSave } = Controller()

  return (
    <DemoPage
      title="createRecord()"
      method="No request until save() - creates a local record first"
      guideHref="/docs/guides/collections#create">
      <AddressForm
        address={address}
        actionLabel="Save"
        busyLabel="Saving"
        onAction={onSave}
      />
    </DemoPage>
  )
})

export default Page
