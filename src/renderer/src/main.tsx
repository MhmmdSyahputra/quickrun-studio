import './assets/main.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/notifications/styles.css'
import '@mantine/core/styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
