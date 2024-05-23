import { useEffect } from 'react'
import * as lodash from 'lodash'
import { observer } from 'mobx-react-lite'
import { ARM } from '../App'

const TestComponent = observer(() => {
  const cities = ARM.getCollection('cities')
  const citiesResults = ARM.getAlias('citiesResults')
  const currentCity = ARM.getAlias('currentCity')

  console.log('Child rerendering...')

  useEffect(() => {
    // ARM.queryRecord('cities', 17, {}, { alias: 'currentCity'})
    ARM.queryRecord('cities', 19, {}, { alias: 'currentCity' })

    ARM.query('cities', {
      filter: { 'area.id': 131, id: '22,23' },
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

    // console.log(firstCity.getProperty('id'))
    // console.log(firstCity.getProperty('attributes.name'))

    // firstCity.setProperty('attributes.name', 'Baltimore City')
    firstCity.setProperties({ attributes: { name: 'Baltimore City' } })
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
      <div class="form-container">
        <div class="form-field">
          <span class="form-field-label">Name:</span>
          <input
            value={currentCity?.getProperty('attributes.name')}
            onChange={(event) =>
              currentCity?.setProperty('attributes.name', event.target.value)
            }
          />
        </div>
        <div class="form-field">
          <span class="form-field-label">Priority:</span>
          <input
            type="number"
            value={currentCity?.getProperty('attributes.priority')}
            onChange={(event) =>
              currentCity?.setProperty('attributes.priority', event.target.value)
            }
          />
        </div>
        <div class="form-field">
          <span class="form-field-label">Latitude:</span>
          <input
            value={currentCity?.getProperty('attributes.label-latitude')}
            onChange={(event) =>
              currentCity?.setProperty('attributes.label-latitude', event.target.value)
            }
          />
        </div>
        <div class="form-field">
          <span class="form-field-label">Longitude:</span>
          <input
            value={currentCity?.getProperty('attributes.label-longitude')}
            onChange={(event) =>
              currentCity?.setProperty('attributes.label-longitude', event.target.value)
            }
          />
        </div>
        <div class="form-field">
          <button onClick={updateCity}>Update</button>
        </div>
      </div>
    </div>
  )
})

export default TestComponent
