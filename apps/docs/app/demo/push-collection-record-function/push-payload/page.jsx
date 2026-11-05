'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Model from './model'
import Controller from './controller'

const Page = observer(() => {
  Model()
  const { addresses, onPushRecord } = Controller()

  return (
    <DemoPage
      title="pushPayload()"
      method="Fetches raw JSON via ajax(), then pushes it into the collection directly"
      guideHref="/docs/guides/collections#push">
      <AddressesTable
        addresses={addresses}
        footer={
          <button className="blue-btn" onClick={onPushRecord}>
            Push Record (2518368)
          </button>
        }
      />
    </DemoPage>
  )
})

export default Page
