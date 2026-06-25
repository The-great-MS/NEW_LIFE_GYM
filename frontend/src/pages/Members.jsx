import React, { useEffect, useState } from 'react';
import api from '../api'; // Aapki central api.js file ka exact path (agar path hierarchy alag ho toh check kar lena)

const Members = ({ fetchDashboardStats, isDark, theme }) => {
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      // Axios hatakar central api instance lagaya hai
      const res = await api.get('/api/members');
      setMembersList(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading members:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const toggleFeeStatus = async (id, currentStatus, currentPlan) => {
    const nextStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    try {
      // Centralized API dynamic link matching
      await api.put(`/api/members/fee-status/${id}`, {
        feeStatus: nextStatus,
        planType: currentPlan || 'Monthly'
      });
      fetchMembers();
      if (fetchDashboardStats) fetchDashboardStats();
    } catch (err) {
      alert("Failed to change fee status");
    }
  };

  const handlePlanChange = async (id, nextPlan, currentStatus) => {
    try {
      // Centralized API instance used here
      await api.put(`/api/members/fee-status/${id}`, {
        feeStatus: currentStatus,
        planType: nextPlan
      });
      fetchMembers();
      if (fetchDashboardStats) fetchDashboardStats();
    } catch (err) {
      alert("Failed to update pricing plan");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the gym?`)) {
      try {
        // Centralized API route handling
        await api.delete(`/api/members/${id}`);
        alert("Member removed successfully.");
        fetchMembers();
        if (fetchDashboardStats) fetchDashboardStats();
      } catch (err) {
        alert("Failed to delete member.");
      }
    }
  };

  return (
    <div className={`p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} shadow-md transition-all duration-300`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-black ${theme.textInverse}`}>Active Gym Athletes</h3>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-0.5 font-medium`}>Manage subscription metrics, tracking cycles, and fee status indexes.</p>
      </div>

      {loading ? (
        <div className={`text-center py-10 font-bold ${theme.textLight}`}>Loading athletes...</div>
      ) : membersList.length === 0 ? (
        <div className={`text-center py-10 font-medium border border-dashed ${isDark ? 'border-gray-800' : 'border-gray-400'} rounded-xl ${theme.textLight}`}>No members found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} ${isDark ? 'text-gray-400' : 'text-gray-700'} text-xs font-black uppercase tracking-wider`}>
                <th className="py-3 px-4">Name / Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Tier Plan</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-800/50' : 'divide-gray-200'}`}>
              {membersList.map((member) => (
                <tr key={member._id} className={`${isDark ? 'hover:bg-gray-800/20' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="py-4 px-4">
                    <p className={`font-bold ${theme.textInverse}`}>{member.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} font-semibold`}>{member.email}</p>
                  </td>
                  <td className={`py-4 px-4 text-sm font-bold ${theme.textLight}`}>{member.phone || 'N/A'}</td>

                  <td className="py-4 px-4 text-sm">
                    <select
                      value={member.planType || 'Monthly'}
                      onChange={(e) => handlePlanChange(member._id, e.target.value, member.feeStatus)}
                      className={`${isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900 border-gray-400'} text-xs font-bold border rounded px-2 py-1 focus:outline-none focus:border-green-500 cursor-pointer shadow-sm`}
                    >
                      <option value="Monthly">Monthly (₹1k)</option>
                      <option value="Quarterly">Quarterly (₹2.5k)</option>
                      <option value="Yearly">Yearly (₹8k)</option>
                    </select>
                  </td>

                  <td className="py-4 px-4 text-sm">
                    <button
                      onClick={() => toggleFeeStatus(member._id, member.feeStatus, member.planType)}
                      className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                        member.feeStatus === 'Paid'
                          ? `${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-100 border-green-500'} text-green-600`
                          : `${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-100 border-yellow-600'} text-yellow-600`
                      }`}
                    >
                      {member.feeStatus === 'Paid' ? '● Paid' : '● Pending'}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button onClick={() => handleDelete(member._id, member.name)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold rounded-lg transition-all border border-red-500/20 cursor-pointer">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Members;
