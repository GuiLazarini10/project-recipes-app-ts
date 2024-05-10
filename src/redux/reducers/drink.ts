import { NEW_ISDRINK } from '../actions/index';

type ActionType = {
  type: string,
  payload: boolean,
};
 type StateType = object;

export const INITIAL_STATE: StateType = {};

function drinkReducer(state = INITIAL_STATE, action: ActionType) {
  switch (action.type) {
    case NEW_ISDRINK:
      // console.log(action.payload);
      return { ...state, isDrink: action.payload };
    default:
      return state;
  }
}

export default drinkReducer;
