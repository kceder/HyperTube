// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import authReducer from './authSlice'
import notificationsReducer from './notificationsSlice'
import languageReducer from './languageSlice'

const store = configureStore({
  reducer: {
    auth:           authReducer,
    notifications:  notificationsReducer,
    language:       languageReducer,
  },
})

export default store