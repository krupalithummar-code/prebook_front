import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
// $2b$08$xL0dlDuB25QTbe3pf6hmPekge4yEvvnXC3wvQmY69lxSi4dNSsLie
const Login = () => {
    const navigate = useNavigate()
    const backend_Url = "https://381300edb6ac.ngrok-free.app"

    // State variable
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Function to handle Login
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${backend_Url}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nameOrEmail: email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.message || 'Login failed. Please try again.')
                return
            }

            toast.success(data.message || "Login successful!")
            setTimeout(() => {
                navigate("/dashboard")
            }, 1000);
        } catch (error) {
            console.error('Error during login:', error)
        } finally {
            setEmail("")
            setPassword("")
        }
    }

    return (
        <div className="login-main">
            <div className="login-wrapper">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
