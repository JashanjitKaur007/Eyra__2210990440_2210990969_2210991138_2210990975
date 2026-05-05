// // // import React, { useState, useEffect } from 'react';
// // // import { useAuth } from '../contexts/AuthContext';
// // // import { useNavigate } from 'react-router-dom';
// // // import axios from 'axios';
// // // import {
// // //   User, Mail, Edit2, Save, LogOut, Trash2,
// // //   History as HistoryIcon, TrendingUp,
// // //   Calendar, MessageCircle, Brain, Loader,
// // //   Eye, EyeOff, Zap
// // // } from 'lucide-react';

// // // const Profile = () => {
// // //   const { user, logout } = useAuth();
// // //   const navigate = useNavigate();

// // //   const [activeTab, setActiveTab] = useState('profile');
// // //   const [historyData, setHistoryData] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [showPassword, setShowPassword] = useState(false);

// // //   const [form, setForm] = useState({
// // //     name: '',
// // //     email: '',
// // //     password: '',
// // //     confirmPassword: ''
// // //   });

// // //   useEffect(() => {
// // //     if (user) {
// // //       setForm({
// // //         name: user.name || '',
// // //         email: user.email || '',
// // //         password: '',
// // //         confirmPassword: ''
// // //       });
// // //     }
// // //   }, [user]);

// // //   useEffect(() => {
// // //     axios.get('/chat/history')
// // //       .then(res => setHistoryData(res.data || []))
// // //       .finally(() => setLoading(false));
// // //   }, []);

// // //   const handleLogout = () => {
// // //     logout();
// // //     navigate('/login');
// // //   };

// // //   if (!user) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-slate-50">
// // //         <Loader className="animate-spin text-emerald-600 w-10 h-10" />
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
// // //       <div className="max-w-7xl mx-auto">

// // //         {/* HERO */}
// // //         <div className="relative mb-16">
// // //           <div className="absolute -top-10 left-0 w-72 h-72 bg-emerald-400/20 blur-[100px] rounded-full"></div>

// // //           <div className="relative bg-white border border-slate-100 rounded-3xl p-10 shadow-sm flex justify-between items-center">

// // //             <div className="flex items-center gap-6">
// // //               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
// // //                 <span className="text-white text-3xl font-bold">
// // //                   {user.name?.[0]}
// // //                 </span>
// // //               </div>

// // //               <div>
// // //                 <h1 className="text-4xl font-bold text-slate-900">
// // //                   {user.name}
// // //                 </h1>
// // //                 <p className="text-slate-500 mt-1">
// // //                   {user.email}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="flex gap-3">
// // //               <button
// // //                 onClick={() => navigate('/home')}
// // //                 className="px-5 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition"
// // //               >
// // //                 Chat
// // //               </button>

// // //               <button
// // //                 onClick={() => navigate('/face-analysis')}
// // //                 className="px-5 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition"
// // //               >
// // //                 Mood
// // //               </button>

// // //               <button
// // //                 onClick={handleLogout}
// // //                 className="px-5 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition"
// // //               >
// // //                 Logout
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* TABS */}
// // //         <div className="flex gap-6 mb-10">
// // //           {['profile', 'history', 'insights'].map((tab) => (
// // //             <button
// // //               key={tab}
// // //               onClick={() => setActiveTab(tab)}
// // //               className={`px-6 py-3 rounded-2xl text-sm font-medium transition ${
// // //                 activeTab === tab
// // //                   ? 'bg-emerald-600 text-white shadow-md'
// // //                   : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
// // //               }`}
// // //             >
// // //               {tab.toUpperCase()}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* PROFILE */}
// // //         {activeTab === 'profile' && (
// // //           <div className="grid lg:grid-cols-5 gap-8">

// // //             <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
// // //               <div className="flex justify-between mb-6">
// // //                 <h2 className="text-2xl font-semibold">Account</h2>

