import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => ({ addresses: ARM.query('addresses', {}) })

export default Model
