import React, { useState, useMemo } from 'react';
import { Upload, Search, Filter, Download, Archive, Eye, Globe, Lock, Tag, Calendar, File as FileIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileCard from '../components/ui/FileCard';
import UploadModal from '../components/ui/UploadModal';
import { useApp } from '../contexts/AppContext';
import { FileItem } from '../contexts/AppContext';

const Files: React.FC = () => {
  const { state, dispatch } = useApp();
  const { files, isPublicView } = state;
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'category'>('date');

  const categories = ['All', 'Certificate', 'Resume Update', 'Project Media', 'Achievement', 'Other'];

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    files.forEach(file => file.tags.forEach(tag => tags.add(tag)));
    return ['All', ...Array.from(tags).sort()];
  }, [files]);

  // Filter files based on public view mode
  const visibleFiles = useMemo(() => {
    return isPublicView ? files.filter(file => file.isPublic) : files;
  }, [files, isPublicView]);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = visibleFiles.filter(file => {
      const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
      const matchesTag = selectedTag === 'All' || file.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'size':
          return b.size - a.size;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });
  }, [visibleFiles, searchTerm, selectedCategory, selectedTag, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSize = visibleFiles.reduce((sum, file) => sum + file.size, 0);
    const publicFiles = visibleFiles.filter(file => file.isPublic).length;
    const categoryCounts = visibleFiles.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: visibleFiles.length,
      totalSize,
      publicFiles,
      categoryCounts
    };
  }, [visibleFiles]);

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      dispatch({ type: 'DELETE_FILE', payload: fileId });
    }
  };

  const handleTogglePublic = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      dispatch({ 
        type: 'UPDATE_FILE', 
        payload: { ...file, isPublic: !file.isPublic } 
      });
    }
  };

  const downloadAllPublicFiles = () => {
    const publicFiles = files.filter(file => file.isPublic);
    if (publicFiles.length === 0) {
      alert('No public files to download');
      return;
    }

    // In a real app, this would create a ZIP file
    alert(`Would download ${publicFiles.length} public files as a ZIP archive`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Certificate': return '🏆';
      case 'Resume Update': return '👤';
      case 'Project Media': return '📁';
      case 'Achievement': return '🎖️';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            File Center {isPublicView && '(Public View)'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isPublicView 
              ? 'Public files available for sharing and download'
              : 'Manage your documents, certificates, and media files'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          {!isPublicView && (
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload size={16} className="mr-2" />
              Upload Files
            </Button>
          )}
          <Button variant="outline" onClick={downloadAllPublicFiles}>
            <Archive size={16} className="mr-2" />
            Download All Public
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FileIcon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFiles}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Globe size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Public Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publicFiles}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Archive size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <Tag size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(stats.categoryCounts).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">File Categories</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(stats.categoryCounts).map(([category, count]) => (
              <div
                key={category}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{category}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{count} files</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag === 'All' ? 'All Tags' : tag}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      {filteredAndSortedFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={!isPublicView ? handleDeleteFile : undefined}
              onTogglePublic={!isPublicView ? handleTogglePublic : undefined}
              showActions={!isPublicView}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedCategory !== 'All' || selectedTag !== 'All' 
                ? 'No files found' 
                : isPublicView 
                  ? 'No public files' 
                  : 'No files yet'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'All' || selectedTag !== 'All'
                ? 'Try adjusting your search or filter criteria'
                : isPublicView
                  ? 'Public files will appear here when available'
                  : 'Upload your first file to get started'
              }
            </p>
            {!isPublicView && !searchTerm && selectedCategory === 'All' && selectedTag === 'All' && (
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload size={16} className="mr-2" />
                Upload Files
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
};

export default Files;