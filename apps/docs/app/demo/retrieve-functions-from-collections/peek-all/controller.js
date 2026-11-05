import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => ({ addresses: ARM.peekAll('addresses') })

export default Controller
