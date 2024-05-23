import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ApiResourceManager from './api-resource-manager'
import TestComponent from './components/test-component'

export const ARM = new ApiResourceManager(['cities', 'areas'])

ARM.setHost('https://www.metromart.com')
ARM.setHeadersCommon('Authorization', `Token ${window.localStorage.getItem('token')}`)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')

const App = observer(() => {
  // const currentCity = ARM.getAlias('currentCity')
  // const cities = ARM.getCollection('cities')
  // const citiesResults = ARM.getAlias('citiesResults')

  // useEffect(() => {
  //   ARM.query('cities', {
  //     filter: { 'area.id': 131 },
  //     sort: 'priority',
  //   })
  //
  //   ARM.query('cities', {
  //     filter: { 'area.id': 131, id: 2 },
  //     sort: 'priority',
  //   })
  // }, [])
  console.log('Parent rerendering...');

  return (
    <div className="App">
      <div>API Resource Manager</div>
      <label>Cities from parent component</label>
      {/* <ul> */}
      {/*   {cities?.map((city, index) => ( */}
      {/*     <li key={index}>{city.attributes.name} - from collection</li> */}
      {/*   ))} */}
      {/* </ul> */}
      {/* ---- */}
      {/* <ul> */}
      {/*   {citiesResults?.map((city, index) => ( */}
      {/*     <li key={index}>{city.attributes.name} - from alias</li> */}
      {/*   ))} */}
      {/* </ul> */}
      {/* ---- */}
      {/* <ul> */}
      {/*   <li>{currentCity?.attributes.name} - from alias of single data</li> */}
      {/* </ul> */}
      <TestComponent />
    </div>
  )
})

export default App
