import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplet, Users, Shield, Zap, Target} from 'lucide-react';



const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-4 pb-20">
            <div className="container mx-auto bg-gray-100 px-6 py-6 rounded-2xl max-w-5xl">

                <header className="text-center py-16 bg-white rounded-xl shadow-lg border-t-4 border-red-600 mb-12">
                    <Droplet className="mx-auto h-12 w-12 text-red-600 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
                        Our Mission: Connecting Pulse to Life
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        PulseLink was founded on a simple, vital idea: eliminating the time-lag in blood emergencies. We use technology to turn seconds into life-saving moments.
                    </p>
                </header>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-10 border-b pb-4">
                        Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition duration-300">
                            <Zap className="mx-auto h-10 w-10 text-red-600 mb-3" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Response</h3>
                            <p className="text-gray-600 text-sm">
                                Leveraging GeoSpatial technology to notify the absolute nearest donor within minutes, not hours.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition duration-300">
                            <Shield className="mx-auto h-10 w-10 text-red-600 mb-3" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Verified Integrity</h3>
                            <p className="text-gray-600 text-sm">
                                Commitment to donor privacy and rigorous checks to prevent fraudulent requests and ensure data security.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition duration-300">
                            <Heart className="mx-auto h-10 w-10 text-red-600 mb-3" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Life-Centric</h3>
                            <p className="text-gray-600 text-sm">
                                Every feature is designed to maximize the chance of a successful, life-saving connection.
                            </p>
                        </div>
                    </div>
                </section>

                

                <section className="text-center bg-red-600 text-white p-10 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">Be Part of the Impact</h2>
                    <p className="text-red-100 mb-8">
                        Every user is a valuable member of our network. See the difference you can make.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <Link 
                            to="/become-donor" 
                            className="flex items-center bg-white text-red-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
                        >
                            <Users className='mr-2 h-5 w-5'/> Join Our Donors
                        </Link>
                        <Link 
                            to="/find-blood" 
                            className="flex items-center bg-red-800 border border-white text-white font-bold px-6 py-3 rounded-full hover:bg-red-900 transition shadow-lg transform hover:scale-105"
                        >
                            <Target className='mr-2 h-5 w-5'/> See Active Requests
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutUs;