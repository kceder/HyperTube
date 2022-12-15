import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  uid: false,
  username: '',
  isLoggedIn: false,
  accessToken: '',
  profilePic: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      console.log(action.payload) // testing
      state.isLoggedIn =  true
      state.uid =         action.payload.uid
      state.username =    action.payload.username
      state.profilePic =  action.payload.profilePic
      state.accessToken = action.payload.accessToken

      // Maybe I'll persiste state to local storage further on...
      const hypertube = {
        uid:          state.uid,
        username:     state.username,
        profilePic:   state.profilePic,
        accessToken:  state.accessToken
      }
      localStorage.setItem('hypertube', JSON.stringify(hypertube))
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.profilePic

      // Parse the state stored in local storage (as JSON string)
      const hypertube = JSON.parse(localStorage.getItem('hypertube'))
      hypertube.profilePic= action.profilePic

      // Persist to local storage too!
      localStorage.setItem('hypertube', JSON.stringify(hypertube))
    },
    logOut: (state, action) => {
      /* Resetting state pointing the whole 'state' to the initialState object,
        doesn't trigger a re-render in the components that subscribed to state
        changes in the slice (with useSelector).
        State reset must be done INDIVIDUALLY for each property! */
      // state = initialState // this doesn't work
      state.isLoggedIn  = false
      state.uid         = initialState.uid
      state.username    = initialState.username
      state.profilePic  = initialState.profilePic
      state.accessToken = initialState.accessToken
      // console.log(`logging out: ${JSON.stringify(state)}`)

      localStorage.removeItem('hypertube')
    }
  },
})

export const {
  logIn,
  logOut,
  setProfilePic,
} = authSlice.actions

// export {  } // async actions

export default authSlice.reducer
