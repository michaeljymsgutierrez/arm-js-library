'use client'

import { useRouter } from 'next/navigation'
import { ARM } from '@arm-config-wrapper'

const Controller = (props) => {
  const router = useRouter()

  const onClickCancel = () => {
    const queryParams = new URLSearchParams({
      skipId: new Date().getTime(),
    }).toString()
    router.push(`/addresses?${queryParams}`, { scroll: false })
  }

  const onClickSave = (address) => {
    const queryParams = new URLSearchParams({
      skipId: new Date().getTime(),
    }).toString()
    address
      .save()
      .then(() => router.push(`/addresses?${queryParams}`, { scroll: false }))
  }

  return { onClickCancel, onClickSave }
}

export default Controller
