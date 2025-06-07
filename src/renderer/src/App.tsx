import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Titlebar } from './components/titleBar'
function App(): React.JSX.Element {
  return (
    <Router>
      <MantineProvider>
        <Notifications />
        <Titlebar />
        <br /> <br />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MantineProvider>
    </Router>
  )
}

export default App
