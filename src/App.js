import './App.css'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ApiResourceManager from './api-resource-manager'

export const ARM = new ApiResourceManager(['related-keywords'])

ARM.setHost('https://team-staging.metromart.com')
ARM.setHeadersCommon(
  'Authorization',
  `Token ${window.localStorage.getItem('token')}`
)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

const App = observer(() => {
  const relatedKeywords = ARM.getAlias('relatedKeywords', [])

  useEffect(() => {
    ARM.query('related-keywords', {}, { alias: 'relatedKeywords' })
  }, [])

  return (
    <div className="App">
      <h3>Related Keywords</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>KIND</th>
          <th>ACTION</th>
        </tr>

        {relatedKeywords.map((relatedKeyword, index) => (
          <tr key={index}>
            <td>{relatedKeyword.get('id')}</td>
            <td>{relatedKeyword.get('attributes.name')}</td>
            <td>{relatedKeyword.get('attributes.kind')}</td>
            <td>
              <button onClick={() => relatedKeyword.save()}>Save</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
})

export default App
