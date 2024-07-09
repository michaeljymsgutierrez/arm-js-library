'use client'

import { useRouter } from 'next/navigation'
import { ARM } from '@arm-config-wrapper'

const Controller = (props) => {
  const router = useRouter()
  const onClickEdit = (id) =>
    router.push(`/addresses/${id}/edit`, { scroll: false })
  const onClickNew = () => router.push('/addresses/new', { scroll: false })

  return { onClickEdit, onClickNew }
}

export default Controller
