import { useEffect } from 'react'
import * as lodash from 'lodash'
import { observer } from 'mobx-react-lite'
import { ARM } from '../App'

const TestComponent = observer(() => {
  const cities = ARM.getCollection('cities')
  const citiesResults = ARM.getAlias('citiesResults', [])
  const currentCity = ARM.getAlias('currentCity', {})

  console.log('Child rerendering...')

  useEffect(() => {
    // ARM.queryRecord('cities', 17, {}, { alias: 'currentCity'})
    ARM.queryRecord('cities', 20, {
      include: 'areas',
    }, { alias: 'currentCity' })

    ARM.query('cities', {
      filter: { 'area.id': 131, id: '22,23' },
      include: 'areas',
      sort: 'priority',
    })
    //
    ARM.query(
      'cities',
      {
        filter: { 'area.id': 131, id: '17,21' },
        sort: 'priority',
      },
      { alias: 'citiesResults' }
    )
  }, [])

  function updateCity() {
    const firstCity = lodash.find(citiesResults, { id: 17 })
    // const secondCity = lodash.find(citiesResults, { id: 21 })

    // console.log(firstCity.get('id'))
    // console.log(firstCity.get('attributes.name'))

    // firstCity.set('attributes.name', 'Baltimore City')
    firstCity.setProperties({ attributes: { name: 'Baltimore City' } })
  }

  return (
    <div>
      <label>Cities from test component</label>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>{city.attributes.name} - from collection</li>
        ))}
      </ul>
      ----
      <ul>
        {citiesResults.map((city, index) => (
          <li key={index}>{city.attributes.name} - from alias</li>
        ))}
      </ul>
      ----
      <ul>
        {/* <li>{currentCity?.attributess.name} - from alias of single data</li> */}
        <li>
          {currentCity.get('attributes.name')} - from alias of single data
        </li>
      </ul>
      {/* <div className="form-container"> */}
      {/*   <div className="form-field"> */}
      {/*     <span className="form-field-label">Name:</span> */}
      {/*     <input */}
      {/*       value={currentCity?.get('attributes.name')} */}
      {/*       onChange={(event) => */}
      {/*         currentCity?.set('attributes.name', event.target.value) */}
      {/*       } */}
      {/*     /> */}
      {/*   </div> */}
      {/*   <div className="form-field"> */}
      {/*     <span className="form-field-label">Priority:</span> */}
      {/*     <input */}
      {/*       type="number" */}
      {/*       value={currentCity?.get('attributes.priority')} */}
      {/*       onChange={(event) => */}
      {/*         currentCity?.set('attributes.priority', event.target.value) */}
      {/*       } */}
      {/*     /> */}
      {/*   </div> */}
      {/*   <div className="form-field"> */}
      {/*     <span className="form-field-label">Latitude:</span> */}
      {/*     <input */}
      {/*       value={currentCity?.get('attributes.label-latitude')} */}
      {/*       onChange={(event) => */}
      {/*         currentCity?.set('attributes.label-latitude', event.target.value) */}
      {/*       } */}
      {/*     /> */}
      {/*   </div> */}
      {/*   <div className="form-field"> */}
      {/*     <span className="form-field-label">Longitude:</span> */}
      {/*     <input */}
      {/*       value={currentCity?.get('attributes.label-longitude')} */}
      {/*       onChange={(event) => */}
      {/*         currentCity?.set('attributes.label-longitude', event.target.value) */}
      {/*       } */}
      {/*     /> */}
      {/*   </div> */}
      {/*   <div className="form-field"> */}
      {/*     <button onClick={updateCity}>Update</button> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  )
})

export default TestComponent
