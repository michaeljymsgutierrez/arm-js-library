import { useEffect } from 'react'
import * as lodash from 'lodash'
import { observer } from 'mobx-react-lite'
import { Store } from '../App'

const TestComponent = observer(() => {
  const cities = Store.getCollection('cities')
  const citiesResults = Store.getAlias('citiesResults')
  const currentCity = Store.getAlias('currentCity')

  console.log('Child rerendering...')

  useEffect(() => {
    Store.queryRecord('cities', 17, {}, { alias: 'currentCity'})

    // Store.query('cities', {
    //   filter: { 'area.id': 131 },
    //   sort: 'priority',
    // })
    //
    // Store.query(
    //   'cities',
    //   {
    //     filter: { 'area.id': 131, id: '17,21' },
    //     sort: 'priority',
    //   },
    //   { alias: 'citiesResults' }
    // )
  }, [])

  function updateCity() {
    // const firstCity = lodash.find(citiesResults, { id: 17 })
    // const secondCity = lodash.find(citiesResults, { id: 21 })
    // firstCity.attributes.name = 'Los Angeles'
    // secondCity.attributes.name = 'Las Vegas'
    currentCity.attributes.name = 'Los Angeles'

    // set(firstCity, { attributes: { name: event.target.value }})
    // firstCity.set('name', 'Makati')
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
      ----
      <ul>
        <li>{currentCity?.attributes.name} - from alias of single data</li>
      </ul>
      <button onClick={updateCity}>Update First City</button>
    </div>
  )
})

export default TestComponent
