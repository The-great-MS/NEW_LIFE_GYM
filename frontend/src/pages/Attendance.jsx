import React, { useEffect, useState } from 'react';
import api from '../api'; // Aapki central api.js file ka exact path (agar path alag ho toh check kar lena)

const Attendance = ({ fetchDashboardStats, isDark, theme }) => {
  const [members, setMembers] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Normal axios hatakar central api instance lagaya hai
      const membersRes = await api.get('/api/members');
      const logsRes = await api.get('/api/attendance/today');
      setMembers(membersRes.data);
      setTodayLogs(logsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading attendance data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (memberId) => {
    try {
      // Centralized API instance route handling
      const res = await api.post('/api/attendance/checkin', { memberId, status: 'Present' });
      alert(res.data.message);
      loadData();
      if (fetchDashboardStats) fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const isCheckedIn = (id) => todayLogs.some(log => log.memberId === id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
      {/* LEFT: MARK ATTENDANCE SHEET */}
      <div className={`lg:col-span-2 p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} shadow-md`}>
        <h3 className={`text-xl font-black ${theme.textInverse} mb-1`}>Mark Today's Check-ins</h3>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs font-semibold mb-6`}>Click Check-in to mark athletes present for today's session.</p>

        {loading ? (
          <div className={`font-bold text-sm ${theme.textLight}`}>Loading athletes...</div>
        ) : (
          <div className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
            {members.map(m => (
              <div key={m._id} className="py-3.5 flex justify-between items-center">
                <div>
                  <h4 className={`font-bold text-sm ${theme.textInverse}`}>{m.name}</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} font-semibold`}>{m.email}</p>
                </div>
                {isCheckedIn(m._id) ? (
                  <span className={`text-xs font-black bg-green-500/10 px-3 py-1.5 rounded-xl border ${isDark ? 'border-green-500/30' : 'border-green-500'} text-green-600 shadow-sm`}>✓ Checked In</span>
                ) : (
                  <button onClick={() => handleCheckIn(m._id)} className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-sm cursor-pointer ${theme.buttonMain}`}>
                    ⚡ Check-In
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: TODAY'S LOG PANELS */}
      <div className={`p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} shadow-md flex flex-col`}>
        <h3 className={`text-xl font-black ${theme.textInverse} mb-1`}>Live Active Logs</h3>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs font-semibold mb-6`}>Athletes training inside the turf right now.</p>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {todayLogs.length === 0 ? (
            <p className={`text-center font-medium py-6 text-xs ${theme.textLight}`}>No entries recorded yet.</p>
          ) : (
            todayLogs.map(log => (
              <div key={log._id} className={`p-3.5 rounded-xl ${theme.bgMain} border ${isDark ? 'border-gray-800' : 'border-gray-300'} flex justify-between items-center shadow-sm`}>
                <div>
                  <p className={`text-sm font-bold ${theme.textInverse}`}>{log.memberName}</p>
                  <p className="text-[10px] text-gray-500 font-mono">ID: ...{log.memberId.slice(-6)}</p>
                </div>
                <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-400 text-gray-800'}`}>{log.checkInTime}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
