const LOGIN = 'login';
const LOGOUT = 'logout';
const FETCH_ERROR = 'userFetchError';
const CHANGE_USER = 'change';
const LOADING = 'loading';


const initialState = {
    user: {
        email: '',
        username: '',
        id: '',
        avatar_img: '',
        isActivated: false
    },
    isAuth: false,
    error: {
    fetchingError: false,
    message: '',
    errors: []
    },
    loading: false
}

 export const userReducer = (state = initialState, action) => {
   switch(action.type){
    case LOGIN:
    return {...state, user: {...action.payload}, isAuth: true};
    case LOGOUT:
    return {...state, user: {...action.payload}, isAuth: false};
    case FETCH_ERROR:
    return {...state, error: {
        fetchingError: true,
        message: action.payload.message,
        errors: [ ...action.payload.errors]
    }};
    case CHANGE_USER:
    return {...state, user: {...state.user, ...action.payload}};
    case LOADING:
    return {...state, loading: action.payload};
    default:
        return state;
   }
   };

export  const loginAction = (userData) => {
   return {type: LOGIN, payload: userData}
}

export const logoutAction = () => {
    const user = {email: '', id: '', username: '', isActivated: false};
    return {type: LOGOUT, payload: user};
}

export const errorHandlerAction = (message, errors) => {
   return {type: FETCH_ERROR, payload: {message, errors}};
}

export const changeAction = (fields) => {
   return {type: CHANGE_USER, payload: fields};
}

export const setLoading = (loading) => {
    return {type: LOADING, payload: loading};
}