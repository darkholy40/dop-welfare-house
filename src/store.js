import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initState = {
    appContainerClass: 'center',
    url: 'http://localhost:8080',
    userData: '',
    username: '',
    token: '',
    dopSearchDrawer: false,
    setting: {
        rank: [],
        born: [],
        groups: [],
    }
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

        case 'GET_SETTING':
            return {
                ...state,
                setting: action.data
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

        case 'TRIGGER_SEARCH_DRAWER':
            const setVisibility = action.visibility
            return {
                ...state,
                dopSearchDrawer: setVisibility
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