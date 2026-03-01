import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import loginImg from '../assets/LoginSignup/login-page-img.png';
const googleIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png';
const appleIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png';
const microsoftIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png';

const Login = () => {
   const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      {
        email,
        password
      }
    );

    // Save auth data
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);

    const role = res.data.role;

if (role === 'donor') {
  navigate('/donor/dashboard');
} else if (role === 'seeker') {
  navigate('/seeker/dashboard');
} else if (role === 'admin') {
  navigate('/admin');
}


    console.log('Login response:', res.data);

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Login failed');
  }
};


    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-2 sm:p-4">
            <div className="flex w-full h-[90vh] sm:h-[90vh] max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="hidden lg:flex w-1/2 items-center justify-center relative bg-cover bg-center text-white "
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('${loginImg}')`
                    }}>
                    <div className="text-center p-8">
                        <h1 className='text-4xl font-bold text-red-600 drop-shadow-lg leading-tight mb-4'>Your Next Great Act Awaits.</h1>
                        <h2 className='text-xl text-gray-200'>
                            Every login is a step closer to saving a life. Thank you for being part of PulseLink.
                        </h2>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-4xl font-bold text-gray-800">Hello Again!</h2>
                        <p className="text-gray-600 mt-2">Welcome back you've been missed!</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="sr-only">Enter email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-red-500"
                                placeholder="Enter Email *"
                                required
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="sr-only">Password</label>
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

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 focus:outline-red-500" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-red-600 hover:text-red-500">Forgot Password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 "
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-lg bg-white hover:bg-gray-100 hover:cursor-pointer transition duration-200"
                            aria-label="Login with Google"
                        >
                            <img src={googleIcon} alt="Google" className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-lg bg-white hover:bg-gray-100 hover:cursor-pointer transition duration-200"
                            aria-label="Login with Apple"
                        >
                            <img src={appleIcon} alt="Apple" className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-lg bg-white hover:bg-gray-100 hover:cursor-pointer transition duration-200"
                            aria-label="Login with Facebook"
                        >
                            <img src={microsoftIcon} alt="Facebook" className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;