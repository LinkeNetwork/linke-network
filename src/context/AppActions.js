
export default function actions(state, dispatch) {
  return {
    setState(payload) {
      dispatch({
        type: 'SET_STATE',
        payload
      })
    },
    updateAccounts(payload){
      dispatch({
        type: 'UPDATE_ACCOUNTS',
        payload
      })
    },
  }
}
