import { combineReducers } from 'redux';
import meals from './meal';
import drinks from './drink';

const rootReducer = combineReducers<any>({ drinks, meals });

export default rootReducer;
