import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import RewardsDashboard from './pages/RewardsDashboard'
import CustomerDetail from './pages/CustomerDetail'
import { ToastContainer } from "react-toastify";

function App() {

    return (
        <>
            <ToastContainer position="top-center" hideProgressBar autoClose={3000} />
            <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<RewardsDashboard />} />
                <Route path="/admin-data" element={<CustomerDetail />} />
            </Routes>
        </>
    )
}

export default App
