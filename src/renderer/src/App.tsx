import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Titlebar } from './components/titleBar'
import { Sidebar } from './components/sideBar/sidebar'
function App(): React.JSX.Element {
  return (
    <Router>
      <MantineProvider>
        <Notifications />
        <Titlebar />
        <Sidebar>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Sidebar>
      </MantineProvider>
    </Router>
  )
}

export default App
