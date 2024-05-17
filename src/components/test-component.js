import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Store } from '../App'

const TestComponent = observer(() => {
  const cities = Store.getCollection('cities')
  const citiesResults = Store.getAlias('citiesResults')

  useEffect(() => {
    Store.query(
      'cities',
      {
        filter: { 'area.id': 131 },
        sort: 'priority',
      },
      { alias: 'citiesResults' }
    )

    // Store.query('cities', {
    //   filter: { 'area.id': 131, id: 2 },
    //   sort: 'priority',
    // })
  }, [])

  return (
    <div>
      <label>Cities from test component</label>
      <ul>
        {cities?.map((city, index) => (
          <li key={index}>{city.attributes.name} - from collection</li>
        ))}
      </ul>
      ----
      <ul>
        {citiesResults?.map((city, index) => (
          <li key={index}>{city.attributes.name} - from alias</li>
        ))}
      </ul>
    </div>
  )
})

export default TestComponent