// // //                 {!isEditing && (
// // //                   <button
// // //                     onClick={() => setIsEditing(true)}
// // //                     className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
// // //                   >
// // //                     Edit
// // //                   </button>
// // //                 )}
// // //               </div>

// // //               {!isEditing ? (
// // //                 <div className="space-y-6">
// // //                   <Info icon={User} label="Name" value={user.name} />
// // //                   <Info icon={Mail} label="Email" value={user.email} />
// // //                   <Info
// // //                     icon={Calendar}
// // //                     label="Member Since"
// // //                     value={new Date(user.createdAt).toLocaleDateString()}
// // //                   />
// // //                 </div>
// // //               ) : (
// // //                 <div className="space-y-5">
// // //                   <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
// // //                   <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />

// // //                   <div className="grid grid-cols-2 gap-4">
// // //                     <PasswordInput
// // //                       label="Password"
// // //                       value={form.password}
// // //                       show={showPassword}
// // //                       toggle={() => setShowPassword(!showPassword)}
// // //                       onChange={(v) => setForm({ ...form, password: v })}
// // //                     />
// // //                     <PasswordInput
// // //                       label="Confirm"
// // //                       value={form.confirmPassword}
// // //                       show={showPassword}
// // //                       onChange={(v) => setForm({ ...form, confirmPassword: v })}
// // //                     />
// // //                   </div>

// // //                   <button className="w-full py-3 bg-emerald-600 text-white rounded-xl flex justify-center gap-2">
// // //                     <Save size={18} /> Save
// // //                   </button>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <div className="lg:col-span-2 space-y-4">
// // //               <ActionCard icon={MessageCircle} text="Start Chat" onClick={() => navigate('/home')} />
// // //               <ActionCard icon={Zap} text="Mood Check" onClick={() => navigate('/face-analysis')} />

// // //               <button className="w-full py-4 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 flex justify-center gap-2">
// // //                 <Trash2 size={18} /> Delete Account
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* HISTORY */}
// // //         {activeTab === 'history' && (
// // //           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
// // //             {loading ? (
// // //               <Loader className="animate-spin text-emerald-600 mx-auto" />
// // //             ) : historyData.length === 0 ? (
// // //               <p className="text-center text-slate-400">No chats yet</p>
// // //             ) : (
// // //               historyData.map((h) => (
// // //                 <div key={h._id} className="p-5 border border-slate-100 rounded-2xl mb-4 hover:shadow-sm transition">
// // //                   <p className="text-slate-500 text-sm">
// // //                     {new Date(h.createdAt).toDateString()}
// // //                   </p>
// // //                   <p className="mt-2">{h.prompt}</p>
// // //                 </div>
// // //               ))
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* INSIGHTS */}
// // //         {activeTab === 'insights' && (
// // //           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
// // //             <h2 className="text-xl font-semibold mb-4">Insights</h2>
// // //             <p className="text-slate-500">Analytics coming soon</p>
// // //           </div>
// // //         )}

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // /* COMPONENTS */

// // // const Info = ({ icon: Icon, label, value }) => (
// // //   <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl">
// // //     <Icon className="text-emerald-600" />
// // //     <div>
// // //       <p className="text-slate-500 text-sm">{label}</p>
// // //       <p className="text-slate-900 font-medium">{value}</p>
// // //     </div>
// // //   </div>
// // // );

// // // const Input = ({ label, value, onChange }) => (
// // //   <div>
// // //     <label className="text-sm text-slate-500">{label}</label>
// // //     <input
// // //       value={value}
// // //       onChange={(e) => onChange(e.target.value)}
// // //       className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
// // //     />
// // //   </div>
// // // );

