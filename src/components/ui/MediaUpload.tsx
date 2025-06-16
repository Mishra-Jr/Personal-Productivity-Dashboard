import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Video, FileText, AlertCircle } from 'lucide-react';
import Button from './Button';
import { Card, CardContent } from './Card';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface MediaUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  onInsertToMarkdown?: (markdownText: string) => void;
  className?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onFilesUploaded, 
  onInsertToMarkdown,
  className = "" 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError('');

    if (rejectedFiles.length > 0) {
      setUploadError('Some files were rejected. Please upload only images (JPG, PNG, GIF) or videos (MP4, MOV, AVI) under 50MB.');
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image'
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    onFilesUploaded(newFiles);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const insertIntoMarkdown = (file: UploadedFile) => {
    if (!onInsertToMarkdown) return;

    const fileName = file.file.name;
    const markdownText = file.type === 'image' 
      ? `![${fileName}](${file.preview})`
      : `[📹 ${fileName}](${file.preview})`;
    
    onInsertToMarkdown(markdownText);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Media Files'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop images or videos, or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports: JPG, PNG, GIF, MP4, MOV, AVI (max 50MB each)
            </p>
          </div>

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-300">{uploadError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Video size={32} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 text-center px-2">
                          {file.file.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex space-x-2">
                      {onInsertToMarkdown && (
                        <Button
                          size="sm"
                          onClick={() => insertIntoMarkdown(file)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          <FileText size={14} className="mr-1" />
                          Insert
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(file.id)}
                        className="bg-white/90 hover:bg-white text-gray-900 border-white"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* File info */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUpload;