import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => ({ addresses: ARM.findAll('addresses', { alias: 'customerAddresses' }) })

export default Model
