'use client'

import { useDebouncedCallback } from 'use-debounce'
import { ARM } from '@arm-config-wrapper'

const Controller = (props) => {
  const debounced = useDebouncedCallback((item) => {
    if (item.get('attributes.count') <= 0) {
      item.destroyRecord()
    } else {
      item.save()
    }
  }, 1000)

  const onClickIncrement = (item) => {
    let currentItemCount = item.get('attributes.count') + 1
    item.set('attributes.count', currentItemCount)

    debounced(item)
  }

  const onClickDecrement = (item) => {
    let currentItemCount = item.get('attributes.count') - 1
    item.set('attributes.count', currentItemCount)

    debounced(item)
  }

  return { onClickIncrement, onClickDecrement }
}

export default Controller
