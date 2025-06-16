import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Video, Search, Filter, Grid, List, Eye, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';

const Media: React.FC = () => {
  const { state } = useApp();
  const { media, projects } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const filters = ['All', 'Images', 'Videos', ...projects.map(p => p.name)];

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    
    if (selectedFilter === 'Images') {
      matchesFilter = item.type === 'image';
    } else if (selectedFilter === 'Videos') {
      matchesFilter = item.type === 'video';
    } else if (selectedFilter !== 'All') {
      const project = projects.find(p => p.name === selectedFilter);
      matchesFilter = item.projectId === project?.id;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (selectedMedia) {
    const mediaItem = media.find(m => m.id === selectedMedia);
    if (!mediaItem) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedMedia(null)}>
            ← Back to Media
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              {mediaItem.type === 'image' ? (
                <img
                  src={mediaItem.url}
                  alt={mediaItem.name}
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                />
              ) : (
                <video
                  src={mediaItem.url}
                  controls
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                />
              )}
              
              <div className="mt-6 space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{mediaItem.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Uploaded on {mediaItem.uploadedAt.toLocaleDateString()}
                </p>
                {mediaItem.projectId && (
                  <p className="text-indigo-600 dark:text-indigo-400">
                    Associated with: {projects.find(p => p.id === mediaItem.projectId)?.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your project images and videos</p>
        </div>
        <Button>
          <Upload size={16} className="mr-2" />
          Upload Media
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
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {filters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400'
                } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-l-lg`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400'
                } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-r-lg`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      {filteredMedia.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                  onClick={() => setSelectedMedia(item.id)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Video size={32} />
                      <span className="text-sm mt-2">Video</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {item.uploadedAt.toLocaleDateString()}
                  </p>
                  {item.projectId && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                      {projects.find(p => p.id === item.projectId)?.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMedia.map((item) => (
                  <div key={item.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                      {item.type === 'image' ? (
                        <ImageIcon size={20} className="text-gray-400" />
                      ) : (
                        <Video size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.uploadedAt.toLocaleDateString()}
                        {item.projectId && (
                          <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                            • {projects.find(p => p.id === item.projectId)?.name}
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMedia(item.id)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedFilter !== 'All' ? 'No media found' : 'No media yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedFilter !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start uploading images and videos for your projects'
              }
            </p>
            {!searchTerm && selectedFilter === 'All' && (
              <Button>
                <Upload size={16} className="mr-2" />
                Upload Media
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Media;