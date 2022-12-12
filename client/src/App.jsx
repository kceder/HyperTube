import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Hero from './components/hero'
import Layout from './components/layout'

export default function Home() {
  return (
    <BrowserRouter>
    <Layout>
        <Routes>
          <Route path='/'
            element={<Hero />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