// // // const PasswordInput = ({ label, value, onChange, show, toggle }) => (
// // //   <div>
// // //     <label className="text-sm text-slate-500">{label}</label>
// // //     <div className="relative">
// // //       <input
// // //         type={show ? 'text' : 'password'}
// // //         value={value}
// // //         onChange={(e) => onChange(e.target.value)}
// // //         className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
// // //       />
// // //       {toggle && (
// // //         <button onClick={toggle} className="absolute right-3 top-4 text-slate-400">
// // //           {show ? <EyeOff size={18} /> : <Eye size={18} />}
// // //         </button>
// // //       )}
// // //     </div>
// // //   </div>
// // // );

// // // const ActionCard = ({ icon: Icon, text, onClick }) => (
// // //   <button
// // //     onClick={onClick}
// // //     className="w-full flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition"
// // //   >
// // //     <Icon className="text-emerald-600" />
// // //     <span className="font-medium">{text}</span>
// // //   </button>
// // // );

// // // export default Profile;


// // import React, { useState, useEffect } from 'react';
// // import { useAuth } from '../contexts/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import {
// //   User, Mail, Edit2, Save, LogOut, Trash2,
// //   Calendar, MessageCircle, Loader, Eye, EyeOff, Zap
// // } from 'lucide-react';

// // const Profile = () => {
// //   const { user, logout } = useAuth();
// //   const navigate = useNavigate();

// //   const [activeTab, setActiveTab] = useState('profile');
// //   const [historyData, setHistoryData] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [isEditing, setIsEditing] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);

// //   const [form, setForm] = useState({
// //     name: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: ''
// //   });

// //   useEffect(() => {
// //     if (user) {
// //       setForm({
// //         name: user.name || '',
// //         email: user.email || '',
// //         password: '',
// //         confirmPassword: ''
// //       });
// //     }
// //   }, [user]);

// //   useEffect(() => {
// //     axios.get('/chat/history')
// //       .then(res => setHistoryData(res.data || []))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/login');
// //   };
  

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-white">
// //         <Loader className="animate-spin text-emerald-600 w-10 h-10" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen pt-28 pb-20 px-6 bg-white">

// //       <div className="max-w-5xl mx-auto">

// //         {/* HERO */}
// //         <div className="mb-20">
// //           <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900">
// //             {user.name}
// //           </h1>

// //           <p className="text-xl text-slate-500 mt-3">
// //             {user.email}
// //           </p>

// //           <div className="flex gap-4 mt-8">
// //             <button
// //               onClick={() => navigate('/home')}
// //               className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
// //             >
// //               Start Chat
// //             </button>

// //             <button
// //               onClick={() => navigate('/face-analysis')}
// //               className="px-6 py-3 border border-slate-300 rounded-full hover:bg-slate-100 transition"
// //             >
// //               Mood Check
// //             </button>

// //             <button
// //               onClick={handleLogout}
// //               className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-full transition"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>

// //         {/* TABS */}
// //         <div className="flex gap-10 border-b border-slate-200 mb-12">
// //           {['profile', 'history', 'insights'].map(tab => (
// //             <button
// //               key={tab}
// //               onClick={() => setActiveTab(tab)}
// //               className={`pb-3 text-lg font-medium transition ${
// //                 activeTab === tab
// //                   ? 'text-emerald-600 border-b-2 border-emerald-600'
// //                   : 'text-slate-400 hover:text-slate-700'
// //               }`}
// //             >
// //               {tab}
// //             </button>
// //           ))}
// //         </div>

// //         {/* PROFILE */}
// //         {activeTab === 'profile' && (
// //           <div className="space-y-10">

// //             {!isEditing ? (
// //               <>
// //                 <Line label="Full Name" value={user.name} icon={User} />
// //                 <Line label="Email" value={user.email} icon={Mail} />
// //                 {/* <Line
// //                   label="Member Since"
// //                   value={new Date(user.createdAt).toLocaleDateString()}
// //                   icon={Calendar}
// //                 /> */}


// // <Line
// //   label="Wellness Score"
// //   value="82%"
// //   icon={User}
// // />

