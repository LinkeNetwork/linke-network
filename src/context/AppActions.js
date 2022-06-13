
export default function actions(state, dispatch) {
  return {
    setState(payload) {
      dispatch({
        type: 'SET_STATE',
        payload
      })
    },
  }
}
