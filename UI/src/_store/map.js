export const mapInitialState = { map: null };

export const mapReducer = (state, action) => {
  switch (action.type) {
    case 'set_map':
      return {
        ...state,
        ...action.payload,
      };

    case 'reset':
      return { ...mapInitialState };

    default:
      return state;
  }
};
