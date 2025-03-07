import React from 'react'
import Layout from './components/layout/Layout';
import { Route, Router } from 'react-router-dom';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';

import
function App() {

  return (
    <Layout>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="login/" element={<LoginPage />} />

      </Routes>
    </Layout>
  )
}


export default App
