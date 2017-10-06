import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const enhancer = compose(
	process.env.NODE_ENV === 'dev' ?
		applyMiddleware(thunk, createLogger()) :
		applyMiddleware(thunk)
)

export const initStore = (initialState = {}) => {
	return createStore(
		combineReducers(reducers),
		initialState, // TODO Should we use this?
		enhancer);
}
