import ReactStore from './react-store'

function App() {
  const RS = new ReactStore()
  RS.setHost('https://staging.metromart.com/api/v1')
  RS.query('cities', {
    filter: {
      'area.id': 131,
      'id': 1
    },
    sort: 'priority'
  })
  return <div className="App">React Store</div>
}

export default App