// // <Line
// //   label="Mood Trend"
// //   value={getMoodTrend()}
// //   icon={Brain}
// // />

// // <Line
// //   label="Total Sessions"
// //   value={historyData.length}
// //   icon={MessageCircle}
// // />

// // <Line
// //   label="Last Active"
// //   value={historyData[0] ? new Date(historyData[0].createdAt).toLocaleDateString() : '—'}
// //   icon={Calendar}
// // />

// //                 <button
// //                   onClick={() => setIsEditing(true)}
// //                   className="mt-10 px-6 py-3 bg-black text-white rounded-full"
// //                 >
// //                   Edit Profile
// //                 </button>
// //               </>
// //             ) : (
// //               <div className="space-y-6">
// //                 <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
// //                 <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <PasswordInput label="Password" value={form.password}
// //                     show={showPassword}
// //                     toggle={() => setShowPassword(!showPassword)}
// //                     onChange={(v) => setForm({ ...form, password: v })} />

// //                   <PasswordInput label="Confirm" value={form.confirmPassword}
// //                     show={showPassword}
// //                     onChange={(v) => setForm({ ...form, confirmPassword: v })} />
// //                 </div>

// //                 <button className="px-6 py-3 bg-emerald-600 text-white rounded-full flex items-center gap-2">
// //                   <Save size={18} /> Save
// //                 </button>
// //               </div>
// //             )}

// //           </div>
// //         )}

// //         {/* HISTORY */}
// //         {activeTab === 'history' && (
// //           <div>
// //             {loading ? (
// //               <Loader className="animate-spin text-emerald-600 mx-auto" />
// //             ) : historyData.length === 0 ? (
// //               <p className="text-slate-400">No chats yet</p>
// //             ) : (
// //               historyData.map(item => (
// //                 <div key={item._id} className="py-6 border-b border-slate-200">
// //                   <p className="text-sm text-slate-400">
// //                     {new Date(item.createdAt).toDateString()}
// //                   </p>
// //                   <p className="text-lg text-slate-900 mt-1">{item.prompt}</p>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         )}

// //         {/* INSIGHTS */}
// //         {activeTab === 'insights' && (
// //           <div>
// //             <h2 className="text-2xl font-semibold text-slate-900 mb-4">
// //               Insights
// //             </h2>
// //             <p className="text-slate-500">Analytics coming soon</p>
// //           </div>
// //         )}

// //         {/* DELETE */}
// //         <div className="mt-20 pt-10 border-t border-slate-200">
// //           <button className="text-red-600 hover:underline flex items-center gap-2">
// //             <Trash2 size={18} /> Delete Account
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // /* components */

// // const Line = ({ label, value, icon: Icon }) => (
// //   <div className="flex items-center justify-between border-b border-slate-200 pb-4">
// //     <div className="flex items-center gap-3 text-slate-500">
// //       <Icon size={18} />
// //       {label}
// //     </div>
// //     <div className="text-slate-900 font-medium">{value}</div>
// //   </div>
// // );

// // const Input = ({ label, value, onChange }) => (
// //   <div>
// //     <label className="text-sm text-slate-500">{label}</label>
// //     <input
// //       value={value}
// //       onChange={(e) => onChange(e.target.value)}
// //       className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl"
// //     />
// //   </div>
// // );

// // const PasswordInput = ({ label, value, onChange, show, toggle }) => (
// //   <div>
// //     <label className="text-sm text-slate-500">{label}</label>
// //     <div className="relative">
// //       <input
// //         type={show ? 'text' : 'password'}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl"
// //       />
// //       {toggle && (
// //         <button
// //           onClick={toggle}
// //           className="absolute right-3 top-4 text-slate-400"
// //         >
// //           {show ? <EyeOff size={18} /> : <Eye size={18} />}
// //         </button>
// //       )}
// //     </div>
// //   </div>
// // );

