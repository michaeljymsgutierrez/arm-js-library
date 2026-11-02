import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => ({ addresses: ARM.getCollection('addresses') })

export default Controller
