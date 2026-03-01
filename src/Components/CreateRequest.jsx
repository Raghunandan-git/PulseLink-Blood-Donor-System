import React, { useState } from 'react';
import api from '../services/api';
import { 
  Droplets, User,   MapPin,   Hospital,   AlertCircle,   ChevronLeft, 
  Phone,   Flame,   Layers,  ArrowRight,  CheckCircle,  Loader2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CreateBloodRequest = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    (error) => {
      console.error("Location error:", error);
    }
  );
}, []);
  // FIX: Added patientName to the initial state
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '',
    unitsRequired: '',
    hospitalName: '',
    city: '',
    contactNumber: '',
    urgency: 'Medium',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSOS, setIsSOS] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitRequest = async () => {
    setError('');
    
    // Basic Validation
    if (!form.patientName || !form.bloodGroup || !form.unitsRequired || !form.hospitalName || !form.city || !form.contactNumber) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSOS ? '/requests/sos' : '/requests';

      if (!coords) {
  setError("Location not detected. Please allow location access.");
  return;
}
await api.post(endpoint, {
  ...form,
  urgency: isSOS ? 'High' : form.urgency,
  latitude: coords?.latitude,
  longitude: coords?.longitude
});
      navigate('/seeker/dashboard');
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.error || 'Failed to create blood request');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-red-100 selection:text-red-600">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link 
          to="/seeker/dashboard" 
          className="inline-flex items-center text-slate-500 hover:text-red-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-2 bg-slate-900 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10">
                <Droplets size={200} />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div>
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 mb-6">
                    <Droplets size={28} fill="white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight leading-tight">Post Urgent Request.</h2>
                  <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                    Fill in the details carefully. We will notify all matching donors within your city instantly.
                  </p>
                </div>

                <div className="space-y-6 pt-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Verified Matching</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Instant Alerts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-3 p-10">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl mb-6 border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} />
                  <span className="text-xs font-black uppercase tracking-tight">{error}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Patient Details Section */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Patient Information</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        name="patientName"
                        placeholder="Patient Full Name"
                        value={form.patientName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-bold text-slate-700 text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <Droplets size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          name="bloodGroup"
                          value={form.bloodGroup}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-bold text-slate-700 text-sm appearance-none"
                        >
                          <option value="">Blood Group</option>
                          {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                      <div className="relative group">
                        <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          name="unitsRequired"
                          placeholder="Units"
                          value={form.unitsRequired}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-bold text-slate-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details Section */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hospital & Contact</p>
                  <div className="space-y-4">
                    <div className="relative group">
                      <Hospital size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="hospitalName"
                        placeholder="Hospital Name & Branch"
                        value={form.hospitalName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-bold text-slate-700 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={form.city}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-bold text-slate-700 text-sm"
                        />
                      </div>
                      <div className="relative group">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="contactNumber"
                          placeholder="Mobile No."
                          value={form.contactNumber}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-bold text-slate-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Section */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Urgency Level</p>
                  <div className="relative group">
                    <Flame size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      name="urgency"
                      value={form.urgency}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all outline-none font-black text-slate-700 text-sm appearance-none"
                    >
                      <option value="Low">Low (Within 48 Hours)</option>
                      <option value="Medium">Medium (Within 24 Hours)</option>
                      <option value="High">High (Immediate/Emergency)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <Flame className="text-red-600 animate-pulse" />
    <div>
      <p className="text-xs font-black text-red-600 uppercase tracking-widest">
        SOS Emergency Mode
      </p>
      <p className="text-[11px] text-red-500">
        Instantly alerts all eligible donors
      </p>
    </div>
  </div>

  <input
    type="checkbox"
    checked={isSOS}
    onChange={() => setIsSOS(!isSOS)}
    className="w-5 h-5 accent-red-600"
  />
</div>


                <button
                  onClick={submitRequest}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-3 mt-4
                    ${loading 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                    }`}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    <><Droplets size={18} fill="white" /> Broadcast Request <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
          By submitting, you agree to our emergency donor protocols.
        </p>
      </div>
    </div>
  );
};

export default CreateBloodRequest;