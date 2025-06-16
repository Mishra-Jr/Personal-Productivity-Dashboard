import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, File, Image, Video, FileText, Award, User, FolderOpen, AlertCircle, Check, Loader2 } from 'lucide-react';
import Button from './Button';
import { Card, CardContent } from './Card';
import { useApp } from '../../contexts/AppContext';
import { FileItem } from '../../contexts/AppContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  category: FileItem['category'];
  description: string;
  projectId?: string;
  isPublic: boolean;
  tags: string[];
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const { projects } = state;
  
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const categories: FileItem['category'][] = ['Certificate', 'Resume Update', 'Project Media', 'Achievement', 'Other'];

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);

    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
      );
      setErrors(errorMessages);
    }

    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      category: 'Other',
      description: '',
      isPublic: false,
      tags: []
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const getCategoryIcon = (category: FileItem['category']) => {
    switch (category) {
      case 'Certificate': return Award;
      case 'Resume Update': return User;
      case 'Project Media': return FolderOpen;
      case 'Achievement': return Award;
      default: return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = (fileId: string): Promise<string> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          // Simulate file URL generation
          resolve(`/files/${fileId}-${Date.now()}`);
        } else {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      }, 200);
    });
  };

  const processFile = async (uploadFile: UploadFile): Promise<void> => {
    const fileUrl = await simulateUpload(uploadFile.id);
    
    const fileItem: FileItem = {
      id: uploadFile.id,
      name: `${uploadFile.file.name.split('.')[0]}-${Date.now()}.${uploadFile.file.name.split('.').pop()}`,
      originalName: uploadFile.file.name,
      url: fileUrl,
      type: uploadFile.file.type,
      size: uploadFile.file.size,
      category: uploadFile.category,
      description: uploadFile.description,
      projectId: uploadFile.projectId,
      isPublic: uploadFile.isPublic,
      uploadedAt: new Date(),
      tags: uploadFile.tags
    };

    // Auto-processing logic based on category
    switch (uploadFile.category) {
      case 'Certificate':
        // Add to professional profile certifications
        const currentProfile = state.professionalProfile;
        const updatedProfile = {
          ...currentProfile,
          certifications: [...currentProfile.certifications, uploadFile.description || uploadFile.file.name]
        };
        dispatch({ type: 'UPDATE_PROFESSIONAL_PROFILE', payload: updatedProfile });
        break;
        
      case 'Project Media':
        // Add to media gallery and attach to project
        if (uploadFile.file.type.startsWith('image/') || uploadFile.file.type.startsWith('video/')) {
          const mediaItem = {
            id: `media-${uploadFile.id}`,
            name: uploadFile.file.name,
            url: fileUrl,
            type: uploadFile.file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            projectId: uploadFile.projectId,
            uploadedAt: new Date()
          };
          dispatch({ type: 'ADD_MEDIA', payload: mediaItem });
        }
        break;
        
      case 'Resume Update':
        // This would typically replace the current resume
        // For now, we'll just add it to files
        break;
        
      case 'Achievement':
        // Could be integrated into a achievements section
        break;
    }

    dispatch({ type: 'ADD_FILE', payload: fileItem });
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});

    try {
      // Process files sequentially to avoid overwhelming the system
      for (const uploadFile of uploadFiles) {
        await processFile(uploadFile);
      }

      // Clear form and close modal
      setUploadFiles([]);
      setUploadProgress({});
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(['Upload failed. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    updateFile(fileId, {
      tags: [...(uploadFiles.find(f => f.id === fileId)?.tags || []), tag.trim()]
    });
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    const file = uploadFiles.find(f => f.id === fileId);
    if (!file) return;
    updateFile(fileId, {
      tags: file.tags.filter((_, index) => index !== tagIndex)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
              <Upload size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Upload Center</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upload and categorize your files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Upload Area */}
          {uploadFiles.length === 0 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isDragActive ? 'Drop files here' : 'Upload Files'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop files, or click to browse
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>Supported: Images, Videos, PDFs, Documents, Presentations</p>
                <p>Maximum file size: 50MB each</p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Upload Errors</h4>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Files to Upload ({uploadFiles.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  {...getRootProps()}
                  className="cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <Upload size={14} className="mr-2" />
                  Add More
                </Button>
              </div>

              {uploadFiles.map((uploadFile) => {
                const FileIcon = getFileIcon(uploadFile.file);
                const CategoryIcon = getCategoryIcon(uploadFile.category);
                const progress = uploadProgress[uploadFile.id] || 0;
                const isCompleted = progress === 100;

                return (
                  <Card key={uploadFile.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* File Icon */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <FileIcon size={24} className="text-gray-600 dark:text-gray-400" />
                        </div>

                        {/* File Details */}
                        <div className="flex-1 space-y-3">
                          {/* File Info */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {uploadFile.file.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFile(uploadFile.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              disabled={isUploading}
                            >
                              <X size={16} className="text-gray-400" />
                            </button>
                          </div>

                          {/* Progress Bar */}
                          {isUploading && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {isCompleted ? 'Upload complete' : 'Uploading...'}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    isCompleted ? 'bg-green-500' : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Category Selection */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                              </label>
                              <div className="relative">
                                <CategoryIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                  value={uploadFile.category}
                                  onChange={(e) => updateFile(uploadFile.id, { 
                                    category: e.target.value as FileItem['category'],
                                    projectId: e.target.value === 'Project Media' ? uploadFile.projectId : undefined
                                  })}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  disabled={isUploading}
                                >
                                  {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Project Selection for Project Media */}
                            {uploadFile.category === 'Project Media' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Project
                                </label>
                                <select
                                  value={uploadFile.projectId || ''}
                                  onChange={(e) => updateFile(uploadFile.id, { projectId: e.target.value || undefined })}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  disabled={isUploading}
                                >
                                  <option value="">Select Project</option>
                                  {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Description (Optional)
                            </label>
                            <textarea
                              value={uploadFile.description}
                              onChange={(e) => updateFile(uploadFile.id, { description: e.target.value })}
                              placeholder="Add a description for this file..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                              disabled={isUploading}
                            />
                          </div>

                          {/* Tags */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {uploadFile.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-400 text-sm rounded-full"
                                >
                                  {tag}
                                  <button
                                    onClick={() => removeTag(uploadFile.id, index)}
                                    className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-300"
                                    disabled={isUploading}
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Add tags (press Enter)"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addTag(uploadFile.id, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              disabled={isUploading}
                            />
                          </div>

                          {/* Public Toggle */}
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`public-${uploadFile.id}`}
                              checked={uploadFile.isPublic}
                              onChange={(e) => updateFile(uploadFile.id, { isPublic: e.target.checked })}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              disabled={isUploading}
                            />
                            <label htmlFor={`public-${uploadFile.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                              Make this file public (visible in recruiter view)
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {uploadFiles.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {uploadFiles.length} file{uploadFiles.length !== 1 ? 's' : ''} ready to upload
            </div>
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || uploadFiles.length === 0}>
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;