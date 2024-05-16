import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactStore from './react-store'
import TestComponent from './components/test-component'

export const RS = new ReactStore(['cities', 'areas'])

RS.setHost('https://staging.metromart.com')

const App = observer(() => {
  const { cities } = RS;

  // useEffect(() => {
  //   RS.query('cities', {
  //     filter: { 'area.id': 131 },
  //     sort: 'priority',
  //   })
  //
  //   RS.query('cities', {
  //     filter: { 'area.id': 131, id: 2 },
  //     sort: 'priority',
  //   })
  // }, [])

  return (
    <div className="App">
      <div>React Store</div>
      <label>Cities from parent component</label>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>{city.attributes.name}</li>
        ))}
      </ul>
      <TestComponent />
    </div>
  )
})

export default App
