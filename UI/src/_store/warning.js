export const warningInitialState = {
  filter: {
    distance: 5000,
    inHours: 72,
    fromFollowees: false,
  },
  curWarningID: null,
};

export const getWarningByID = (warnings, wid) => {
  return warnings.find((e) => e.id === wid);
};

const getWarningIndexByID = (warnings, wid) => {
  return warnings.findIndex((e) => e.id === wid);
};

export const warningReducer = (state, action) => {
  switch (action.type) {
    case 'set_warnings':
      return {
        ...state,
        ...action.payload,
      };

    case 'update': {
      const newState = { ...state };
      const newWarning = action.payload;
      const id = getWarningIndexByID(newState.results.features, newWarning.id);
      newState.results.features[id] = newWarning;

      return {
        ...state,
        ...newState,
      };
    }

    case 'set_current_warning':
      return {
        ...state,
        ...action.payload,
      };

    case 'create_warning': {
      const newState = { ...state };
      const newWarning = action.payload;
      newState.results.features.unshift(newWarning);

      return {
        ...state,
        ...newState,
      };
    }

    case 'reset':
      return { ...warningInitialState };

    default:
      return state;
  }
};
