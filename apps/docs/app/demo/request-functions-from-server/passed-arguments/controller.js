import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => ({
  customerAddress: ARM.getAlias('customerAddress'),
})

export default Controller
