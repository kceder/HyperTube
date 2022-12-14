import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/layout'
import Hero from './components/hero'
import AuthPage from './pages/auth'

export default function Home() {
  return (
    <BrowserRouter>
    <Layout>
        <Routes>
          <Route path='/'
            element={<Hero />}
          />

          <Route path='auth'
            element={<AuthPage />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
