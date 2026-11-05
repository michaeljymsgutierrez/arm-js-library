import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => ({ addressesRequest: ARM.getRequestAlias('customerAddresses') })

export default Controller
