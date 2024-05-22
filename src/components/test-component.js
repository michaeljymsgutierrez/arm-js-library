import { useEffect } from 'react'
import * as lodash from 'lodash'
import { observer } from 'mobx-react-lite'
import { ARM } from '../App'

const TestComponent = observer(() => {
  const cities = ARM.getCollection('cities')
  const citiesResults = ARM.getAlias('citiesResults')
  const currentCity = ARM.getAlias('currentCity')
  //
  // console.log('Child rerendering...')
  //
  useEffect(() => {
    // ARM.queryRecord('cities', 17, {}, { alias: 'currentCity'})
    ARM.queryRecord('cities', 19, {}, { alias: 'currentCity'})

    ARM.query('cities', {
      filter: { 'area.id': 131 , id: '22,23' },
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
    // const firstCity = lodash.find(citiesResults, { id: 17 })
    // const secondCity = lodash.find(citiesResults, { id: 21 })
    // firstCity.attributes.name = 'Los Angeles'
    // secondCity.attributes.name = 'Las Vegas'
    // currentCity.attributes.name = 'Los Angeles'
    // console.log(currentCity)

    // set
    //   mobx
    //   lodash
    //
    //   currentCity
    //
    //   set(object, { key: value })
    //   set(object, 'key.attribute.name', value)
    //
    //
    //   currentCity.set('key.attribute.name', value)
    //   currentCity.set('relationships.area.data.id', value)
    //   currentCity.setProperties({
    //     name: 'Makati',
    //     slug: '/makati'
    //   })
    //
    // ARM.set(currentCity, {
    //   attibutes: {
    //     name: 'Makati', slug: '/makati'
    //   },
    //   relationships: {
    //     area: { data: { id: 1
    //       }
    //     }
    //   }
    // })

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
