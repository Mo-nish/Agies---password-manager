import React, { useState } from 'react';
import { Shield, Plus, Search, Lock, Eye, Trash2 } from 'lucide-react';

const Vault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    data: '',
    category: 'general',
    priority: 'medium'
  });

  // Mock vault entries
  const [vaultEntries] = useState([
    {
      id: '1',
      title: 'Bank Account',
      category: 'finance',
      priority: 'high',
      lastAccessed: new Date(),
      accessCount: 5
    },
    {
      id: '2',
      title: 'Email Password',
      category: 'accounts',
      priority: 'medium',
      lastAccessed: new Date(),
      accessCount: 12
    },
    {
      id: '3',
      title: 'API Key',
      category: 'development',
      priority: 'critical',
      lastAccessed: new Date(),
      accessCount: 3
    }
  ]);

  const filteredEntries = vaultEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    setShowAddForm(false);
    setNewEntry({ title: '', data: '', category: 'general', priority: 'medium' });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Secure Vault
        </h1>
        <p className="text-purple-200 text-lg">
          Your encrypted secrets and credentials
        </p>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vault entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary px-6 py-3 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-purple-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">Add New Vault Entry</h3>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Title</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="input-field"
                  placeholder="Entry title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Category</label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  className="input-field"
                >
                  <option value="general">General</option>
                  <option value="finance">Finance</option>
                  <option value="accounts">Accounts</option>
                  <option value="development">Development</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Data</label>
              <textarea
                value={newEntry.data}
                onChange={(e) => setNewEntry({ ...newEntry, data: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Enter your secret data"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Priority</label>
              <select
                value={newEntry.priority}
                onChange={(e) => setNewEntry({ ...newEntry, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6 py-2">
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vault Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Lock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                  <span className="text-sm text-slate-400 capitalize">{entry.category}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                entry.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                entry.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                entry.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {entry.priority}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Last accessed:</span>
                <span>{entry.lastAccessed.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Access count:</span>
                <span>{entry.accessCount}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2">
                <Eye className="h-4 w-4" />
                View
              </button>
              <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No vault entries found</h3>
          <p className="text-slate-500">Try adjusting your search or add a new entry.</p>
        </div>
      )}
    </div>
  );
};

export default Vault;
