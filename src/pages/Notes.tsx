import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Tag, Edit3, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';
import { Note } from '../contexts/AppContext';

const Notes: React.FC = () => {
  const { state } = useApp();
  const { notes } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const tags = ['All', 'Idea', 'Task', 'Journal', 'Reflection'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || note.tags.includes(selectedTag as any);
    return matchesSearch && matchesTag;
  });

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Idea':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Task':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Journal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400';
      case 'Reflection':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">Capture your thoughts and ideas</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {note.title}
                  </h3>
                  <div className="flex space-x-1 ml-2">
                    <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-4 whitespace-pre-line">
                  {note.content}
                </p>

                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getTagColor(tag)}`}
                      >
                        <Tag size={10} className="inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} className="mr-1" />
                    <span>
                      {note.updatedAt.toLocaleDateString()} at {note.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Edit3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedTag !== 'All' ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedTag !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start capturing your thoughts and ideas'
              }
            </p>
            {!searchTerm && selectedTag === 'All' && (
              <Button>
                <Plus size={16} className="mr-2" />
                Create Note
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notes;