

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon, Trash2, Calendar, MessageCircle, Brain, 
  AlertTriangle, Search, Filter, ChevronDown, Eye, Star, 
  ArrowRight, Mic, Sparkles, TrendingUp 
} from 'lucide-react';
import axios from 'axios';

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😞',
  angry: '😡',
  anxious: '😰',
  // Add more as needed
};

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [onlyDifficult, setOnlyDifficult] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [markedImportant, setMarkedImportant] = useState(new Set());

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/chat/history');
      setHistoryData(response.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`/chat/history/${id}`);
      setHistoryData(prev => prev.filter(item => item._id !== id));
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const toggleImportant = (id) => {
    setMarkedImportant(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const continueChat = (item) => {
    // Your existing continueChat logic (unchanged)
    // ...
    navigate('/');
  };

  // Filter logic
  const filteredHistory = historyData
    .filter(item => {
      const itemDate = new Date(item.createdAt);
      const matchesSearch = 
        (item.prompt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.response || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMood = selectedMood === 'all' || 
        (item.mood && item.mood.toLowerCase() === selectedMood);

      const itemTags = item.tags || [];
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => itemTags.includes(tag));

      const isDifficult = item.analysis?.severity === 'high' || 
        (item.mood && ['sad', 'angry', 'anxious'].includes(item.mood.toLowerCase()));

      const matchesDifficult = !onlyDifficult || isDifficult;

      const matchesDate = (!dateRange.from || itemDate >= new Date(dateRange.from)) &&
                         (!dateRange.to || itemDate <= new Date(dateRange.to));

      return matchesSearch && matchesMood && matchesTags && matchesDifficult && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Simple streak calculation (example: consecutive days with entries)
  const calculateStreak = () => {
    // Implement proper logic based on your dates
    return 5; // Placeholder
  };

  const streak = calculateStreak();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-2xl">
            <HistoryIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Your Journey</h1>
        </div>
        <p className="text-xl text-gray-600">Revisit your thoughts, moods, and moments</p>
      </div>

      {/* Streaks & Highlights */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <TrendingUp className="h-5 w-5" />
          <span className="font-semibold">You've checked in {streak} days in a row 🔥</span>
        </div>

        {/* Memory Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-amber-700">You felt very anxious on March 12th</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
            <p className="text-emerald-700">March 25th was one of your happiest days</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
            <p className="text-blue-700">Sleep issues came up 4 times this month</p>
          </div>
        </div>
      </div>

      {/* Smart Filters */}
      <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8 space-y-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Mood Filter */}
          <div className="flex gap-2">
            {['all', 'happy', 'neutral', 'sad', 'angry', 'anxious'].map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-4 py-3 rounded-2xl text-2xl transition-all border ${
                  selectedMood === mood 
                    ? 'bg-purple-100 border-purple-300 scale-110' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {mood === 'all' ? '🌈' : moodEmojis[mood] || '😶'}
              </button>
            ))}
          </div>

          {/* Only Difficult Days */}
          <label className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={onlyDifficult}
              onChange={(e) => setOnlyDifficult(e.target.checked)}
              className="w-5 h-5 text-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Only difficult days</span>
          </label>
        </div>

        {/* Date + Sort + Tags (simplified) */}
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-gray-500 block mb-1">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2.5"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2.5"
            />
          </div>

          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="relative pl-8">
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-200 to-indigo-200"></div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No entries match your filters yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredHistory.map((item, index) => {
              const mood = item.mood || 'neutral';
              const isImportant = markedImportant.has(item._id);

              return (
                <div key={item._id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-4 w-8 h-8 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-xl">{moodEmojis[mood] || '📖'}</span>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(item.createdAt).toLocaleDateString('en-US', { 
                              weekday: 'long', month: 'short', day: 'numeric' 
                            })} 
                            • {new Date(item.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-3xl">{moodEmojis[mood]}</span>
                            <span className="font-medium capitalize">{mood}</span>
                            {isImportant && <Star className="h-5 w-5 text-amber-500 fill-current" />}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => continueChat(item)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-2xl transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" /> Continue
                          </button>
                          <button
                            onClick={() => setSelectedItem(selectedItem === item._id ? null : item._id)}
                            className="p-2 hover:bg-gray-100 rounded-xl"
                          >
                            <Eye className="h-5 w-5 text-gray-400" />
                          </button>
                          <button
                            onClick={() => toggleImportant(item._id)}
                            className="p-2 hover:bg-gray-100 rounded-xl"
                          >
                            <Star className={`h-5 w-5 ${isImportant ? 'text-amber-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(item._id)}
                            className="p-2 hover:bg-red-50 rounded-xl text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Preview */}
                      <p className="line-clamp-3 text-gray-700 leading-relaxed">
                        {item.prompt?.length > 180 
                          ? item.prompt.substring(0, 180) + '...' 
                          : item.prompt}
                      </p>

                      {/* Tags & Indicators */}
                      {(item.tags?.length > 0 || item.hasVoice) && (
                        <div className="flex gap-2 mt-5">
                          {item.tags?.map((tag, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {item.hasVoice && <span className="text-xs flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-600 rounded-full"><Mic className="h-3 w-3" /> Voice note</span>}
                        </div>
                      )}
                    </div>

                    {/* Expanded View */}
                    {selectedItem === item._id && (
                      <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-8">
                        {/* Full content + your existing expanded logic here */}
                        {/* ... paste your existing expanded conversation & analysis ... */}

                        <div className="flex gap-3 pt-4 border-t">
                          <button className="flex-1 py-3 text-sm font-medium border border-gray-300 rounded-2xl hover:bg-white">✏️ Edit entry</button>
                          <button className="flex-1 py-3 text-sm font-medium bg-white border border-red-200 text-red-600 rounded-2xl hover:bg-red-50">🗑 Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reflection Prompts */}
      <div className="mt-16 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-purple-900">Reflect & Grow</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white p-6 rounded-3xl text-left hover:shadow transition-shadow border border-transparent hover:border-purple-200">
            <p className="font-medium mb-2">Do you feel better than this day?</p>
            <p className="text-sm text-gray-600">Compare with today</p>
          </button>
          <button className="bg-white p-6 rounded-3xl text-left hover:shadow transition-shadow border border-transparent hover:border-purple-200">
            <p className="font-medium mb-2">What has changed since then?</p>
            <p className="text-sm text-gray-600">Write a follow-up</p>
          </button>
          <button className="bg-white p-6 rounded-3xl text-left hover:shadow transition-shadow border border-transparent hover:border-purple-200">
            <p className="font-medium mb-2">Want to add context?</p>
            <p className="text-sm text-gray-600">Add what was happening</p>
          </button>
        </div>
      </div>

      {/* Delete Modal (your existing one) */}
      {/* ... keep your delete modal ... */}
    </div>
  );
};

export default History;