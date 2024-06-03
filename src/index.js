import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import ApiResourceManager from './api-resource-manager'

export const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHost('https://www.metromart.com')
ARM.setHeadersCommon(
  'Authorization',
  `Token ${window.localStorage.getItem('token')}`
)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
