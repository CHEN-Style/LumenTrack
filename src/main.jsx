import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes.jsx'
import { ModeProvider, useMode } from './contexts/modeContext'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme/theme'

createRoot(document.getElementById('root')).render(
  <ModeProvider>
    <ThemeWrapper />
  </ModeProvider> 
)

function ThemeWrapper() {
  const { mode } = useMode()
  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
