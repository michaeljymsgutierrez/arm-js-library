import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => ({
  addressRequest: ARM.queryRecord('addresses', { filter: { id: 2519858 } }),
})

export default Model
