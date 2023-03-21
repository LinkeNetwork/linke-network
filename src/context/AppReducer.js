

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
    case 'SET_BUTTON_TEXT':
      return {
      ...state,
      swapButtonText: action.payload
    }
    default: return state
  }
};