// // export default Profile;


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   User, Mail, Edit2, Save, LogOut, Trash2,
//   Calendar, MessageCircle, Loader, Eye, EyeOff,
//   Zap, TrendingUp, Brain
// } from 'lucide-react';

// const Profile = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState('profile');
//   const [historyData, setHistoryData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isEditing, setIsEditing] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   useEffect(() => {
//     if (user) {
//       setForm({
//         name: user.name || '',
//         email: user.email || '',
//         password: '',
//         confirmPassword: ''
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     axios.get('/chat/history')
//       .then(res => setHistoryData(res.data || []))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   /* ================== DYNAMIC LOGIC ================== */

//   const getMoodTrend = () => {
//     if (historyData.length < 2) return 'Not enough data';

//     const last = historyData[0]?.analysis?.severity;
//     const prev = historyData[1]?.analysis?.severity;

//     const map = { high: 3, moderate: 2, low: 1 };

//     if (!last || !prev) return 'Stable';

//     if (map[last] < map[prev]) return 'Improving';
//     if (map[last] > map[prev]) return 'Declining';

//     return 'Stable';
//   };

//   const getStreak = () => {
//     if (!historyData.length) return 0;

//     let streak = 1;

//     for (let i = 1; i < historyData.length; i++) {
//       const d1 = new Date(historyData[i - 1].createdAt);
//       const d2 = new Date(historyData[i].createdAt);

//       const diff = (d1 - d2) / (1000 * 60 * 60 * 24);

//       if (diff <= 1.5) streak++;
//       else break;
//     }

//     return streak;
//   };

//   const getThisWeekSessions = () => {
//     const now = new Date();

//     return historyData.filter(item => {
//       const d = new Date(item.createdAt);
//       return (now - d) / (1000 * 60 * 60 * 24) <= 7;
//     }).length;
//   };

//   const getMostActiveTime = () => {
//     if (!historyData.length) return '—';

//     const hours = historyData.map(h => new Date(h.createdAt).getHours());
//     const avg = hours.reduce((a, b) => a + b, 0) / hours.length;

//     if (avg < 12) return 'Morning';
//     if (avg < 18) return 'Afternoon';
//     return 'Evening';
//   };

//   const getAvgLength = () => {
//     if (!historyData.length) return 0;

//     const total = historyData.reduce((sum, item) => {
//       return sum + (item.prompt?.length || 0);
//     }, 0);

//     return Math.round(total / historyData.length);
//   };

//   /* ================== UI ================== */

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <Loader className="animate-spin text-emerald-600 w-10 h-10" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-28 pb-20 px-6 bg-white">
//       <div className="max-w-5xl mx-auto">

//         {/* HERO */}
//         <div className="mb-20">
//           <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900">
//             {user.name}
//           </h1>

//           <p className="text-xl text-slate-500 mt-3">
//             {user.email}
//           </p>

//           <div className="flex gap-4 mt-8">
//             <button
//               onClick={() => navigate('/home')}
//               className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
//             >
//               Start Chat
//             </button>

//             <button
//               onClick={() => navigate('/face-analysis')}
//               className="px-6 py-3 border border-slate-300 rounded-full hover:bg-slate-100 transition"
//             >
//               Mood Check
//             </button>

//             <button
//               onClick={handleLogout}
//               className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-full transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="flex gap-10 border-b border-slate-200 mb-12">
//           {['profile', 'history', 'insights'].map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`pb-3 text-lg font-medium transition ${
//                 activeTab === tab
//                   ? 'text-emerald-600 border-b-2 border-emerald-600'
//                   : 'text-slate-400 hover:text-slate-700'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* PROFILE */}
//         {activeTab === 'profile' && (
//           <div className="space-y-8">

//             {!isEditing ? (
//               <>
//                 <Line label="Full Name" value={user.name} icon={User} />
//                 <Line label="Email" value={user.email} icon={Mail} />

