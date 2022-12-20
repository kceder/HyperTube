// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import authReducer from './authSlice'
import notificationsReducer from './notificationsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
})

export default store