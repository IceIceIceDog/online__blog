import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {userReducer} from './userReducer';
import {themeReducer} from './themeReducer';
import {messageReducer} from './messageReducer';

const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
    messages: messageReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));