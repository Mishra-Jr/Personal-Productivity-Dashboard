import React from 'react';
import { ExternalLink, Calendar, Heart, MessageCircle, Share, Edit3, Trash2, Tag } from 'lucide-react';
import Button from './Button';
import { LinkedInPost } from '../../contexts/AppContext';

interface LinkedInPostCardProps {
  post: LinkedInPost;
  onEdit: (post: LinkedInPost) => void;
  onDelete: (postId: string) => void;
}

const LinkedInPostCard: React.FC<LinkedInPostCardProps> = ({ post, onEdit, onDelete }) => {
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

  const formatEngagement = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{post.publishedDate.toLocaleDateString()}</span>
            </div>
            {post.postUrl && (
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ExternalLink size={14} />
                <span>View Post</span>
              </a>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={() => onEdit(post)}
            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Edit post"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {post.summary}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement Metrics */}
      {post.engagement && (
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {post.engagement.likes > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <Heart size={14} className="text-red-500" />
              <span>{formatEngagement(post.engagement.likes)}</span>
            </div>
          )}
          {post.engagement.comments > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <MessageCircle size={14} className="text-blue-500" />
              <span>{formatEngagement(post.engagement.comments)}</span>
            </div>
          )}
          {post.engagement.shares > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <Share size={14} className="text-green-500" />
              <span>{formatEngagement(post.engagement.shares)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInPostCard;