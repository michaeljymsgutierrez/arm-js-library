'use client'

import { observer } from 'mobx-react'
import DemoPage from '@/components/demo/demo-page'
import AddressesTable from '@/components/demo/addresses-table'
import Controller from './controller'
import Model from './model'

const Page = observer(() => {
  const { isLoading } = Model()
  const { customerAddress } = Controller()

  return (
    <DemoPage
      title="Passed arguments (resource, id, params, config)"
      method="GET /addresses/2519858?include=user"
      guideHref="/docs/guides/request-functions#passed-arguments">
      <AddressesTable
        addresses={isLoading ? [] : [customerAddress]}
        isLoading={isLoading}
      />
    </DemoPage>
  )
})

export default Page
