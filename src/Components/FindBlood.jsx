import React, { useState } from 'react';
import api from '../services/api';
import { Search, Droplets, MapPin, Phone, User, AlertCircle, Loader2 } from 'lucide-react';

const FindBlood = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchDonors = async () => {
    if (!bloodGroup) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/donor/search?bloodGroup=${encodeURIComponent(bloodGroup)}`
      );
      setDonors(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
            <Search className="text-red-600" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Find Blood Donors</h2>
          <p className="mt-3 text-lg text-gray-500">
            Search our network of hero donors by blood group to find a match instantly.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex flex-col sm:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Droplets className="text-red-500" size={20} />
            </div>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="block w-full pl-12 pr-10 py-4 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white transition appearance-none font-medium text-gray-700"
            >
              <option value="">Select Blood Group</option>
              {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <button
            onClick={searchDonors}
            disabled={loading || !bloodGroup}
            className="sm:w-48 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Searching...' : 'Search Donors'}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 mb-8 animate-shake">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {donors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {donors.map((donor) => (
              <div 
                key={donor._id} 
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full flex items-center justify-center pl-6 pb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <span className="text-2xl font-black text-red-600 group-hover:text-white uppercase">
                    {donor.bloodGroup}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">{donor.fullName}</h3>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Available Now</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="text-gray-400" size={18} />
                      <span className="font-medium">{donor.phone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="text-gray-400 mt-1 shrink-0" size={18} />
                      <span className="text-sm leading-relaxed">{donor.address}</span>
                    </div>
                  </div>

                  <a 
                    href={`tel:${donor.phone}`}
                    className="mt-2 w-full bg-gray-900 text-white text-center py-3 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2"
                  >
                    <Phone size={16} /> Contact Donor
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && bloodGroup && !error && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No Donors Found</h3>
              <p className="text-gray-500 mt-1">We couldn't find any donors for {bloodGroup} in our records yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FindBlood;