//                 <Line label="Total Sessions" value={historyData.length} icon={MessageCircle} />
//                 <Line label="Current Streak" value={`${getStreak()} days`} icon={Zap} />
//                 <Line label="This Week" value={`${getThisWeekSessions()} sessions`} icon={TrendingUp} />
//                 <Line label="Mood Trend" value={getMoodTrend()} icon={Brain} />
//                 <Line label="Most Active" value={getMostActiveTime()} icon={Calendar} />
//                 <Line label="Avg Message Size" value={`${getAvgLength()} chars`} icon={MessageCircle} />

//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="mt-10 px-6 py-3 bg-black text-white rounded-full"
//                 >
//                   Edit Profile
//                 </button>
//               </>
//             ) : (
//               <div className="space-y-6">
//                 <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
//                 <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />

//                 <div className="grid grid-cols-2 gap-4">
//                   <PasswordInput
//                     label="Password"
//                     value={form.password}
//                     show={showPassword}
//                     toggle={() => setShowPassword(!showPassword)}
//                     onChange={(v) => setForm({ ...form, password: v })}
//                   />

//                   <PasswordInput
//                     label="Confirm"
//                     value={form.confirmPassword}
//                     show={showPassword}
//                     onChange={(v) => setForm({ ...form, confirmPassword: v })}
//                   />
//                 </div>

//                 <button className="px-6 py-3 bg-emerald-600 text-white rounded-full flex items-center gap-2">
//                   <Save size={18} /> Save
//                 </button>
//               </div>
//             )}

//           </div>
//         )}

//         {/* HISTORY */}
//         {activeTab === 'history' && (
//           <div>
//             {loading ? (
//               <Loader className="animate-spin text-emerald-600 mx-auto" />
//             ) : historyData.length === 0 ? (
//               <p className="text-slate-400">No chats yet</p>
//             ) : (
//               historyData.map(item => (
//                 <div key={item._id} className="py-6 border-b border-slate-200">
//                   <p className="text-sm text-slate-400">
//                     {new Date(item.createdAt).toDateString()}
//                   </p>
//                   <p className="text-lg text-slate-900 mt-1">{item.prompt}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* DELETE */}
//         <div className="mt-20 pt-10 border-t border-slate-200">
//           <button className="text-red-600 hover:underline flex items-center gap-2">
//             <Trash2 size={18} /> Delete Account
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// /* COMPONENTS */

// const Line = ({ label, value, icon: Icon }) => (
//   <div className="flex items-center justify-between border-b border-slate-200 pb-4">
//     <div className="flex items-center gap-3 text-slate-500">
//       <Icon size={18} />
//       {label}
//     </div>
//     <div className="text-slate-900 font-medium">{value}</div>
//   </div>
// );

// const Input = ({ label, value, onChange }) => (
//   <div>
//     <label className="text-sm text-slate-500">{label}</label>
//     <input
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl"
//     />
//   </div>
// );

// const PasswordInput = ({ label, value, onChange, show, toggle }) => (
//   <div>
//     <label className="text-sm text-slate-500">{label}</label>
//     <div className="relative">
//       <input
//         type={show ? 'text' : 'password'}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl"
//       />
//       {toggle && (
//         <button onClick={toggle} className="absolute right-3 top-4 text-slate-400">
//           {show ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       )}
//     </div>
//   </div>
// );

// export default Profile;




