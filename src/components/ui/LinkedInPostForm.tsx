import React, { useState } from 'react';
import { Plus, X, Calendar, Tag, Link, Hash } from 'lucide-react';
import Button from './Button';
import { LinkedInPost } from '../../contexts/AppContext';

interface LinkedInPostFormProps {
  onSubmit: (post: Omit<LinkedInPost, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  editingPost?: LinkedInPost;
}

const LinkedInPostForm: React.FC<LinkedInPostFormProps> = ({ onSubmit, onCancel, editingPost }) => {
  const [title, setTitle] = useState(editingPost?.title || '');
  const [summary, setSummary] = useState(editingPost?.summary || '');
  const [postUrl, setPostUrl] = useState(editingPost?.postUrl || '');
  const [publishedDate, setPublishedDate] = useState(
    editingPost?.publishedDate 
      ? editingPost.publishedDate.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(editingPost?.tags || []);
  const [engagement, setEngagement] = useState({
    likes: editingPost?.engagement?.likes || 0,
    comments: editingPost?.engagement?.comments || 0,
    shares: editingPost?.engagement?.shares || 0
  });

  const availableTags = ['Project', 'Career Update', 'Networking', 'Industry Insight', 'Achievement', 'Learning'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    onSubmit({
      title: title.trim(),
      summary: summary.trim(),
      postUrl: postUrl.trim(),
      publishedDate: new Date(publishedDate),
      tags: selectedTags as any[],
      engagement: engagement.likes || engagement.comments || engagement.shares ? engagement : undefined
    });

    // Reset form
    setTitle('');
    setSummary('');
    setPostUrl('');
    setPublishedDate(new Date().toISOString().split('T')[0]);
    setSelectedTags([]);
    setEngagement({ likes: 0, comments: 0, shares: 0 });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Project':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Career Update':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      case 'Networking':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400';
      case 'Industry Insight':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400';
      case 'Achievement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Learning':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editingPost ? 'Edit LinkedIn Post' : 'Add LinkedIn Post'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Post Title */}
      <div>
        <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Post Title
        </label>
        <input
          id="postTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a descriptive title for your post..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Post Summary */}
      <div>
        <label htmlFor="postSummary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Summary
        </label>
        <textarea
          id="postSummary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summarize the key points of your LinkedIn post..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Post URL */}
      <div>
        <label htmlFor="postUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Link size={14} className="inline mr-1" />
          LinkedIn Post URL
        </label>
        <input
          id="postUrl"
          type="url"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://linkedin.com/posts/..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Published Date */}
      <div>
        <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Calendar size={14} className="inline mr-1" />
          Published Date
        </label>
        <input
          id="publishedDate"
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Tag size={14} className="inline mr-1" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? getTagColor(tag)
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Engagement Metrics (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Hash size={14} className="inline mr-1" />
          Engagement Metrics (Optional)
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="likes" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Likes
            </label>
            <input
              id="likes"
              type="number"
              min="0"
              value={engagement.likes}
              onChange={(e) => setEngagement(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="comments" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Comments
            </label>
            <input
              id="comments"
              type="number"
              min="0"
              value={engagement.comments}
              onChange={(e) => setEngagement(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="shares" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Shares
            </label>
            <input
              id="shares"
              type="number"
              min="0"
              value={engagement.shares}
              onChange={(e) => setEngagement(prev => ({ ...prev, shares: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || !summary.trim()}>
          <Plus size={16} className="mr-2" />
          {editingPost ? 'Update Post' : 'Add Post'}
        </Button>
      </div>
    </form>
  );
};

export default LinkedInPostForm;