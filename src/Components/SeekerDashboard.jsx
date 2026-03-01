import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Droplets,
  Hospital,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle,
  Loader2,
  XCircle,
  Plus,
  History,
  Calendar,
  ChevronRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from "socket.io-client";

export default function SeekerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeRequests = requests.filter(req => ['Open', 'Accepted'].includes(req.status));
  const pastRequests = requests.filter(req => ['Fulfilled', 'Cancelled'].includes(req.status));
  const hasActiveRequest = activeRequests.length > 0;

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.get('/requests/my');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, []);

  useEffect(() => {
  const socket = io("http://localhost:5000");

  const token = localStorage.getItem("token");

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    socket.emit("registerUser", userId);
  }

  socket.on("donorOnTheWay", (data) => {
    alert(`${data.donorName} is ${data.distance} km away and coming!`);
  });

  return () => socket.disconnect();
}, []);

  const cancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await api.patch(`/requests/${id}/cancel`);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Activity className="text-red-600" /> Seeker Console
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your active blood requests</p>
          </div>

          <Link to="/request-blood">
            <button
              disabled={hasActiveRequest}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-red-100
                ${hasActiveRequest 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
                  : 'bg-red-600 hover:bg-red-700 text-white uppercase'
                }`}
            >
              <Plus size={18} strokeWidth={3} /> {hasActiveRequest ? 'Request Active' : 'Create Request'}
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        
        {/* ACTIVE REQUESTS SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div><h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2
  ${hasActiveRequest && activeRequests[0]?.isSOS ? 'text-red-600' : 'text-slate-800'}">
  
  {hasActiveRequest && activeRequests[0]?.isSOS ? '🚨 SOS Emergency Active' : 'Active Emergencies'}
</h2>

          </div>

          <div className="space-y-6">
            {activeRequests.length === 0 ? (
              <div className="bg-white p-16 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Droplets size={40} />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">No Active Pulse</h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
                  You haven't posted any urgent requests. Create one if you need a matching donor nearby.
                </p>
              </div>
            ) : (
              activeRequests.map(req => (
                <div
  key={req._id}
  className={`rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group
    ${req.isSOS 
      ? 'bg-red-50 border-2 border-red-200 animate-pulse'
      : 'bg-white border border-slate-100'
    }`}
>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* INFO */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl border border-red-100 shadow-inner">
                          {req.bloodGroup}
                        </div>
                        {req.isSOS && (
  <span className="ml-2 bg-red-600 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">
    SOS
  </span>
)}

                        <div>
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Required Group</p>
                          <h3 className="text-xl font-black text-slate-800 leading-none">{req.hospitalName}</h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-bold text-xs">
                          <MapPin size={14} className="text-red-500" /> {req.city}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-bold text-xs">
                          <Calendar size={14} className="text-slate-400" /> {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    {/* STATUS & ACTIONS */}
                    <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                      <StatusBadge status={req.status} />
                      {req.status === 'Open' && (
                        <button
                          onClick={() => cancelRequest(req._id)}
                          className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                          <XCircle size={12} /> Withdraw Request
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DONOR REVEAL */}
                  {req.status === 'Accepted' && req.donor && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                          <UserCheck size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Matching Donor Found</p>
                          <p className="font-black text-slate-800">{req.donor.fullName} is on the way</p>
                        </div>
                      </div>
                      <div className="bg-white/50 px-4 py-2 rounded-xl font-bold text-xs text-green-700 border border-green-200/50 uppercase tracking-tighter">
                         Blood Match: {req.donor.bloodGroup}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* PAST REQUESTS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <History size={16} /> Archive Logs
            </h2>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{pastRequests.length} Total</span>
          </div>

          <div className="grid gap-4">
            {pastRequests.length === 0 ? (
              <p className="text-slate-300 text-xs font-bold uppercase text-center py-6 italic tracking-widest">Clean record history</p>
            ) : (
              pastRequests.map(req => (
                <div
                  key={req._id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 leading-none mb-1">{req.hospitalName}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.city} • {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <StatusBadge status={req.status} small />
                    <ChevronRight size={16} className="text-slate-200 hidden sm:block" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */
function StatusBadge({ status, small }) {
  const map = {
    Open: {
      text: 'Searching',
      icon: <Clock size={small ? 12 : 16} className="animate-pulse" />,
      style: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50'
    },
    Accepted: {
      text: 'Donor Secured',
      icon: <UserCheck size={small ? 12 : 16} />,
      style: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50'
    },
    Fulfilled: {
      text: 'Donation Completed',
      icon: <CheckCircle size={small ? 12 : 16} />,
      style: 'bg-green-50 text-green-600 border-green-100 shadow-green-50'
    },
    Cancelled: {
      text: 'Request Closed',
      icon: <XCircle size={small ? 12 : 16} />,
      style: 'bg-red-50 text-red-400 border-red-200 shadow-red-50'
    }
  };

  const cfg = map[status];

  return (
    <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 border shadow-sm ${cfg.style} ${small ? 'px-3 py-1.5' : ''}`}>
      {cfg.icon}
      {cfg.text}
    </div>
  );
}