import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/layout'
import Hero from './components/hero'
import AuthPage from './pages/auth'
import OAuthPage from './pages/oauth'
import SignUpPage from './pages/sign-up'
import ProfilePage from './pages/profile'

export default function Home() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/'
            element={<Hero />}
          />

          <Route path='sign-up'
            element={<SignUpPage />}
          />

          <Route path='profile'
            element={<ProfilePage />}
          />

          <Route path='auth'
            element={<AuthPage />}
          />

          <Route path='oauth/:provider'
            element={<OAuthPage />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
