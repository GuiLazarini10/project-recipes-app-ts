import { NEW_MEAL } from '../actions/index';

type ActionType = {
  type: string,
  payload: string,
};
export const INITIAL_STATE = {
  object: '',
};

function mealReducer(state = INITIAL_STATE, action:ActionType) {
  switch (action.type) {
    case NEW_MEAL:
      return { ...state, object: action.payload };
    default:
      return state;
  }
}

export default mealReducer;
