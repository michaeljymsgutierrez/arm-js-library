import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { RS } from '../App'

const TestComponent = observer(() => {
  const { cities, citiesResults } = RS

  useEffect(() => {
    RS.alias('citiesResults').query('cities', {
      filter: { 'area.id': 131 },
      sort: 'priority',
    })

    // RS.query('cities', {
    //   filter: { 'area.id': 131 },
    //   sort: 'priority',
    // }, { alias: 'citiesResults' })

    // RS.query('cities', {
    //   filter: { 'area.id': 131, id: 2 },
    //   sort: 'priority',
    // })
  }, [])

  return (
    <div>
      <label>Cities from test component</label>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>{city.attributes.name}</li>
        ))}
      </ul>
      ----
      <ul>
        {citiesResults?.map((city, index) => (
          <li key={index}>{city.attributes.name} - Test</li>
        ))}
      </ul>
    </div>
  )
})

export default TestComponent
