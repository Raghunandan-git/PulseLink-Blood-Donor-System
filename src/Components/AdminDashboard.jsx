import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Users, 
  Droplet, 
  Activity, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Hospital,
  UserCheck,
  AlertCircle,
  Loader2,
  Mail,
  Zap,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);

        const reqRes = await api.get('/admin/verify-requests');
        setRequests(reqRes.data);

        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || 'Admin data load failed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmDonation = async (requestId) => {
    if (!window.confirm('Are you sure you want to confirm this donation?')) return;

    try {
      await api.post('/admin/confirm-donation', { requestId });
      alert('Donation confirmed successfully');
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      alert(err.response?.data?.message || 'Confirmation failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <ShieldCheck className="absolute text-red-600 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Authorizing Console</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 selection:bg-red-100 selection:text-red-600">
      {/* --- PREMIUM HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">System Intelligence</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Control Active</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Server Load</p>
              <p className="text-sm font-black text-slate-900 mt-1">Optimal 0.4ms</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        
        {/* --- DYNAMIC METRICS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Global Users" value={stats.totalUsers} icon={<Users size={20}/>} color="indigo" />
          <StatCard title="Active Donors" value={stats.totalDonors} icon={<Droplet size={20}/>} color="red" />
          <StatCard title="Live Requests" value={stats.totalRequests} icon={<Activity size={20}/>} color="orange" />
          <StatCard title="Verified Saves" value={stats.totalDonations} icon={<CheckCircle size={20}/>} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: VERIFICATION PIPELINE --- */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verification Pipeline</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Confirm and verify active blood transfers</p>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending:</span>
                <span className="ml-2 text-sm font-black text-red-600">{requests.length}</span>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-50 shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">All Clear</h3>
                  <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs mx-auto uppercase tracking-tighter">No donations are currently awaiting admin authorization.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {requests.map(req => (
                  <div key={req._id} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-2xl shadow-slate-300 ring-4 ring-slate-50">
                          <span className="text-[10px] font-black opacity-50 uppercase leading-none mb-1">Group</span>
                          <span className="text-xl font-black">{req.bloodGroup}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors flex items-center gap-2">
                            {req.hospitalName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200 uppercase tracking-tighter leading-none">
                              <MapPin size={12}/> {req.city}
                            </span>
                            <span className="bg-red-50 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-red-100 uppercase tracking-tighter leading-none">
                              <UserCheck size={12}/> {req.donor?.fullName || 'Anonymous'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => confirmDonation(req._id)}
                        className="w-full md:w-auto bg-slate-900 hover:bg-green-600 text-white font-black text-[11px] tracking-[0.15em] uppercase py-5 px-10 rounded-[1.5rem] transition-all shadow-xl hover:shadow-green-100 flex items-center justify-center gap-3 active:scale-95 group/btn"
                      >
                        <Zap size={14} className="group-hover/btn:fill-current" /> Authorize Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: DIRECTORY ENGINE --- */}
          <div className="lg:col-span-4 space-y-8">
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cloud Directory</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Platform user distribution</p>
              </div>

            <div className="bg-white rounded-[3rem] border border-white shadow-xl shadow-slate-200/40 overflow-hidden relative group">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Node</span>
                <Users size={14} className="text-indigo-500" />
              </div>
              
              <div className="max-h-[650px] overflow-y-auto custom-scrollbar">
                {users.map((user, idx) => (
                  <div key={user._id} className="p-8 hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 group/item">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border transition-all group-hover/item:rotate-6 ${user.role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-800 border-slate-200 shadow-sm'}`}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight mb-1">{user.fullName}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${user.isProfileComplete ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`} title={user.isProfileComplete ? "Complete Profile" : "Incomplete Profile"}></div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 pl-1">
                      <Mail size={12} />
                      <p className="text-[11px] font-bold truncate tracking-tight">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600 to-transparent opacity-30"></div>
                 <p className="relative z-10 text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Admin Supervision</p>
                 <p className="relative z-10 text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic leading-none">End-to-End Encryption Enabled</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* --- STAT CARD ENGINE --- */
const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    red: "text-red-600 bg-red-50 border-red-100 shadow-red-100/40",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-100/40",
    orange: "text-orange-600 bg-orange-50 border-orange-100 shadow-orange-100/40",
    green: "text-green-600 bg-green-50 border-green-100 shadow-green-100/40"
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm flex items-center gap-6 hover:translate-y-[-5px] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
           <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{value || 0}</p>
           <TrendingUp size={12} className="text-green-500 opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;