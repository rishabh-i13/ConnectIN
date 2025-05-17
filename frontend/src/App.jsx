import { useState } from 'react'
import Layout from './components/layout/Layout'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/auth/LoginPage.jsx'
import SignUpPage from './Pages/auth/SignUpPage.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios';
import { useAuthUser } from './lib/hooks.js';
import Chatbot from './components/Chatbot.jsx'
import NotificationsPage from './Pages/NotificationsPage.jsx'
import NetworkPage from './Pages/NetworkPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

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
        <Route path="/network" element={authUser ? <NetworkPage /> : <Navigate to="/login" />} />
        <Route path="/post/:postId" element={authUser ? <PostPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Chatbot/>
      <Toaster/>
    </Layout>
  )
}

export default App
