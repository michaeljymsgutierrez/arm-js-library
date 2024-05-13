import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactStore from './react-store'

const RS = new ReactStore(['cities', 'areas'])

RS.setHost('https://staging.metromart.com')

const App = observer(() => {
  const { cities } = RS;

  useEffect(() => {
    RS.query('cities', {
      filter: { 'area.id': 131, id: 1 },
      sort: 'priority',
    })
  }, [])

  return (
    <div className="App">
      <div>React Store</div>
      <label>Cities</label>
      <ul>
        {cities.map((v, i) => (
          <li key={i}>{v.attributes.name}</li>
        ))}
      </ul>
    </div>
  )
})

export default App
