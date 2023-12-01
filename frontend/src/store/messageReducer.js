const SET = 'set';


const inititalState = {
    messages: null
}

export const messageReducer = (state = inititalState, action) => {
    switch (action.type){
        case SET:
            return {...state, messages: action.payload};
        default:
            return state;
    }
}

export const setAction = (messages) => {
    return {type: SET, payload: messages};
}


