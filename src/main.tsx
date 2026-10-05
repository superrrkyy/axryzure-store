import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

/* Self-hosted variable fonts (no external requests at runtime). */
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/jetbrains-mono'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
