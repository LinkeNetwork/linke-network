

export default function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_ACCOUNTS':
      return {
      ...state,
      accounts:action.payload
    }
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload
      }
    default: return state
  }
};
