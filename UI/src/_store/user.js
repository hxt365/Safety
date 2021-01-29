export const userInitialState = null;

export const userReducer = (state, action) => {
  switch (action.type) {
    case 'set_user':
      return {
        ...state,
        ...action.payload,
      };

    case 'logout':
      return userInitialState;

    default:
      return state;
  }
};
