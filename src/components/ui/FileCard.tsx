import React, { useState } from 'react';
import { File, Image, Video, FileText, Award, User, FolderOpen, Download, ExternalLink, Copy, Check, Eye, Trash2, Edit3, Globe, Lock, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import { FileItem } from '../../contexts/AppContext';

interface FileCardProps {
  file: FileItem;
  onDelete?: (fileId: string) => void;
  onEdit?: (file: FileItem) => void;
  onTogglePublic?: (fileId: string) => void;
  showActions?: boolean;
  className?: string;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onDelete,
  onEdit,
  onTogglePublic,
  showActions = true,
  className = ""
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const getCategoryIcon = () => {
    switch (file.category) {
      case 'Certificate': return Award;
      case 'Resume Update': return User;
      case 'Project Media': return FolderOpen;
      case 'Achievement': return Award;
      default: return File;
    }
  };

  const getCategoryColor = () => {
    switch (file.category) {
      case 'Certificate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Resume Update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Project Media':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400';
      case 'Achievement':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyFileLink = async () => {
    try {
      const fileUrl = `${window.location.origin}${file.url}`;
      await navigator.clipboard.writeText(fileUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const FileIcon = getFileIcon();
  const CategoryIcon = getCategoryIcon();

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <FileIcon size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {file.originalName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          
          {/* Public/Private Indicator */}
          <div className="flex items-center space-x-2">
            {file.isPublic ? (
              <Globe size={16} className="text-green-600 dark:text-green-400" title="Public file" />
            ) : (
              <Lock size={16} className="text-gray-400" title="Private file" />
            )}
            {showActions && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(file)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Edit file"
                  >
                    <Edit3 size={14} className="text-gray-400 hover:text-indigo-600" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Delete file"
                  >
                    <Trash2 size={14} className="text-gray-400 hover:text-red-600" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category and Description */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor()}`}>
              <CategoryIcon size={10} className="mr-1" />
              {file.category}
            </span>
          </div>

          {file.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {file.description}
            </p>
          )}

          {/* Tags */}
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {file.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  <Tag size={8} className="mr-1" />
                  {tag}
                </span>
              ))}
              {file.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{file.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Upload Date */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            <span>Uploaded {file.uploadedAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadFile}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Download size={14} className="mr-1" />
              Download
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyFileLink}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} className="mr-1" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Preview for images/videos */}
          {(file.type.startsWith('image/') || file.type.startsWith('video/')) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(file.url, '_blank')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Eye size={14} className="mr-1" />
              Preview
            </Button>
          )}

          {/* Toggle Public */}
          {onTogglePublic && showActions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePublic(file.id)}
              className={`${
                file.isPublic 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400'
              } hover:text-gray-900 dark:hover:text-white`}
            >
              {file.isPublic ? (
                <>
                  <Globe size={14} className="mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock size={14} className="mr-1" />
                  Private
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;