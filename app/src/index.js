import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './page'
import ApiResourceManager from './api-resource-manager'

export const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHost('https://www.metromart.com')
ARM.setHeadersCommon(
  'Authorization',
  `Token eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTI5ODA4NjAsInR5cGUiOiJjdXN0b21lciIsInNob3AtaWQiOjIwNDgsImlhdCI6MTcxMjI4NDE5Mn0.I14uJ2CclmiqAfMniveoQT878Adn49t5ssmx9F9ewXE`
)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
