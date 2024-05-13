import { useEffect } from 'react'
import ReactStore from './react-store'

const RS = new ReactStore()
RS.setHost('https://staging.metromart.com')

function App() {
  useEffect(() => {
    (async () => {
      const results = await RS.query('cities', {
        filter: { 'area.id': 131, id: 1 },
        sort: 'priority',
      })
      console.log(results.data)
    })()
  }, [])

  return <div className="App">React Store</div>
}

export default App
