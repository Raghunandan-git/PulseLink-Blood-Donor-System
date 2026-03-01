import React from 'react';
import logo from '../assets/PulseLink-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-2">
            <a href="/" className="flex flex-col space-x-2">
              <img src={logo} alt="PulseLink Logo" className="h-20 w-20" />
              <span className="text-2xl font-bold text-white">PulseLink</span>
            </a>
            <p className="mt-4 max-w-sm">
              Connecting volunteer blood donors with patients in need. Your single donation can save up to three lives.
            </p>
            <div className="flex space-x-4 mt-6">
              <FontAwesomeIcon icon={faFacebook} size="2x" className='hover:text-red-500 transition-colors' />
              <FontAwesomeIcon icon={faInstagram} size='2x'className='hover:text-red-500 transition-colors'   />
              <FontAwesomeIcon icon={faTwitter} size='2x'  className='hover:text-red-500 transition-colors' />
              <FontAwesomeIcon icon={faLinkedin} size='2x' className='hover:text-red-500 transition-colors' />
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">About</h3>
            <ul>
              <li className="mb-2"><a href="/about" className="hover:text-red-500 transition-colors">About Us</a></li>
              <li className="mb-2"><a href="/how-it-works" className="hover:text-red-500 transition-colors">How It Works</a></li>
              <li className="mb-2"><a href="/impact" className="hover:text-red-500 transition-colors">Our Impact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Get Involved</h3>
            <ul>
              <li className="mb-2"><a href="/become-donor" className="hover:text-red-500 transition-colors">Become a Donor</a></li>
              <li className="mb-2"><a href="/host-drive" className="hover:text-red-500 transition-colors">Host a Drive</a></li>
              <li className="mb-2"><a href="/partner" className="hover:text-red-500 transition-colors">Partner With Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Latest Updates</h3>
            <div className="space-y-4">
              <a href="https://blog.ipleaders.in/blood-donation-india/" className="flex items-center space-x-3 group">
                <div className="w-16 h-12 bg-gray-700 rounded-lg flex-shrink-0">
                    <img src="https://blog.ipleaders.in/wp-content/uploads/2021/09/R-1.jpg" alt="donating-blood-in-india" />
                </div>
                <p className="text-sm group-hover:text-red-500 transition-colors">All about blood donation in India.</p>
              </a>
              <a href="https://care24.co.in/blog/myths-and-facts-about-blood-donation/" className="flex items-center space-x-3 group">
                <div className="w-16 h-12 bg-gray-700 rounded-lg flex-shrink-0">
                    <img src="https://care24.co.in/wp-content/uploads/2017/06/myths-and-facts-about-blood-donation.png" alt="myths-in-blood-donation" />
                </div>
                <p className="text-sm group-hover:text-red-500 transition-colors">Myths and facts about blood donation.</p>
              </a>
              <a href="https://www.nhlbi.nih.gov/education/blood/donation" className="flex items-center space-x-3 group">
                <div className="w-16 h-12 bg-gray-700 rounded-lg flex-shrink-0">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVZnu3WciVcbZ1F0l1So_yW71XQySRuD5JvQ&s" alt="myths-in-blood-donation" />
                </div>
                <p className="text-sm group-hover:text-red-500 transition-colors">Who can donate blood?.</p>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>
          </div>
          <p>&copy; 2025 PulseLink. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;