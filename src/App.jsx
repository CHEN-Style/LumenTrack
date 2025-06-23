import { useState } from 'react'
import './App.css'
import WelcomePage from './page/welcomePage'
import { ModeProvider, useMode } from './contexts/modeContext'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme/theme'

function App() {
  return (
    <ModeProvider>
      <ThemeWrapper />
    </ModeProvider>
  )
}

function ThemeWrapper() {
  const { mode } = useMode()
  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <WelcomePage />
    </ThemeProvider>
  )
}

export default App
