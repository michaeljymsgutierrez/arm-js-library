import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => ({ addresses: ARM.findAll('addresses') })

export default Model
