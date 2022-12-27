import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeLanguage: 'en'
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setActiveLanguage: (state, action) => {
      console.log(action.payload) // testing
      state.activeLanguage =  action.payload
    }
  },
})

export const {
  setActiveLanguage
} = languageSlice.actions

// export {  } // async actions

export default languageSlice.reducer
