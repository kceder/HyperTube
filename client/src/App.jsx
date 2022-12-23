import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Redux
import { useSelector } from 'react-redux'

import Layout from './components/layout'
import HomePage from './pages/home'
import AuthPage from './pages/auth'
import MoviePage from './pages/movie'
import OAuthPage from './pages/oauth'
import SignUpPage from './pages/sign-up'
import ProfilePage from './pages/profile'
import ForgotPasswordPage from './pages/forgot-password'
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
            element={<HomePage />}
          />

          <Route
            path='movie/:id'
            element={<MoviePage />}
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
            path='forgot-password'
            element={<ForgotPasswordPage />}
          />
        </Routes>
      </Layout>
      {isOn && <Notification />}
    </BrowserRouter>
  )
}
