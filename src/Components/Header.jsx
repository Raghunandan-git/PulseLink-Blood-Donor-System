import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/PulseLink-logo-noBG.png';
import { Bell, User, LogOut, LayoutDashboard, Menu, X, ChevronDown, Settings } from "lucide-react";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        if (token) {
            setIsLoggedIn(true);
            setRole(userRole);
        } else {
            setIsLoggedIn(false);
            setRole(null);
        }
        setIsMenuOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/");
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Blood', path: '/find-blood' },
        { name: 'Become a Donor', path: '/become-donor' },
        { name: 'About Us', path: '/about' },
    ];

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoadingNotifications(true);
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
  console.error("Unauthorized or error fetching notifications");
  setNotifications([]); 
  return;
}

const data = await res.json();

if (Array.isArray(data)) {
  setNotifications(data);
} else {
  setNotifications([]);
}
            } catch (err) {
                console.error("Notification fetch error:", err);
            } finally {
                setLoadingNotifications(false);
            }
        };

        if (isLoggedIn) {
            fetchNotifications();
        }
    }, [isLoggedIn]);

    const unreadCount = Array.isArray(notifications)
  ? notifications.filter(n => !n.isRead).length
  : 0;

    return (
        <header className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ${
            isScrolled 
                ? 'bg-white/90 backdrop-blur-md shadow-[0_2px_20px_-5px_rgba(0,0,0,0.1)] py-3' 
                : 'bg-white py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                
                {/* Logo Section */}
                <Link to='/' className='flex items-center gap-3 group'>
                    <div className="relative">
                        <img src={logo} alt="PulseLink-logo" className='h-10 w-auto transition-transform duration-300 group-hover:scale-110' />
                        <div className="absolute -inset-1 bg-red-100 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                    <div className='flex flex-col -space-y-1'>
                        <span className='text-xl font-black tracking-tighter'>
                            <span className='text-red-600 uppercase'>Pulse</span>
                            <span className='text-slate-900 uppercase'>Link</span>
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase">Saving Lives</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center bg-slate-50/50 rounded-full px-2 py-1 border border-slate-100">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            to={link.path} 
                            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-full ${
                                location.pathname === link.path 
                                    ? 'bg-white text-red-600 shadow-sm' 
                                    : 'text-slate-500 hover:text-red-500'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons / Profile */}
                <div className='flex items-center gap-3'>
                    {!isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login" className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-red-600 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-red-600 rounded-full shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-red-300 transition-all active:scale-95">
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            {/* Notification Bell */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setNotificationOpen(!notificationOpen); setProfileOpen(false); }} 
                                    className={`p-2.5 rounded-full transition-all duration-300 ${notificationOpen ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-100'}`}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 bg-red-600 text-[10px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notificationOpen && (
                                    <div className="absolute right-0 mt-4 w-80 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800">Notifications</h3>
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">New</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {loadingNotifications ? (
                                                <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                                            ) : notifications.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 text-sm">No new alerts</div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div key={notif._id} className={`p-4 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.isRead ? "bg-red-50/40" : ""}`}>
                                                        <p className="text-sm font-bold text-slate-800">{notif.title}</p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }}
                                    className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all duration-300 ${profileOpen ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${profileOpen ? 'bg-red-500' : 'bg-red-600 text-white'}`}>
                                        <User size={16} strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-tight hidden sm:inline">Menu</span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-4 w-60 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">{role}</p>
                                        </div>
                                        <div className="p-2">
                                            <button onClick={() => navigate(`/${role}/dashboard`)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors">
                                                <LayoutDashboard size={18} className="text-slate-400" /> Dashboard
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors">
                                                <Settings size={18} className="text-slate-400" /> Settings
                                            </button>
                                            <hr className="my-2 border-slate-50" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600 transition-colors">
                                                <LogOut size={18} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className='lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors'
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className='lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl animate-in slide-in-from-top duration-300'>
                    <nav className="px-6 py-8">
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path} 
                                        className={`block py-4 px-6 text-lg font-bold rounded-2xl transition-colors ${
                                            location.pathname === link.path ? 'bg-red-50 text-red-600' : 'text-slate-800 hover:bg-slate-50'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {!isLoggedIn ? (
                            <div className="grid grid-cols-2 gap-3 mt-8">
                                <Link to="/login" className="py-4 text-center font-bold uppercase tracking-widest text-slate-700 bg-slate-100 rounded-2xl">
                                    Log In
                                </Link>
                                <Link to="/signup" className="py-4 text-center font-bold uppercase tracking-widest text-white bg-red-600 rounded-2xl shadow-lg shadow-red-100">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <button 
                                onClick={handleLogout}
                                className="w-full mt-8 py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-red-600 bg-red-50 rounded-2xl"
                            >
                                <LogOut size={18} /> Logout Account
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;