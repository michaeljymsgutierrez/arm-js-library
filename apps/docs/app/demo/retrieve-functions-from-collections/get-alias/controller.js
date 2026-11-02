import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => ({ addresses: ARM.getAlias('customerAddresses', []) })

export default Controller
