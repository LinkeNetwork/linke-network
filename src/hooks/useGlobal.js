import { useContext } from 'react'
import { AppContext } from '../context/AppGlobalState'

const useGlobal = () => {
  return useContext(AppContext)
}

export default useGlobal
