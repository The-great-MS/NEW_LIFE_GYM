import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Trainers = ({ isDark, theme }) => {
  const [trainersList, setTrainersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', specialization: '', phone: '', shift: 'Morning (6 AM - 12 PM)' });

  const fetchTrainers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trainers');
      setTrainersList(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/trainers/add', form);
      alert("Trainer Added Successfully! 🏋️");
      setForm({ name: '', specialization: '', phone: '', shift: 'Morning (6 AM - 12 PM)' });
      setShowAddForm(false);
      fetchTrainers();
    } catch (err) {
      alert("Failed to add trainer");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove ${name} from trainers list?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/trainers/${id}`);
        fetchTrainers();
      } catch (err) {
        alert("Error deleting trainer");
      }
    }
  };

  return (
    <div className={`p-6 rounded-2xl ${theme.bgCard} border ${isDark ? 'border-gray-800' : 'border-gray-300'} shadow-md transition-all duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`text-2xl font-black ${theme.textInverse}`}>Gym Instructors & Trainers</h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-0.5 font-medium`}>Manage shifts and specializations of your gym staff.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className={`px-4 py-2 rounded-xl ${theme.buttonMain} font-bold text-sm transition-all cursor-pointer shadow-sm`}>
          {showAddForm ? '✕ Close Form' : '➕ Add Trainer'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className={`mb-8 p-6 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-800' : 'border-gray-300'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end`}>
          <div>
            <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-700'} mb-1`}>Trainer Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className={`w-full px-3 py-2 rounded-lg ${theme.bgInput} border ${theme.borderInput} ${theme.textInverse} text-sm font-semibold focus:outline-none focus:border-green-500`} placeholder="Coach Vikram" />
          </div>
          <div>
            <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-700'} mb-1`}>Specialization</label>
            <input type="text" name="specialization" value={form.specialization} onChange={handleChange} required className={`w-full px-3 py-2 rounded-lg ${theme.bgInput} border ${theme.borderInput} ${theme.textInverse} text-sm font-semibold focus:outline-none focus:border-green-500`} placeholder="Bodybuilding / Strength" />
          </div>
          <div>
            <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-700'} mb-1`}>Phone Number</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} required className={`w-full px-3 py-2 rounded-lg ${theme.bgInput} border ${theme.borderInput} ${theme.textInverse} text-sm font-semibold focus:outline-none focus:border-green-500`} placeholder="98765xxxxx" />
          </div>
          <div>
            <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-700'} mb-1`}>Shift Time</label>
            <select name="shift" value={form.shift} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg ${theme.bgInput} border ${theme.borderInput} ${theme.textInverse} text-sm font-bold focus:outline-none focus:border-green-500 cursor-pointer`}>
              <option>Morning (6 AM - 12 PM)</option>
              <option>Afternoon (12 PM - 5 PM)</option>
              <option>Evening (5 PM - 10 PM)</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <button type="submit" className={`px-6 py-2 rounded-xl ${theme.buttonMain} font-bold text-sm shadow-md cursor-pointer`}>Save Instructor</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={`text-center py-10 font-bold ${theme.textLight}`}>Loading trainers...</div>
      ) : trainersList.length === 0 ? (
        <div className={`text-center py-10 font-medium border border-dashed ${isDark ? 'border-gray-800' : 'border-gray-300'} rounded-xl ${theme.textLight}`}>No trainers registered yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} ${isDark ? 'text-gray-400' : 'text-gray-700'} text-xs font-black uppercase tracking-wider`}>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-800/50' : 'divide-gray-200'}`}>
              {trainersList.map((trainer) => (
                <tr key={trainer._id} className={`${isDark ? 'hover:bg-gray-800/20' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className={`py-4 px-4 font-bold ${theme.textInverse}`}>{trainer.name}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      {trainer.specialization}
                    </span>
                  </td>
                  <td className={`py-4 px-4 font-bold text-sm ${theme.textLight}`}>{trainer.phone}</td>
                  <td className={`py-4 px-4 font-semibold text-sm ${theme.textLight}`}>{trainer.shift}</td>
                  <td className="py-4 px-4 text-center">
                    <button onClick={() => handleDelete(trainer._id, trainer.name)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold rounded-lg transition-all border border-red-500/20 cursor-pointer">Remove</button>
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

export default Trainers;
