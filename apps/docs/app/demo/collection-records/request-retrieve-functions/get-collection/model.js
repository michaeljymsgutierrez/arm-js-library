import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => ARM.findRecord('users', 12980860, {})

export default Model
