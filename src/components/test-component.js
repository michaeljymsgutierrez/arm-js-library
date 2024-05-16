import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { RS } from '../App'

const TestComponent = observer(() => {
  const { cities, citiesResults } = RS;

  useEffect(() => {
    RS.query('cities', {
      filter: { 'area.id': 131 },
      sort: 'priority',
    })

    RS.query('cities', {
      filter: { 'area.id': 131, id: 2 },
      sort: 'priority',
    })
  }, [])


  return (
    <div>
      <label>Cities from test component</label>
      <ul>
        {cities.map((v, i) => (
          <li key={i}>{v.attributes.name}</li>
        ))}
      </ul>
    </div>
  )
})

export default TestComponent
