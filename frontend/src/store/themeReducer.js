const CHANGE = 'change';

const initialState = {
    theme: localStorage.getItem('theme') || 'light'
};

export const themeReducer = (state = initialState, action) => {
    switch (action.type){
        case CHANGE:
            return {...state, theme: action.payload};
        default:
            return state;
    }
};

export const changeAction = (theme) => {
    return {type: 'change', payload: theme};
}