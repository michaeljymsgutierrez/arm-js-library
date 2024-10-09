import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './page'
import ARMConfigWrapper, {
  ARM as ApiResourceManager,
} from './components/arm-config-wrapper'

export const ARM = ApiResourceManager

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <ARMConfigWrapper>
    <App />
  </ARMConfigWrapper>
)
