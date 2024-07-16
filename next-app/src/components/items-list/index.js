'use client'

import { observer } from 'mobx-react-lite'
import { ARM } from '@arm-config-wrapper'

const ItemsList = observer(() => {
  const items = ARM.getCollection('items')

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.get('id')} -{' '}
          {item
            .getCollection('products', {
              referenceKey: 'relationships.product.data',
              async: true,
            })
            .map((product, index) => (
              <span key={index}>{product.get('attributes.name')}</span>
            ))}
          ({item.get('attributes.count')})
        </li>
      ))}
    </ul>
  )
})

export default ItemsList
