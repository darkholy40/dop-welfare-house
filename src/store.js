import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initState = {
    appContainerClass: 'center',
    url: 'http://164.115.43.132:5010',
    userData: '',
    username: '',
    token: ''
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case 'SET_APP_CLASS':
            return {
                ...state,
                appContainerClass: action.data
            }

        case 'SET_USER_DATA':
            return {
                ...state,
                userData: action.data
            }

        case 'SET_TOKEN':
            return {
                ...state,
                token: action.data.token,
                username: action.data.username
            }

        case 'TOKEN_EXPIRED':
            return {
                ...state,
                token: ''
            }

        case 'GO_LOGOUT':
            return {
                ...state,
                userData: '',
                username: '',
                token: ''
            }

        default:
            break
    }

    return state
}

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [
        'username',
        'token'
    ]
}
  
const persistedReducer = persistReducer(persistConfig, reducer)

export default () => {
    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    return { store, persistor }
}