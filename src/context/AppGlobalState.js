import React, { useReducer } from 'react'
import initState from './AppState'
import appReducer from './AppReducer'
import appActions from './AppActions'
export const AppContext = React.createContext(initState)
  
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer,initState)
  const actions = appActions(state, dispatch)

  return (
    <AppContext.Provider value={{...state, ...actions, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
