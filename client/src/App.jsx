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
import ResetPasswordPage from './pages/reset-password'
import RequestConfirmationPage from './pages/request-confirmation'
import ConfirmAccountPage from './pages/confirm-account'
import PageNotFound from './pages/page-not-found'
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
            path='movies/:id'
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
            path='request-confirmation'
            element={<RequestConfirmationPage />}
          />

          <Route
            path='confirm-account'
            element={<ConfirmAccountPage />}
          />

          <Route
            path='forgot-password'
            element={<ForgotPasswordPage />}
          />

          <Route
            path='reset-password'
            element={<ResetPasswordPage />}
          />

          <Route
            path='*'
            element={<PageNotFound />}
          />
        </Routes>
      </Layout>
      {isOn && <Notification />}
    </BrowserRouter>
  )
}
