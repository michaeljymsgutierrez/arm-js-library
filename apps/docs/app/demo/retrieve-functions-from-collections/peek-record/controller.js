import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => ({ address: ARM.peekRecord('addresses', 2519858) })

export default Controller
