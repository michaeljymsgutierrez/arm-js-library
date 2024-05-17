import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactStore from './react-store'
import TestComponent from './components/test-component'

export const Store = new ReactStore(['cities', 'areas'])

Store.setHost('https://staging.metromart.com')

const App = observer(() => {
  const cities = Store.getCollection('cities')
  // const citiesResults = Store.getAlias('citiesResults')

  // useEffect(() => {
  //   Store.query('cities', {
  //     filter: { 'area.id': 131 },
  //     sort: 'priority',
  //   })
  //
  //   Store.query('cities', {
  //     filter: { 'area.id': 131, id: 2 },
  //     sort: 'priority',
  //   })
  // }, [])
  console.log('Parent rerendering...');

  return (
    <div className="App">
      <div>React Store</div>
      <label>Cities from parent component</label>
      <ul>
        {cities?.map((city, index) => (
          <li key={index}>{city.attributes.name}</li>
        ))}
      </ul>
      {/* ---- */}
      {/* <ul> */}
      {/*   {citiesResults?.map((city, index) => ( */}
      {/*     <li key={index}>{city.attributes.name} - Test</li> */}
      {/*   ))} */}
      {/* </ul> */}
      <TestComponent />
    </div>
  )
})

export default App