import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, Edit2, Save, LogOut, Trash2,
  Calendar, MessageCircle, Loader, Eye, EyeOff,
  Zap, TrendingUp, Brain
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  useEffect(() => {
    axios.get('/chat/history')
      .then(res => setHistoryData(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* ================== DYNAMIC LOGIC ================== */

  const getMoodTrend = () => {
    if (historyData.length < 2) return '—';

    const last = historyData[0]?.analysis?.severity;
    const prev = historyData[1]?.analysis?.severity;

    const map = { high: 3, moderate: 2, low: 1 };

    if (!last || !prev) return 'Stable';
    if (map[last] < map[prev]) return 'Improving';
    if (map[last] > map[prev]) return 'Declining';

    return 'Stable';
  };

  const getStreak = () => {
    if (!historyData.length) return 0;

    let streak = 1;

    for (let i = 1; i < historyData.length; i++) {
      const d1 = new Date(historyData[i - 1].createdAt);
      const d2 = new Date(historyData[i].createdAt);

      const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) streak++;
      else break;
    }

    return streak;
  };

  const getThisWeekSessions = () => {
    const now = new Date();

    return historyData.filter(item => {
      const d = new Date(item.createdAt);
      return (now - d) / (1000 * 60 * 60 * 24) <= 7;
    }).length;
  };

  const getMostActiveTime = () => {
    if (!historyData.length) return '—';

    const hours = historyData.map(h => new Date(h.createdAt).getHours());
    const avg = hours.reduce((a, b) => a + b, 0) / hours.length;

    if (avg < 12) return 'Morning';
    if (avg < 18) return 'Afternoon';
    return 'Evening';
  };

  const getAvgLength = () => {
    if (!historyData.length) return 0;

    const total = historyData.reduce((sum, item) => {
      return sum + (item.prompt?.length || 0);
    }, 0);

    return Math.round(total / historyData.length);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="animate-spin text-emerald-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-500 mt-2">{user.email}</p>

          <div className="flex gap-4 mt-6">
            <button onClick={() => navigate('/home')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-full">
              Start Chat
            </button>

            <button onClick={() => navigate('/face-analysis')}
              className="px-6 py-3 border border-slate-300 rounded-full">
              Mood Check
            </button>

            <button onClick={handleLogout}
              className="px-6 py-3 text-red-600">
              Logout
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-10 border-b border-slate-200 mb-10">
          {['profile', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 ${
                activeTab === tab
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <>
            {/* ACCOUNT SECTION */}
            <div className="bg-slate-50 p-8 rounded-3xl mb-10">
              <h2 className="text-xl font-semibold mb-6 text-slate-900">
                Account Info
              </h2>

              <div className="space-y-4">
                <Line label="Full Name" value={user.name} icon={User} />
                <Line label="Email" value={user.email} icon={Mail} />
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 px-5 py-2 bg-black text-white rounded-full"
              >
                Edit
              </button>
            </div>

            {/* INSIGHTS GRID (SEPARATE) */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Your Activity
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <StatCard icon={MessageCircle} label="Sessions" value={historyData.length} />
                <StatCard icon={Zap} label="Streak" value={`${getStreak()} days`} />
                <StatCard icon={TrendingUp} label="This Week" value={getThisWeekSessions()} />
                <StatCard icon={Brain} label="Mood" value={getMoodTrend()} />
                <StatCard icon={Calendar} label="Active Time" value={getMostActiveTime()} />
                <StatCard icon={MessageCircle} label="Avg Size" value={`${getAvgLength()} chars`} />
              </div>
            </div>
          </>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div>
            {loading ? (
              <Loader className="animate-spin text-emerald-600 mx-auto" />
            ) : historyData.map(item => (
              <div key={item._id} className="py-6 border-b">
                <p className="text-sm text-slate-400">
                  {new Date(item.createdAt).toDateString()}
                </p>
                <p>{item.prompt}</p>
              </div>
            ))}
          </div>
        )}

        {/* DELETE */}
        <div className="mt-16">
          <button className="text-red-600 flex items-center gap-2">
            <Trash2 size={18} /> Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

/* COMPONENTS */

const Line = ({ label, value, icon: Icon }) => (
  <div className="flex justify-between border-b pb-3">
    <div className="flex gap-2 text-slate-500">
      <Icon size={16} />
      {label}
    </div>
    <div>{value}</div>
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition">
    <Icon className="text-emerald-600 mb-3" />
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-semibold text-slate-900">{value}</p>
  </div>
);

export default Profile;