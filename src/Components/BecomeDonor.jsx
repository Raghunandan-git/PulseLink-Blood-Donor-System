//Components/BecomeDonor.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Calendar as CalendarIcon, MapPin, Phone, ArrowRight, CheckCircle, AlertCircle, Weight, User, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTint } from 'react-icons/fa';
import axios from 'axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

/* ------------------ HELPERS ------------------ */
const getAge = (dob) => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const daysSinceLastDonation = (date) => {
  if (!date) return 9999;
  const last = new Date(date);
  const today = new Date();
  return Math.floor((today - last) / (1000 * 60 * 60 * 24));
};

/* ------------------ CUSTOM CALENDAR COMPONENT ------------------ */
const CustomCalendar = ({ label, value, onChange, name, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  const generateDays = useCallback(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    for (let i = 0; i < firstDay; i++) calendar.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendar.push(new Date(year, month, d));
    return calendar;
  }, [viewDate]);

  const handleDateSelect = (date) => {
    if (!date) return;
    const formatted = date.toISOString().split('T')[0];
    onChange({ target: { name, value: formatted } });
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between cursor-pointer hover:border-red-300 transition focus-within:ring-2 focus-within:ring-red-100"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <CalendarIcon size={18} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in duration-150">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18}/></button>
            <span className="font-bold text-gray-800">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={18}/></button>
          </div>
          <div className="grid grid-cols-7 mb-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {DAYS.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateDays().map((date, i) => (
              <div 
                key={i} 
                onClick={() => handleDateSelect(date)}
                className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm transition cursor-pointer
                  ${!date ? 'pointer-events-none' : 
                    value === date?.toISOString().split('T')[0] ? 'bg-red-600 text-white font-bold' : 'hover:bg-red-50 text-gray-700'}
                `}
              >
                {date?.getDate()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------ MAIN PAGE ------------------ */
const BecomeDonor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    bloodType: '',
    phone: '',
    address: '',
    lastDonation: '',
    weight: '',
    latitude: null,
  longitude: null
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const age = getAge(formData.dob);
  const daysGap = daysSinceLastDonation(formData.lastDonation);

  const isEligible =
    age >= 18 &&
    age <= 65 &&
    Number(formData.weight) >= 50 &&
    daysGap >= 90;

  const eligibilityMessage = () => {
    if (!formData.dob || !formData.weight) return null;
    if (age < 18) return 'You must be at least 18 years old';
    if (age > 65) return 'Maximum allowed age is 65';
    if (formData.weight < 50) return 'Minimum weight required is 50 kg';
    if (daysGap < 90) return 'Last donation must be at least 90 days ago';
    return null;
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isEligible) {
      setError('Check eligibility rules before proceeding');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
  fullName: formData.fullName,
  bloodGroup: formData.bloodType,
  phone: formData.phone,
  dob: formData.dob,
  weight: Number(formData.weight),
  address: formData.address,
  latitude: formData.latitude,
  longitude: formData.longitude
};
if (formData.latitude===null || formData.longitude===null) {
  setError("Location not detected yet. Please allow location access.");
  return;
}


      await axios.post('http://localhost:5000/api/donors/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Donor profile created successfully! Redirecting...');
      setTimeout(() => navigate('/donor/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving donor profile');
    }
  };

  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      },
      (error) => {
        console.error("Location error:", error);
        setError("Location access is required to register as donor");
      }
    );
  } else {
    setError("Geolocation not supported in this browser");
  }
}, []);

  return (
    <div className="bg-red-50 min-h-screen pt-8 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-8 hover:text-red-600 transition font-medium">
          <ChevronLeft size={20} /> Back to Home
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Become a PulseLink Donor</h1>
          <p className="text-gray-500 mt-2 text-lg">Your blood donation can give someone another chance at life.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* FORM SECTION */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-red-100 border border-white">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
              <div className="bg-red-100 p-3 rounded-2xl">
                <FaTint className="text-red-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Donor Profile</h2>
                <p className="text-sm text-gray-400">Fill in your medical and contact details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-gray-400" />
                  <input name="fullName" required placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 transition" onChange={handleChange} />
                </div>
              </div>

              <CustomCalendar 
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Blood Group</label>
                <select name="bloodType" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 transition bg-white appearance-none" onChange={handleChange}>
                  <option value="">Select Group</option>
                  {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-4 text-gray-400" />
                  <input name="phone" required placeholder="00000 00000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 transition" onChange={handleChange} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Weight (kg)</label>
                <div className="relative">
                  <Weight size={16} className="absolute left-4 top-4 text-gray-400" />
                  <input name="weight" type="number" required placeholder="Min 50kg" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 transition" onChange={handleChange} />
                </div>
              </div>

              <CustomCalendar 
                label="Last Donation (Optional)"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={handleChange}
                placeholder="Leave blank if first time"
              />

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                  <textarea name="address" required placeholder="Current Residential Address" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 transition min-h-[100px]" onChange={handleChange} />
                </div>
              </div>

              {eligibilityMessage() && (
                <div className="md:col-span-2 flex items-center gap-3 bg-red-50 p-4 rounded-2xl text-red-600 text-sm border border-red-100 animate-pulse">
                  <AlertCircle size={20} className="shrink-0" />
                  <span className="font-medium">{eligibilityMessage()}</span>
                </div>
              )}

              {error && <p className="text-red-600 md:col-span-2 font-bold text-center">{error}</p>}
              {success && <p className="text-green-600 md:col-span-2 font-bold text-center">{success}</p>}

              <button
                type="submit"
                disabled={!isEligible}
                className={`md:col-span-2 py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg
                  ${isEligible ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-200 active:scale-[0.98]' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Register as Donor <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* SIDEBAR RULES */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200 border border-gray-50">
              <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3 text-gray-800">
                <CheckCircle className="text-green-500" size={24} /> Eligibility Checklist
              </h3>
              <ul className="space-y-6">
                {[
                  { label: "Age Limit", val: "18 – 65 Years", icon: "🎂" },
                  { label: "Minimum Weight", val: "50 Kilograms", icon: "⚖️" },
                  { label: "Donation Gap", val: "90 Days", icon: "⏳" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-gray-700 font-bold">{item.val}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-3">Every Drop Counts</h4>
                <p className="text-red-100 text-sm leading-relaxed mb-4">You are joining a global community of life-savers. PulseLink connects you to real-time emergencies.</p>
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>
              <FaTint className="absolute -bottom-4 -right-4 text-white/10 text-9xl rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeDonor;