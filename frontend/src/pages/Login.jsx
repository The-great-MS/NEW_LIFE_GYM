import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 👈 Fixed: Sirf clean aur standard axios import kiya hai ab

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🚀 Fixed standard axios endpoint call
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        console.log("Login successful, redirecting straight to dashboard...");
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Email or Password. Try Again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 transition-colors duration-300 ${isDark ? 'bg-[#0b130e]' : 'bg-[#f0f4f1]'}`}>
      <div className="absolute top-6 right-6">
        <button onClick={() => setIsDark(!isDark)} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all shadow-md cursor-pointer ${isDark ? 'bg-[#121e16] border-[#39b54a]/30 text-[#39b54a]' : 'bg-white border-[#1e7e2c]/40 text-[#1e7e2c]'}`}>
          {isDark ? '🍃 Grass Mode' : '☀️ Bright Mode'}
        </button>
      </div>

      <div className={`w-full max-w-md p-8 rounded-2xl border transition-all shadow-2xl ${isDark ? 'bg-[#121e16] border-gray-800' : 'bg-white border-gray-300'}`}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#39b54a] flex items-center justify-center font-bold text-white">G</div>
          <h1 className={`text-2xl font-black tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>GREEN<span className={isDark ? 'text-[#39b54a]' : 'text-[#1e7e2c]'}>GYM</span></h1>
        </div>

        <div className="text-center mb-6">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
          <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter your credentials to manage your gym turf core.</p>
        </div>

        {error && <div className="p-3 mb-4 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none transition-all ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:border-green-500' : 'bg-gray-100 border-gray-400 text-gray-900 focus:border-green-600'}`} placeholder="admin@greengym.com" />
          </div>
          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:border-green-500' : 'bg-gray-100 border-gray-400 text-gray-900 focus:border-green-600'}`} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 mt-2 rounded-xl font-bold tracking-wide transition-all shadow-md cursor-pointer ${isDark ? 'bg-[#39b54a] hover:bg-green-600 text-[#0b130e]' : 'bg-[#1e7e2c] hover:bg-green-800 text-white'}`}>
            {loading ? 'Authenticating...' : 'Secure Log In 🔒'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Don't have an admin account? <Link to="/register" className={`font-bold underline ${isDark ? 'text-[#39b54a]' : 'text-[#1e7e2c]'}`}>Register Turf Now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
