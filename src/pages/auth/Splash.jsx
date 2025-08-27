import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/signin'), 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <img
        src="/assets/images/download.png"
        alt="GlassTask logo"
        className="w-24 h-24 mb-6 rounded-xl shadow-lg animate-bounce object-cover bg-white"
      />
      <h1 className="text-3xl font-bold mb-2 text-white">GlassTask</h1>
      <p className="text-slate-400 mb-6">Productivity, Analytics & Finance</p>
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
      </div>
    </div>
  );
};
export default Splash;
