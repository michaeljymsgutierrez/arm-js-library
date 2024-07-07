'use client'

import { useRouter } from 'next/navigation'
import { ARM } from '@arm-config-wrapper'

const Controller = (props) => {
  const router = useRouter()
  const onClickCancel = () => router.push('/addresses', { scroll: false })

  return { onClickCancel }
}

export default Controller
