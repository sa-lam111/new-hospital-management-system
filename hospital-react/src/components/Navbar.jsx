import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.userType === 'admin'
    ? '/admin-dashboard'
    : user?.userType === 'doctor'
      ? '/doctor-dashboard'
      : '/patient';

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-indigo-700 hidden sm:inline">Healthcare Hospital</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
            Home
          </Link>
          <Link to="/doctors" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
            Specialities
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
            Services
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
            Contact Us
          </Link>
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to={dashboardPath}
                className={`px-6 py-2 text-white rounded-lg transition-colors font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700`}
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                  {user.name}
                </button>
                <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all z-20 border border-gray-200">
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/book-appointment" 
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
              >
                Book Appointment
              </Link>
              <Link 
                to="/login" 
                className="px-6 py-2 text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-50 border-t border-blue-200 px-4 py-4 space-y-4">
          <Link to="/" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">
            Home
          </Link>
          <Link to="/doctors" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">
            Specialities
          </Link>
          <Link to="/services" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">
            Services
          </Link>
          <Link to="/about" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">
            About
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">
            Contact Us
          </Link>
          
          {user ? (
            <>
              <Link 
                to={dashboardPath}
                className={`block py-2 text-white rounded-lg text-center font-semibold transition-colors bg-indigo-600 hover:bg-indigo-700`}
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="block w-full py-2 bg-red-600 text-white rounded-lg text-center font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/book-appointment" 
                className="block py-2 bg-indigo-600 text-white rounded-lg text-center font-semibold hover:bg-indigo-700 transition-colors"
              >
                Book Appointment
              </Link>
              <Link 
                to="/login" 
                className="block py-2 text-indigo-600 border-2 border-indigo-600 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}