

export default function reducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload
      }
    default: return state
  }
};
