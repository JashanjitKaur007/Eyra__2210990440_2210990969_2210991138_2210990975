// This is the Navbar component that is displayed at the top of the app. It includes the logo, navigation links, and user profile/logout options. The navbar is responsive and includes a mobile menu for smaller screens. The design uses a clean and modern aesthetic with a focus on usability and accessibility.


// Import necessary modules and components
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { Leaf, Menu, X, User, MessageCircle, Camera, LogOut } from 'lucide-react';
import { Leaf, Menu, X, User, MessageCircle, ScanFace, ClipboardList, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';


// Navbar component definition
const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  // Render the navbar with logo, navigation links, and user profile/logout options. The navbar is responsive and includes a mobile menu for smaller screens.
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link to="/about" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-2xl tracking-tight text-slate-900">
              eyra
            </span>
          </Link>

          {/* CENTER NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 mx-auto">

            <Link to="/about" className="hover:text-emerald-700 transition">Home</Link>
            <a href="#story" className="hover:text-emerald-700 transition">Our Story</a>
            <a href="#how" className="hover:text-emerald-700 transition">How It Works</a>
            <a href="#features" className="hover:text-emerald-700 transition">Features</a>
            <a href="#values" className="hover:text-emerald-700 transition">Values</a>
            <a href="#faq" className="hover:text-emerald-700 transition">FAQs</a>

            {/* TESTS DROPDOWN */}
            {/* <div className="relative group">
              <button className="hover:text-emerald-700 transition">
                Tests
              </button>

              <div className="absolute left-0 mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">

                <Link to="/tests/depression" className="block px-4 py-2 hover:bg-slate-100">Depression Test</Link>
                <Link to="/tests/anxiety" className="block px-4 py-2 hover:bg-slate-100">Anxiety Test</Link>
                <Link to="/tests/adhd" className="block px-4 py-2 hover:bg-slate-100">ADHD Test</Link>
                <Link to="/tests/ocd" className="block px-4 py-2 hover:bg-slate-100">OCD Test</Link>
                <Link to="/tests/psychosis" className="block px-4 py-2 hover:bg-slate-100">Psychosis Test</Link>
                <Link to="/tests/eating-disorder" className="block px-4 py-2 hover:bg-slate-100">Eating Disorder Test</Link>
                <Link to="/tests/addiction" className="block px-4 py-2 hover:bg-slate-100">Addiction Test</Link>
                <Link to="/tests/social-anxiety" className="block px-4 py-2 hover:bg-slate-100">Social Anxiety Test</Link>
                <Link to="/tests/youth-mental-health" className="block px-4 py-2 hover:bg-slate-100">Youth Mental Health Test</Link>

              </div>
            </div> */}

          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">

                
  {/* Chat */}
  <Link 
    to="/home" 
    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition"
  >
    <MessageCircle className="w-5 h-5" />
    Chat
  </Link>

  {/* TESTS DROPDOWN */}
  <div className="relative group">
    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition">
      <ClipboardList className="w-5 h-5" />
      Tests
    </button>

    <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">

      <Link to="/tests/depression" className="block px-4 py-2 hover:bg-slate-100">Depression Test</Link>
      <Link to="/tests/anxiety" className="block px-4 py-2 hover:bg-slate-100">Anxiety Test</Link>
      <Link to="/tests/adhd" className="block px-4 py-2 hover:bg-slate-100">ADHD Test</Link>
      <Link to="/tests/ocd" className="block px-4 py-2 hover:bg-slate-100">OCD Test</Link>
      <Link to="/tests/psychosis" className="block px-4 py-2 hover:bg-slate-100">Psychosis Test</Link>
      <Link to="/tests/eating-disorder" className="block px-4 py-2 hover:bg-slate-100">Eating Disorder Test</Link>
      <Link to="/tests/addiction" className="block px-4 py-2 hover:bg-slate-100">Addiction Test</Link>
      <Link to="/tests/social-anxiety" className="block px-4 py-2 hover:bg-slate-100">Social Anxiety Test</Link>
      <Link to="/tests/youth-mental-health" className="block px-4 py-2 hover:bg-slate-100">Youth Mental Health Test</Link>

    </div>
  </div>

  {/* FACE ANALYSIS (UPDATED ICON) */}
  <Link 
    to="/face-analysis" 
    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition"
  >
    <ScanFace className="w-5 h-5" />
    Face Insights
  </Link>
                {/* PROFILE */}
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 hover:text-emerald-700 transition"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {user.name?.split(' ')[0]?.slice(0, 8) || 'Profile'}
                    </span>
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/register" 
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-sm"
              >
                Start Free
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden ml-auto p-2"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4 text-slate-700">

          <Link to="/about" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/home" onClick={() => setIsOpen(false)}>Chat</Link>
          <Link to="/face-analysis" onClick={() => setIsOpen(false)}>Face Analysis</Link>

          {/* MOBILE TESTS */}
          <div className="border-t pt-4 space-y-2">
            <p className="font-semibold">Tests</p>

            <Link to="/tests/depression">Depression</Link>
            <Link to="/tests/anxiety">Anxiety</Link>
            <Link to="/tests/adhd">ADHD</Link>
            <Link to="/tests/ocd">OCD</Link>
            <Link to="/tests/psychosis">Psychosis</Link>
            <Link to="/tests/eating-disorder">Eating Disorder</Link>
            <Link to="/tests/addiction">Addiction</Link>
            <Link to="/tests/social-anxiety">Social Anxiety</Link>
            <Link to="/tests/youth-mental-health">Youth Mental Health</Link>
          </div>

          {user && (
            <div className="border-t pt-4 space-y-3">
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-5 h-5" /> Profile
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-2 text-red-600"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};


// Export the Navbar component as the default export
export default Navbar;