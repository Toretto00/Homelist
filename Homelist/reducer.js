export const initialState = {
  user: null,
  auth_token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH_DATA":
      let new_state = state;
      if (
        action.data.user !== undefined &&
        action.data.auth_token !== undefined
      ) {
        new_state = {
          ...state,
          user: action.data.user,
          auth_token: action.data.auth_token,
        };
      } else if (action.data.user === undefined && action.data.auth_token) {
        new_state = {
          ...state,
          auth_token: action.data.auth_token,
        };
      } else if (action.data.user && action.data.auth_token === undefined) {
        new_state = {
          ...state,
          user: action.data.user,
        };
      }
      return new_state;

    default:
      return state;
  }
};

export default reducer;
