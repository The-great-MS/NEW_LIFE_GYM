import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { gymTheme } from '../theme';
import Members from './Members';
import Trainers from './Trainers';
import Attendance from './Attendance';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveStats, setLiveStats] = useState({ activeMembers: 0, trainersOnDuty: 0, attendanceRate: '0%', monthlyRevenue: '₹0', todayCheckedInCount: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [formError, setFormError] = useState('');

  // 🌿 Mobile Sidebar Control State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🌿 Dynamic Theme State
  const [isDark, setIsDark] = useState(true);
  const theme = gymTheme(isDark);

  const fetchDashboardStats = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/stats');
      setLiveStats(statsRes.data);

      const logsRes = await axios.get('http://localhost:5000/api/attendance/today');
      setRecentLogs(logsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard requirements:", err);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const user = JSON.parse(userData);
      setAdminName(user.name);
      fetchDashboardStats();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...memberForm, role: 'member' });
      alert('New Member Added Successfully to Database! 🎉');
      setIsModalOpen(false);
      setMemberForm({ name: '', email: '', password: '', phone: '' });
      fetchDashboardStats();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const statsLayout = [
    { id: 1, name: 'Active Members', value: liveStats.activeMembers, icon: '👥', change: 'Live from DB' },
    { id: 2, name: 'Trainers On Duty', value: liveStats.trainersOnDuty, icon: '💪', change: 'Total Staff Count' },
    { id: 3, name: 'Today\'s Attendance', value: liveStats.attendanceRate, icon: '📅', change: `${liveStats.todayCheckedInCount || 0} checked in` },
    { id: 4, name: 'Monthly Revenue', value: liveStats.monthlyRevenue, icon: '💰', change: 'Estimated' },
  ];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false); // Close responsive drawers on mobile select
    if (tabName === 'dashboard') fetchDashboardStats();
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bgMain} transition-all duration-500 ease-in-out`}>

      {/* 📱 MOBILE TOP FLOATING NAVBAR */}
      <div className={`md:hidden w-full p-4 flex justify-between items-center ${theme.bgCard} border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} z-50 sticky top-0`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#39b54a] flex items-center justify-center font-bold text-white text-sm">G</div>
          <h1 className={`text-md font-black tracking-wider ${theme.textInverse}`}>NEW LIFE<span className={`${theme.textPrimary}`}>GYM</span></h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-xl border ${theme.borderAccent} ${theme.textPrimary} text-sm font-bold cursor-pointer`}
        >
          {isSidebarOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* 🟢 SIDEBAR (DESKTOP MODAL + MOBILE SLIDING DRAWER) */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 ${theme.bgCard} border-r ${isDark ? 'border-gray-800' : 'border-gray-300'} p-6 shadow-xl flex flex-col justify-between
        transform transition-transform duration-500 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          <div className="hidden md:flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#39b54a] flex items-center justify-center font-bold text-white">NEW</div>
            <h1 className={`text-xl font-bold tracking-wider ${theme.textInverse}`}>LIFE<span className={`${theme.textPrimary}`}>GYM</span></h1>
          </div>
          <nav className="space-y-2 mt-14 md:mt-0">
            <button onClick={() => handleTabClick('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 cursor-pointer ${activeTab === 'dashboard' ? `bg-green-600/20 ${theme.textPrimary} font-bold` : `${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}`}>📊 Dashboard</button>
            <button onClick={() => handleTabClick('members')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 cursor-pointer ${activeTab === 'members' ? `bg-green-600/20 ${theme.textPrimary} font-bold` : `${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}`}>👥 Members</button>
            <button onClick={() => handleTabClick('trainers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 cursor-pointer ${activeTab === 'trainers' ? `bg-green-600/20 ${theme.textPrimary} font-bold` : `${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}`}>🏋️ Trainers</button>
            <button onClick={() => handleTabClick('attendance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 cursor-pointer ${activeTab === 'attendance' ? `bg-green-600/20 ${theme.textPrimary} font-bold` : `${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}`}>📋 Attendance</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-medium transition-all cursor-pointer">🚪 Log Out</button>
      </div>

      {/* 📱 MOBILE OVERLAY BACKDROP */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"></div>}

      {/* 🟢 MAIN WORKSPACE AREA */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col justify-between transition-all duration-500 ease-in-out md:h-screen">
        <div>
          {/* TOP HEADER HEADER VIEW */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold ${theme.textInverse} transition-colors duration-500`}>Welcome, {adminName}!</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs md:text-sm mt-0.5 font-medium transition-colors duration-500`}>Here is what's happening at your turf today.</p>
            </div>

            <div>
              <button
                onClick={() => setIsDark(!isDark)}
                className={`px-3 py-1.5 md:px-4 md:py-2 ${theme.bgCard} border ${theme.borderAccent} ${theme.textPrimary} rounded-xl text-xs md:text-sm font-bold shadow-md cursor-pointer hover:scale-105 transition-all duration-500 flex items-center gap-2`}
              >
                {isDark ? '🍃 Grass-Turf Mode' : '☀️ Bright Mode'}
              </button>
            </div>
          </div>

          {/* RENDERING BLOCKS GRID CONTROLS */}
          {activeTab === 'dashboard' ? (
            <>
              {/* RESPONSIVE GRID BOX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                {statsLayout.map((stat) => (
                  <div key={stat.id} className={`p-5 md:p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} shadow-md transition-all duration-500`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} font-semibold text-xs md:text-sm`}>{stat.name}</span>
                      <span className={`text-xl p-1.5 rounded-xl ${isDark ? theme.bgMain : 'bg-green-50'}`}>{stat.icon}</span>
                    </div>
                    <div className={`text-2xl md:text-3xl font-black ${theme.textInverse} mb-1.5`}>{stat.value}</div>
                    <div className={`text-[10px] md:text-xs ${theme.textPrimary} font-bold bg-green-500/5 px-2 py-0.5 rounded-md inline-block`}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* RECENT CHECKINS AND LOGS FOR APP */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className={`p-5 md:p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} flex flex-col lg:col-span-2 shadow-sm transition-all duration-500`}>
                  <h3 className={`text-base md:text-lg font-bold ${theme.textInverse} mb-4`}>Recent Active Check-ins</h3>
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] pr-1">
                    {recentLogs.length === 0 ? (
                      <div className={`text-gray-600 text-xs font-medium text-center py-10 border border-dashed ${isDark ? 'border-gray-800' : 'border-gray-400'} rounded-xl ${theme.bgMain}`}>
                        No members checked-in yet today.
                      </div>
                    ) : (
                      recentLogs.map((log) => (
                        <div key={log._id} className={`p-3.5 rounded-xl ${theme.bgMain} border ${isDark ? 'border-gray-800' : 'border-gray-300'} flex justify-between items-center transition-all duration-500 shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#39b54a]"></div>
                            <div>
                              <p className={`text-xs md:text-sm font-bold ${theme.textInverse}`}>{log.memberName}</p>
                              <p className={`text-[9px] md:text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Session Attending</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono font-bold ${isDark ? 'bg-gray-900 text-gray-400 border-gray-800' : 'bg-white border-gray-400 text-gray-800'} px-2 py-0.5 rounded-md border`}>{log.checkInTime}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={`p-5 md:p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} shadow-sm transition-all duration-500`}>
                  <h3 className={`text-base md:text-lg font-bold ${theme.textInverse} mb-4`}>Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => setIsModalOpen(true)} className={`w-full py-2.5 md:py-3 rounded-xl ${theme.buttonSecondary} font-bold text-xs md:text-sm border ${theme.borderAccent} cursor-pointer shadow-sm`}>➕ Add New Member</button>
                    <button onClick={() => setActiveTab('attendance')} className={`w-full py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm cursor-pointer shadow-sm ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'}`}>📅 Mark Attendance</button>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'members' ? (
            <Members fetchDashboardStats={fetchDashboardStats} isDark={isDark} theme={theme} />
          ) : activeTab === 'trainers' ? (
            <Trainers isDark={isDark} theme={theme} />
          ) : (
            <Attendance fetchDashboardStats={fetchDashboardStats} isDark={isDark} theme={theme} />
          )}
        </div>

        {/* 🟢 RESPONSIVE STRUCTURAL FOOTER */}
        <footer className={`mt-auto pt-4 border-t ${isDark ? 'border-gray-900' : 'border-gray-200'} flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] md:text-xs font-semibold text-gray-500`}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39b54a]"></span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-600'}>MERN Stack Project</span>
          </div>
          <div className={`text-center sm:text-right ${isDark ? 'text-gray-500' : 'text-gray-700'}`}>
            Engineered by <span className={`${theme.textPrimary} font-black`}>Mohd Suhail</span> <span className="mx-1 text-gray-400">|</span> CSE 2026
          </div>
        </footer>
      </div>

      {/* 🟢 REGISTER ATHELETE MODAL BOX */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className={`w-full max-w-md p-6 md:p-8 rounded-2xl ${theme.bgCard} border ${theme.borderAccent} shadow-2xl relative transition-all duration-500`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-md">✕</button>
            <h3 className={`text-xl md:text-2xl font-black ${theme.textPrimary} mb-1`}>Add Gym Member</h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-5 font-medium`}>Create a login account for your new athlete.</p>

            {formError && <div className="p-3 mb-4 text-xs font-bold text-red-400 bg-red-950/50 border border-red-500/30 rounded-lg">{formError}</div>}

            <form onSubmit={handleAddMemberSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Full Name</label>
                <input type="text" name="name" value={memberForm.name} onChange={handleInputChange} required className={`w-full px-3.5 py-2 rounded-xl ${theme.bgInput} border ${theme.borderInput} ${isDark ? 'text-white' : 'text-gray-900'} text-xs md:text-sm focus:outline-none focus:border-green-500 font-medium`} placeholder="Rohan Sharma" />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Email Address</label>
                <input type="email" name="email" value={memberForm.email} onChange={handleInputChange} required className={`w-full px-3.5 py-2 rounded-xl ${theme.bgInput} border ${theme.borderInput} ${isDark ? 'text-white' : 'text-gray-900'} text-xs md:text-sm focus:outline-none focus:border-green-500 font-medium`} placeholder="rohan@gmail.com" />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Phone Number</label>
                <input type="text" name="phone" value={memberForm.phone} onChange={handleInputChange} required className={`w-full px-3.5 py-2 rounded-xl ${theme.bgInput} border ${theme.borderInput} ${isDark ? 'text-white' : 'text-gray-900'} text-xs md:text-sm focus:outline-none focus:border-green-500 font-medium`} placeholder="91234xxxxx" />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Default Password</label>
                <input type="password" name="password" value={memberForm.password} onChange={handleInputChange} required className={`w-full px-3.5 py-2 rounded-xl ${theme.bgInput} border ${theme.borderInput} ${isDark ? 'text-white' : 'text-gray-900'} text-xs md:text-sm focus:outline-none focus:border-green-500`} placeholder="••••••••" />
              </div>
              <button type="submit" className={`w-full py-2.5 md:py-3 mt-2 rounded-xl ${theme.buttonMain} font-bold text-xs md:text-sm tracking-wide shadow-md cursor-pointer`}>Save Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
