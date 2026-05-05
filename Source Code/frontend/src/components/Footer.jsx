// This is the Footer component that is displayed at the bottom of the app. It includes a main statement, a call-to-action link, and a bottom bar with the brand logo, navigation links, and copyright/credit information. The design uses a dark background with subtle glow effects to create a calming and inviting atmosphere.

import React from 'react';
import { Leaf, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';


// Footer component definition
const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white px-6 md:px-10 py-20 relative overflow-hidden">

      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">

        {/* MAIN STATEMENT */}
        <div className="mb-20">
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] font-semibold tracking-tight">
            feel heard.<br />
            feel understood.
          </h1>

          <Link
            to="/home"
            className="inline-flex items-center gap-2 mt-6 text-emerald-400 text-base hover:gap-3 transition-all duration-300"
          >
            Start talking
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">

          {/* BRAND */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-xl font-medium">eyra</span>
          </div>

          {/* LINKS */}
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/home" className="hover:text-white transition">Chat</Link>
            <Link to="/face-analysis" className="hover:text-white transition">Analysis</Link>
          </div>

          {/* COPYRIGHT + CREDIT */}
          <div className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
            © {new Date().getFullYear()} eyra  
            <br />
            Not a substitute for professional care.
            <br />
            <span className="text-slate-400">
              Built by Jashanjit Kaur
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};


// Export the Footer component as the default export
export default Footer;