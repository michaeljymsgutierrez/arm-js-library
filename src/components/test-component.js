import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Store } from '../App'

const TestComponent = observer(() => {
  const cities = Store.getCollection('cities')
  const citiesResults = Store.getAlias('citiesResults')

  console.log('Child rerendering...');

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

  function updateCity() {
    const firstCity = cities[0]
    const secondCity = cities[1]
    firstCity.attributes.name = 'Los Angeles'
    secondCity.attributes.name = 'Las Vegas'
  }

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
      <button onClick={updateCity}>Update First City</button>
    </div>
  )
})

export default TestComponent
