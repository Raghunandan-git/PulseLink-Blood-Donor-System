import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  User, Droplet, Phone, MapPin, Calendar, Weight,
  Award, Activity, CheckCircle, AlertCircle, Edit3, Clock,
  BabyIcon, ChevronRight
} from 'lucide-react';
import { io } from "socket.io-client";
const DonorDashboard = () => {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]);
  const [donationLoading, setDonationLoading] = useState(true);
  const [requests, setRequests] = useState([]);
const [requestLoading, setRequestLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/donors/profile');
        setDonor(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations/me');
        setDonations(res.data);
      } catch (err) {
        console.error('Error fetching donations');
      } finally {
        setDonationLoading(false);
      }
    };

    fetchProfile();
    fetchDonations();
  }, []);

  const getDaysUntilEligible = () => {
    if (!donor?.lastDonationDate) return null;
    const lastDate = new Date(donor.lastDonationDate);
    const nextEligibleDate = new Date(lastDate);
    nextEligibleDate.setDate(lastDate.getDate() + 90);
    const diffTime = nextEligibleDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = getDaysUntilEligible();

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isEligible = () => {
    if (!donor?.dob || !donor?.weight) return false;
    const age = calculateAge(donor.dob);
    if (age < 18 || age > 65) return false;
    if (donor.weight < 50) return false;
    if (donor.lastDonationDate) {
      const last = new Date(donor.lastDonationDate);
      const diffDays = (new Date() - last) / (1000 * 60 * 60 * 24);
      if (diffDays < 90) return false;
    }
    return true;
  };

  const eligible = isEligible();

  const toggleAvailability = async () => {
    try {
      const res = await api.patch('/donors/availability');
      setDonor(prev => ({
        ...prev,
        isAvailable: res.data.isAvailable,
        isEligible: true
      }));
    } catch (err) {
      setDonor(prev => ({ ...prev, isAvailable: false, isEligible: false }));
    }
  };

  const fetchRequests = async () => {
  try {
    const res = await api.get('/requests');

    // filter matching blood group
    const matching = res.data.filter(
  r => r.bloodGroup === donor?.bloodGroup
);

// Sort SOS requests first
const sorted = matching.sort((a, b) => b.isSOS - a.isSOS);

setRequests(sorted);

// Optional: alert donor if SOS exists
if (sorted.some(r => r.isSOS)) {
  alert('🚨 SOS Request Detected! Immediate donation needed.');
}

  } catch (err) {
    console.error('Failed to fetch requests');
  } finally {
    setRequestLoading(false);
  }
};
useEffect(() => {
  if (donor) {
    fetchRequests();
  }
}, [donor]);
useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.on("requestAccepted", (requestId) => {
    setRequests(prev =>
      prev.filter(r => r._id !== requestId)
    );
  });

  return () => socket.disconnect();
}, []);
const respondToRequest = async (requestId) => {
  if (!window.confirm('Do you want to accept this blood request?')) return;

  try {
    await api.post('/donations/respond', {
      requestId
    });

    // Update UI immediately
    setRequests(prev =>
      prev.map(r =>
        r._id === requestId
          ? { ...r, status: 'Accepted' }
          : r
      )
    );

    alert('Request accepted successfully');
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Failed to respond');
  }
};



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <p className="text-slate-500 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
        <AlertCircle size={60} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Incomplete</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <Link to="/become-donor" className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-red-200 w-full">
          Complete Profile <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
              <Droplet size={32} fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                Welcome, {donor.fullName.split(' ')[0]}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">PulseLink Verified</span>
              </div>
            </div>
          </div>
          <Link to="/become-donor" className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md">
            <Edit3 size={18} /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={80} />
              </div>
              <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Activity size={18} className="text-red-500" /> Live Availability
              </h3>
              <button
                disabled={!donor?.isEligible}
                onClick={toggleAvailability}
                className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-md
                  ${donor?.isEligible
                      ? donor.isAvailable
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }
                `}
              >
                {donor?.isEligible
                  ? donor.isAvailable ? 'AVAILABLE FOR DONATION' : 'MARK AS AVAILABLE'
                  : `NOT ELIGIBLE (${daysLeft}d LEFT)`}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-4 font-medium leading-relaxed">
                Toggle this off if you are temporarily sick, traveling, or unable to respond to requests.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Group</p>
                <p className="text-2xl font-black text-red-600">{donor.bloodGroup}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Age</p>
                <p className="text-2xl font-black text-slate-800">{calculateAge(donor.dob)}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center col-span-2 flex items-center justify-between px-8">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Donations</p>
                  <p className="text-2xl font-black text-slate-800">{donations.length}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${!eligible && daysLeft !== null ? 'text-red-500' : 'text-green-500'}`}>
                    {!eligible && daysLeft !== null ? `WAIT: ${daysLeft} DAYS` : 'ELIGIBLE NOW ✅'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
  <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
    <Award className="text-amber-500" /> Milestones
  </h3>
  <div className="flex justify-between items-center px-2">
    {/* First Donation Badge */}
    <div 
      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white transition-all duration-500 ${donations.length >= 1 ? 'bg-red-100 grayscale-0 opacity-100 scale-110' : 'bg-slate-100 grayscale opacity-30'}`} 
      title={donations.length >= 1 ? "First Donation Unlocked!" : "Donate once to unlock"}
    >
      🩸
    </div>

    {/* Life Saver Badge */}
    <div 
      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white transition-all duration-500 ${donations.length >= 5 ? 'bg-blue-100 grayscale-0 opacity-100 scale-110' : 'bg-slate-100 grayscale opacity-30'}`} 
      title={donations.length >= 5 ? "Life Saver Unlocked!" : "5 donations to unlock"}
    >
      🛡️
    </div>

    {/* Community Hero Badge */}
    <div 
      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white transition-all duration-500 ${donations.length >= 10 ? 'bg-amber-100 grayscale-0 opacity-100 scale-110' : 'bg-slate-100 grayscale opacity-30'}`} 
      title={donations.length >= 10 ? "Community Hero Unlocked!" : "10 donations to unlock"}
    >
      🤝
    </div>
  </div>
  <p className="text-[10px] text-slate-400 mt-6 text-center italic font-medium tracking-tight">
    {donations.length === 0 
      ? "Complete your first donation to unlock badges!" 
      : `You have ${donations.length} verified donation(s)`}
  </p>
</div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/50 border-b flex items-center gap-2">
                <Activity size={18} className="text-red-600" />
                <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">Donor Identity & Medical</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-xl text-red-600"><User size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                      <p className="font-bold text-slate-800 leading-tight">{donor.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-xl text-red-600"><Phone size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                      <p className="font-bold text-slate-800 leading-tight">{donor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-xl text-red-600"><MapPin size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Location</p>
                      <p className="font-bold text-slate-800 text-sm leading-relaxed">{donor.address}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Droplet size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</p>
                      <p className="font-bold text-slate-800 leading-tight">{donor.bloodGroup} Positive</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Weight size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight Info</p>
                      <p className="font-bold text-slate-800 leading-tight">{donor.weight} Kilograms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Calendar size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Donation</p>
                      <p className="font-bold text-slate-800 leading-tight">
                        {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Never Record'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-red-600" />
                  <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">Donation History</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{donations.length} RECORDS</span>
              </div>
              <div className="p-8">
                {donationLoading ? (
                  <p className="text-slate-400 text-sm animate-pulse">Fetching history...</p>
                ) : donations.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-400 text-sm italic font-medium">No donations found in our records.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {donations.map((donation) => (
                      <div key={donation._id} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors shadow-sm">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 leading-none mb-1">{donation.hospitalName}</p>
                            <p className="text-xs text-slate-500 font-bold tracking-tight uppercase">{donation.city}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-700">
                            {new Date(donation.donatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
<div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
  <div className="px-8 py-5 bg-slate-50/50 border-b flex items-center gap-2">
    <Droplet size={18} className="text-red-600" />
    <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">
      Matching Blood Requests
    </h3>
  </div>

  <div className="p-8">
    {requestLoading ? (
      <p className="text-slate-400">Loading requests...</p>
    ) : requests.length === 0 ? (
      <p className="text-slate-400 italic">
        No active requests for your blood group.
      </p>
    ) : (
      <div className="grid gap-4">
        {requests.map(req => (
          <div
            key={req._id}
            className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center"
          >
            <div>
              <p className="font-extrabold text-slate-800">
                {req.hospitalName}
              </p>
              <p className="text-sm text-slate-500">
                {req.city} • {req.unitsRequired} unit(s)
              </p>
              <p className="text-xs text-red-600 font-bold">
                Urgency: {req.urgency}
              </p>
              {req.isSOS && (
  <span className="inline-block mb-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
    SOS EMERGENCY
  </span>
)}

            </div>

            {req.status === 'Open' && (
  <button
  disabled={!eligible}
  onClick={() => respondToRequest(req._id)}
  className={`px-6 py-3 rounded-xl font-black text-xs tracking-widest
    ${eligible
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
  `}
>
  {eligible ? 'RESPOND' : 'NOT ELIGIBLE'}
</button>
)}


            

          </div>
        ))}
      </div>
    )}
  </div>
</div>

            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                  <AlertCircle className="text-red-400 animate-pulse" size={36} />
                </div>
                <h4 className="text-xl font-extrabold mb-3 tracking-tight">SOS Sentinel Active</h4>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                  We are monitoring for SOS requests in your area. Ensure your contact details are active to receive alerts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;