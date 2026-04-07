import { createContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

function AppProvider({ children }) {
  const [appState, setAppState] = useState({})

  const value = useMemo(() => ({ appState, setAppState }), [appState])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppContext, AppProvider }
