import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import loginImg from '../assets/LoginSignup/signup-img.png'; 
import axios from 'axios'
const googleIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png';
const appleIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png';
const microsoftIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('donor'); 


const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        const res = await axios.post(
            'http://localhost:5000/api/auth/register',
            {
                fullName,
                username,
                email,
                password,
                role
            }
        );

        alert('Signup successful!');
        console.log(res.data);

    } catch (error) {
        alert(error.response?.data?.message || 'Signup failed');
        console.error(error);
    }
};


    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-2 sm:p-4">
            <div className="flex w-full h-auto max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="hidden lg:flex w-1/2 items-center justify-center relative bg-cover bg-center text-white"
                     style={{
                         backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('${loginImg}')`
                     }}>
                    <div className="text-center p-8">
                        <h1 className='text-4xl font-bold text-red-600 drop-shadow-lg leading-tight mb-4'>Join the Lifesaving Network.</h1>
                        <h2 className='text-xl text-gray-200'>
                            Create your PulseLink account and become a vital part of our community. Your journey to make a difference starts now.
                        </h2>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-4xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-gray-600 mt-2">Let's get you started!</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-red-500"
                                placeholder="Full Name *"
                                required
                            />
                        </div>
                        <div className="mb-4">
                             <div className="flex rounded-lg bg-gray-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setRole('donor')}
                                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                        role === 'donor' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Donor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seeker')}
                                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                        role === 'seeker' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Seeker
                                </button>
                                
                            </div>
                        </div>
                         <div className="mb-4">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-red-500"
                                placeholder="Enter username *"
                                required
                            />
                        </div>
                         <div className="mb-4">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-red-500"
                                placeholder="Email Address *"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-red-500"
                                placeholder="Password *"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-red-500"
                                placeholder="Confirm Password *"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-lg bg-white hover:bg-gray-100 transition duration-200"
                            aria-label="Sign up with Google"
                        >
                            <img src={googleIcon} alt="Google" className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-lg bg-white hover:bg-gray-100 transition duration-200"
                            aria-label="Sign up with Apple"
                        >
                            <img src={appleIcon} alt="Apple" className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-lg bg-white hover:bg-gray-100 transition duration-200"
                            aria-label="Sign up with Microsoft"
                        >
                            <img src={microsoftIcon} alt="Microsoft" className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

