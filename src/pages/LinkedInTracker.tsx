import React, { useState, useMemo } from 'react';
import { Plus, ExternalLink, Search, Filter, BarChart3, TrendingUp, Users, Award, Calendar, Linkedin } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LinkedInPostForm from '../components/ui/LinkedInPostForm';
import LinkedInPostCard from '../components/ui/LinkedInPostCard';
import { useApp } from '../contexts/AppContext';
import { LinkedInPost } from '../contexts/AppContext';

const LinkedInTracker: React.FC = () => {
  const { state, dispatch } = useApp();
  const { linkedInPosts, linkedInProfile } = state;
  
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<LinkedInPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'engagement'>('date');

  const availableTags = ['All', 'Project', 'Career Update', 'Networking', 'Industry Insight', 'Achievement', 'Learning'];

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = linkedInPosts.length;
    const totalLikes = linkedInPosts.reduce((sum, post) => sum + (post.engagement?.likes || 0), 0);
    const totalComments = linkedInPosts.reduce((sum, post) => sum + (post.engagement?.comments || 0), 0);
    const totalShares = linkedInPosts.reduce((sum, post) => sum + (post.engagement?.shares || 0), 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const postsThisMonth = linkedInPosts.filter(post => post.publishedDate >= thisMonth).length;
    
    const avgEngagement = totalPosts > 0 ? Math.round((totalLikes + totalComments + totalShares) / totalPosts) : 0;

    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalShares,
      postsThisMonth,
      avgEngagement
    };
  }, [linkedInPosts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = linkedInPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag as any);
      return matchesSearch && matchesTag;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      } else {
        const aEngagement = (a.engagement?.likes || 0) + (a.engagement?.comments || 0) + (a.engagement?.shares || 0);
        const bEngagement = (b.engagement?.likes || 0) + (b.engagement?.comments || 0) + (b.engagement?.shares || 0);
        return bEngagement - aEngagement;
      }
    });
  }, [linkedInPosts, searchTerm, selectedTag, sortBy]);

  const handleAddPost = (postData: Omit<LinkedInPost, 'id' | 'createdAt'>) => {
    if (editingPost) {
      // Update existing post
      const updatedPost: LinkedInPost = {
        ...editingPost,
        ...postData,
        id: editingPost.id,
        createdAt: editingPost.createdAt
      };
      dispatch({ type: 'UPDATE_LINKEDIN_POST', payload: updatedPost });
      setEditingPost(null);
    } else {
      // Add new post
      const newPost: LinkedInPost = {
        ...postData,
        id: `post-${Date.now()}-${Math.random()}`,
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_LINKEDIN_POST', payload: newPost });
    }
    setShowPostForm(false);
  };

  const handleEditPost = (post: LinkedInPost) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch({ type: 'DELETE_LINKEDIN_POST', payload: postId });
    }
  };

  const handleCancelForm = () => {
    setShowPostForm(false);
    setEditingPost(null);
  };

  const openLinkedInProfile = () => {
    window.open(linkedInProfile.profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LinkedIn Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your professional content and networking</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={openLinkedInProfile}>
            <ExternalLink size={16} className="mr-2" />
            Open LinkedIn
          </Button>
          {!showPostForm && (
            <Button onClick={() => setShowPostForm(true)}>
              <Plus size={16} className="mr-2" />
              Add Post
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <Linkedin size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{linkedInProfile.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{linkedInProfile.headline}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Profile last updated: {linkedInProfile.lastUpdated.toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" onClick={openLinkedInProfile}>
              <ExternalLink size={16} className="mr-2" />
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgEngagement}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLikes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.postsThisMonth}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post Form */}
      {showPostForm && (
        <LinkedInPostForm
          onSubmit={handleAddPost}
          onCancel={handleCancelForm}
          editingPost={editingPost}
        />
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
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
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="engagement">Sort by Engagement</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Archive */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Post Archive ({filteredAndSortedPosts.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedPosts.map((post) => (
              <LinkedInPostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Linkedin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedTag !== 'All' ? 'No posts found' : 'No LinkedIn posts yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedTag !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start tracking your LinkedIn content by adding your first post'
              }
            </p>
            {!searchTerm && selectedTag === 'All' && !showPostForm && (
              <Button onClick={() => setShowPostForm(true)}>
                <Plus size={16} className="mr-2" />
                Add First Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkedInTracker;