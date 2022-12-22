import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOn: false,
  title: '',
  message: '',
  status: ''
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotif: (state, action) => {
      // console.log(action.payload) // testing
      state.isOn =        true
      state.title =       action.payload.title
      state.message =     action.payload.message
      state.status =      action.payload.status
    },
    hideNotif: (state, action) => {
      state.isOn =        false
      state.title =       ''
      state.message =     ''
      state.status =      ''
    }
  },
})

export const {
  showNotif,
  hideNotif
} = notificationsSlice.actions

// export {  } // async actions

export default notificationsSlice.reducer
