import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/home/hero-image.png';
import img1 from '../assets/home/Post-request.png';
import img2 from '../assets/home/2-Receive-request.png';
import { Users, HeartHandshake, MessageCircleHeartIcon } from 'lucide-react'
import img3 from '../assets/home/3-save-life.png';
import banner from '../assets/home/Banner.png';
import logo from '../assets/PulseLink-logo.png'
export default function HomePage() {

  const testimonials = [
    {
      quote: "PulseLink connected me with a donor in under an hour. I'm so grateful for this platform and the person who saved my son's life, truly a lifesaver.",
      name: "Sarah K.",
      role: "Recipient's Mother",
      imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop"
    },
    {
      quote: "As a regular donor, this app makes it incredibly easy to see urgent needs nearby and make a real difference. The process is seamless and deeply rewarding.",
      name: "David L.",
      role: "Volunteer Donor",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
    },
    {
      quote: "I was skeptical at first, but when my sister needed blood, PulseLink delivered. Fast, efficient, and truly a beacon of hope in a crisis.",
      name: "Priya S.",
      role: "Family Member",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (


    <div className="bg-white text-gray-800 font-sans">


      <main id="home">
        <section
          className="relative bg-cover bg-center text-white min-h-[600px] flex items-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url('${heroImg}')`
          }}
        >
          <div className="container mx-auto px-6 py-24 text-center relative z-10">
            <h1 className="text-4xl md:text-8xl font-extrabold leading-tight text-white text-shadow-black drop-shadow-lg">Every Drop Counts.</h1>
            <h2 className="text-4xl md:text-6xl font-extrabold text-red-600 text-shadow-stone-950 leading-tight mb-5 drop-shadow-lg">Find a Blood Donor in Minutes.</h2>
            <p className="text-gray-100 font-bold text-lg max-w-3xl mx-auto mb-10">Join our network of volunteer donors and help save lives in your community.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/find-blood" className="bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:border hover:border-red-700 hover:text-red-600 transition duration-300 shadow-lg w-full sm:w-auto transform hover:scale-105">
                REQUEST BLOOD
              </Link>
              <Link to="/become-donor" className="bg-white text-gray-800 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-700 hover:border hover:border-black hover:text-white transition duration-300 border border-gray-300 shadow-lg w-full sm:w-auto transform hover:scale-105">
                BECOME A DONOR
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Saving a Life is Simple</h3>
              <div className="w-24 h-1.5 bg-red-500 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center p-6 shadow-2xl rounded-r-4xl bg-gradient-to-r from-white to-gray-300">
                <img src={img1} alt="Post a request" className="mx-auto mb-6 h-48 sm:h-56 lg:h-64 object-contain" />
                <h4 className="text-2xl font-bold mb-2">1. Post a Request</h4>
                <p className="text-gray-600">When you need blood, simply post a request specifying the blood group and your location.</p>
              </div>
              <div className="text-center p-6 shadow-2xl rounded-4xl bg-gradient-to-r from-gray-300 via-white to-gray-300">
                <img src={img2} alt="Get notified" className="mx-auto mb-6 h-48 sm:h-56 lg:h-64 object-contain" />
                <h4 className="text-2xl font-bold mb-2">2. Get Notified</h4>
                <p className="text-gray-600">Our system instantly alerts all matching and available donors in your vicinity in real-time.</p>
              </div>
              <div className="text-center p-6 shadow-2xl rounded-l-4xl bg-gradient-to-r from-gray-300 to-white">
                <img src={img3} alt="Save a life" className="mx-auto mb-6 h-48 sm:h-56 lg:h-64 object-contain" />
                <h4 className="text-2xl font-bold mb-2">3. Save a Life</h4>
                <p className="text-gray-600">Connect with the responding donors, coordinate, and get the life-saving help you need.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-100 to-red-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Join Our Growing Network</h3>
              <div className="w-24 h-1.5 bg-red-500 mx-auto"></div>
              <p className="text-lg font-semibold text-gray-600 mt-4 max-w-2xl mx-auto">See the real-time impact of our dedicated community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 border-2 border-red-200">
                <div className="flex flex-col items-center justify-center">
                  <Users className="h-12 w-12 text-red-600 mb-4" />
                  <h4 className="text-5xl font-extrabold text-red-600 mb-2 text-center">10,500+</h4>
                  <p className="text-xl font-semibold text-gray-700 text-center">Registered Donors</p>
                </div>
              </div>
              <div className="bg-white backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 border-2 border-red-200">
                <div className="flex flex-col items-center justify-center">
                  <HeartHandshake className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <h4 className="text-5xl font-extrabold text-red-600 mb-2">2,000+</h4>
                <p className="text-xl font-semibold text-gray-700">Lives Saved</p>
                </div>
              </div>
              <div className="bg-white backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 border-2 border-red-200">
                <div className="flex flex-col items-center justify-center">
                 <MessageCircleHeartIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <h4 className="text-5xl font-extrabold text-red-600 mb-2">75</h4>
                <p className="text-xl font-semibold text-gray-700">Active Requests</p>
                </div>
              </div>
              
            </div>
          </div>
        </section>


        <div className="relative bg-cover bg-center min-h-[400px] flex justify-start items-center" style={{ backgroundImage: `url('${banner}')` }} >
          <div className="w-full md:w-3/5 lg:w-1/2 px-8 md:px-16 lg:px-24">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800"> A Moment of Your Time, A Lifetime for others.</h1>
            <h2 className="text-xl md:text-2xl text-red-600 font-semibold mt-2">Your compassion changes everything.</h2>
            <Link to="/become-donor" className="inline-block bg-red-600 text-white px-10 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition duration-300 shadow-lg transform hover:scale-105 mt-8" >
              Become a Donor
            </Link>

          </div>

        </div>


        <section className="py-20 bg-gradient-to-b from-red-100 to-white ">
          <div className="container mx-auto px-6 ">

            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Stories of Hope</h3>
              <div className="w-24 h-1.5 bg-red-500 mx-auto"></div>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Hear directly from those whose lives have been touched by PulseLink.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white relative overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-50">
                    <svg className="w-10 h-10 text-red-200" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 10c-1.24 0-2.34.8-2.73 1.95-.33.95.16 2.05 1.23 2.55 1.07.5 2.33-.16 2.83-1.23.5-1.07-.16-2.33-1.23-2.83-.03-.01-.06-.02-.09-.03zm11 0c-1.24 0-2.34.8-2.73 1.95-.33.95.16 2.05 1.23 2.55 1.07.5 2.33-.16 2.83-1.23.5-1.07-.16-2.33-1.23-2.83-.03-.01-.06-.02-.09-.03z" /></svg>
                  </div>
                  <div className="flex items-center mb-4">
                    <img className="w-16 h-16 rounded-full mr-5 object-cover shadow-md" src={testimonial.imageUrl} alt={`Avatar of ${testimonial.name}`} />
                    <div>
                      <p className="font-bold text-lg text-gray-800">{testimonial.name}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic text-lg relative z-10">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}

    </div>
  );
}