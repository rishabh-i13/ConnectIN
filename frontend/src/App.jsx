import { useState } from 'react'
import Layout from './components/layout/Layout'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/auth/LoginPage.jsx'
import SignUpPage from './pages/auth/SignUpPage.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios';
import { useAuthUser } from './lib/hooks.js';
import Chatbot from './components/Chatbot.jsx'
import NotificationsPage from './Pages/NotificationsPage.jsx'

function App() {
  
  const { data: authUser, isLoading } = useAuthUser();

 if(isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes>
      <Chatbot/>
      <Toaster/>
    </Layout>
  )
}

export default App
