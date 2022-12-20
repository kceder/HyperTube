import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Redux
import { useSelector } from 'react-redux'

import Layout from './components/layout'
import Hero from './components/hero'
import AuthPage from './pages/auth'
import OAuthPage from './pages/oauth'
import SignUpPage from './pages/sign-up'
import ProfilePage from './pages/profile'
import ResetPasswordPage from './pages/reset-password'
import Notification from './components/notification'

export default function Home() {
  // Redux
  const { isOn } = useSelector((slices) => slices.notifications)

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path='/'
            element={<Hero />}
          />

          <Route
            path='sign-up'
            element={<SignUpPage />}
          />

          <Route
            path='profile'
            element={<ProfilePage />}
          />

          <Route
            path='auth'
            element={<AuthPage />}
          />

          <Route
            path='oauth/:provider'
            element={<OAuthPage />}
          />

          <Route
            path='reset-password'
            element={<ResetPasswordPage />}
          />
        </Routes>
      </Layout>
      {isOn && <Notification />}
      {/* {isOn && <Notification
        title='test'
        message='testing testing testing testing testing testing testing testing'
        status='error'
      />} */}
    </BrowserRouter>
  )
}
